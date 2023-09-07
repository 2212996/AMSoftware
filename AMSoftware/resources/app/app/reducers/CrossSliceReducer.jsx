import * as fs from 'fs';

import { READ_STATE, WRITE_STATE, EXPORT_HTML } from '../actions/CrossSliceActions';
import exportHtml from '../components/common/exportHtml';

export default function crossSliceReducer(state, action) {
  switch (action.type) {
    case EXPORT_HTML: {
      exportHtml(state.options.contest, state.games, state.competitors, state.uiStates.backupPath);
      return state;
    }
    case WRITE_STATE: {
      fs.writeFile(action.fileName, JSON.stringify(state), (err) => {
        if (err) {
          console.log('failed at WRITE_STATE');
        }
      });
      return state;
    }
    case READ_STATE: {
      const newUiStates = Object.assign({}, action.newState.uiStates, {
        selectedCell: {
          col: 1,
          row: 1,
        },
        selectedScreen: 'CHECK',
        selectedSettingScreen: 'GAMES',
      });
      return Object.assign({}, action.newState, {
        uiStates: newUiStates,
      });
    }

    default:
      return state;
  }
}
