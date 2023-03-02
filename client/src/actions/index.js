import * as actionTypes from 'constants/actionTypes';

const doSetAuthUser = (authUser) => ({
  type: actionTypes.AUTH_USER_SET,
  authUser,
});

const doSetTrip = ({ action, payload }) => ({
  type: action,
  payload,
});

const doClearTrips = () => ({
  type: actionTypes.CLEAR_TRIPS,
});

export { doSetAuthUser, doSetTrip, doClearTrips };
