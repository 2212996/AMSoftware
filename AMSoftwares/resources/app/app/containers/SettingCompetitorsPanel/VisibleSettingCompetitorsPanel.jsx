import { connect } from 'react-redux';
import SettingCompetitorsPanel from '../../components/SettingCompetitorsPanel/SettingCompetitorsPanel';
import { addCompetitorInGame, deleteCompetitorInGame } from '../../actions/GamesActions';

const mapStateToProps = state => (
  {
    competitors: state.competitors,
    games: state.games,
  }
);

const mapDispatchToProps = dispatch => (
  {
    addCompetitorInGame: (gameId, competitorId) => {
      dispatch(addCompetitorInGame(gameId, competitorId));
    },
    deleteCompetitorInGame: (gameId, competitorId) => {
      dispatch(deleteCompetitorInGame(gameId, competitorId));
    },
  }
);

const VisibleSettingCompetitorsPanel = connect(
  mapStateToProps,
  mapDispatchToProps,
)(SettingCompetitorsPanel);

export default VisibleSettingCompetitorsPanel;
