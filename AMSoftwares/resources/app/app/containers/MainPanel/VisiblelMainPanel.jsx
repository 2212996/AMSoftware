import { connect } from 'react-redux';
import MainPanel from '../../components/MainPanel/MainPanel';
import { switchModal, selectCreationMethod,
  assignTempScore } from '../../actions/UiStatesActions/UiStatesActions';

const mapStateToProps = state => (
  {
    games: state.games,
    competitors: state.competitors,
    selectedGame: state.uiStates.selectedGame,
    selectedRound: state.uiStates.selectedRound,
    isModalOn: state.uiStates.isModalOn,
    temp: state.uiStates.pagesTemp[6],
    backupPath: state.uiStates.backupPath,
    tempGame: state.uiStates.tempGame,
    selectedCreationMethod: state.uiStates.selectedCreationMethod,
  }
);

const mapDispatchToProps = dispatch => (
  {
    switchModal: (flag) => {
      dispatch(switchModal(flag));
    },
    selectCreationMethod: (method) => {
      dispatch(selectCreationMethod(method));
    },
    assignTempScore: (scoreData) => {
      dispatch(assignTempScore(scoreData));
    },
  }
);

const VisibleMainPanel = connect(
  mapStateToProps,
  mapDispatchToProps,
)(MainPanel);

export default VisibleMainPanel;
