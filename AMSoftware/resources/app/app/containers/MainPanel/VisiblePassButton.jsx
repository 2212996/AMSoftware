import { connect } from 'react-redux';
import PassButton from '../../components/MainPanel/PassButton';

import { editTemp, switchModal } from '../../actions/UiStatesActions/UiStatesActions';

const mapStateToProps = state => (
  {
    games: state.games,
    selectedGame: state.uiStates.selectedGame,
    selectedRound: state.uiStates.selectedRound,
    backupPath: state.uiStates.backupPath,
    tempGame: state.uiStates.tempGame,
  }
);

const mapDispatchToProps = dispatch => (
  {
    editTemp: (id, data) => {
      dispatch(editTemp(6, id, data));
    },
    switchModal: (flag) => {
      dispatch(switchModal(flag));
    },
  }
);

const VisiblePassButton = connect(
  mapStateToProps,
  mapDispatchToProps,
)(PassButton);

export default VisiblePassButton;
