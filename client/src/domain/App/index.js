import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from 'react-router-dom';
import Container from 'react-bootstrap/Container';

import { PrivateRoute, withPublicRouter } from 'components/Route';
import { withAuthentication } from 'components/Session';

import Navigation from 'components/Navigation';
import NotFoundPage from 'components/NotFound';
import DriverPage from 'domain/Driver';
import HomePage from 'domain/Home';
import RiderPage from 'domain/Rider';
import SignInPage from 'domain/SignIn';
import SignUpPage from 'domain/SignUp';

import * as ROUTES from 'constants/routes';

import './index.css';

const App = () => (
  <Container fluid>
    <Router>
      <Navigation />

      <hr />
      <Switch>
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

        <PrivateRoute path={ROUTES.RIDER}>
          <RiderPage />
        </PrivateRoute>

        <Route path="*" component={NotFoundPage} />
      </Switch>
    </Router>
  </Container>
);

export default withAuthentication(App);
