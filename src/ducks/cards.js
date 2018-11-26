import { firestore } from "../firebase";
import { combineReducers } from "redux";
import { showNotification } from "./notifications";
import * as log from "loglevel";
import { getNextCard } from "./selectors";

const CARDS_SUBSCRIBE = "CARDS_SUBSCRIBE";
export const cardsSubscribe = uid => dispatch => {
  const handleCards = snapshot => {
    const cards = [];
    snapshot.forEach(card => {
      const data = card.data();
      data.lastAttempt = data.lastAttempt ? data.lastAttempt.toDate() : null;
      cards.push({ id: card.id, data });
    });
    dispatch(receiveCards(cards));
  };

  const handleError = err => {
    log.error("err", err);
  };

  const unsubscribe = firestore
    .collection("cards")
    .where("uid", "==", uid)
    .onSnapshot(handleCards, handleError);

  dispatch({ type: CARDS_SUBSCRIBE, unsubscribe });
};

const RECEIVE_CARDS = "RECEIVE_CARDS";
export const receiveCards = cards => ({
  type: RECEIVE_CARDS,
  cards
});

const CARDS_UNSUBSCRIBE = "CARDS_UNSUBSCRIBE";
export const cardsUnsubscribe = () => ({ type: CARDS_UNSUBSCRIBE });

const RECORD_CARD_ATTEMPT = "RECORD_CARD_ATTEMPT";
export const recordCardAttempt = success => (dispatch, getState) => {
  const state = getState();
  const { gameCount } = state.game;
  const {
    id,
    data: { level }
  } = getNextCard(state);
  const data = {
    level: success ? level + 1 : 1,
    lastAttempt: new Date(),
    lastAttemptGame: gameCount
  };
  dispatch({ type: RECORD_CARD_ATTEMPT, id, data });
  firestore
    .collection("cards")
    .doc(id)
    .update(data)
    .then(() => {
      dispatch({ type: SAVE_CARD_SUCCESS });
    });
};

const CREATE_CARD = "CREATE_CARD";
export const createCard = () => ({
  type: CREATE_CARD
});

const EDIT_CARD = "EDIT_CARD";
export const editCard = (id, data) => ({
  type: EDIT_CARD,
  id,
  data
});

const EDIT_CARD_UPDATE = "EDIT_CARD_UPDATE";
export const editCardUpdate = data => ({
  type: EDIT_CARD_UPDATE,
  data
});

const EDIT_CARD_DONE = "EDIT_CARD_DONE";
export const editCardDone = () => ({
  type: EDIT_CARD_DONE
});

const SAVE_CARD = "SAVE_CARD";
const SAVE_CARD_SUCCESS = "SAVE_CARD_SUCCESS";
export const saveCard = (id, data) => (dispatch, getState) => {
  dispatch({ type: SAVE_CARD });

  const handleSuccess = () => {
    dispatch({ type: SAVE_CARD_SUCCESS });
    dispatch(showNotification("Card saved"));
    dispatch(editCardDone());
  };

  if (id) {
    firestore
      .collection("cards")
      .doc(id || undefined)
      .set(data)
      .then(handleSuccess);
  } else {
    firestore
      .collection("cards")
      .add({
        ...data,
        lastAttempt: new Date(),
        level: 1,
        uid: getState().user.uid
      })
      .then(handleSuccess);
  }
};

const DELETE_CARD = "DELETE_CARD";
const DELETE_CARD_SUCCESS = "DELETE_CARD_SUCCESS";
export const deleteCard = id => dispatch => {
  dispatch({ type: DELETE_CARD });
  firestore
    .collection("cards")
    .doc(id)
    .update({
      deleted: true
    })
    .then(() => {
      dispatch({ type: DELETE_CARD_SUCCESS });
      dispatch(showNotification("Card deleted"));
    });
};

// Reducers
const list = (state = [], action) => {
  switch (action.type) {
    case RECEIVE_CARDS:
      return action.cards;
    case CARDS_UNSUBSCRIBE:
      return [];
    case RECORD_CARD_ATTEMPT:
      return state.map(card => {
        if (card.id === action.id) {
          return {
            ...card,
            data: {
              ...card.data,
              ...action.data
            }
          };
        }
        return card;
      });
    default:
      return state;
  }
};

const isLoaded = (state = false, action) => {
  switch (action.type) {
    case CARDS_SUBSCRIBE:
    case CARDS_UNSUBSCRIBE:
      return false;
    case RECEIVE_CARDS:
      return true;
    default:
      return state;
  }
};

const editing = (state = false, action) => {
  switch (action.type) {
    case CREATE_CARD:
      return { id: null, data: {} };
    case EDIT_CARD:
      return { id: action.id, data: { ...action.data } };
    case EDIT_CARD_UPDATE:
      return { ...state, data: { ...state.data, ...action.data } };
    case SAVE_CARD:
      return { ...state, saving: true };
    case EDIT_CARD_DONE:
      return false;
    default:
      return state;
  }
};

const rootReducer = combineReducers({ list, isLoaded, editing });
export default rootReducer;
