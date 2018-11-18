import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import {
  editCard,
  editCardUpdate,
  saveCard,
  editCardDone
} from "../../ducks/cards";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Button from "@material-ui/core/Button";
import CardSaveButton from "../CardSaveButton";
import CircularProgress from "@material-ui/core/CircularProgress";
import * as log from "loglevel";

export class CardEditDialog extends React.Component {
  handleInputChange = ({ target }) => {
    const { name, type, checked, value } = target;
    const val = type === "checkbox" ? checked : value;
    this.props.editCardUpdate({
      [name]: val
    });
  };

  render() {
    if (this.props.card === false) return null;

    const {
      editCardDone,
      saveCard,
      card,
      card: {
        id,
        saving,
        data: { prompt, answer }
      }
    } = this.props;

    const dialogContent = (
      <DialogContent>
        <DialogContentText>
          Each card needs a <strong>prompt</strong> for whatever it is you're
          trying to remember and an <strong>answer</strong>.
        </DialogContentText>
        <TextField
          autoFocus
          margin="dense"
          id="prompt"
          name="prompt"
          label="Prompt"
          type="text"
          variant="outlined"
          multiline
          value={prompt || ""}
          onChange={this.handleInputChange}
          fullWidth
        />
        <TextField
          margin="dense"
          id="answer"
          name="answer"
          label="Answer"
          type="text"
          variant="outlined"
          multiline
          value={answer || ""}
          onChange={this.handleInputChange}
          fullWidth
        />
        <DialogContentText>
          <small>
            You can use{" "}
            <a
              href="https://daringfireball.net/projects/markdown/syntax"
              title="Markdown syntax guide"
            >
              Markdown
            </a>{" "}
            in these fields for more control.
          </small>
        </DialogContentText>
      </DialogContent>
    );

    const dialogActions = (
      <DialogActions>
        {saving ? <CircularProgress size={10} /> : null}
        <Button onClick={editCardDone}>Cancel</Button>
        <Button
          onClick={() => saveCard(card.id, card.data)}
          disabled={!(prompt && answer) | saving}
        >
          Save
        </Button>
      </DialogActions>
    );

    return (
      <Dialog open={true} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Edit Card</DialogTitle>
        {dialogContent}
        {dialogActions}
      </Dialog>
    );
  }
}

CardEditDialog.propTypes = {
  card: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      data: PropTypes.object.isRequired
    })
  ])
};

const mapStateToProps = state => ({
  card: state.cards.editing
});

const mapDispatchToProps = dispatch => ({
  saveCard: (id, data) => dispatch(saveCard(id, data)),
  editCardUpdate: data => dispatch(editCardUpdate(data)),
  editCardDone: data => dispatch(editCardDone())
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CardEditDialog);
