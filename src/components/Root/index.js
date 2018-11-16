import React from "react";
import { Provider } from "react-redux";
import AsyncApp from "../AsyncApp";
import { configureStore } from "../../utils";

export default class Root extends React.Component {
  render() {
    return (
      <Provider store={configureStore()}>
        <AsyncApp />
      </Provider>
    );
  }
}
