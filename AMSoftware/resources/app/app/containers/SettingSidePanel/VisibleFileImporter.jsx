import { connect } from 'react-redux';
import FileImporter from '../../components/SettingSidePanel/FileImporter';

import { readGames, addCompetitorsInGames } from '../../actions/GamesActions';
import { readCompetitors } from '../../actions/CompetitorsActions';
import { writeState } from '../../actions/CrossSliceActions';


const mapStateToProps = state => (
  {
    games: state.games,
    competitors: state.competitors,
    backupPath: state.uiStates.backupPath,
  }
);

const mapDispatchToProps = dispatch => (
  {
    readGames: (newGames) => {
      dispatch(readGames(newGames));
    },
    readCompetitors: (newCompetitors) => {
      dispatch(readCompetitors(newCompetitors));
    },
    addCompetitorsInGames: (newGamesCompetitors) => {
      dispatch(addCompetitorsInGames(newGamesCompetitors));
    },
    writeState: (filePath) => {
      dispatch(writeState(filePath));
    },
  }
);

const VisibleFileImporter = connect(
  mapStateToProps,
  mapDispatchToProps,
)(FileImporter);

export default VisibleFileImporter;
