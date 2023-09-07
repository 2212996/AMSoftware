import { connect } from 'react-redux';
import SettingMainPanel from '../components/SettingMainPanel';

const mapStateToProps = (state) => (
  {
    selectedSettingScreen: state.uiStates.selectedSettingScreen,
  }
);

const VisibleSettingMainPanel = connect(
  mapStateToProps
)(SettingMainPanel);

export default VisibleSettingMainPanel;
