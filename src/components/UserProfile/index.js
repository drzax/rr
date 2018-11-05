import React from "react";
import styles from "./styles.scss";
import Avatar from "@material-ui/core/Avatar";
import Face from "@material-ui/icons/Face";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import * as log from "loglevel";
import { auth } from "../../firebase";

export default class UserProfile extends React.Component {
  state = {
    formData: {},
    open: false
  };

  handleClickOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  handleLogout = () => {
    log.debug("logout");
    auth
      .signOut()
      .then(() => {
        this.setState({ open: false });
      })
      .catch(log.error);
  };

  handleSubmit = () => {
    const { email } = this.state.formData;
    const actionCodeSettings = {
      url: window.location.href,
      handleCodeInApp: true
    };

    auth
      .sendSignInLinkToEmail(email, actionCodeSettings)
      .then(() => window.localStorage.setItem("emailForSignIn", email))
      .catch(log.error);
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
    log.debug("user", this.props.user);
    const { user } = this.props;
    const { formData, open } = this.state;
    return (
      <div className={styles.wrapper}>
        {user.isAnonymous ? (
          <p className={styles.anon}>
            Dang—this is an anonymous user account. Sign up to save your stuff.
          </p>
        ) : null}
        <Button
          variant="fab"
          color="primary"
          aria-label="Add"
          onClick={this.handleClickOpen}
        >
          <Face />
        </Button>
        <Dialog
          open={this.state.open}
          onClose={this.handleClose}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">
            {user.isAnonymous ? "Sign-up" : "Logout"}
          </DialogTitle>

          {user.isAnonymous ? (
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
          ) : null}
          <DialogActions>
            <Button onClick={this.handleLogout} color="primary">
              Logout
            </Button>

            <Button onClick={this.handleClose} color="primary">
              Cancel
            </Button>
            {user.isAnonymous ? (
              <Button onClick={this.handleSubmit} color="primary">
                Submit
              </Button>
            ) : null}
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}
