import { connect } from 'react-redux';
import SettingSidePanel from '../../components/SettingSidePanel/SettingSidePanel';
import { editTemp, switchModal } from '../../actions/UiStatesActions/UiStatesActions';

const mapStateToProps = state => (
  {
    temp: state.uiStates.pagesTemp[5],
    games: state.games,
    competitors: state.competitors,
    contest: state.options.contest,
    backupPath: state.uiStates.backupPath,
    isModalOn: state.uiStates.isModalOn,
  }
);

const mapDispatchToProps = dispatch => (
  {
    editTemp: (dataNum, data) => {
      dispatch(editTemp(5, dataNum, data));
    },
    switchModal: (flag) => {
      dispatch(switchModal(flag));
    },
  }
);

const VisibleSettingSidePanel = connect(
  mapStateToProps,
  mapDispatchToProps,
)(SettingSidePanel);

export default VisibleSettingSidePanel;
