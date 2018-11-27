import React from "react";
import * as log from "loglevel";
import styles from "./styles.scss";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { userSubscribe, userUnsubscribe } from "../../ducks/user";
import { createCard } from "../../ducks/cards";

// components
import Game from "../Game";
import AddCard from "../AddCard";
import CircularProgress from "@material-ui/core/CircularProgress";
import LoginScreen from "../LoginScreen";
import GameActions from "../GameActions";
import CardEditDialog from "../CardEditDialog";
import Button from "@material-ui/core/Button";
import AddIcon from "@material-ui/icons/Add";
import MainMenu from "../MainMenu";

export class App extends React.Component {
  componentDidMount() {
    this.props.userSubscribe();
  }

  componentWillUnmount() {
    this.props.userUnsubscribe();
  }

  render() {
    const { subscribed, uid, createCard } = this.props;

    if (subscribed && !uid) return <LoginScreen />;

    if (subscribed && uid)
      return (
        <div className={styles.root}>
          <div className={styles.gamePanel}>
            <Game />
          </div>
          <div className={styles.actionsPanel}>
            <div className={styles.globalActions}>
              <Button
                variant="fab"
                color="primary"
                aria-label="Add"
                onClick={createCard}
              >
                <AddIcon />
              </Button>
            </div>
            <GameActions />
          </div>
          <CardEditDialog />
          <MainMenu className={styles.menu} />
        </div>
      );

    return (
      <div className={styles.loading}>
        <CircularProgress className={styles.progress} />
      </div>
    );
  }
}

App.propTypes = {
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
    userUnsubscribe: () => dispatch(userUnsubscribe()),
    createCard: () => dispatch(createCard())
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
