import React from "react";
import styles from "./styles.scss";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import EditIcon from "@material-ui/icons/Edit";
import CardEditDialog from "../CardEditDialog";
import * as log from "loglevel";

export default class EditCard extends React.Component {
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
    const { uid, cardRef } = this.props;

    return (
      <span>
        <Button secondary aria-label="Edit" onClick={this.handleOpen}>
          <EditIcon />
        </Button>
        <CardEditDialog
          cardRef={cardRef}
          uid={uid}
          open={open}
          onClose={this.handleClose}
        />
      </span>
    );
  }
}
