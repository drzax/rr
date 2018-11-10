import React from "react";
import styles from "./styles.scss";
import Button from "@material-ui/core/Button";
import { auth } from "../../firebase";
import * as log from "loglevel";

export default class LoginButtonEmail extends React.Component {
  handleEmailSent = () => {
    const { notify, email } = this.props;
    window.localStorage.setItem("emailForSignIn", email);
    notify && notify("Please check your email for a sign-in link");
  };

  handleError = error => {
    const { notify } = this.props;
    log.error(error);
    notify &&
      notify("Sign-in failed. Are you sure your email address is correct?");
  };

  // TODO: should the notify prop be required? Consider using flow or prop-types
  handleSubmit = () => {
    const { email, notify } = this.props;
    notify && notify("Sending sign-in email");
    auth
      .sendSignInLinkToEmail(email, {
        url: window.location.href,
        handleCodeInApp: true
      })
      .then(this.handleEmailSent)
      .catch(this.handleError);
  };

  render() {
    const { email } = this.props;
    return (
      <Button
        onClick={this.handleSubmit}
        color="primary"
        disabled={!(email && email.length > 3)}
      >
        Sign-in
      </Button>
    );
  }
}
