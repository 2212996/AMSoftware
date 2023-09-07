import { connect } from 'react-redux';
import CompetitorsEditModal from '../../components/SettingCompetitorsPanel/CompetitorEditModal';
import { changeCompetitorField } from '../../actions/CompetitorsActions';
import { writeState } from '../../actions/CrossSliceActions';

const mapStateToProps = state => (
  {
    backupPath: state.uiStates.backupPath,
  }
);

const mapDispatchToProps = dispatch => (
  {
    changeCompetitorField: (competitorId, field, value) => {
      dispatch(changeCompetitorField(competitorId, field, value));
    },
    writeState: (fileName) => {
      dispatch(writeState(fileName));
    },
  }
);

const VisibleCompetitorsEditModal = connect(
  mapStateToProps,
  mapDispatchToProps,
)(CompetitorsEditModal);

export default VisibleCompetitorsEditModal;
