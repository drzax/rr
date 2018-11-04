import React from "react";
import styles from "./styles.scss";
import { calendar, GAME_STATES } from "../../constants";
import { firestore, auth } from "../../firebase";
import Card from "../Card";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";

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
      level: result ? cardData.level + 1 : 1
    });
  };

  playNextLevel() {
    const nextLevelIndex = this.state.nextLevelIndex + 1 || 0;
    const nextLevel = this.state.nextLevels[nextLevelIndex];
    console.log("nextLevelIndex, nextLevel", nextLevelIndex, nextLevel);
    if (nextLevel === undefined) return this.endGame();

    this.setState({ nextLevelIndex, nextLevel });

    const onCards = snapshot => {
      if (snapshot.size === 0) {
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
        .where("level", "==", nextLevel)
        .limit(1)
        .onSnapshot(onCards)
    );
  }

  endGame = () => {
    this.gameRef.update({
      gameCount: this.state.gameCount + 1
    });
    this.setState({
      cardRef: null,
      cardData: null,
      gameState: GAME_STATES.START_SCREEN,
      isGameEnd: true
    });
  };

  startGame = () => {
    const cardsDue = this.state.cardsRemaining;

    this.setState({
      cardsDue: this.state.cardsRemaining,
      isGameEnd: false
    });

    this.playNextLevel();
  };

  componentWillMount() {
    this.gameRef = firestore.collection("games").doc(this.props.user.uid);
    this.cardsRef = firestore
      .collection("cards")
      .where("uid", "==", this.props.user.uid);

    const handleGameData = doc => {
      // Save the first game data and come back if it doesn't exist.
      if (!doc.exists) return doc.ref.set({ gameCount });

      const gameCount = doc.data().gameCount;
      this.setState({
        gameCount,
        nextLevels: levelsFromGameCount(gameCount)
      });

      // If there's no card listener, we've just mounted
      if (!this.listeners.has("cardCount"))
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
      if (this.state.nextLevels.indexOf(data.level) > -1) cardsRemaining++;
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
    this.listeners.forEach((name, unsubscribe) => unsubscribe());
  }

  render() {
    const {
      cardData,
      gameState,
      cardsDue,
      cardsRemaining,
      isGameEnd
    } = this.state;

    const startButton = cardsRemaining ? (
      <Button size="large" variant="contained" onClick={this.startGame}>
        Start reviewing {cardsRemaining} card
        {cardsRemaining > 1 ? "s" : ""}
      </Button>
    ) : (
      <p>There are no cards to reveiw. Add some?</p>
    );

    switch (gameState) {
      case GAME_STATES.LOADING_GAME:
        return <CircularProgress />;
      case GAME_STATES.START_SCREEN:
        return isGameEnd ? (
          <div>
            <p>Done!</p>
            {startButton}
          </div>
        ) : (
          startButton
        );
      case GAME_STATES.LOADING_CARDS:
        return <CircularProgress />;
      case GAME_STATES.PLAYING:
        return <Card data={cardData} handleResult={this.handleResult} />;
      case GAME_STATES.GAME_END:
        return (
          <div>
            <p>Done!</p>
            {startButton}
          </div>
        );
    }
  }
}
