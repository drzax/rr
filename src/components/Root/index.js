import React from "react";
import { Provider } from "react-redux";
import AsyncApp from "../AsyncApp";
import Notifications from "../Notifications";
import { configureStore } from "../../utils";

export default class Root extends React.Component {
  render() {
    return (
      <Provider store={configureStore()}>
        <div>
          <AsyncApp />
          <Notifications />
        </div>
      </Provider>
    );
  }
}
