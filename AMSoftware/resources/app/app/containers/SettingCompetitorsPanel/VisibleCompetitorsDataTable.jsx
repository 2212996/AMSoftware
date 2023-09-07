import { connect } from 'react-redux';
import CompetitorsDataTable from '../../components/SettingCompetitorsPanel/CompetitorsDataTable';
import { changeCompetitorField } from '../../actions/CompetitorsActions';
import { writeState } from '../../actions/CrossSliceActions';

const mapStateToProps = state => (
  {
    competitors: state.competitors,
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

const VisibleCompetitorsDataTable = connect(
  mapStateToProps,
  mapDispatchToProps,
)(CompetitorsDataTable);

export default VisibleCompetitorsDataTable;
