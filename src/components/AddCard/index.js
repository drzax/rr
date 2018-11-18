import React from "react";
import styles from "./styles.scss";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import AddIcon from "@material-ui/icons/Add";
import CardEditDialog from "../CardEditDialog";
import * as log from "loglevel";

export default class AddCard extends React.Component {
  state = {
    open: false
  };

  handleOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  render() {
    const { open } = this.state;
    const { uid } = this.props;

    return (
      <div className={styles.wrapper}>
        <Button
          variant="fab"
          color="primary"
          aria-label="Add"
          onClick={this.handleOpen}
        >
          <AddIcon />
        </Button>
        <CardEditDialog uid={uid} open={open} onClose={this.handleClose} />
      </div>
    );
  }
}

AddCard.propTypes = {
  uid: PropTypes.string.isRequired,
  saveCard: PropTypes.func.isRequired
};
