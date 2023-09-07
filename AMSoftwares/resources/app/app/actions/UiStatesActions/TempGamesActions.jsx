// action types

export const CHANGE_SCORE = 'CHANGE_SCORE';
export const ASSIGN_HEATS = 'ASSIGN_HEATS';
export const ASSIGN_SCORES = 'ASSIGN_SCORES';

// action creators

export function changeScore(gameId, roundKey, style, competitorId, judgeNum, score) {
  return { type: CHANGE_SCORE, gameId, roundKey, style, competitorId, judgeNum, score };
}

export function assignHeats(game, round, heats) {
  return { type: ASSIGN_HEATS, game, round, heats };
}

export function assignScores(game, round, scores) {
  return { type: ASSIGN_SCORES, game, round, scores };
}
