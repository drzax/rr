import React from "react";
import { render } from "react-dom";
import App from "./components/App";
import ErrorBox from "./components/ErrorBox";
import * as log from "loglevel";

const PROJECT_NAME = "rr";
const root = document.querySelector(`[data-${PROJECT_NAME}-root]`);

function init() {
  render(<App projectName={PROJECT_NAME} />, root);
}

init();

if (module.hot) {
  module.hot.accept("./components/App", () => {
    try {
      init();
    } catch (err) {
      render(<ErrorBox error={err} />, root);
    }
  });
}

if (process.env.NODE_ENV === "development") {
  log.setLevel("debug");
  log.debug(`[${PROJECT_NAME}] public path: ${__webpack_public_path__}`);
}
