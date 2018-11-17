import React from "react";
import Button from "@material-ui/core/Button";
import PropTypes from "prop-types";

export default function GameStartButton({
  onClick,
  playedToday,
  cardsRemaining
}) {
  let superUser = true;
  return (
    <Button
      size="large"
      variant="contained"
      disabled={(playedToday && !superUser) || cardsRemaining === 0}
      onClick={onClick}
    >
      Start reviewing {cardsRemaining} card
      {cardsRemaining > 1 || cardsRemaining === 0 ? "s" : ""}
    </Button>
  );
}

GameStartButton.propTypes = {
  onClick: PropTypes.func.isRequired,
  playedToday: PropTypes.bool.isRequired,
  cardsRemaining: PropTypes.number.isRequired
};
