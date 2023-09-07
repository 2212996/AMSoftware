import { connect } from 'react-redux';
import SettingContestPanel from '../components/SettingContestPanel';
import { editContest } from '../actions/OptioinsActions';
import { selectGameType } from '../actions/UiStatesActions/UiStatesActions';

const mapStateToProps = state => (
  {
    contestData: state.options.contest,
    selectedGameType: state.uiStates.gameType,
  }
);

const mapDispatchToProps = dispatch => (
  {
    editContest: (name, data) => {
      dispatch(editContest(name, data));
    },
    selectGameType: (gameType) => {
      dispatch(selectGameType(gameType));
    },
  }
);

const VisibleSettingContestPanel = connect(
  mapStateToProps,
  mapDispatchToProps,
)(SettingContestPanel);

export default VisibleSettingContestPanel;
