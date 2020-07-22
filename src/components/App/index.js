import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import { PrivateRoute, withPublicRouter } from '../Route';
import { withAuthentication } from '../Session';
import DriverDash from '../Driver/Dashboard';
import HomePage from '../Home';
import Navigation from '../Navigation';
import RequestTrip from '../Rider/RequestTrip';
import RiderDash from '../Rider/Dashboard';
import SignInPage from '../SignIn';
import SignUpPage from '../SignUp';
import * as ROUTES from '../../constants/routes';

import './index.css';

const App = () => (
  <Router>
    <div className="container-fluid">
      <Navigation />

      <hr />

      <Route exact path={ROUTES.HOME} component={HomePage} />
      <Route
        exact
        path={ROUTES.SIGNIN}
        component={withPublicRouter(SignInPage)}
      />
      <Route
        exact
        path={ROUTES.SIGNUP}
        component={withPublicRouter(SignUpPage)}
      />

      <PrivateRoute exact path={ROUTES.DRIVER}>
        <DriverDash />
      </PrivateRoute>

      <PrivateRoute exact path={ROUTES.RIDER}>
        <RiderDash />
      </PrivateRoute>

      <PrivateRoute exact path={ROUTES.REQUESTTRIP}>
        <RequestTrip />
      </PrivateRoute>
    </div>
  </Router>
);

export default withAuthentication(App);
