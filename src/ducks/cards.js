import { firestore } from "../firebase";
import { combineReducers } from "redux";

const CARDS_SUBSCRIBE = "CARDS_SUBSCRIBE";
export const cardsSubscribe = uid => dispatch => {
  const handleCards = snapshot => {
    const cards = [];
    snapshot.forEach(card => {
      const data = card.data();
      data.lastAttempt = data.lastAttempt ? data.lastAttempt.toDate() : null;
      cards.push({ id: card.id, ...data });
    });
    dispatch(receiveCards(cards));
  };

  const handleError = err => {
    log.debug("err", err);
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
export const recordCardAttempt = (cardId, success) => ({
  type: RECORD_CARD_ATTEMPT,
  cardId,
  success
});

const SAVE_CARD = "SAVE_CARD";
export const saveCard = (id, data) => ({
  type: SAVE_CARD,
  id,
  data
});

// Reducers
const list = (state = [], action) => {
  switch (action.type) {
    case RECEIVE_CARDS:
      return action.cards;
    case CARDS_UNSUBSCRIBE:
      return [];
    case RECORD_CARD_ATTEMPT:
      return state.map(card => {
        if (card.id === action.cardId) {
          return {
            ...card,
            lastAttempt: new Date(),
            level: action.success ? card.level + 1 : 0
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

const rootReducer = combineReducers({ list, isLoaded });
export default rootReducer;
