import sessionReducer from './session';
import * as actionTypes from '../constants/actionTypes';

describe('Session Reducer', () => {
  test('should set user type as admin', () => {
    const authUser = { user: { type: 'ADMIN' } };
    const state = { authUser: null };
    const newState = sessionReducer(state, {
      type: actionTypes.AUTH_USER_SET,
      authUser,
    });

    expect(newState?.authUser.user.type).toEqual('ADMIN');
  });

  test('should set user type as driver', () => {
    const authUser = { user: { type: 'DRIVER' } };
    const state = { authUser: null };
    const newState = sessionReducer(state, {
      type: actionTypes.AUTH_USER_SET,
      authUser,
    });

    expect(newState?.authUser.user.type).toEqual('DRIVER');
  });

  test('should set user type as rider', () => {
    const authUser = { user: { type: 'RIDER' } };
    const state = { authUser: null };
    const newState = sessionReducer(state, {
      type: actionTypes.AUTH_USER_SET,
      authUser,
    });

    expect(newState?.authUser.user.type).toEqual('RIDER');
  });
});
