import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import styles from "./styles.scss";
import { editCard, deleteCard, recordCardAttempt } from "../../ducks/cards";

// components
import Button from "@material-ui/core/Button";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import Markdown from "react-markdown";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CheckIcon from "@material-ui/icons/Check";
import CloseIcon from "@material-ui/icons/Close";

export class FlashCard extends React.Component {
  state = { flipped: false };

  flipKeyboard = e => {
    if (e.code === "Space") this.setState({ flipped: !this.state.flipped });
  };

  flipClick = () => {
    this.setState({ flipped: !this.state.flipped });
  };

  handleSuccess = () => {
    const {
      id,
      data: { level }
    } = this.props;
    console.log("id, level", id, level);
    this.props.handleResult(id, level, true);
  };

  handleFailure = () => {
    const {
      id,
      data: { level }
    } = this.props;
    this.props.handleResult(id, level, false);
  };

  componentDidUpdate(prevProps) {
    if (prevProps.id !== this.props.id) {
      this.setState({ flipped: false });
    }
  }

  componentDidMount() {
    // window.addEventListener("keyup", this.flipKeyboard);
  }

  componentWillUnmount() {
    // window.removeEventListener("keyup", this.flipKeyboard);
  }

  render() {
    const {
      id,
      data,
      data: { prompt, answer },
      editCard,
      deleteCard
    } = this.props;

    const { flipped } = this.state;

    return (
      <Card className={styles.wrapper}>
        <CardContent className={styles.content}>
          <Markdown
            className={styles.answer}
            source={flipped ? answer : prompt}
          />
        </CardContent>
        <CardActions className={styles.cardActions}>
          <div className={styles.edit}>
            <Button aria-label="Edit" onClick={() => editCard(id, data)}>
              <EditIcon />
            </Button>
            <Button aria-label="Delete" onClick={() => deleteCard(id)}>
              <DeleteIcon />
            </Button>
          </div>
          <div className={styles.play}>
            {flipped ? (
              <Button
                key="correct"
                onClick={this.handleSuccess}
                color="primary"
              >
                <CheckIcon />
              </Button>
            ) : null}
            {flipped ? (
              <Button
                key="incorrect"
                onClick={this.handleFailure}
                color="primary"
              >
                <CloseIcon />
              </Button>
            ) : null}
            <Button key="flip" onClick={this.flipClick} color="primary">
              Flip
            </Button>
          </div>
        </CardActions>
      </Card>
    );
  }
}

FlashCard.propTypes = {
  id: PropTypes.string.isRequired,
  data: PropTypes.object.isRequired,
  handleResult: PropTypes.func.isRequired
};

const mapStateToProps = state => ({});

const mapDispatchToProps = dispatch => ({
  editCard: (id, data) => dispatch(editCard(id, data)),
  deleteCard: id => dispatch(deleteCard(id)),
  handleResult: (id, level, success) =>
    dispatch(recordCardAttempt(id, level, success))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FlashCard);
