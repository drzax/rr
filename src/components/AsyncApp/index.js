import React from "react";
import * as log from "loglevel";
import styles from "./styles.scss";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { userSubscribe, userUnsubscribe } from "../../ducks/user";

// components
import Game from "../Game";
import AddCard from "../AddCard";
import CircularProgress from "@material-ui/core/CircularProgress";
import UserProfile from "../UserProfile";
import LoginScreen from "../LoginScreen";
import CardEditDialog from "../CardEditDialog";

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

    if (subscribed && uid)
      return (
        <div className={styles.root}>
          <div className={styles.gamePanel}>
            <Game />
          </div>
          <div className={styles.actionsPanel} />
          <CardEditDialog />
        </div>
      );

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
  return { uid, subscribed, editCard: state.cards.editing };
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
