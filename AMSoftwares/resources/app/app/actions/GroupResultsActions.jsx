// action types

export const ADD_GROUP_RESULT = 'ADD_GROUP_RESULT';
export const ADD_ROUND_RESULT = 'ADD_ROUND_RESULT';
export const ADD_RANK_RESULT = 'ADD_RANK_RESULT';

// action creators

export function addGroupResult(groupId) {
  return { type: ADD_GROUP_RESULT, groupId };
}

export function addRoundResult(groupId, roundKey, competitors) {
  return { type: ADD_ROUND_RESULT, groupId, roundKey, competitors };
}

export function addRankResult(groupId, rank, competitorId) {
  return { type: ADD_RANK_RESULT, groupId, rank, competitorId };
}
