import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { compose } from 'recompose';
import { withRouter } from 'react-router-dom';

import * as ROUTES from 'constants/routes';
import { doSetAuthUser } from 'actions';
import { withServerConsumer } from 'services/server';

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

const SignInFormBase = ({ serverAPI, history }) => {
  const [user, setUser] = useState(initialState);
  const dispatch = useDispatch();

  const onSubmit = (event) => {
    const { email, password } = user;

    serverAPI
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
    <>
      <h5 className="card-title text-center">Sign In</h5>
      <form className="form-signin" onSubmit={onSubmit}>
        <div className="form-group">
          <label htmlFor="email">Email address</label>
          <input
            className="form-control"
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
            className="form-control"
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
            className="btn btn-lg btn-primary btn-block text-uppercase"
            type="submit"
            disabled={isInvalid}
          >
            Sign In
          </button>
          {user.error && <p>{user.error}</p>}
        </div>
      </form>
      {/* <hr className="my-4" />
      <button
        className="btn btn-lg btn-google btn-block text-uppercase"
        type="submit"
      >
        <i className="fab fa-google mr-2" />
        Sign in with Google
      </button>
      <button
        className="btn btn-lg btn-facebook btn-block text-uppercase"
        type="submit"
      >
        <i className="fab fa-facebook-f mr-2" />
        Sign in with Facebook
      </button> */}
    </>
  );
};

SignInFormBase.propTypes = {
  serverAPI: PropTypes.shape({
    doSignInWithEmailAndPassword: PropTypes.func.isRequired,
  }).isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
};

const SignInForm = compose(
  withServerConsumer,
  withRouter,
)(SignInFormBase);

export default SignInForm;
