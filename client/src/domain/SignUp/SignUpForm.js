import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { useHistory } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import { ToastContainer, toast } from 'react-toastify';

import * as ROUTES from 'constants/routes';
import { TOASTR_OPTIONS } from 'constants/utils';
import { withServerConsumer } from 'services/server';

// Use camelCase as variable name
const initialState = {
  email: '',
  password: '',
  password2: '',
  firstName: '',
  lastName: '',
  groups: '',
  avatar: '',
  error: null,
};

const SignUpFormBase = ({ serverAPI }) => {
  const [user, setUser] = useState(initialState);
  const history = useHistory();

  const handleSubmit = (event) => {
    const {
      email,
      password,
      password2,
      firstName,
      lastName,
      groups,
      avatar,
    } = user;

    const data = new FormData();

    data.append('email', email);
    data.append('password', password);
    data.append('password2', password2);
    data.append('first_name', firstName);
    data.append('last_name', lastName);
    data.append('groups', groups);
    data.append('avatar', avatar);

    (async () => {
      const res = await serverAPI
        .doSignUpWithEmailAndPassword(data)
        .catch((err) => (err.response ? err.response : err));

      if (res?.status === 201) {
        setUser(initialState);
        toast.info(
          `Account created successfully. Go to login Page.`,
          TOASTR_OPTIONS,
        );
        setTimeout(() => history.push(ROUTES.SIGNIN), 5000);
      } else if (res?.status === 400) {
        setUser({ ...user, error: res.data });
      } else if (res?.message) {
        const nonfield = Array(res.message);
        setUser({ ...user, error: { nonfield } });
      }
    })();

    event.preventDefault();
  };

  const handleChange = (event) =>
    setUser({ ...user, [event.target.name]: event.target.value });

  const handleFileChange = (event) =>
    setUser({
      ...user,
      [event.target.name]: event.target.files[0] || '',
    });

  const { error } = user;

  const isInvalid =
    user.email === '' ||
    user.password === '' ||
    user.password2 === '' ||
    user.firstName === '' ||
    user.groups === '' ||
    user.password !== user.password2;

  return (
    <>
      <ToastContainer />
      <Card.Title className="text-center">Sign Up</Card.Title>
      <Form onSubmit={handleSubmit}>
        <Form.Group>
          <Form.Label>Email address</Form.Label>
          <Form.Control
            name="email"
            id="email"
            type="email"
            onChange={handleChange}
            value={user.email}
            placeholder="Enter Email"
          />
          {error?.email &&
            error.email.map((err, index) => (
              <p key={index.toString()}>{err}</p>
            ))}
        </Form.Group>
        <Form.Group>
          <Form.Label>First name</Form.Label>
          <Form.Control
            name="firstName"
            id="firstName"
            type="text"
            onChange={handleChange}
            value={user.firstName}
            placeholder="Enter First Name"
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Last name</Form.Label>
          <Form.Control
            name="lastName"
            id="lastName"
            type="text"
            onChange={handleChange}
            value={user.lastName}
            placeholder="Enter Last Name"
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Password</Form.Label>
          <Form.Control
            name="password"
            id="password"
            type="password"
            onChange={handleChange}
            value={user.password}
            placeholder="Enter Password"
          />
          {error?.password &&
            error.password.map((err, index) => (
              <p key={index.toString()}>{err}</p>
            ))}
        </Form.Group>
        <Form.Group>
          <Form.Label>Confirm Password</Form.Label>
          <Form.Control
            name="password2"
            id="password2"
            type="password"
            onChange={handleChange}
            value={user.password2}
            placeholder="Confirm Password"
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>User Role</Form.Label>
          <Form.Control
            as="select"
            id="groups"
            name="groups"
            value={user.groups}
            onChange={handleChange}
          >
            <option value="">-------</option>
            <option value="DRIVER">DRIVER</option>
            <option value="RIDER">RIDER</option>
          </Form.Control>
          {error?.groups &&
            error.groups.map((err, index) => (
              <p key={index.toString()}>{err}</p>
            ))}
        </Form.Group>
        <Form.Group>
          <Form.File
            label="Avatar"
            id="avatar"
            name="avatar"
            onChange={handleFileChange}
            accept="image/*"
          />
          {error?.avatar &&
            error.avatar.map((err, index) => (
              <p key={index.toString()}>{err}</p>
            ))}
        </Form.Group>
        <Button
          variant="primary"
          size="lg"
          block
          type="submit"
          disabled={isInvalid}
        >
          Sign Up
        </Button>
        {error?.nonfield &&
          error.nonfield.map((err, index) => (
            <p key={index.toString()}>{err}</p>
          ))}
      </Form>
    </>
  );
};

SignUpFormBase.propTypes = {
  serverAPI: PropTypes.shape({
    doSignUpWithEmailAndPassword: PropTypes.func.isRequired,
  }).isRequired,
};

const SignUpForm = compose(withServerConsumer)(SignUpFormBase);

export default SignUpForm;
