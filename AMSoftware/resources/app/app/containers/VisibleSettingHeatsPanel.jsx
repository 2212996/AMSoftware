import { connect } from 'react-redux';
import SettingHeatsPanel from '../components/SettingHeatsPanel';
import { selectCell, editTemp } from '../actions/UiStatesActions/UiStatesActions';
import { changeRoundsOption } from '../actions/GamesActions';

const mapStateToProps = state => (
  {
    games: state.games,
    selectedCell: state.uiStates.selectedCell,
    temp: state.uiStates.pagesTemp[3],
  }
);

const mapDispatchToProps = dispatch => (
  {
    selectCell: (col, row) => {
      dispatch(selectCell(col, row));
    },
    editTemp: (dataNum, data) => {
      dispatch(editTemp(3, dataNum, data));
    },
    changeJudge: (gameId, roundKey, judge) => {
      dispatch(changeRoundsOption('judge', gameId, roundKey, judge));
    },
    changeHeats: (gameId, roundKey, heats) => {
      dispatch(changeRoundsOption('heats', gameId, roundKey, heats));
    },
    changeUps: (gameId, roundKey, ups) => {
      dispatch(changeRoundsOption('up', gameId, roundKey, ups));
    },
  }
);

const VisibleSettingHeatsPanel = connect(
  mapStateToProps,
  mapDispatchToProps,
)(SettingHeatsPanel);

export default VisibleSettingHeatsPanel;
