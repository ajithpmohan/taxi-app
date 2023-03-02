import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Nav, Navbar } from 'react-bootstrap';
import Dropdown from 'react-bootstrap/Dropdown';
import { Link } from 'react-router-dom';

import * as ROUTES from 'constants/routes';
import SignOut from 'domain/SignOut';
import MenuLink from './MenuLink';

import './index.css';

const authStates = (currentTrip) => ({
  DRIVER: <NavigationAuthDriver />,
  RIDER: <NavigationAuthRider currentTrip={currentTrip} />,
  ADMIN: <NavigationAuthAdmin />,
  NONAUTH: <NavigationNonAuth />,
});

const Navigation = ({ authUser, currentTrip }) => (
  <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
    <Navbar.Brand as={Link} to={ROUTES.HOME}>
      Taxi App
    </Navbar.Brand>
    <Navbar.Toggle aria-controls="responsive-navbar-nav" />
    <Navbar.Collapse id="responsive-navbar-nav">
      {authStates(currentTrip)[authUser.user?.role || 'NONAUTH']}
      {authUser.isAuthenticated && (
        <Nav>
          <Dropdown>
            <Dropdown.Toggle
              variant="dark"
              id="dropdown-basic"
              className="navbarDropdownToggle"
            ></Dropdown.Toggle>
            <Dropdown.Menu align="right">
              <Dropdown.Item>
                <span>Welcome </span>
                {authUser.user?.fullname || 'User'}
                <span>!</span>
              </Dropdown.Item>
              <Dropdown.Item>
                <SignOut />
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </Nav>
      )}
    </Navbar.Collapse>
  </Navbar>

  // <nav className="navbar navbar-expand-lg navbar-light bg-light">
  //   <button
  //     className="navbar-toggler"
  //     type="button"
  //     data-toggle="collapse"
  //     data-target="#navbarSupportedContent"
  //     aria-controls="navbarSupportedContent"
  //     aria-expanded="false"
  //     aria-label="Toggle navigation"
  //   >
  //     <span className="navbar-toggler-icon" />
  //   </button>

  //   <div
  //     className="collapse navbar-collapse"
  //     id="navbarSupportedContent"
  //   >
  //     {authStates(currentTrip)[authUser.user?.role || 'NONAUTH']}
  //     {authUser.isAuthenticated && (
  //       <ul className="navbar-nav ml-auto nav-flex-icons">
  //         <li className="nav-item avatar dropdown">
  //           <button
  //             type="button"
  //             className="nav-link dropdown-toggle btn btn-light"
  //             id="navbarDropdownMenuLink"
  //             data-toggle="dropdown"
  //             aria-haspopup="true"
  //             aria-expanded="false"
  //           >
  //             <img
  //               src={
  //                 authUser.user?.avatar ||
  //                 'https://mdbootstrap.com/img/Photos/Avatars/avatar-2.jpg'
  //               }
  //               className="md-avatar rounded-circle size-1"
  //               alt="avatar"
  //             />
  //           </button>
  //           <div
  //             className="dropdown-menu dropdown-menu-lg-right dropdown-secondary"
  //             aria-labelledby="navbarDropdownMenuLink"
  //           >
  //             <div className="dropdown-item">
  //               <span>Welcome </span>
  //               {authUser.user?.fullname || 'User'}
  //               <span>!</span>
  //             </div>
  //             <SignOut />
  //           </div>
  //         </li>
  //       </ul>
  //     )}
  //   </div>
  // </nav>
);

const NavigationAuthDriver = () => (
  <Nav className="mr-auto">
    <MenuLink
      activeOnlyWhenExact="true"
      to={ROUTES.DRIVER}
      label="Dashboard"
    />
  </Nav>
);

const NavigationAuthRider = ({ currentTrip }) => (
  <Nav className="mr-auto">
    <MenuLink
      activeOnlyWhenExact="true"
      to={ROUTES.RIDER}
      label="Dashboard"
    />
    {!currentTrip && (
      <MenuLink
        activeOnlyWhenExact="true"
        to={ROUTES.REQUESTTRIP}
        label="Request a Trip"
      />
    )}
  </Nav>
);

const NavigationAuthAdmin = () => <Nav className="mr-auto"> </Nav>;

const NavigationNonAuth = () => (
  <Nav className="mr-auto">
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
  </Nav>
);

Navigation.propTypes = {
  authUser: PropTypes.shape({
    refresh: PropTypes.string,
    access: PropTypes.string,
    user: PropTypes.objectOf(PropTypes.string),
    isAuthenticated: PropTypes.bool,
  }),
  currentTrip: PropTypes.shape({
    status: PropTypes.string,
  }),
};

Navigation.defaultProps = {
  authUser: null,
  currentTrip: null,
};

NavigationAuthRider.propTypes = Navigation.propTypes;
NavigationAuthRider.defaultProps = Navigation.defaultProps;

const mapStateToProps = (state) => ({
  authUser: state.sessionState.authUser,
  currentTrip: state.tripState.currentTrip,
});

export default connect(mapStateToProps)(Navigation);
