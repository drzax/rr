import { connect } from "react-redux";
import {
  cardsSubscribe,
  cardsUnsubscribe,
  recordCardAttempt,
  createCard
} from "../../ducks/cards";
import { requestGameData, startGame, endGame } from "../../ducks/game";
import {
  getCurrentCardCount,
  getNextCard,
  gameIsLoaded,
  cardsPerLevel
} from "../../ducks/selectors";

// COMPONENT
import Game from "./component";

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
    nextCard: getNextCard(state),
    cardsPerLevel: cardsPerLevel(state)
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
