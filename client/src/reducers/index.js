import { combineReducers } from 'redux';
import sessionReducer from './session';
import TripReducer from './trips';

const rootReducer = combineReducers({
  sessionState: sessionReducer,
  tripState: TripReducer,
});

export default rootReducer;
