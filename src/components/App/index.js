import React from "react";
import styles from "./styles.scss";
import worm from "./worm.svg";
import Game from "../Game";
import AddCard from "../AddCard";
import CircularProgress from "@material-ui/core/CircularProgress";
import Snackbar from "@material-ui/core/Snackbar";
import { auth, firebase } from "../../firebase";
import UserProfile from "../UserProfile";
import LoginScreen from "../LoginScreen";
import InsightPanel from "../InsightPanel";
import * as log from "loglevel";

export default class App extends React.Component {
  state = { awaitingLogin: true, superUser: false };

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
              window.history.replaceState(
                null,
                null,
                window.location.href.replace(window.location.search, "")
              );
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
              window.history.replaceState(
                null,
                null,
                window.location.href.replace(window.location.search, "")
              );
            })
            .catch(log.error);
        }
      } else {
        this.setState({ user, awaitingLogin: false });
      }
    });

    window.addEventListener("keyup", this.handleSuperUserToggle);
    if (window.localStorage.superUser) {
      this.setState({ superUser: true });
    }
  }

  componentWillUnmount() {
    this.offAuthStateChanged();
    window.removeEventListener("keyup", this.handleSuperUserToggle);
  }

  handleSuperUserToggle = ev => {
    if (ev.target !== document.body) return;
    if (ev.key === "s") this.s = true;
    setTimeout(() => (this.s = false), 500);
    if (ev.key === "u" && this.s) {
      const superUser = !this.state.superUser;
      const message = superUser
        ? "Super user mode enabled 💯"
        : "Super user mode disabled";
      if (superUser) log.setLevel("debug");
      window.localStorage.superUser = superUser;
      this.setState({ superUser, message });
      this.s = false;
    }
  };

  handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    this.setState({ message: false });
  };

  render() {
    const { user, awaitingLogin, message, superUser } = this.state;

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
        <Game user={user} superUser={superUser} />
        <AddCard user={user} />
        <UserProfile user={user} />
        {superUser ? <InsightPanel user={user} /> : null}
        <Snackbar
          open={!!message}
          onClose={this.handleCloseSnackbar}
          autoHideDuration={6000}
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
