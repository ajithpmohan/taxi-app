import React from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';

import { doSetAuthUser, doClearTrips } from 'actions';
import * as ROUTES from 'constants/routes';

const SignOut = () => {
  const dispatch = useDispatch();
  const history = useHistory();

  const onSignOut = () => {
    localStorage.removeItem('authUser');
    // set authUser as null
    dispatch(doSetAuthUser(null));
    // clear all trip data from the store
    dispatch(doClearTrips());
    history.push(ROUTES.HOME);
  };

  return (
    <button
      type="button"
      className="dropdown-item"
      onClick={onSignOut}
    >
      SignOut
    </button>
  );
};

export default SignOut;
