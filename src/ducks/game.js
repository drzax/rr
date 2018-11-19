import { firestore } from "../firebase";
import { calendar } from "../constants";

import * as log from "loglevel";

const REQUEST_GAME_DATA = "REQUEST_GAME_DATA";
export const requestGameData = uid => dispatch => {
  const handleGameData = doc => {
    // Save the first game data and come back if it doesn't exist.
    const data = doc.exists ? doc.data() : { gameCount: 0 };
    data.lastPlayed = data.lastPlayed ? data.lastPlayed.toDate() : new Date(0);
    dispatch(receiveGameData(data));
  };

  firestore
    .collection("games")
    .doc(uid)
    .get()
    .then(handleGameData);

  dispatch({ type: REQUEST_GAME_DATA });
};

const RECEIVE_GAME_DATA = "RECEIVE_GAME_DATA";
export const receiveGameData = game => ({
  type: RECEIVE_GAME_DATA,
  game
});

const END_GAME = "END_GAME";
const GAME_DATA_SAVED = "GAME_DATA_SAVED";
export const endGame = () => (dispatch, getState) => {
  let {
    game: { gameCount },
    user: { uid }
  } = getState();
  gameCount = gameCount ? gameCount + 1 : 1;
  const lastPlayed = new Date();
  dispatch({ type: END_GAME, gameCount, lastPlayed });

  // TODO: This is dispatched and never confiremd. Figure out a good way to actually deal with failed FB writes.
  firestore
    .collection("games")
    .doc(uid)
    .update({
      gameCount,
      lastPlayed
    })
    .then(() => {
      dispatch({ type: GAME_DATA_SAVED });
    });
};

const START_GAME = "START_GAME";
export const startGame = () => ({ type: START_GAME });

export default function reducer(
  state = { isLoaded: false, isPlaying: false },
  action
) {
  switch (action.type) {
    case START_GAME:
      return { ...state, isPlaying: true };
    case RECEIVE_GAME_DATA:
      return { ...state, ...action.game, isLoaded: true };
    case REQUEST_GAME_DATA:
      return { ...state, isLoaded: false };
    case END_GAME:
      return {
        ...state,
        gameCount: action.gameCount,
        lastPlayed: action.lastPlayed,
        isPlaying: false
      };
    default:
      return state;
  }
}
