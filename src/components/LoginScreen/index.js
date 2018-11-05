import React from "react";
import styles from "./styles.scss";

import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Button from "@material-ui/core/Button";
import Snackbar from "@material-ui/core/Snackbar";
import * as log from "loglevel";
import { auth } from "../../firebase";

export default class LoginScreen extends React.Component {
  state = {
    message: null,
    formData: {}
  };

  anonSignIn = () => {
    this.setState({ message: "Hold tight, creating an anonymous account ..." });
    auth.signInAnonymously();
  };

  handleSubmit = () => {
    this.setState({ message: "Sending sign-in email" });
    const { email } = this.state.formData;
    const actionCodeSettings = {
      url: window.location.href,
      handleCodeInApp: true
    };

    auth
      .sendSignInLinkToEmail(email, actionCodeSettings)
      .then(() => {
        window.localStorage.setItem("emailForSignIn", email);
        this.setState({
          message: "Please check your email for a sign-in link"
        });
      })
      .catch(error => {
        log.error(error);
        this.setState({
          message: "Sign-in failed. Are you sure your email address is correct?"
        });
      });
  };

  handleInputChange = ({ target }) => {
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
    const { formData, message } = this.state;

    return (
      <div>
        <Dialog
          open={true}
          aria-labelledby="form-dialog-title"
          BackdropProps={{ invisible: true }}
        >
          <DialogTitle id="form-dialog-title">Sign-in or sign-up</DialogTitle>

          <DialogContent>
            <DialogContentText>
              All we need to make it permanent is your email address.
            </DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              id="email"
              name="email"
              label="Email address"
              type="email"
              variant="outlined"
              value={formData.email || ""}
              onChange={this.handleInputChange}
              fullWidth
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={this.anonSignIn}>Use anonymously</Button>
            <Button
              onClick={this.handleSubmit}
              color="primary"
              disabled={!(formData.email && formData.email.length > 3)}
            >
              Sign-in
            </Button>
          </DialogActions>
        </Dialog>
        <Snackbar
          open={!!message}
          anchorOrigin={{ vertical: "top", horizontal: "left" }}
          ContentProps={{
            "aria-describedby": "message-id"
          }}
          message={<span id="message-id">{message}</span>}
        />
      </div>
    );
  }
}
