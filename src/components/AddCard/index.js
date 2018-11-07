import React from "react";
import styles from "./styles.scss";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import AddIcon from "@material-ui/icons/Add";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import { firestore } from "../../firebase";
import * as log from "loglevel";

export default class AddCard extends React.Component {
  state = {
    open: false,
    formData: {}
  };

  handleClickOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  handleSave = () => {
    const cardData = {
      uid: this.props.user.uid,
      level: 1,
      ...this.state.formData
    };
    log.debug("cardData", cardData);
    firestore
      .collection("cards")
      .doc()
      .set(cardData)
      .then(log.debug)
      .catch(log.error);
    this.setState({ open: false });
  };

  handleInputChange = ({ target }) => {
    log.debug("target", target);
    const name = target.name;
    const value = target.type === "checkbox" ? target.checked : target.value;

    this.setState({
      formData: {
        ...this.state.formData,
        [name]: value
      }
    });
  };

  render() {
    const { formData } = this.state;
    log.debug("formData", formData);
    return (
      <div className={styles.wrapper}>
        <Button
          variant="fab"
          color="primary"
          aria-label="Add"
          onClick={this.handleClickOpen}
        >
          <AddIcon />
        </Button>
        <Dialog
          open={this.state.open}
          onClose={this.handleClose}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">Add Card</DialogTitle>

          <DialogContent>
            <DialogContentText>
              Each card needs a <strong>prompt</strong> for whatever it is
              you're trying to remember and an <strong>answer</strong>.
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
              value={formData.prompt || ""}
              onChange={this.handleInputChange}
              fullWidth
            />
            <TextField
              autoFocus
              margin="dense"
              id="answer"
              name="answer"
              label="Answer"
              type="text"
              variant="outlined"
              multiline
              value={formData.answer || ""}
              onChange={this.handleInputChange}
              fullWidth
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleClose} color="primary">
              Cancel
            </Button>
            <Button onClick={this.handleSave} color="primary">
              Save
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}
