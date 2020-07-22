import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import SignOut from '../SignOut';
import MenuLink from './MenuLink';
import * as ROUTES from '../../constants/routes';

import './index.css';

const AUTH_STATES = (authUser) => ({
  DRIVER: <NavigationAuthDriver authUser={authUser} />,
  RIDER: <NavigationAuthRider authUser={authUser} />,
  ADMIN: <NavigationAuthAdmin authUser={authUser} />,
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
      {AUTH_STATES(authUser)[authUser.user?.type || 'NONAUTH']}
      {authUser.isAuthenticated && (
        <ul className="navbar-nav ml-auto nav-flex-icons">
          <li className="nav-item avatar dropdown">
            <button
              type="button"
              className="nav-link dropdown-toggle btn btn-light"
              id="navbarDropdownMenuLink"
              data-toggle="dropdown"
              aria-haspopup="true"
              aria-expanded="false"
            >
              <img
                src={
                  authUser.user?.avatar ||
                  'https://mdbootstrap.com/img/Photos/Avatars/avatar-2.jpg'
                }
                className="md-avatar rounded-circle size-1"
                alt="avatar"
              />
            </button>
            <div
              className="dropdown-menu dropdown-menu-lg-right dropdown-secondary"
              aria-labelledby="navbarDropdownMenuLink"
            >
              <div className="dropdown-item">
                <span>Welcome </span>
                {authUser.user?.fullname || 'User'}
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
    <MenuLink
      activeOnlyWhenExact="true"
      to={ROUTES.DRIVER}
      label="Dashboard"
    />
  </ul>
);

const NavigationAuthRider = () => (
  <ul className="navbar-nav mr-auto">
    <MenuLink
      activeOnlyWhenExact="true"
      to={ROUTES.RIDER}
      label="Dashboard"
    />
    <MenuLink
      activeOnlyWhenExact="true"
      to={ROUTES.REQUESTTRIP}
      label="Request a Trip"
    />
  </ul>
);

const NavigationAuthAdmin = () => (
  <ul className="navbar-nav mr-auto">
    <MenuLink
      activeOnlyWhenExact="true"
      to={ROUTES.HOME}
      label="Home"
    />
  </ul>
);

const NavigationNonAuth = () => (
  <ul className="navbar-nav mr-auto">
    <MenuLink
      activeOnlyWhenExact="true"
      to={ROUTES.HOME}
      label="Home"
    />
    <MenuLink
      activeOnlyWhenExact="true"
      to={ROUTES.SIGNIN}
      label="Sign In"
    />
    <MenuLink
      activeOnlyWhenExact="true"
      to={ROUTES.SIGNUP}
      label="Sign Up"
    />
  </ul>
);

Navigation.propTypes = {
  authUser: PropTypes.shape({
    refresh: PropTypes.string,
    access: PropTypes.string,
    user: PropTypes.object,
    isAuthenticated: PropTypes.bool,
  }),
};

Navigation.defaultProps = {
  authUser: null,
};

const mapStateToProps = (state) => ({
  authUser: state.sessionState.authUser,
});

export default connect(mapStateToProps)(Navigation);
