import React from "react";
import styles from "./styles.scss";
import worm from "./worm.svg";
import Game from "../Game";
import AddCard from "../AddCard";
import CircularProgress from "@material-ui/core/CircularProgress";
import { auth, firebase } from "../../firebase";
import UserProfile from "../UserProfile";
import LoginScreen from "../LoginScreen";
import * as log from "loglevel";

export default class App extends React.Component {
  state = { awaitingLogin: true };

  signinLinkProcessed = false;

  componentWillMount() {
    this.offAuthStateChanged = auth.onAuthStateChanged(user => {
      log.debug("user", user);

      // Confirm the link is a sign-in with email link.
      if (
        this.signinLinkProcessed === false &&
        auth.isSignInWithEmailLink(window.location.href)
      ) {
        this.signinLinkProcessed = true;
        // Additional state parameters can also be passed via URL.
        // This can be used to continue the user's intended action before triggering
        // the sign-in operation.
        // Get the email if available. This should be available if the user completes
        // the flow on the same device where they started it.
        var email = window.localStorage.getItem("emailForSignIn");

        if (!email) {
          // User opened the link on a different device. To prevent session fixation
          // attacks, ask the user to provide the associated email again. For example:
          email = window.prompt("Please provide your email for confirmation");
        }

        // Construct the email link credential from the current URL.
        var credential = firebase.auth.EmailAuthProvider.credentialWithLink(
          email,
          window.location.href
        );

        // Link the credential to the current user.
        if (user) {
          user
            .linkAndRetrieveDataWithCredential(credential)
            .then(usercred => {
              // The provider is now successfully linked.
              // The phone user can now sign in with their phone number or email.
              log.debug("usercred", usercred);
              // this.setState({ user: usercred.user });
              window.localStorage.removeItem("emailForSignIn");
              this.setState({ user, awaitingLogin: false });
            })
            .catch(log.error);
        } else {
          auth
            .signInWithEmailLink(email, window.location.href)
            .then(result => {
              // Clear email from storage.
              window.localStorage.removeItem("emailForSignIn");
              // You can access the new user via result.user
              // Additional user info profile not available via:
              // result.additionalUserInfo.profile == null
              // You can check if the user is new or existing:
              // result.additionalUserInfo.isNewUser
              this.setState({ user, awaitingLogin: false });
            })
            .catch(log.error);
        }
      } else {
        this.setState({ user, awaitingLogin: false });
      }
    });
  }

  componentWillUnmount() {
    this.offAuthStateChanged();
  }

  login = () => {};

  render() {
    const { user, awaitingLogin } = this.state;
    if (awaitingLogin)
      return (
        <div className={styles.root}>
          <CircularProgress />
        </div>
      );

    if (!user) {
      return (
        <div className={styles.root}>
          <LoginScreen />
        </div>
      );
    }

    return (
      <div className={styles.root}>
        <Game user={user} />
        <AddCard user={user} />
        <UserProfile user={user} />
      </div>
    );
  }
}
