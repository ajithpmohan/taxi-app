import React from 'react';
import { Switch, Route } from 'react-router-dom';

import Dashboard from './Dashboard';
import TripDetail from './TripDetail';
import * as ROUTES from '../../constants/routes';

const DriverPage = () => (
  <div>
    <h4>Driver Dashboard</h4>

    <Switch>
      <Route exact path={ROUTES.DRIVER} component={Dashboard} />
      <Route exact path={ROUTES.TRIPDETAIL} component={TripDetail} />
    </Switch>
  </div>
);

export default DriverPage;
