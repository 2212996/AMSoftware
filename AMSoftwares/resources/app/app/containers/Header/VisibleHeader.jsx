import { connect } from 'react-redux';
import { selectScreen, assignBackupPath, assignTempGame, assignTempScore, switchModal,
  selectCheckScreen } from '../../actions/UiStatesActions/UiStatesActions';
import { readState, writeState, exportHtml } from '../../actions/CrossSliceActions';
import Header from '../../components/Header/Header';

const mapStateToProps = state => (
  {
    selectedScreen: state.uiStates.selectedScreen,
    selectedCheckScreen: state.uiStates.selectedCheckScreen,
    selectedGame: state.uiStates.selectedGame,
    selectedRound: state.uiStates.selectedRound,
    games: state.games,
    backupPath: state.uiStates.backupPath,
    isModalOn: state.uiStates.isModalOn,
    tempGame: state.uiStates.tempGame,
  }
);

const mapDispatchToProps = dispatch => (
  {
    selectScreen: (screen) => {
      dispatch(selectScreen(screen));
    },
    selectCheckScreen: (screen) => {
      dispatch(selectCheckScreen(screen));
    },
    readState: (newState) => {
      dispatch(readState(newState));
    },
    writeState: (fileName) => {
      dispatch(writeState(fileName));
    },
    exportHtml: () => {
      dispatch(exportHtml());
    },
    assignBackupPath: (path) => {
      dispatch(assignBackupPath(path));
    },
    assignTempGame: (data) => {
      dispatch(assignTempGame(data));
    },
    assignTempScore: (score) => {
      dispatch(assignTempScore(score));
    },
    switchModal: (flag) => {
      dispatch(switchModal(flag));
    },
  }
);

const VisibleHeader = connect(
  mapStateToProps,
  mapDispatchToProps,
)(Header);

export default VisibleHeader;
