import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import styles from "./styles.scss";
import { editCard, deleteCard } from "../../ducks/cards";
import { showAnswer, hideAnswer } from "../../ducks/game";

// components
import IconButton from "@material-ui/core/IconButton";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import LoopIcon from "@material-ui/icons/Loop";
import Markdown from "react-markdown";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";

export class FlashCard extends React.Component {
  state = { flipped: false };

  flipClick = e => {
    e.preventDefault();
    const { hideAnswer, showAnswer } = this.props;
    if (this.state.flipped) {
      hideAnswer();
    } else {
      showAnswer();
    }
    this.setState({ flipped: !this.state.flipped });
  };

  componentDidUpdate(prevProps) {
    if (prevProps.id !== this.props.id) {
      this.props.hideAnswer();
      this.setState({ flipped: false });
    }
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
      <Card className={styles.wrapper} onClick={this.flipClick}>
        <CardContent className={styles.content}>
          <Markdown
            className={styles.answer}
            source={flipped ? answer : prompt}
          />
        </CardContent>
        <CardActions className={styles.cardActions}>
          <div className={styles.edit}>
            <IconButton
              aria-label="Edit"
              onClick={e => {
                e.stopPropagation();
                editCard(id, data);
              }}
            >
              <EditIcon fontSize="small" />
            </IconButton>
            <IconButton
              aria-label="Delete"
              onClick={e => {
                e.stopPropagation();
                deleteCard(id);
              }}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </div>
          <div className={styles.play}>
            <IconButton key="flip" onClick={this.flipClick} color="primary">
              <LoopIcon fontSize="small" />
            </IconButton>
          </div>
        </CardActions>
      </Card>
    );
  }
}

FlashCard.propTypes = {
  id: PropTypes.string.isRequired,
  data: PropTypes.object.isRequired
};

const mapStateToProps = state => ({});

const mapDispatchToProps = dispatch => ({
  editCard: (id, data) => dispatch(editCard(id, data)),
  deleteCard: id => dispatch(deleteCard(id)),
  showAnswer: () => dispatch(showAnswer()),
  hideAnswer: () => dispatch(hideAnswer())
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FlashCard);
