import React from "react";
import styles from "./styles.scss";
import { firestore } from "../../firebase";
import { levelsFromGameCount } from "../../utils";

export default class InsightPanel extends React.Component {
  state = {};
  componentDidMount() {
    this.unsubscribeCards = firestore
      .collection("cards")
      .where("uid", "==", this.props.user.uid)
      .onSnapshot(snapshot => {
        const totalCards = snapshot.size;
        let cardsByLevel = [];

        snapshot.forEach(card => {
          const data = card.data();
          cardsByLevel[data.level] = cardsByLevel[data.level]
            ? cardsByLevel[data.level] + 1
            : 1;
        });

        this.setState({ totalCards, cardsByLevel });
      });

    this.unsubscribeGame = firestore
      .collection("games")
      .doc(this.props.user.uid)
      .onSnapshot(snapshot => {
        this.setState({ game: snapshot.data() });
      });
  }

  componentWillUnmount() {
    this.unsubscribeCards();
    this.unsubscribeGame();
  }

  render() {
    const { totalCards, game, cardsByLevel } = this.state;
    const { user } = this.props;

    // Never show this on a production build
    // TODO: There's probably a better place to specify this. Like not even including it.
    if (process.env.NODE_ENV !== "development") return null;

    return (
      <div className={styles.wrapper}>
        {user ? (
          <table>
            <caption>User data</caption>
            <tbody>
              {["email", "isAnonymous", "emailVerified", "uid"].map(key => (
                <tr key={key}>
                  <th>{key}</th>
                  <td>{user[key] ? user[key].toString() : null}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : null}
        {game ? (
          <table>
            <caption>Game data</caption>
            <tbody>
              {["gameCount", "lastPlayed"].map(key => (
                <tr key={key}>
                  <th>{key}</th>
                  <td>{game[key] ? game[key].toString() : null}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : null}
        {game ? (
          <table>
            <caption>Playing levels</caption>
            <tbody>
              {["today", "tomorrow", "the next day"].map((key, idx) => (
                <tr key={key}>
                  <th>{key}</th>
                  <td>
                    {levelsFromGameCount(game.gameCount + idx).toString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : null}
        {cardsByLevel ? (
          <table>
            <caption>Cards by level</caption>
            {Object.keys(cardsByLevel).map(key => (
              <tr key={`level-${key}`}>
                <th>{key}</th>
                <td>{cardsByLevel[key]}</td>
              </tr>
            ))}
          </table>
        ) : null}
      </div>
    );
  }
}
