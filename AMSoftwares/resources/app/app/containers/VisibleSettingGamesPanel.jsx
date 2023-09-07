import { connect } from 'react-redux';
import SettingGamesPanel from '../components/SettingGamesPanel';
import { editTemp } from '../actions/UiStatesActions/UiStatesActions';
import { changeStyleOption, addGame, changeGameName } from '../actions/GamesActions';

const mapStateToProps = state => (
  {
    games: state.games,
    temp: state.uiStates.pagesTemp[2],
  }
);

const mapDispatchToProps = dispatch => (
  {
    editTemp: (dataNum, data) => {
      dispatch(editTemp(2, dataNum, data));
    },
    changeStyleOption: (gameId, style, num) => {
      dispatch(changeStyleOption(gameId, style, num));
    },
    addGame: (id, name, num, smallFinal) => {
      dispatch(addGame(id, name, num, smallFinal));
    },
    changeGameName: (gameId, name) => {
      dispatch(changeGameName(gameId, name));
    },
  }
);

const VisibleSettingGamesPanel = connect(
  mapStateToProps,
  mapDispatchToProps,
)(SettingGamesPanel);

export default VisibleSettingGamesPanel;
