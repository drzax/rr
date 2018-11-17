import { calendar, GAME_STATES } from "./constants";
import { createStore, applyMiddleware } from "redux";
import thunkMiddleware from "redux-thunk";
import { createLogger } from "redux-logger";
import rootReducer from "./ducks";
import * as log from "loglevel";

export const levelsFromGameCount = gameCount => {
  return calendar[gameCount % 64].slice();
};

export const configureStore = preloadedState => {
  return createStore(
    rootReducer,
    preloadedState,
    applyMiddleware(
      thunkMiddleware,
      createLogger(),
      createSubscriptionManager()
    )
  );
};

export const removeQueryStringFromUrl = () => {
  window.history.replaceState(
    null,
    document.title,
    window.location.href.replace(window.location.search, "")
  );
};

// TODO: the strings here should use the equivalent constants in ./user.js...but how?
function createSubscriptionManager() {
  const subscriptions = new Map();
  return ({ getState, dispatch }) => next => action => {
    switch (action.type) {
      case "USER_SUBSCRIBE":
        subscriptions.set("USER_UNSUBSCRIBE", action.unsubscribe);
        break;
      case "CARDS_SUBSCRIBE":
        subscriptions.set("CARDS_UNSUBSCRIBE", action.unsubscribe);
        break;
      case "USER_UNSUBSCRIBE":
      case "CARDS_UNSUBSCRIBE":
        const unsubscribe = subscriptions.get(action.type);
        subscriptions.delete(action.type);
        unsubscribe();
        break;
    }

    return next(action);
  };
}
