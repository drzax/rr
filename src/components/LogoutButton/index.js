import React from "react";
import styles from "./styles.scss";
import Button from "@material-ui/core/Button";
import Logout from "../Logout";

export default class LogoutButton extends React.Component {
  render() {
    return <Logout component={Button}>Logout</Logout>;
  }
}
