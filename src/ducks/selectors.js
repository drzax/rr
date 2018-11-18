import { createSelector } from "reselect";
import { gameCountCardsFilter } from "../utils";

const getCards = state => state.cards;
const getGame = state => state.game;

export const getNextCard = createSelector(
  [getCards, getGame],
  (cards, game) => {
    if (game.gameCount === undefined) return null;
    return cards.list
      .filter(gameCountCardsFilter(game.gameCount))
      .sort(
        (a, b) =>
          a.data.level - b.data.level || a.data.lastAttempt - b.data.lastAttempt
      )[0];
  }
);

export const getCurrentCardCount = createSelector(
  [getCards, getGame],
  (cards, game) => {
    if (game.gameCount === undefined) return null;
    return cards.list.filter(gameCountCardsFilter(game.gameCount)).length;
  }
);

export const gameIsLoaded = createSelector(
  [getCards, getGame],
  (cards, game) => cards.isLoaded && game.isLoaded
);
