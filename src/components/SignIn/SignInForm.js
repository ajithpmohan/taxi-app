import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import { withRouter } from 'react-router-dom';

import { doSetAuthUser } from '../../actions';
import { withAPI } from '../../api';
import * as ROUTES from '../../constants/routes';

const INITIAL_STATE = {
  email: '',
  password: '',
  error: null,
};

const REDIRECT_URL = {
  DRIVER: ROUTES.DRIVER,
  RIDER: ROUTES.RIDER,
  ADMIN: ROUTES.HOME,
};

class SignInFormBase extends React.Component {
  constructor(props) {
    super(props);
    this.state = { ...INITIAL_STATE };
  }

  onSubmit = (event) => {
    const { email, password } = this.state;
    const { api } = this.props;

    api
      .doSignInWithEmailAndPassword(email, password)
      .then((resp) => {
        this.setState({ ...INITIAL_STATE });

        const { history, onSetAuthUser } = this.props;
        localStorage.setItem('authUser', JSON.stringify(resp.data));
        onSetAuthUser(JSON.parse(localStorage.getItem('authUser')));

        history.push(REDIRECT_URL[resp.data.user.type]);
      })
      .catch((error) => {
        this.setState({ error });
      });

    event.preventDefault();
  };

  onChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };

  render() {
    const { email, password, error } = this.state;
    const isInvalid = password === '' || email === '';

    return (
      <form onSubmit={this.onSubmit}>
        <div className="form-group">
          <label htmlFor="email">Email address</label>
          <input
            className="form-control col-md-4"
            name="email"
            id="email"
            value={email}
            onChange={this.onChange}
            type="text"
            placeholder="Email Address"
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            className="form-control col-md-4"
            id="password"
            name="password"
            value={password}
            onChange={this.onChange}
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
          {error && <p>{error.response?.data.detail}</p>}
        </div>
      </form>
    );
  }
}

SignInFormBase.propTypes = {
  api: PropTypes.shape({
    doSignInWithEmailAndPassword: PropTypes.func.isRequired,
  }).isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
  onSetAuthUser: PropTypes.func.isRequired,
};

const mapDispatchToProps = (dispatch) => ({
  onSetAuthUser: (authUser) => dispatch(doSetAuthUser(authUser)),
});

const SignInForm = compose(
  withAPI,
  withRouter,
  connect(null, mapDispatchToProps),
)(SignInFormBase);

export default SignInForm;
