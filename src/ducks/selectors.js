import { createSelector } from "reselect";
import { levelsFromGameCount } from "../utils";

const getCards = state => state.cards;
const getGame = state => state.game;

export const getNextCard = createSelector(
  [getCards, getGame],
  (cards, game) => {
    if (game.gameCount === undefined) return null;
    const levels = levelsFromGameCount(game.gameCount);
    return cards.list
      .filter(c => levels.indexOf(c.level) > -1)
      .sort((a, b) => a.level - b.level || a.lastAttempt - b.lastAttempt)[0];
  }
);

export const getCurrentCardCount = createSelector(
  [getCards, getGame],
  (cards, game) => {
    if (game.gameCount === undefined) return null;
    const levels = levelsFromGameCount(game.gameCount);
    return cards.list.filter(c => levels.indexOf(c.level) > -1).length;
  }
);

export const gameIsLoaded = createSelector(
  [getCards, getGame],
  (cards, game) => cards.isLoaded && game.isLoaded
);
