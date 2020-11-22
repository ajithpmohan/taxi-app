import * as actionTypes from 'constants/actionTypes';

// Manage Users all type of Trips
const initialState = {
  availableTrips: [], // only for driver. shows all newly requested trips
  currentTrip: null, // users current ongoing trip
  recentTrips: [], // users previous trips
};

const setCurrentTrip = (state, currentTrip, availableTrips = []) => ({
  ...state,
  availableTrips,
  currentTrip,
});

const clearCurrentTrip = (state) => ({
  ...state,
  currentTrip: initialState.currentTrip,
});

const setAvailableTrips = (state, availableTrips) => ({
  ...state,
  availableTrips,
  currentTrip: null,
});

const updateAvailableTrips = (state, trip) => ({
  ...state,
  availableTrips: [...state.availableTrips, trip],
  currentTrip: null,
});

const setRecentTrips = (state, recentTrips) => ({
  ...state,
  recentTrips,
});

const updateRecentTrips = (state, trip) => ({
  ...state,
  recentTrips: [...state.recentTrips, trip],
});

const clearTrips = (state) => ({
  ...state,
  ...initialState,
});

function TripReducer(state = initialState, action) {
  switch (action.type) {
    // SET_CURRENT_TRIP events trigger on three conditions.
    // a) When a new trip is created by RIDER assign it to `currentTrip` state variable.'
    // b) When RIDER/Driver reconnected to websocket, fetch if rider/driver has any
    // ongoing trip data & assign it to `currentTrip` state variable.
    // c) When Driver accept a trip request assign it to `currentTrip` state variable .
    case actionTypes.SET_CURRENT_TRIP:
      return setCurrentTrip(state, action.payload);

    // CLEAR_CURRENT_TRIP events trigger when trip is completed.
    case actionTypes.CLEAR_CURRENT_TRIP:
      return clearCurrentTrip(state);

    // SET_AVAILABLE_TRIPS events
    // When Driver connected/reconnected to websocket who doesn't have any ongoing trip at that moment,
    // all newly requested trips will be fetched & stored to `availableTrips` state Array variable.
    case actionTypes.SET_AVAILABLE_TRIPS:
      return setAvailableTrips(state, action.payload);

    // UPDATE_AVAILABLE_TRIPS events
    // When a new trip is created by any rider, then the trip data will send to all drivers
    // connected to websocket who doesn't have any ongoing trip at that moment and append
    // it to `availableTrips` state Array variable.
    case actionTypes.UPDATE_AVAILABLE_TRIPS:
      return updateAvailableTrips(state, action.payload);

    // SET_RECENT_TRIPS events
    case actionTypes.SET_RECENT_TRIPS:
      return setRecentTrips(state, action.payload);

    // UPDATE_RECENT_TRIPS events
    case actionTypes.UPDATE_RECENT_TRIPS:
      return updateRecentTrips(state, action.payload);

    /// CLEAR_TRIPS events
    // When User signout clear all trips data from the 'store'.
    case actionTypes.CLEAR_TRIPS:
      return clearTrips(state);

    default:
      return state;
  }
}

export default TripReducer;
