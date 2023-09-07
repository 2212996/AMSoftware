// action types
export const ADD_CONTEST = 'ADD_CONTEST';
export const EDIT_CONTEST = 'EDIT_CONTEST';
export const HAS_SMALL_FINAL = 'HAS_SMALL_FINAL';

// action creators

export function addContest(data) {
  return { type: ADD_CONTEST, data };
}
export function editContest(name, data) {
  return { type: EDIT_CONTEST, name, data };
}
export function hasSmallFinal(flag) {
  return { type: HAS_SMALL_FINAL, flag };
}
