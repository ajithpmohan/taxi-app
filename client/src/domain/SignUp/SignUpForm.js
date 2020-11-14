import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { withRouter } from 'react-router-dom';

import * as ROUTES from 'constants/routes';
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

const SignUpFormBase = ({ serverAPI, history }) => {
  const [user, setUser] = useState(initialState);

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

    serverAPI
      .doSignUpWithEmailAndPassword(data)
      .then((response) => {
        setUser(initialState);
        alert(response?.data.message);

        history.push(ROUTES.HOME);
      })
      .catch(({ response }) => {
        const error = response?.data || null;
        setUser({ ...user, error });
      });

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
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="email">Email address</label>
        <input
          className="form-control col-md-4"
          type="text"
          name="email"
          id="email"
          value={user.email}
          onChange={handleChange}
          placeholder="Email Address"
        />
        {error?.email &&
          error.email.map((err, index) => (
            <p key={index.toString()}>{err}</p>
          ))}
      </div>
      <div className="form-group">
        <label htmlFor="firstName">First name:</label>
        <input
          className="form-control col-md-4"
          type="text"
          name="firstName"
          id="firstName"
          value={user.firstName}
          onChange={handleChange}
          placeholder="First name"
        />
      </div>
      <div className="form-group">
        <label htmlFor="lastName">Last name</label>
        <input
          className="form-control col-md-4"
          type="text"
          name="lastName"
          id="lastName"
          value={user.lastName}
          onChange={handleChange}
          placeholder="Last name"
        />
      </div>
      <div className="form-group">
        <label htmlFor="password">Password</label>
        <input
          className="form-control col-md-4"
          type="password"
          id="password"
          name="password"
          value={user.password}
          onChange={handleChange}
          placeholder="Password"
        />
        {error?.password &&
          error.password.map((err, index) => (
            <p key={index.toString()}>{err}</p>
          ))}
      </div>
      <div className="form-group">
        <label htmlFor="password2">Confirm Password</label>
        <input
          className="form-control col-md-4"
          type="password"
          id="password2"
          name="password2"
          value={user.password2}
          onChange={handleChange}
          placeholder="Confirm Password"
        />
      </div>
      <div className="form-group">
        <label htmlFor="groups">User Type</label>
        <select
          className="form-control col-md-4"
          id="groups"
          name="groups"
          value={user.groups}
          onChange={handleChange}
        >
          <option value="">------</option>
          <option value="DRIVER">DRIVER</option>
          <option value="RIDER">RIDER</option>
        </select>
        {error?.groups &&
          error.groups.map((err, index) => (
            <p key={index.toString()}>{err}</p>
          ))}
      </div>
      <div className="form-group">
        <label htmlFor="avatar">Avatar</label>
        <input
          className="form-control col-md-4"
          type="file"
          id="avatar"
          name="avatar"
          onChange={handleFileChange}
          accept="image/*"
        />
        {error?.avatar &&
          error.avatar.map((err, index) => (
            <p key={index.toString()}>{err}</p>
          ))}
      </div>
      <div className="form-group">
        <button
          className="btn btn-primary"
          disabled={isInvalid}
          type="submit"
        >
          Sign Up
        </button>
        {error?.nonfield &&
          error.nonfield.map((err, index) => (
            <p key={index.toString()}>{err}</p>
          ))}
      </div>
    </form>
  );
};

SignUpFormBase.propTypes = {
  serverAPI: PropTypes.shape({
    doSignUpWithEmailAndPassword: PropTypes.func.isRequired,
  }).isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
};

const SignUpForm = compose(
  withServerConsumer,
  withRouter,
)(SignUpFormBase);

export default SignUpForm;
