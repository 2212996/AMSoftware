// action types

export const SELECT_CELL = 'SELECT_CELL';
export const SELECT_ROUND = 'SELECT_ROUND';
export const SELECT_GAME = 'SELECT_GAME';
export const SELECT_GAME_AND_ROUND = 'SELECT_GAME_AND_ROUND';
export const SELECT_SCREEN = 'SELECT_SCREEN';
export const SELECT_CHECK_SCREEN = 'SELECT_CHECK_SCREEN';
export const SELECT_SETTING_SCREEN = 'SELECT_SETTING_SCREEN';
export const EDIT_TEMP = 'EDIT_TEMP';
export const SWITCH_MODAL = 'SWITCH_MODAL';
export const ASSIGN_BACKUP_PATH = 'ASSIGN_BACKUP_PATH';
export const ASSIGN_TEMP_GAME = 'ASSIGN_TEMP_GAME';
export const ASSIGN_TEMP_SCORE = 'ASSIGN_TEMP_SCORE';
export const SELECT_CREATION_METHOD = 'SELECT_CREATION_METHOD';
export const SELECT_GAME_TYPE = 'SELECT_GAME_TYPE';

// action creators

export function selectCell(col, row) {
  return { type: SELECT_CELL, col, row };
}

export function selectRound(round, style) {
  return { type: SELECT_ROUND, round, style };
}

export function selectGame(game) {
  return { type: SELECT_GAME, game };
}

export function selectGameAndRound(game, round, style) {
  return { type: SELECT_GAME_AND_ROUND, game, round, style };
}

export function selectScreen(screen) {
  return { type: SELECT_SCREEN, screen };
}

export function selectCheckScreen(screen) {
  return { type: SELECT_CHECK_SCREEN, screen };
}

export function selectSettingScreen(screen) {
  return { type: SELECT_SETTING_SCREEN, screen };
}

export function editTemp(pageNum, dataNum, data) {
  return { type: EDIT_TEMP, pageNum, dataNum, data };
}

export function switchModal(flag) {
  return { type: SWITCH_MODAL, flag };
}

export function assignBackupPath(path) {
  return { type: ASSIGN_BACKUP_PATH, path };
}

export function assignTempGame(game) {
  return { type: ASSIGN_TEMP_GAME, game };
}

export function assignTempScore(score) {
  return { type: ASSIGN_TEMP_SCORE, score };
}

export function selectCreationMethod(method) {
  return { type: SELECT_CREATION_METHOD, method };
}

export function selectGameType(gameType) {
  return { type: SELECT_GAME_TYPE, gameType };
}
