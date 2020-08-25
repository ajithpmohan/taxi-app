import * as actionTypes from '../constants/actionTypes';

const INITIAL_STATE = {
  authUser: { isAuthenticated: false },
};

const applySetAuthUser = (state, authUser) => ({
  ...state,
  authUser,
});

function sessionReducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case actionTypes.AUTH_USER_SET: {
      const isAuthenticated = Boolean(action.authUser);
      return applySetAuthUser(state, {
        ...action.authUser,
        isAuthenticated,
      });
    }
    default:
      return state;
  }
}

export default sessionReducer;
