import React from 'react';
import { compose } from 'recompose';
import { useSelector } from 'react-redux';

import * as ROLES from 'constants/roles';
import { withAuthorization } from 'components/Session';
import { getCurrentTrip, getRecentTrips } from 'selectors';
import TripCard from './TripCard';
import './index.css';

const Dashboard = () => {
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

const condition = (userrole) => userrole === ROLES.RIDER;

export default compose(withAuthorization(condition))(Dashboard);
