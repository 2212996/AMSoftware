import { connect } from 'react-redux';
import App from '../components/App';

const mapStateToProps = state => (
  {
    selectedScreen: state.uiStates.selectedScreen,
    selectedCheckScreen: state.uiStates.selectedCheckScreen,
  }
);

const VisibleApp = connect(
  mapStateToProps,
)(App);

export default VisibleApp;
