import React from "react";
import styles from "./styles.scss";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import {
  cardsSubscribe,
  cardsUnsubscribe,
  recordCardAttempt,
  createCard
} from "../../ducks/cards";
import { requestGameData, startGame, endGame } from "../../ducks/game";
import { calendar, GAME_STATES } from "../../constants";
import {
  getCurrentCardCount,
  getNextCard,
  gameIsLoaded
} from "../../ducks/selectors";

// Components
import FlashCard from "../FlashCard";
import Button from "@material-ui/core/Button";
import GameStartButton from "../GameStartButton";
import CircularProgress from "@material-ui/core/CircularProgress";

// Misc
import * as log from "loglevel";
import isSameDay from "date-fns/is_same_day";

export class Game extends React.Component {
  componentWillMount() {
    const { uid, cardsSubscribe, requestGameData } = this.props;
    cardsSubscribe(uid);
    requestGameData(uid);
  }

  componentWillUnmount() {
    this.props.cardsUnsubscribe();
  }

  componentDidUpdate() {
    const { nextCard, isPlaying, endGame } = this.props;
    if (!nextCard && isPlaying) {
      endGame();
    }
  }

  render() {
    const {
      isLoaded,
      currentCardCount,
      nextCard,
      isPlaying,
      startGame,
      lastPlayed,
      createCard,
      recordCardAttempt
    } = this.props;

    if (!isLoaded) return <CircularProgress />;

    if (isPlaying && nextCard)
      return <FlashCard {...nextCard} handleResult={recordCardAttempt} />;

    const playedToday = isSameDay(new Date(), lastPlayed);
    return (
      <div>
        {currentCardCount === 0 ? (
          <div>
            <p>There are no cards scheduled for the next review.</p>
            <Button
              size="small"
              variant="contained"
              color="primary"
              aria-label="Add"
              onClick={createCard}
            >
              Add one?
            </Button>
          </div>
        ) : (
          <div>
            <GameStartButton
              cardsRemaining={currentCardCount}
              onClick={startGame}
              playedToday={playedToday}
            />
            {playedToday ? (
              <p>
                You've alreayd played today. Have a break until tomorrow — this
                whole thing works best if you have a break between games.
              </p>
            ) : null}
          </div>
        )}
      </div>
    );
  }
}

Game.propTypes = {
  uid: PropTypes.string.isRequired,
  cardsSubscribe: PropTypes.func.isRequired,
  cardsUnsubscribe: PropTypes.func.isRequired,
  requestGameData: PropTypes.func.isRequired,
  startGame: PropTypes.func.isRequired,
  recordCardAttempt: PropTypes.func.isRequired,
  nextCard: PropTypes.object,
  createCard: PropTypes.func.isRequired,
  currentCardCount: PropTypes.number,
  isLoaded: PropTypes.bool.isRequired,
  isPlaying: PropTypes.bool.isRequired,
  lastPlayed: PropTypes.object,
  gameCount: PropTypes.number
};

function mapStateToProps(state) {
  const {
    game: { gameCount, lastPlayed, isPlaying },
    user: { uid }
  } = state;
  return {
    uid,
    gameCount,
    lastPlayed,
    isPlaying,
    isLoaded: gameIsLoaded(state),
    currentCardCount: getCurrentCardCount(state),
    nextCard: getNextCard(state)
  };
}

function mapDispatchToProps(dispatch) {
  return {
    cardsSubscribe: uid => dispatch(cardsSubscribe(uid)),
    cardsUnsubscribe: () => dispatch(cardsUnsubscribe()),
    requestGameData: uid => dispatch(requestGameData(uid)),
    startGame: () => dispatch(startGame()),
    endGame: () => dispatch(endGame()),
    createCard: () => dispatch(createCard()),
    recordCardAttempt: (cardId, success) =>
      dispatch(recordCardAttempt(cardId, success))
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Game);
