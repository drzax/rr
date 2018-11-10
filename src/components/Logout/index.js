import React from "react";
import styles from "./styles.scss";
import { auth } from "../../firebase";
import * as log from "loglevel";

export default class Logout extends React.Component {
  handleLogout = () => {
    const { notify } = this.props;
    auth
      .signOut()
      .then(() => notify && notify("Logged out"))
      .catch(log.error);
  };

  render() {
    const Component = this.props.component;
    return (
      <Component onClick={this.handleLogout} {...this.props.componentProps}>
        {this.props.children}
      </Component>
    );
  }
}
