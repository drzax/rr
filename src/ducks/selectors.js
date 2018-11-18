import { createSelector } from "reselect";
import { gameCountCardsFilter, levelsFromGameCount } from "../utils";
import { endGame } from "./game";
import * as log from "loglevel";

const getCards = state => state.cards;
const getGame = state => state.game;

export const getNextCard = createSelector(
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

export const getCurrentCardCount = createSelector(
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

export const gameIsLoaded = createSelector(
  [getCards, getGame],
  (cards, game) => cards.isLoaded && game.isLoaded
);
