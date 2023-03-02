export const getAccessToken = (state) =>
  state.sessionState.authUser.access;

export const getUserRole = (state) =>
  state.sessionState.authUser.user.role;

export const getAvailableTrips = (state) =>
  state.tripState.availableTrips;

export const getCurrentTrip = (state) => state.tripState.currentTrip;

export const getRecentTrips = (state) => state.tripState.recentTrips;

export const getRiderTrips = (state, id) =>
  [...getRecentTrips(state), getCurrentTrip(state) || []].filter(
    (trip) => trip.id === id,
  )[0];

export const getDriverTrips = (state, id) =>
  [
    ...getAvailableTrips(state),
    ...getRecentTrips(state),
    getCurrentTrip(state) || [],
  ].filter((trip) => trip.id === id)[0];
