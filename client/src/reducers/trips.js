import * as actionTypes from 'constants/actionTypes';

const INITIAL_STATE = {
  availableTrips: [],
  currentTrip: null,
};

const setCurrentTrip = (state, currentTrip, availableTrips = []) => ({
  ...state,
  availableTrips,
  currentTrip,
});

const setNewTrip = (state, trip) => ({
  ...state,
  availableTrips: [...state.availableTrips, trip],
});

const setAvailableTrips = (state, availableTrips) => ({
  ...state,
  availableTrips,
});

function TripReducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    // CURRENT_TRIP events - 3 conditions
    // When a new trip is created by RIDER assign it to `currentTrip` state variable.'
    // When RIDER/Driver reconnected to websocket, fetch if rider/driver has any ongoing trip data
    // & assign it to `currentTrip` state variable.
    // When Driver accept a trip request assign it to `currentTrip` state variable .
    case actionTypes.CURRENT_TRIP:
      return setCurrentTrip(state, action.payload);

    // NEW_TRIP events
    // When a new trip is created by any rider, then the trip data will send to all drivers
    // connected to websocket who doesn't have any ongoing trip at that moment and append
    // it to `availableTrips` state Array variable.
    case actionTypes.NEW_TRIP:
      return setNewTrip(state, action.payload);

    // AVAILABLE_TRIPS events
    // When Driver connected/reconnected to websocket who doesn't have any ongoing trip at that moment,
    // all newly requested trips will be fetched & stored to `availableTrips` state Array variable.
    case actionTypes.AVAILABLE_TRIPS:
      return setAvailableTrips(state, action.payload);
    default:
      return state;
  }
}

export default TripReducer;
