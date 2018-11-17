import React from "react";
import styles from "./styles.scss";
import {
  NotificationsProvider,
  NotificationsConsumer
} from "../Notifications/context";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import LoginButtonEmail from "../LoginButtonEmail";
import LoginButtonAnon from "../LoginButtonAnon";
import * as log from "loglevel";

export default class LoginScreen extends React.Component {
  state = { email: "" };

  handleInputChange = ({ target }) => {
    const name = target.name;
    const value = target.type === "checkbox" ? target.checked : target.value;
    this.setState({
      [name]: value
    });
  };

  render() {
    const { email } = this.state;

    return (
      <div className={styles.root}>
        <NotificationsProvider>
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
                value={email}
                onChange={this.handleInputChange}
                fullWidth
              />
            </DialogContent>
            <NotificationsConsumer>
              {({ open }) => {
                return (
                  <DialogActions>
                    <LoginButtonAnon notify={open} />
                    <LoginButtonEmail notify={open} email={email} />
                  </DialogActions>
                );
              }}
            </NotificationsConsumer>
          </Dialog>
        </NotificationsProvider>
      </div>
    );
  }
}
