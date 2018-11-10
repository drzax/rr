import React from "react";
import styles from "./styles.scss";

import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Button from "@material-ui/core/Button";
import CardSaveButton from "../CardSaveButton";
import CircularProgress from "@material-ui/core/CircularProgress";
import { NotificationsConsumer } from "../Notifications/context";
import * as log from "loglevel";

export default class CardEditDialog extends React.Component {
  state = { loading: false };

  handleInputChange = ({ target }) => {
    const { name, type, checked, value } = target;
    const val = type === "checkbox" ? checked : value;
    this.setState({
      [name]: val
    });
  };

  handleSave = docRef => {
    this.props.onClose();
  };

  fetchCardData() {
    this.setState({
      loading: true
    });
    this.props.cardRef.get().then(card => {
      this.setState({
        loading: false,
        ...card.data()
      });
    });
  }

  componentDidUpdate(prevProps) {
    if (prevProps.cardRef !== this.props.cardRef) {
      this.fetchCardData();
    }
  }

  componentWillMount() {
    if (this.props.cardRef) this.fetchCardData();
  }

  render() {
    const { onClose, open, cardRef, uid } = this.props;
    const { prompt, answer, loading } = this.state;

    const dialogContent = (
      <DialogContent>
        <DialogContentText>
          Each card needs a <strong>prompt</strong> for whatever it is you're
          trying to remember and an <strong>answer</strong>.
        </DialogContentText>
        <TextField
          autoFocus
          margin="dense"
          id="prompt"
          name="prompt"
          label="Prompt"
          type="text"
          variant="outlined"
          multiline
          value={prompt || ""}
          onChange={this.handleInputChange}
          fullWidth
        />
        <TextField
          margin="dense"
          id="answer"
          name="answer"
          label="Answer"
          type="text"
          variant="outlined"
          multiline
          value={answer || ""}
          onChange={this.handleInputChange}
          fullWidth
        />
        <DialogContentText>
          <small>
            You can use{" "}
            <a
              href="https://daringfireball.net/projects/markdown/syntax"
              title="Markdown syntax guide"
            >
              Markdown
            </a>{" "}
            in these fields for more control.
          </small>
        </DialogContentText>
      </DialogContent>
    );

    const dialogActions = (
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>

        <NotificationsConsumer>
          {({ open }) => (
            <CardSaveButton
              notify={open}
              uid={uid}
              data={{ ...this.state }}
              cardRef={cardRef}
              onSave={this.handleSave}
              disabled={!prompt || !answer}
              text={cardRef ? "Update" : "Add"}
            />
          )}
        </NotificationsConsumer>
      </DialogActions>
    );

    return (
      <Dialog open={open} onClose={onClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">
          {cardRef ? "Edit" : "Add"} Card
        </DialogTitle>
        {loading ? <CircularProgress /> : dialogContent}
        {!loading ? dialogActions : null}
      </Dialog>
    );
  }
}
