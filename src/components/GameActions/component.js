import React from "react";
import PropTypes from "prop-types";
import Button from "@material-ui/core/Button";
import CheckIcon from "@material-ui/icons/Check";
import CloseIcon from "@material-ui/icons/Close";
import styles from "./styles.scss";

export default function GameActions(props) {
  const { handleSuccess, handleFailure, answerVisible } = props;

  if (!answerVisible) return null;

  return (
    <div className={styles.gameActions}>
      <Button
        key="correct"
        variant="fab"
        className={styles.correct}
        onClick={handleSuccess}
        color="primary"
      >
        <CheckIcon />
      </Button>
      <Button
        key="incorrect"
        variant="fab"
        className={styles.incorrect}
        onClick={handleFailure}
        color="primary"
      >
        <CloseIcon />
      </Button>
    </div>
  );
}

GameActions.propTypes = {
  handleSuccess: PropTypes.func.isRequired,
  handleFailure: PropTypes.func.isRequired,
  answerVisible: PropTypes.bool.isRequired
};
