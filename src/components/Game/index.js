import React from "react";
import styles from "./styles.scss";
import { calendar, GAME_STATES } from "../../constants";
import { firestore, auth } from "../../firebase";
import isSameDay from "date-fns/is_same_day";
import Card from "../Card";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import * as log from "loglevel";

const levelsFromGameCount = gameCount => {
  return calendar[gameCount % 64].slice();
};

export default class Game extends React.Component {
  constructor() {
    super();
    this.state = {
      gameState: GAME_STATES.LOADING_GAME
    };
    this.listeners = new Map();
  }

  handleResult = result => {
    const { cardRef, cardData } = this.state;
    cardRef.update({
      level: result ? cardData.level + 1 : 1,
      lastAttempt: new Date()
    });
  };

  playNextLevel() {
    this.nextLevelIndex = this.nextLevelIndex + 1;
    this.nextLevel = this.nextLevels[this.nextLevelIndex];
    log.debug("this.nextLevelIndex", this.nextLevelIndex);
    log.debug("this.nextLevel", this.nextLevel);
    log.debug("this.nextLevels", this.nextLevels);
    // If there is no next level, exit here, the game is over.
    if (this.nextLevel === undefined) return this.endGame();

    const onCards = snapshot => {
      if (snapshot.size === 0) {
        this.listeners.get("levelCards")();
        return this.playNextLevel();
      }
      const card = snapshot.docs[0];
      this.setState({
        gameState: GAME_STATES.PLAYING,
        cardData: card.data(),
        cardRef: card.ref
      });
    };

    this.listeners.set(
      "levelCards",
      this.cardsRef
        .where("level", "==", this.nextLevel)
        .limit(1)
        .onSnapshot(onCards)
    );
  }

  endGame = () => {
    log.debug("endGame");
    this.gameRef.update({
      gameCount: this.state.gameCount + 1,
      lastPlayed: new Date()
    });
    this.setState({
      cardRef: null,
      cardData: null,
      gameState: GAME_STATES.START_SCREEN,
      isGameEnd: true
    });
  };

  startGame = () => {
    log.debug("startGame");
    const cardsDue = this.state.cardsRemaining;
    this.setState({
      cardsDue: this.state.cardsRemaining,
      isGameEnd: false
    });
    this.nextLevelIndex = -1;
    this.playNextLevel();
  };

  componentWillMount() {
    this.gameRef = firestore.collection("games").doc(this.props.user.uid);
    this.cardsRef = firestore
      .collection("cards")
      .where("uid", "==", this.props.user.uid);

    const handleGameData = doc => {
      // Save the first game data and come back if it doesn't exist.
      if (!doc.exists) return doc.ref.set({ gameCount: 0 });

      const { gameCount, lastPlayed } = doc.data();
      const playedToday = isSameDay(lastPlayed.toDate(), new Date());
      log.debug("lastPlayed", lastPlayed);
      log.debug("playedToday", playedToday);
      this.setState({
        gameCount,
        playedToday
      });

      this.nextLevels = levelsFromGameCount(gameCount);
      log.debug("this.nextLevels", this.nextLevels);

      // The card count listener needs to be re-triggered here because the gameCount has changed.
      // But there are no database changes to make it run. So instead, just re-initialise the listener.
      const unsubscribe = this.listeners.get("cardCount");
      unsubscribe && unsubscribe();
      this.listeners.set(
        "cardCount",
        this.cardsRef.where("level", "<=", 7).onSnapshot(this.countCards)
      );
    };

    this.listeners.set("gameData", this.gameRef.onSnapshot(handleGameData));
  }

  countCards = snapshot => {
    let cardsRemaining = 0;

    snapshot.forEach(card => {
      const data = card.data();
      if (this.nextLevels.indexOf(data.level) > -1) cardsRemaining++;
    });
    this.setState({ cardsRemaining });

    // If we're still loading game, it's now ready for the start screen.
    if (this.state.gameState === GAME_STATES.LOADING_GAME) {
      this.setState({
        gameState: GAME_STATES.START_SCREEN
      });
    }
  };

  componentWillUnmount() {
    this.listeners.forEach(unsubscribe => unsubscribe());
  }

  render() {
    const {
      cardData,
      gameState,
      cardsDue,
      cardsRemaining,
      isGameEnd,
      playedToday
    } = this.state;

    // const startButton = cardsRemaining ? (
    //
    // ) : (
    //   <p>There are no cards to reveiw. Add some?</p>
    // );

    const getStartButton = () => {
      return !playedToday && cardsRemaining ? (
        <Button
          size="large"
          variant="contained"
          disabled={playedToday}
          onClick={this.startGame}
        >
          Start reviewing {cardsRemaining} card
          {cardsRemaining > 1 ? "s" : ""}
        </Button>
      ) : null;
    };

    const getAddCardsPrompt = () => {
      return cardsRemaining ? null : (
        <p>
          There are no cards scheduled for the next review. Do you want to add
          some?
        </p>
      );
    };

    const getEndGameMessage = () => {
      return isGameEnd ? "Done!" : null;
    };

    const getWaitMessage = () => {
      return playedToday && cardsRemaining ? (
        <p>
          You've already played to day. Wait until tomorrow to run through the
          next set of {cardsRemaining} cards.
        </p>
      ) : null;
    };

    switch (gameState) {
      case GAME_STATES.LOADING_GAME:
        return <CircularProgress />;
      case GAME_STATES.START_SCREEN:
        return (
          <div>
            {getEndGameMessage()}
            {getWaitMessage()}
            {getStartButton()}
            {getAddCardsPrompt()}
          </div>
        );
      case GAME_STATES.LOADING_CARDS:
        return <CircularProgress />;
      case GAME_STATES.PLAYING:
        return <Card data={cardData} handleResult={this.handleResult} />;
    }
  }
}
