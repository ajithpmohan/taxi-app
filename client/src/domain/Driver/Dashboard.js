import React from 'react';
import { compose } from 'recompose';
import { useSelector } from 'react-redux';

import * as ROLES from 'constants/roles';
import { withAuthorization } from 'components/Session';
import {
  getAvailableTrips,
  getCurrentTrip,
  getRecentTrips,
} from 'selectors';
import TripCard from './TripCard';

const Dashboard = () => {
  const availableTrips = useSelector((state) =>
    getAvailableTrips(state),
  );
  const currentTrip = useSelector((state) => getCurrentTrip(state));
  const recentTrips = useSelector((state) => getRecentTrips(state));

  return (
    <>
      <div className="card col-sm-6">
        <h5 className="card-header">Current Trip</h5>
        <div className="card-body">
          {currentTrip ? (
            <ul className="list-group list-group-flush">
              <TripCard key={currentTrip.id} trip={currentTrip} />
            </ul>
          ) : (
            <p className="card-text">No Trip</p>
          )}
        </div>
      </div>
      <div className="card col-sm-6">
        <h5 className="card-header">Requested Trips</h5>
        <div className="card-body">
          <ul className="list-group list-group-flush">
            {availableTrips.map((trip) => (
              <TripCard key={trip.id} trip={trip} />
            ))}
            {!availableTrips.length && (
              <p className="card-text">No Trips</p>
            )}
          </ul>
        </div>
      </div>
      <div className="card col-sm-6">
        <h5 className="card-header">Recent Trips</h5>
        <div className="card-body">
          <ul className="list-group list-group-flush">
            {recentTrips.map((trip) => (
              <TripCard key={trip.id} trip={trip} />
            ))}
            {!recentTrips.length && (
              <p className="card-text">No Trips</p>
            )}
          </ul>
        </div>
      </div>
    </>
  );
};

const roleValidator = (userrole) => userrole === ROLES.DRIVER;

export default compose(withAuthorization(roleValidator))(Dashboard);
