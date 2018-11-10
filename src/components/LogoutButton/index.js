import React from "react";
import styles from "./styles.scss";
import Button from "@material-ui/core/Button";
import { auth } from "../../firebase";

export default class LogoutButton extends React.Component {
  handleLogout = () => {
    const { notify } = this.props;
    auth
      .signOut()
      .then(() => notify && notify("Logged out"))
      .catch(log.error);
  };

  render() {
    return <Button onClick={this.handleLogout}>Logout</Button>;
  }
}
