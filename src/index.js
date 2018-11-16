import React from "react";
import { render } from "react-dom";
import Root from "./components/Root";
import ErrorBox from "./components/ErrorBox";
import * as log from "loglevel";

const PROJECT_NAME = "rr";
const root = document.querySelector(`[data-${PROJECT_NAME}-root]`);

function init() {
  render(<Root projectName={PROJECT_NAME} />, root);
}

init();

if (module.hot) {
  module.hot.accept("./components/Root", () => {
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

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/service-worker.js")
      .then(registration => {
        console.log("SW registered: ", registration);
      })
      .catch(registrationError => {
        console.log("SW registration failed: ", registrationError);
      });
  });
}
