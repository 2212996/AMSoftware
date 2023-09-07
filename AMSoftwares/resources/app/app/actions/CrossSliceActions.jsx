// action types

export const READ_STATE = 'READ_STATE';
export const RESET_STATE = 'RESET_STATE';
export const WRITE_STATE = 'WRITE_STATE';
export const EXPORT_HTML = 'EXPORT_HTML';

// action creators

export function readState(newState) {
  return { type: READ_STATE, newState };
}

export function writeState(fileName) {
  return { type: WRITE_STATE, fileName };
}

export function exportHtml() {
  return { type: EXPORT_HTML };
}
