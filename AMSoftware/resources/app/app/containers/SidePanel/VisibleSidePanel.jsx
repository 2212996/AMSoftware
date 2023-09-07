import { connect } from 'react-redux';
import SidePanel from '../../components/SidePanel/SidePanel';
import { selectRound, selectGame, selectGameAndRound, assignTempGame, switchDidLoadFile,
  assignTempScore } from '../../actions/UiStatesActions/UiStatesActions';

const mapStateToProps = state => (
  {
    selectedRound: state.uiStates.selectedRound,
    selectedGame: state.uiStates.selectedGame,
    games: state.games,
    backupPath: state.uiStates.backupPath,
    tempGame: state.uiStates.tempGame,
    selectedGameType: state.uiStates.gameType,
  }
);

const mapDispatchToProps = dispatch => (
  {
    selectRound: (round, style) => {
      dispatch(selectRound(round, style));
    },
    selectGame: (game) => {
      dispatch(selectGame(game));
    },
    selectGameAndRound: (game, round, style) => {
      dispatch(selectGameAndRound(game, round, style));
    },
    assignTempGame: (game) => {
      dispatch(assignTempGame(game));
    },
    assignTempScore: (score) => {
      dispatch(assignTempScore(score));
    },
  }
);

const VisibleSidePanel = connect(
  mapStateToProps,
  mapDispatchToProps,
)(SidePanel);

export default VisibleSidePanel;
