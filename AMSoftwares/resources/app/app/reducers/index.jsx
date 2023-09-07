import { combineReducers } from 'redux';
import competitors from './CompetitorsReducers';
import games from './GamesReducers';
import groupResults from './GroupResultsReducers';
import uiStates from './UiStatesReducers';
import options from './OptionsReducers';
import crossSliceReducer from './CrossSliceReducer';

const combinedReducers = combineReducers({
  competitors,
  games,
  groupResults,
  uiStates,
  options,
});

function dancemanagerApp(state, action) {
  const intermediateState = combinedReducers(state, action);
  const finalState = crossSliceReducer(intermediateState, action);
  return finalState;
}

export default dancemanagerApp;
