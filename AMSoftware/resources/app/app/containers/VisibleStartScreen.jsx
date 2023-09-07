import { connect } from 'react-redux';
import StartScreen from '../components/StartScreen';
import { readState, writeState } from '../actions/CrossSliceActions';
import { assignBackupPath, switchDidLoadFile, assignTempGame, assignTempScore,
} from '../actions/UiStatesActions/UiStatesActions';

const mapStateToProps = state => (
  {
    backupPath: state.uiStates.backupPath,
  }
);

const mapDispatchToProps = dispatch => (
  {
    readState: (newState) => {
      dispatch(readState(newState));
    },
    assignTempGame: (game) => {
      dispatch(assignTempGame(game));
    },
    assignTempScore: (score) => {
      dispatch(assignTempScore(score));
    },
    assignBackupPath: (path) => {
      dispatch(assignBackupPath(path));
    },
    writeState: (fileName) => {
      dispatch(writeState(fileName));
    },
    switchDidLoadFile: (flag) => {
      dispatch(switchDidLoadFile(flag));
    },
  }
);

const VisibleStartScreen = connect(
  mapStateToProps,
  mapDispatchToProps,
)(StartScreen);

export default VisibleStartScreen;
