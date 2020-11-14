import React from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { compose } from 'recompose';
import { withRouter } from 'react-router-dom';

import { doSetAuthUser, doClearTrips } from 'actions';
import * as ROUTES from 'constants/routes';

const SignOutButton = ({ history }) => {
  const dispatch = useDispatch();

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

SignOutButton.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
};

const SignOut = compose(withRouter)(SignOutButton);

export default SignOut;
