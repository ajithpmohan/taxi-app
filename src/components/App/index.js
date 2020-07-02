import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import Navigation from '../Navigation';
import HomePage from '../Home';
import Dashboard from '../Rider/Dashboard';
import SignInPage from '../SignIn';
import RequestTrip from '../Rider/RequestTrip';

import * as ROUTES from '../../constants/routes';

const App = () => (
  <Router>
    <div className="container-fluid">
      <Navigation />

      <hr />

      <Route exact path={ROUTES.HOME} component={HomePage} />
      <Route exact path={ROUTES.SIGNIN} component={SignInPage} />
      <Route exact path={ROUTES.RIDER} component={Dashboard} />
      <Route
        exact
        path={ROUTES.REQUESTTRIP}
        component={RequestTrip}
      />
    </div>
  </Router>
);

export default App;
