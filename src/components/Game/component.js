import React from "react";
import styles from "./styles.scss";
import PropTypes from "prop-types";

// Components
import FlashCard from "../FlashCard";
import Button from "@material-ui/core/Button";
import GameStartButton from "../GameStartButton";
import CircularProgress from "@material-ui/core/CircularProgress";

// Misc
import isSameDay from "date-fns/is_same_day";

export default class Game extends React.Component {
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
