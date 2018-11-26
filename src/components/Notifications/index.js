import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { showNotification, closeNotification } from "../../ducks/notifications";
import Snackbar from "@material-ui/core/Snackbar";

export class Notifications extends React.Component {
  render() {
    const { isOpen, onClose, autoHideDuration, message } = this.props;
    return (
      <Snackbar
        open={isOpen}
        onClose={onClose}
        autoHideDuration={autoHideDuration || 6000}
        anchorOrigin={{ vertical: "top", horizontal: "left" }}
        ContentProps={{
          "aria-describedby": "message-id"
        }}
        message={<span id="message-id">{message}</span>}
      />
    );
  }
}

Notifications.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  message: PropTypes.string.isRequired,
  autoHideDuration: PropTypes.number
};

const mapDispatchToProps = dispatch => ({
  onClose: () => dispatch(closeNotification())
});

const mapStateToProps = state => ({
  isOpen: state.notifications.isOpen,
  autoHideDuration: state.notifications.duration,
  message: state.notifications.message || ""
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Notifications);
