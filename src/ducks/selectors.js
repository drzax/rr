import { createSelector } from "reselect";
import { gameCountCardsFilter, levelsFromGameCount } from "../utils";
import { endGame } from "./game";
import * as log from "loglevel";

const getCards = state => state.cards;
const getGame = state => state.game;

const createLoggingSelector = (name, state, fn) => {
  const selector = createSelector(state, fn);
  return (...args) => {
    const r = selector(...args);
    log.debug(name, r);
    return r;
  };
};

export const getNextCard = createLoggingSelector(
  "getNextCard",
  [getCards, getGame],
  (cards, game) => {
    if (game.gameCount === undefined) return null;
    log.debug(
      "levelsFromGameCount(game.gameCount)",
      levelsFromGameCount(game.gameCount)
    );
    const nextCard = cards.list
      .filter(gameCountCardsFilter(game.gameCount))
      .sort(
        (a, b) =>
          b.data.level - a.data.level || a.data.lastAttempt - b.data.lastAttempt
      )[0];

    log.debug("nextCard", nextCard);
    return nextCard;
  }
);

export const getCurrentCardCount = createLoggingSelector(
  "getCurrentCardCount",
  [getCards, getGame],
  (cards, game) => {
    if (game.gameCount === undefined) return null;
    const filteredCards = cards.list.filter(
      gameCountCardsFilter(game.gameCount)
    );
    log.debug("filteredCards", filteredCards);
    return filteredCards.length;
  }
);

export const gameIsLoaded = createLoggingSelector(
  "gameIsLoaded",
  [getCards, getGame],
  (cards, game) => cards.isLoaded && game.isLoaded
);

export const cardsPerLevel = createLoggingSelector(
  "cardsPerLevel",
  [getCards],
  cards =>
    Array(8)
      .fill(0)
      .map((v, idx) =>
        cards.list.filter(c => !c.data.deleted && c.data.level === idx + 1)
      )
);
