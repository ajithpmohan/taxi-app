import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { useSelector } from 'react-redux';

import * as ROLES from 'constants/roles';
import {
  withAuthorization,
  // withTripValidator,
} from 'components/Session';
import { getDriverTrips } from 'selectors';
import TripCard from './TripCard';

const TripDetail = ({
  match: {
    params: { id },
  },
}) => {
  const trip = useSelector((state) => getDriverTrips(state, id));

  return (
    <>
      {trip && (
        <div className="card col-sm-6">
          <h5 className="card-header">Trip</h5>
          <div className="card-body">
            <ul className="list-group list-group-flush">
              <TripCard key={trip.id} trip={trip} />
            </ul>
          </div>
        </div>
      )}
    </>
  );
};

TripDetail.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
};

const roleValidator = (userrole) => userrole === ROLES.DRIVER;

// const tripValidator = (currenttrip) => !!currenttrip;

export default compose(
  withAuthorization(roleValidator),
  // withTripValidator(tripValidator),
)(TripDetail);
