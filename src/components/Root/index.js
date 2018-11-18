import React from "react";
import { Provider } from "react-redux";
import App from "../App";
import Notifications from "../Notifications";
import { configureStore } from "../../utils";

export default class Root extends React.Component {
  render() {
    return (
      <Provider store={configureStore()}>
        <div>
          <App />
          <Notifications />
        </div>
      </Provider>
    );
  }
}
