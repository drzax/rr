import React from "react";
import styles from "./styles.scss";
import Button from "@material-ui/core/Button";

export default class Card extends React.Component {
  constructor() {
    super();
    this.state = { flipped: false };
  }

  flipKeyboard = e => {
    if (e.code === "Space") this.setState({ flipped: true });
  };

  flipClick = () => {
    this.setState({ flipped: true });
  };

  handleSuccess = () => {
    this.props.handleResult(true);
    this.setState({ flipped: false });
  };

  handleFailure = () => {
    this.props.handleResult(false);
    this.setState({ flipped: false });
  };

  componentDidMount() {
    window.addEventListener("keyup", this.flipKeyboard);
  }

  componentWillUnmount() {
    window.removeEventListener("keyup", this.flipKeyboard);
  }

  render() {
    const { prompt, answer } = this.props.data;
    const { flipped } = this.state;

    const back = (
      <div>
        <div className={styles.answer}>{answer}</div>
        <Button onClick={this.handleSuccess} color="primary">
          Correct
        </Button>
        <Button onClick={this.handleFailure} color="primary">
          Incorrect
        </Button>
      </div>
    );
    const front = <div className={styles.prompt}>{prompt}</div>;

    return <div className={styles.wrapper}>{flipped ? back : front}</div>;
  }
}
