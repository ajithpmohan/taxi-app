import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { compose } from 'recompose';
import { withRouter } from 'react-router-dom';

import * as ROUTES from 'constants/routes';
import { doSetAuthUser } from 'actions';
import { withAPI } from 'api';

const initialState = {
  email: '',
  password: '',
  error: null,
};

const REDIRECT_URL = {
  DRIVER: ROUTES.DRIVER,
  RIDER: ROUTES.RIDER,
  ADMIN: ROUTES.HOME,
};

const SignInFormBase = ({ api, history }) => {
  const [user, setUser] = useState(initialState);
  const dispatch = useDispatch();

  const onSubmit = (event) => {
    const { email, password } = user;

    api
      .doSignInWithEmailAndPassword(email, password)
      .then(({ data }) => {
        setUser(initialState);

        localStorage.setItem('authUser', JSON.stringify(data));
        dispatch(doSetAuthUser(data));

        const {
          user: { role },
        } = data;
        history.push(REDIRECT_URL[role]);
      })
      .catch(
        ({
          response: {
            data: { detail },
          },
        }) => {
          setUser({ ...user, error: detail });
        },
      );

    event.preventDefault();
  };

  const isInvalid = user.password === '' || user.email === '';

  return (
    <form onSubmit={onSubmit}>
      <div className="form-group">
        <label htmlFor="email">Email address</label>
        <input
          className="form-control col-md-4"
          name="email"
          id="email"
          value={user.email}
          onChange={(e) =>
            setUser({ ...user, email: e.target.value })
          }
          type="text"
          placeholder="Email Address"
        />
      </div>
      <div className="form-group">
        <label htmlFor="password">Password</label>
        <input
          className="form-control col-md-4"
          name="password"
          id="password"
          value={user.password}
          onChange={(e) =>
            setUser({ ...user, password: e.target.value })
          }
          type="password"
          placeholder="Password"
        />
      </div>
      <div className="form-group">
        <button
          className="btn btn-primary"
          disabled={isInvalid}
          type="submit"
        >
          Sign In
        </button>
        {user.error && <p>{user.error}</p>}
      </div>
    </form>
  );
};

SignInFormBase.propTypes = {
  api: PropTypes.shape({
    doSignInWithEmailAndPassword: PropTypes.func.isRequired,
  }).isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
};

const SignInForm = compose(withAPI, withRouter)(SignInFormBase);

export default SignInForm;
