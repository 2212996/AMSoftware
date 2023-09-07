import { connect } from 'react-redux';
import FirstRoundCreator from '../../components/SettingSidePanel/FirstRoundCreator';

import { selectCreationMethod } from '../../actions/UiStatesActions/UiStatesActions';


const mapStateToProps = state => (
  {
    games: state.games,
    competitors: state.competitors,
    backupPath: state.uiStates.backupPath,
    selectedCreationMethod: state.uiStates.selectedCreationMethod,
    selectedGameType: state.uiStates.gameType,
  }
);

const mapDispatchToProps = dispatch => (
  {
    selectCreationMethod: (method) => {
      dispatch(selectCreationMethod(method));
    },
  }
);

const VisibleFirstRoundCreator = connect(
  mapStateToProps,
  mapDispatchToProps,
)(FirstRoundCreator);

export default VisibleFirstRoundCreator;
