import { combineReducers } from "redux";
import user from "./user";
import cards from "./cards";
import game from "./game";
import notifications from "./notifications";

const rootReducer = combineReducers({ user, cards, game, notifications });

export default rootReducer;
