import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import { withAuthentication, withPublicRouter } from '../Session';
import Navigation from '../Navigation';
import HomePage from '../Home';
import SignInPage from '../SignIn';
import SignUpPage from '../SignUp';
import DriverDash from '../Driver/Dashboard';
import RiderDash from '../Rider/Dashboard';
import RequestTrip from '../Rider/RequestTrip';
import * as ROUTES from '../../constants/routes';

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

      <Route exact path={ROUTES.DRIVER} component={DriverDash} />

      <Route exact path={ROUTES.RIDER} component={RiderDash} />
      <Route
        exact
        path={ROUTES.REQUESTTRIP}
        component={RequestTrip}
      />
    </div>
  </Router>
);

export default withAuthentication(App);
