import React from 'react';
import { Switch, Route } from 'react-router-dom';

import * as ROUTES from 'constants/routes';
import NotFoundPage from 'components/NotFound';
import Dashboard from './Dashboard';
import RequestTrip from './RequestTrip';
import TripCard from './TripCard';

const RiderPage = () => (
  <div>
    <h4>Rider Dashboard</h4>

    <Switch>
      <Route exact path={ROUTES.RIDER} component={Dashboard} />
      <Route
        exact
        path={ROUTES.REQUESTTRIP}
        component={RequestTrip}
      />
      <Route exact path={ROUTES.TRIPCARD} component={TripCard} />
      <Route path="*" component={NotFoundPage} />
    </Switch>
  </div>
);

export default RiderPage;
