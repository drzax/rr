import React from "react";
import styles from "./styles.scss";
import Button from "@material-ui/core/Button";
import Markdown from "react-markdown";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CheckIcon from "@material-ui/icons/Check";
import CloseIcon from "@material-ui/icons/Close";

export default class FlashCard extends React.Component {
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
  };

  handleFailure = () => {
    this.props.handleResult(false);
  };

  componentDidUpdate(prevProps) {
    if (prevProps.data !== this.props.data) {
      this.setState({ flipped: false });
    }
  }

  componentDidMount() {
    window.addEventListener("keyup", this.flipKeyboard);
  }

  componentWillUnmount() {
    window.removeEventListener("keyup", this.flipKeyboard);
  }

  render() {
    const { prompt, answer } = this.props.data;
    const { flipped } = this.state;
    const actions = [];

    if (flipped) {
      actions.push(
        <Button key="correct" onClick={this.handleSuccess} color="primary">
          <CheckIcon />
        </Button>
      );
      actions.push(
        <Button key="incorrect" onClick={this.handleFailure} color="primary">
          <CloseIcon />
        </Button>
      );
    } else {
      actions.push(
        <Button key="flip" onClick={this.flipClick} color="primary">
          Flip
        </Button>
      );
    }

    return (
      <Card className={styles.wrapper}>
        <CardContent className={styles.content}>
          <Markdown
            className={styles.answer}
            source={flipped ? answer : prompt}
          />
        </CardContent>
        <CardActions className={styles.cardActions}>
          {actions.map(action => action)}
        </CardActions>
      </Card>
    );
  }
}
