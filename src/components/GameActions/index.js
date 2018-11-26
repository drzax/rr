import { connect } from "react-redux";
import { recordCardAttempt } from "../../ducks/cards";
import { requestGameData, startGame, endGame } from "../../ducks/game";
import { getNextCard, gameIsLoaded } from "../../ducks/selectors";

// COMPONENT
import GameActions from "./component";

function mapStateToProps(state) {
  return { answerVisible: state.game.answerVisible };
}

function mapDispatchToProps(dispatch) {
  return {
    handleSuccess: (id, level) => dispatch(recordCardAttempt(true)),
    handleFailure: (id, level) => dispatch(recordCardAttempt(false))
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(GameActions);
