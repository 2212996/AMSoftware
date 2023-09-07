import { connect } from 'react-redux';

import ScoreTable from '../../components/MainPanel/ScoreTable';
import { selectCell } from '../../actions/UiStatesActions/UiStatesActions';
import { changeScore } from '../../actions/UiStatesActions/TempGamesActions';

const mapStateToProps = state => (
  {
    tempGame: state.uiStates.tempGame,
    tempScore: state.uiStates.tempScore,
    selectedGame: state.uiStates.selectedGame,
    selectedRound: state.uiStates.selectedRound,
    competitors: state.competitors,
    selectedCell: state.uiStates.selectedCell,
  }
);

const mapDispatchToProps = dispatch => (
  {
    selectCell: (col, row) => {
      dispatch(selectCell(row, col));
    },
    protoChangeScore: (gameId, roundKey, style, competitorId, judgeNum, score) => {
      dispatch(changeScore(gameId, roundKey, style, competitorId, judgeNum, score));
    },
  }
);

const mergeProps = (stateProps, dispatchProps, ownProps) => {
  const mergedChangeScore = (competitorId, judgeNum, score) => {
    dispatchProps.protoChangeScore(
      stateProps.selectedGame, stateProps.selectedRound.round,
      stateProps.selectedRound.style, competitorId, judgeNum, score,
    );
  };

  return Object.assign({}, stateProps, dispatchProps, ownProps, {
    changeScore: mergedChangeScore,
  });
};

const VisibleScoreTable = connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps,
)(ScoreTable);

export default VisibleScoreTable;
