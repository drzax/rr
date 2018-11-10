import React from "react";
import styles from "./styles.scss";
import Snackbar from "@material-ui/core/Snackbar";
import { NotificationsConsumer } from "./context";

export default class Notifications extends React.Component {
  render() {
    return (
      <NotificationsConsumer>
        {({ isOpen, message, close }) => (
          <Snackbar
            open={isOpen}
            onClose={close}
            autoHideDuration={6000}
            anchorOrigin={{ vertical: "top", horizontal: "left" }}
            ContentProps={{
              "aria-describedby": "message-id"
            }}
            message={<span id="message-id">{message}</span>}
          />
        )}
      </NotificationsConsumer>
    );
  }
}
