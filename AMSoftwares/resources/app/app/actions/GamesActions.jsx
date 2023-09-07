// action types
export const ADD_GAME = 'ADD_GAME';
export const ADD_COMPETITOR_IN_GAME = 'ADD_COMPETITOR_IN_GAME';
export const DELETE_COMPETITOR_IN_GAME = 'DELETE_COMPETITOR_IN_GAME';
export const CHANGE_ROUNDS_OPTION = 'CHANGE_ROUNDS_OPTION';
export const CHANGE_STYLE_OPTION = 'CHANGE_STYLE_OPTION';
export const CHANGE_GAME_NAME = 'CHANGE_GAME_NAME';
export const READ_GAMES = 'READ_GAMES';
export const ADD_COMPETITORS_IN_GAMES = 'ADD_COMPETITORS_IN_GAMES';

// action creators

export function readGames(games) {
  return { type: READ_GAMES, games };
}

export function addGame(id, name, num, smallFinal = false) {
  return { type: ADD_GAME, id, name, num, smallFinal };
}

export function addCompetitorInGame(gameId, competitorId) {
  return { type: ADD_COMPETITOR_IN_GAME, gameId, competitorId };
}

export function deleteCompetitorInGame(gameId, competitorId) {
  return { type: DELETE_COMPETITOR_IN_GAME, gameId, competitorId };
}

export function changeRoundsOption(option, gameId, roundKey, value) {
  return { type: CHANGE_ROUNDS_OPTION, option, gameId, roundKey, value };
}

export function changeStyleOption(gameId, style, num) {
  return { type: CHANGE_STYLE_OPTION, gameId, style, num };
}

export function changeGameName(gameId, name) {
  return { type: CHANGE_GAME_NAME, gameId, name };
}

export function addCompetitorsInGames(newGamesCompetitors) {
  return { type: ADD_COMPETITORS_IN_GAMES, newGamesCompetitors };
}
