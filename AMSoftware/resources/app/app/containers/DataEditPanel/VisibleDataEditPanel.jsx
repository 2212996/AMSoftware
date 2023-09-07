import { connect } from 'react-redux';
import DataEditPanel from '../../components/DataEditPanel/DataEditPanel';
import { assignTempGame, selectCreationMethod } from '../../actions/UiStatesActions/UiStatesActions';

const mapStateToProps = state => (
  {
    games: state.games,
    competitors: state.competitors,
    selectedGame: state.uiStates.selectedGame,
    selectedRound: state.uiStates.selectedRound,
    tempGame: state.uiStates.tempGame,
    backupPath: state.uiStates.backupPath,
    selectedCreationMethod: state.uiStates.selectedCreationMethod,
  }
);

const mapDispatchToProps = dispatch => (
  {
    assignTempGame: (tempGame) => {
      dispatch(assignTempGame(tempGame));
    },
    selectCreationMethod: (method) => {
      dispatch(selectCreationMethod(method));
    },
  }
);

const VisibleDataEditPanel = connect(
  mapStateToProps,
  mapDispatchToProps,
)(DataEditPanel);

export default VisibleDataEditPanel;
