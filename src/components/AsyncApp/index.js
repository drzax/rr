import React from "react";
import * as log from "loglevel";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { userSubscribe, userUnsubscribe } from "../../ducks/user";
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
import styles from "./styles.scss";

export class AsyncApp extends React.Component {
  componentDidMount() {
    this.props.userSubscribe();
  }

  componentWillUnmount() {
    this.props.userUnsubscribe();
  }

  render() {
    const { subscribed, uid } = this.props;

    if (subscribed && !uid) return <LoginScreen />;

    if (subscribed && uid) {
      const superUser = false;

      return (
        <div className={styles.root}>
          <NotificationsProvider>
            <div className={styles.gamePanel}>
              <Game />
            </div>
            <div className={styles.actionsPanel}>
              <UserProfile />
              <AddCard />
            </div>
          </NotificationsProvider>
        </div>
      );
    }

    return (
      <div className={styles.loading}>
        <CircularProgress className={styles.progress} />
      </div>
    );
  }
}

AsyncApp.propTypes = {
  userSubscribe: PropTypes.func.isRequired,
  userUnsubscribe: PropTypes.func.isRequired,
  uid: PropTypes.string,
  subscribed: PropTypes.bool
};

function mapStateToProps(state) {
  const { uid, subscribed } = state.user;
  return { uid, subscribed };
}

function mapDispatchToProps(dispatch) {
  return {
    userSubscribe: () => dispatch(userSubscribe()),
    userUnsubscribe: () => dispatch(userUnsubscribe())
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AsyncApp);
