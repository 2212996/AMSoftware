import { connect } from 'react-redux';
import ProcessRankButton from '../../components/MainPanel/ProcessRankButton';

import { writeState } from '../../actions/CrossSliceActions';
import { editTemp, assignTempScore, switchModal } from '../../actions/UiStatesActions/UiStatesActions';

const mapStateToProps = state => (
  {
    selectedGame: state.uiStates.selectedGame,
    selectedRound: state.uiStates.selectedRound,
    backupPath: state.uiStates.backupPath,
    tempGame: state.uiStates.tempGame,
  }
);

const mapDispatchToProps = dispatch => (
  {
    writeState: (filePath) => {
      dispatch(writeState(filePath));
    },
    editTemp: (id, data) => {
      dispatch(editTemp(6, id, data));
    },
    assignTempScore: (score) => {
      dispatch(assignTempScore(score));
    },
    switchModal: (flag) => {
      dispatch(switchModal(flag));
    },
  }
);

const VisibleProcessRankButton = connect(
  mapStateToProps,
  mapDispatchToProps,
)(ProcessRankButton);

export default VisibleProcessRankButton;
