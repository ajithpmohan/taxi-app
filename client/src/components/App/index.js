import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import { PrivateRoute, withPublicRouter } from 'components/Route';
import { withAuthentication } from 'components/Session';

import DriverPage from 'components/Driver';
import HomePage from 'components/Home';
import Navigation from 'components/Navigation';
import RequestTrip from 'components/Rider/RequestTrip';
import RiderDash from 'components/Rider/Dashboard';
import SignInPage from 'components/SignIn';
import SignUpPage from 'components/SignUp';

import * as ROUTES from 'constants/routes';

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

      <PrivateRoute path={ROUTES.DRIVER}>
        <DriverPage />
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
