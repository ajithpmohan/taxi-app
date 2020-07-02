import * as actionTypes from '../constants/actionTypes';

const doSetAuthUser = (authUser) => ({
  type: actionTypes.AUTH_USER_SET,
  authUser,
});

export { doSetAuthUser };
