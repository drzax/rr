import React from "react";
import styles from "./styles.scss";
import Button from "@material-ui/core/Button";
import { auth } from "../../firebase";
import * as log from "loglevel";

export default class LoginButtonAnon extends React.Component {
  state = { disabled: false };

  handleError = err => {
    const { notify } = this.props;
    this.setState({ disabled: false });
    notify &&
      notify(
        "Ohh no. There was a problem creating a new anonymous account. Please give it another go."
      );
    log.error(err);
  };

  handleSuccess = () => {
    const { notify } = this.props;
    notify &&
      notify("Anonymous account created. Sign up to make it permanent.");
    // Don't have to do anything else here because the App level authStateChanged handler
    // will deal propagate the new user.
  };

  // TODO: should the notify prop be required? Consider using flow or prop-types
  handleSignIn = () => {
    const { notify } = this.props;
    this.setState({ disabled: true });
    notify && notify("Hold tight, creating an anonymous account ...");
    auth
      .signInAnonymously()
      .then(this.handleSuccess)
      .catch(this.handleError);
  };

  render() {
    return (
      <Button disabled={this.state.disbabled} onClick={this.handleSignIn}>
        Use anonymously
      </Button>
    );
  }
}
