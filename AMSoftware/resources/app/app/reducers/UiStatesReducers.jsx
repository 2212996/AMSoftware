import { SELECT_CELL, SELECT_ROUND, SELECT_GAME, ASSIGN_TEMP_SCORE, SELECT_CHECK_SCREEN,
  SELECT_GAME_AND_ROUND, ASSIGN_BACKUP_PATH, ASSIGN_TEMP_GAME, SELECT_CREATION_METHOD,
  SELECT_SCREEN, SELECT_SETTING_SCREEN, EDIT_TEMP, SWITCH_MODAL, SELECT_GAME_TYPE,
  } from '../actions/UiStatesActions/UiStatesActions';
import { CHANGE_SCORE, ASSIGN_HEATS, ASSIGN_SCORES } from '../actions/UiStatesActions/TempGamesActions';


const initialUiStates = {
  selectedGame: 0,
  selectedRound: {
    round: 1,
    style: 'WALTZ',
  },
  selectedCell: {
    col: 1,
    row: 1,
  },
  isModalOn: 0,
  selectedScreen: 'CHECK',
  selectedCheckScreen: 'CHECK',
  selectedSettingScreen: 'GAMES',
  pagesTemp: [
    [[
      [10, 10, 10, 20, 50, 20, 30, 80, 30],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    ], 0, 0, ''], // 以下5個はSettingMainPanel以下のPanelたち用
    ['', '', '', '', '', '', '', '', '', '', '', ''],
    [-1, '', '', '', 0],
    [-1, 0],
    ['', '', ''],
    [1, 0, 1, 1, 1, ''], // SettingSidePanel用
    [[[], []], {}, 0, 0], // MainPanel用
    [''], // Header用
    [1, 1, 1, 1, 1, 1, 1, 1, 1], // SidePanel用
    [1, 1], // DataPanel用
  ],
  backupPath: '',
  tempGame: {},
  tempScore: {},
  selectedCreationMethod: 'STANDARD',
  gameType: 'SINGLE', // またはTOTAL。単科か総合かの意
};

function round(state, action) {
  switch (action.type) {
    case CHANGE_SCORE: {
      const editedScore = state.scores[action.competitorId].reduce((result, current, index) => (
        result.concat((index + 1 === action.judgeNum) ? action.score : current)
      ), []);
      const editedScores = Object.assign({}, state.scores, {
        [action.competitorId]: editedScore,
      });
      return Object.assign({}, state, {
        scores: editedScores,
      });
    }

    case ASSIGN_HEATS: {
      return Object.assign({}, state, {
        heats: action.heats,
      });
    }

    case ASSIGN_SCORES: {
      return Object.assign({}, state, {
        scores: action.scores,
      });
    }

    default:
      return state;
  }
}

function tempGame(state, action) {
  switch (action.type) {
    case CHANGE_SCORE:
      return Object.assign({}, state, {
        [action.style]: round(state[action.style], action),
      });

    case ASSIGN_HEATS: {
      const edittingState = Object.assign({}, state);
      // TODO: not sure if it works
      Object.keys(state).forEach((style) => {
        Object.assign(edittingState[style], {
          heats: action.heats,
        });
      });

      return edittingState;
    }

    case ASSIGN_SCORES: {
      const edittingState = Object.assign({}, state);
      Object.keys(state).forEach((style) => {
        Object.assign(edittingState[style], {
          scores: action.scores[style],
        });
      });

      return edittingState;
    }

    default:
      return state;
  }
}

export default function uiStates(state = initialUiStates, action) {
  switch (action.type) {
    case CHANGE_SCORE:
    case ASSIGN_HEATS:
    case ASSIGN_SCORES:
      // tempGameが存在しないときはスルー
      if (Object.keys(state.tempGame).length === 0) {
        console.log('tempGameが存在しない状態で関連reducerが呼ばれました');
        return state;
      }
      return Object.assign({}, state, {
        tempGame: tempGame(state.tempGame, action),
      });

    case SELECT_GAME_TYPE: {
      return Object.assign({}, state, {
        gameType: action.gameType,
      });
    }

    case SELECT_CREATION_METHOD: {
      return Object.assign({}, state, {
        selectedCreationMethod: action.method,
      });
    }

    case ASSIGN_TEMP_SCORE:
      return Object.assign({}, state, {
        tempScore: action.score,
      });

    case ASSIGN_TEMP_GAME:
      return Object.assign({}, state, {
        tempGame: action.game,
      });

    case ASSIGN_BACKUP_PATH:
      return Object.assign({}, state, {
        backupPath: action.path,
      });

    case SELECT_CELL:
      return Object.assign({}, state, {
        selectedCell: {
          col: action.col,
          row: action.row,
        },
      });

    case SWITCH_MODAL:
      return Object.assign({}, state, {
        isModalOn: action.flag,
      });

    case SELECT_GAME_AND_ROUND:
      return Object.assign({}, state, {
        selectedRound: {
          round: action.round,
          style: action.style,
        },
        selectedGame: action.game,
      });

    case SELECT_ROUND:
      return Object.assign({}, state, {
        selectedRound: {
          round: action.round,
          style: action.style,
        },
      });

    case SELECT_GAME:
      return Object.assign({}, state, {
        selectedGame: action.game,
      });

    case SELECT_SCREEN:
      return Object.assign({}, state, {
        selectedScreen: action.screen,
      });

    case SELECT_CHECK_SCREEN:
      return Object.assign({}, state, {
        selectedCheckScreen: action.screen,
      });

    case SELECT_SETTING_SCREEN:
      return Object.assign({}, state, {
        selectedSettingScreen: action.screen,
      });

    case EDIT_TEMP: {
      const newPagesTemp = state.pagesTemp.map((value, index) => {
        if (index === action.pageNum) {
          return value.map((value2, index2) => {
            if (index2 === action.dataNum) {
              return action.data;
            }
            return value2;
          });
        }
        return value;
      });
      return Object.assign({}, state, {
        pagesTemp: newPagesTemp,
      });
    }
    default:
      return state;
  }
}
