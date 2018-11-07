import { calendar, GAME_STATES } from "./constants";

export const levelsFromGameCount = gameCount => {
  return calendar[gameCount % 64].slice();
};
