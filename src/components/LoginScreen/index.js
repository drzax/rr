import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { requestLoginEmail, requestLoginAnon } from "../../ducks/user";

import styles from "./styles.scss";
import * as log from "loglevel";

// components
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Button from "@material-ui/core/Button";
import LoginButtonAnon from "../LoginButtonAnon";

export class LoginScreen extends React.Component {
  state = { email: "" };

  handleInputChange = ({ target }) => {
    const name = target.name;
    const value = target.type === "checkbox" ? target.checked : target.value;
    this.setState({
      [name]: value
    });
  };

  handleSubmit = () => {};

  render() {
    const { email } = this.state;
    const { handleLogin, handleLoginAnon } = this.props;

    return (
      <div className={styles.root}>
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
          <DialogActions>
            {email ? null : (
              <Button onClick={() => handleLoginAnon()}>Use anonymously</Button>
            )}
            <Button
              onClick={() => handleLogin(email)}
              color="primary"
              disabled={!(email && email.length > 3)}
            >
              Sign-in
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

const mapStateToProps = state => ({});
const mapDispatchToProps = dispatch => ({
  handleLogin: email => dispatch(requestLoginEmail(email)),
  handleLoginAnon: () => dispatch(requestLoginAnon())
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LoginScreen);
