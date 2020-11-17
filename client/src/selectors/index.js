export const getAccessToken = (state) =>
  state.sessionState.authUser.access;

export const getUserRole = (state) =>
  state.sessionState.authUser.user.role;
