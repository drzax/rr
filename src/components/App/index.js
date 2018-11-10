import React from "react";
import styles from "./styles.scss";
import worm from "./worm.svg";
import Game from "../Game";
import AddCard from "../AddCard";
import CircularProgress from "@material-ui/core/CircularProgress";
import { auth, firebase } from "../../firebase";
import {
  NotificationsProvider,
  NotificationsConsumer
} from "../Notifications/context";
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
        var email = window.localStorage.getItem("emailForSignIn");

        if (!email) {
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
              log.debug("usercred", usercred);
              window.localStorage.removeItem("emailForSignIn");
              this.setState({ user, awaitingLogin: false });
              purgeLoginUrl();
            })
            .catch(log.error);
        } else {
          auth
            .signInWithEmailLink(email, window.location.href)
            .then(result => {
              window.localStorage.removeItem("emailForSignIn");
              this.setState({ user, awaitingLogin: false });
              purgeLoginUrl();
            })
            .catch(err => {
              log.error(email, err);
            });
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
      this.openNotification(message);
      window.localStorage.superUser = superUser;
      this.setState({ superUser });
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
        <div className={styles.loading}>
          <CircularProgress className={styles.progress} />
        </div>
      );

    if (!user) {
      return (
        <div className={styles.root}>
          <NotificationsProvider>
            <LoginScreen />
          </NotificationsProvider>
        </div>
      );
    }

    return (
      <div className={styles.root}>
        <NotificationsProvider>
          <NotificationsConsumer>
            {({ open }) => {
              this.openNotification = open;
            }}
          </NotificationsConsumer>

          <div className={styles.gamePanel}>
            <Game uid={user.uid} superUser={superUser} />
          </div>

          <div className={styles.actionsPanel}>
            <UserProfile user={user} />
            <AddCard user={user} />
          </div>

          {superUser ? <InsightPanel user={user} /> : null}
        </NotificationsProvider>
      </div>
    );
  }
}

const purgeLoginUrl = () => {
  window.history.replaceState(
    null,
    document.title,
    window.location.href.replace(window.location.search, "")
  );
};
