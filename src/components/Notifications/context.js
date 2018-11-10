import React, { createContext, Component } from "react";
import Notifications from "./";
import * as log from "loglevel";

export const NotificationsContext = createContext({
  open: () => {
    log.warn("default open");
  },
  close: () => {},
  isOpen: false,
  message: null
});

export class NotificationsProvider extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isOpen: false,
      message: ""
    };
  }

  open = message => {
    this.setState({
      message,
      isOpen: true
    });
  };

  close = () => {
    this.setState({
      message: "",
      isOpen: false
    });
  };

  render() {
    const { children } = this.props;

    return (
      <NotificationsContext.Provider
        value={{
          open: this.open,
          close: this.close,
          isOpen: this.state.isOpen,
          message: this.state.message
        }}
      >
        <Notifications />
        {children}
      </NotificationsContext.Provider>
    );
  }
}

export const NotificationsConsumer = NotificationsContext.Consumer;
