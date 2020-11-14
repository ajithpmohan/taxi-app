import * as actionTypes from 'constants/actionTypes';

const initialState = {
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

const clearTrips = (state) => ({
  ...state,
  ...initialState,
});

function TripReducer(state = initialState, action) {
  switch (action.type) {
    // CURRENT_TRIP events trigger on three conditions.
    // a) When a new trip is created by RIDER assign it to `currentTrip` state variable.'
    // b) When RIDER/Driver reconnected to websocket, fetch if rider/driver has any
    // ongoing trip data & assign it to `currentTrip` state variable.
    // c) When Driver accept a trip request assign it to `currentTrip` state variable .
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

    /// CLEAR_TRIPS events
    // When User signout clear all trips data from the 'store'.
    case actionTypes.CLEAR_TRIPS:
      return clearTrips(state);

    default:
      return state;
  }
}

export default TripReducer;
