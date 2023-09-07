import { connect } from 'react-redux';

import Modals from '../../components/SettingCompetitorsPanel/Modals';

import { addCompetitor } from '../../actions/CompetitorsActions';

const mapStateToProps = state => (
  {
    competitors: state.competitors,
  }
);

const mapDispatchToProps = dispatch => (
  {
    addCompetitor: (data) => {
      dispatch(addCompetitor(data));
    },
  }
);

const VisibleModals = connect(
  mapStateToProps,
  mapDispatchToProps,
)(Modals);

export default VisibleModals;
