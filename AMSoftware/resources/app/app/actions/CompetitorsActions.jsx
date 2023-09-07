// action types

export const ADD_COMPETITOR = 'ADD_COMPETITOR';
export const CHANGE_COMPETITOR_FIELD = 'CHANGE_COMPETITOR_FIELD';
export const READ_COMPETITORS = 'READ_COMPETITORS';
// action creators

export function addCompetitor(data) {
  return { type: ADD_COMPETITOR, data };
}

export function changeCompetitorField(id, key, data) {
  return { type: CHANGE_COMPETITOR_FIELD, id, key, data };
}

export function readCompetitors(data) {
  return { type: READ_COMPETITORS, data };
}
