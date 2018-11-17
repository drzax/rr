import { combineReducers } from "redux";
import user from "./user";
import cards from "./cards";
import game from "./game";

const rootReducer = combineReducers({ user, cards, game });

export default rootReducer;
