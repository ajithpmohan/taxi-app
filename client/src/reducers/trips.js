import * as actionTypes from '../constants/actionTypes';

const INITIAL_STATE = {
  availableTrips: [],
  currentTrip: null,
};

const setCurrentTrip = (state, currentTrip) => ({
  ...state,
  currentTrip,
});

const setNewTrip = (state, trip) => ({
  ...state,
  ...state.availableTrips.push(trip),
});
const setAvailableTrips = (state, availableTrips) => ({
  ...state,
  availableTrips,
});

function TripReducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case actionTypes.CURRENT_TRIP:
      return setCurrentTrip(state, action.payload);
    case actionTypes.NEW_TRIP:
      return setNewTrip(state, action.payload);
    case actionTypes.AVAILABLE_TRIPS:
      return setAvailableTrips(state, action.payload);
    default:
      return state;
  }
}

export default TripReducer;
