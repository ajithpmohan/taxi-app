import * as actionTypes from '../constants/actionTypes';

const INITIAL_STATE = {
  authUser: null,
};

const applySetAuthUser = (state, authUser) => ({
  ...state,
  authUser,
});

function sessionReducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case actionTypes.AUTH_USER_SET: {
      return applySetAuthUser(state, action.authUser);
    }
    default:
      return state;
  }
}

export default sessionReducer;
