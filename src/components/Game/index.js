import React from "react";
import styles from "./styles.scss";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import {
  cardsSubscribe,
  cardsUnsubscribe,
  recordCardAttempt
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

  render() {
    const {
      isLoaded,
      currentCardCount,
      nextCard,
      isPlaying,
      startGame,
      lastPlayed,
      recordCardAttempt
    } = this.props;

    if (!isLoaded) return <CircularProgress />;

    if (isPlaying && nextCard)
      return <FlashCard {...nextCard} handleResult={recordCardAttempt} />;

    return (
      <GameStartButton
        cardsRemaining={currentCardCount}
        onClick={startGame}
        playedToday={isSameDay(new Date(), lastPlayed)}
      />
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
    recordCardAttempt: (cardId, success) =>
      dispatch(recordCardAttempt(cardId, success))
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Game);
