import { connect } from 'react-redux';
import DataPanel from '../components/DataPanel/DataPanel';
import { assignTempGame } from '../actions/UiStatesActions/UiStatesActions';
import { assignHeats, assignScores } from '../actions/UiStatesActions/TempGamesActions';

const mapStateToProps = state => (
  {
    competitorsData: state.competitors, // state.competitorsと同じ形式で必要な選手データが入ってる。まんま入れてもいいかも
    selectedRound: state.uiStates.selectedRound,
    tempGame: state.uiStates.tempGame,
  }
);

const mapDispatchToProps = dispatch => (
  {
    protoAssignHeats: (game, round, heats) => {
      dispatch(assignHeats(game, round, heats));
    },
    protoAssignScores: (game, round, scores) => {
      dispatch(assignScores(game, round, scores));
    },
    assignTempGame: (game) => {
      dispatch(assignTempGame(game));
    },
  }
);

const mergeProps = (stateProps, dispatchProps, ownProps) => {
  const mergedAssignHeats = (heats) => {
    dispatchProps.protoAssignHeats(stateProps.selectedGame,
      stateProps.selectedRound.round, heats);
  };

  const mergedAssignScores = (scores) => {
    dispatchProps.protoAssignScores(stateProps.selectedGame,
      stateProps.selectedRound.round, scores);
  };

  return Object.assign({}, stateProps, dispatchProps, ownProps,
    { assignHeats: mergedAssignHeats, assignScores: mergedAssignScores });
};

const VisibleDataPanel = connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps,
)(DataPanel);

export default VisibleDataPanel;
