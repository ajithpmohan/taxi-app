import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { withRouter } from 'react-router-dom';

import { withAPI } from '../../api';
import * as ROUTES from '../../constants/routes';

// Use camelCase as variable name
const INITIAL_STATE = {
  email: '',
  password: '',
  password2: '',
  firstName: '',
  lastName: '',
  groups: '',
  avatar: '',
  error: null,
};

class SignUpFormBase extends React.Component {
  constructor(props) {
    super(props);
    this.state = { ...INITIAL_STATE };
  }

  handleSubmit = (event) => {
    const { api } = this.props;
    const {
      email,
      password,
      password2,
      firstName,
      lastName,
      groups,
      avatar,
    } = this.state;

    const data = new FormData();

    data.append('email', email);
    data.append('password', password);
    data.append('password2', password2);
    data.append('first_name', firstName);
    data.append('last_name', lastName);
    data.append('groups', groups);
    data.append('avatar', avatar);

    api
      .doSignUpWithEmailAndPassword(data)
      .then((resp) => {
        this.setState({ ...INITIAL_STATE });
        alert(resp?.data.message);

        const { history } = this.props;
        history.push(ROUTES.HOME);
      })
      .catch(({ response }) => {
        const error = response?.data || null;
        this.setState({ error });
      });

    event.preventDefault();
  };

  handleChange = (event) =>
    this.setState({ [event.target.name]: event.target.value });

  handleFileChange = (event) =>
    this.setState({
      [event.target.name]: event.target.files[0] || '',
    });

  render() {
    const {
      email,
      firstName,
      lastName,
      password,
      password2,
      groups,
      error,
    } = this.state;

    const isInvalid =
      email === '' ||
      password === '' ||
      password2 === '' ||
      firstName === '' ||
      groups === '' ||
      password !== password2;

    return (
      <form onSubmit={this.handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Email address</label>
          <input
            className="form-control col-md-4"
            type="text"
            name="email"
            id="email"
            value={email}
            onChange={this.handleChange}
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
            value={firstName}
            onChange={this.handleChange}
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
            value={lastName}
            onChange={this.handleChange}
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
            value={password}
            onChange={this.handleChange}
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
            value={password2}
            onChange={this.handleChange}
            placeholder="Confirm Password"
          />
        </div>
        <div className="form-group">
          <label htmlFor="groups">User Type</label>
          <select
            className="form-control col-md-4"
            id="groups"
            name="groups"
            value={groups}
            onChange={this.handleChange}
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
            onChange={this.handleFileChange}
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
  }
}

SignUpFormBase.propTypes = {
  api: PropTypes.shape({
    doSignUpWithEmailAndPassword: PropTypes.func.isRequired,
  }).isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
};

const SignUpForm = compose(withAPI, withRouter)(SignUpFormBase);

export default SignUpForm;
