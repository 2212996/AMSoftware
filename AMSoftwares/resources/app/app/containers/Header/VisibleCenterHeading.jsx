import { connect } from 'react-redux';

import CenterHeading from '../../components/Header/CenterHeading';

import { selectSettingScreen, selectCell } from '../../actions/UiStatesActions/UiStatesActions';


const mapStateToProps = state => (
  {
    selectedScreen: state.uiStates.selectedScreen,
    selectedSettingScreen: state.uiStates.selectedSettingScreen,
  }
);

const mapDispatchToProps = dispatch => (
  {
    selectSettingScreen: (screenName) => {
      dispatch(selectSettingScreen(screenName));
    },
    selectCell: (col, row) => {
      dispatch(selectCell(col, row));
    },
  }
);

const VisibleCenterHeading = connect(
  mapStateToProps,
  mapDispatchToProps,
)(CenterHeading);

export default VisibleCenterHeading;
