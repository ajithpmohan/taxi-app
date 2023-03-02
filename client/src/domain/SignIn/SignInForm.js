import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { compose } from 'recompose';
import { useHistory } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';

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

const SignInFormBase = ({ serverAPI }) => {
  const [user, setUser] = useState(initialState);
  const dispatch = useDispatch();
  const history = useHistory();

  const onSubmit = (event) => {
    const { email, password } = user;

    (async () => {
      const res = await serverAPI
        .doSignInWithEmailAndPassword(email, password)
        .catch((err) => (err.response ? err.response : err));

      if (res?.status === 200) {
        setUser(initialState);
        localStorage.setItem('authUser', JSON.stringify(res.data));
        dispatch(doSetAuthUser(res.data));

        const {
          data: {
            user: { role },
          },
        } = res;
        history.push(REDIRECT_URL[role]);
      } else if (res?.status === 401) {
        setUser({ ...user, error: res.data?.detail });
      } else if (res?.message) {
        setUser({ ...user, error: res.message });
      }
    })();

    event.preventDefault();
  };

  const isInvalid = user.password === '' || user.email === '';

  return (
    <>
      <Card.Title className="text-center">Sign In</Card.Title>
      <Form onSubmit={onSubmit}>
        <Form.Group>
          <Form.Label>Email address</Form.Label>
          <Form.Control
            name="email"
            id="email"
            type="email"
            onChange={(e) =>
              setUser({ ...user, email: e.target.value })
            }
            value={user.email}
            placeholder="Enter Email"
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Password</Form.Label>
          <Form.Control
            name="password"
            id="password"
            type="password"
            onChange={(e) =>
              setUser({ ...user, password: e.target.value })
            }
            value={user.password}
            placeholder="Enter Password"
          />
        </Form.Group>
        <Button
          variant="primary"
          size="lg"
          block
          type="submit"
          disabled={isInvalid}
        >
          Sign In
        </Button>
        {user.error && <p>{user.error}</p>}
      </Form>
    </>
  );
};

SignInFormBase.propTypes = {
  serverAPI: PropTypes.shape({
    doSignInWithEmailAndPassword: PropTypes.func.isRequired,
  }).isRequired,
};

const SignInForm = compose(withServerConsumer)(SignInFormBase);

export default SignInForm;
