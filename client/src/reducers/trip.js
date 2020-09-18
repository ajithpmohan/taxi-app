import * as actionTypes from '../constants/actionTypes';

const INITIAL_STATE = {
  trips: [],
  currentTrip: null,
};

const setCurrentTrip = (state, currentTrip) => ({
  ...state,
  currentTrip,
});

const setAvailableTripsToDriver = (state, trip) => ({
  ...state,
  ...state.trips.push(trip),
});

function TripReducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case actionTypes.CURRENT_TRIP:
      return setCurrentTrip(state, action.payload);
    case actionTypes.TRIP_REQUESTED:
      return setAvailableTripsToDriver(state, action.payload);
    default:
      return state;
  }
}

export default TripReducer;
