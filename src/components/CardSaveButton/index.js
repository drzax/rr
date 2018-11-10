import React from "react";
import styles from "./styles.scss";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import { firestore } from "../../firebase";
import * as log from "loglevel";

export default class CardSaveButton extends React.Component {
  state = { saving: false };

  handleError = err => {
    const { notify } = this.props;
    // todo: log this somewhere accessible.
    log.error(err);
    notify && notify("Error saving card. Please try again.");
    this.setState({ saving: false });
  };

  handleUpdate = () => {
    const { cardRef, data, notify, onSave } = this.props;
    cardRef
      .update(data)
      .then(() => {
        notify && notify("Card updated.");
        onSave(cardRef);
        this.setState({ saving: false });
      })
      .catch(this.handleError);
  };

  handleCreate = () => {
    const { uid, data, notify, onSave } = this.props;
    const cardRef = firestore.collection("cards").doc();
    this.setState({ saving: true });

    const cardData = {
      uid,
      level: 1,
      lastAttempt: new Date(),
      ...data
    };

    log.debug("cardData", cardData);

    cardRef
      .set(cardData)
      .then(() => {
        notify && notify("Card added.");
        onSave(cardRef);
        this.setState({ saving: false });
      })
      .catch(this.handleError);
  };

  render() {
    const { cardRef, text, disabled } = this.props;
    const { saving } = this.state;
    return (
      <Button
        disabled={disabled || saving}
        onClick={cardRef ? this.handleUpdate : this.handleCreate}
      >
        {saving ? <CircularProgress size={20} /> : text}
      </Button>
    );
  }
}
