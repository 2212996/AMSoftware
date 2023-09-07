import { connect } from 'react-redux';
import PrintComponent from '../../components/SidePanel/PrintComponent';
import { editTemp } from '../../actions/UiStatesActions/UiStatesActions';

const mapStateToProps = state => (
  {
    games: state.games,
    competitors: state.competitors,
    contest: state.options.contest,
    temp: state.uiStates.pagesTemp[8],
    tempGame: state.uiStates.tempGame,
    tempScore: state.uiStates.tempScore,
    selectedRound: state.uiStates.selectedRound,
    selectedGame: state.uiStates.selectedGame,
    backupPath: state.uiStates.backupPath,
  }
);

const mapDispatchToProps = dispatch => (
  {
    editTemp: (index, data) => {
      dispatch(editTemp(8, index, data));
    },
  }
);

const VisiblePrintComponent = connect(
  mapStateToProps,
  mapDispatchToProps,
)(PrintComponent);

export default VisiblePrintComponent;
