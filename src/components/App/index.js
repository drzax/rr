import React from "react";
import styles from "./styles.scss";
import worm from "./worm.svg";
import Game from "../Game";
import AddCard from "../AddCard";
import { auth } from "../../firebase";

export default class App extends React.Component {
  state = {};

  componentWillMount() {
    this.offAuthStateChanged = auth.onAuthStateChanged(user => {
      this.setState({ user });
    });
  }

  componentWillUnmount() {
    this.offAuthStateChanged();
  }

  render() {
    const { user } = this.state;
    if (!user) return null;
    return (
      <div className={styles.root}>
        <Game user={user} />
        <AddCard user={user} />
      </div>
    );
  }
}
