import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import { withAuthentication } from '../Session';
import SignOut from '../SignOut';
import * as ROUTES from '../../constants/routes';

import './index.css';

const AUTH_STATES = (authUser) => ({
  DRIVER: <NavigationAuthDriver authUser={authUser} />,
  RIDER: <NavigationAuthRider authUser={authUser} />,
  NONAUTH: <NavigationNonAuth />,
});

const Navigation = ({ authUser }) => (
  <nav className="navbar navbar-expand-lg navbar-light bg-light">
    <button
      className="navbar-toggler"
      type="button"
      data-toggle="collapse"
      data-target="#navbarSupportedContent"
      aria-controls="navbarSupportedContent"
      aria-expanded="false"
      aria-label="Toggle navigation"
    >
      <span className="navbar-toggler-icon"></span>
    </button>

    <div
      className="collapse navbar-collapse"
      id="navbarSupportedContent"
    >
      {AUTH_STATES(authUser)[authUser?.user.type || 'NONAUTH']}
      {!!authUser && (
        <ul className="navbar-nav ml-auto nav-flex-icons">
          <li className="nav-item avatar dropdown">
            <button
              type="button"
              className="nav-link dropdown-toggle btn btn-light"
              id="navbarDropdownMenuLink-55"
              data-toggle="dropdown"
              aria-haspopup="true"
              aria-expanded="false"
            >
              <img
                src={
                  authUser?.user.avatar ||
                  'https://mdbootstrap.com/img/Photos/Avatars/avatar-2.jpg'
                }
                className="md-avatar rounded-circle size-1"
                alt="avatar"
              />
            </button>
            <div
              className="dropdown-menu dropdown-menu-lg-right dropdown-secondary"
              aria-labelledby="navbarDropdownMenuLink-55"
            >
              <div className="dropdown-item">
                <span>Welcome </span>
                {authUser?.user.fullname}
                <span>!</span>
              </div>
              <SignOut />
            </div>
          </li>
        </ul>
      )}
    </div>
  </nav>
);

const NavigationAuthDriver = () => (
  <ul className="navbar-nav mr-auto">
    <li className="nav-item">
      <Link to={ROUTES.HOME} className="nav-link">
        Home
        <span className="sr-only">(current)</span>
      </Link>
    </li>
    <li className="nav-item">
      <Link to={ROUTES.DRIVER} className="nav-link">
        Dashboard
      </Link>
    </li>
  </ul>
);

const NavigationAuthRider = () => (
  <ul className="navbar-nav mr-auto">
    <li className="nav-item">
      <Link to={ROUTES.HOME} className="nav-link">
        Home
        <span className="sr-only">(current)</span>
      </Link>
    </li>
    <li className="nav-item">
      <Link to={ROUTES.RIDER} className="nav-link">
        Dashboard
      </Link>
    </li>
    <li className="nav-item">
      <Link to={ROUTES.REQUESTTRIP} className="nav-link">
        Request a Trip
      </Link>
    </li>
  </ul>
);

const NavigationNonAuth = () => (
  <ul className="navbar-nav mr-auto">
    <li className="nav-item">
      <Link to={ROUTES.HOME} className="nav-link">
        Home
        <span className="sr-only">(current)</span>
      </Link>
    </li>
    <li className="nav-item">
      <Link to={ROUTES.SIGNIN} className="nav-link">
        Sign In
      </Link>
    </li>
  </ul>
);

Navigation.propTypes = {
  authUser: PropTypes.shape({
    refresh: PropTypes.string,
    access: PropTypes.string,
    user: PropTypes.object,
  }),
};

Navigation.defaultProps = {
  authUser: null,
};

export default withAuthentication(Navigation);
