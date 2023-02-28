import React from 'react';
import PropTypes from 'prop-types';
import { Link, useRouteMatch } from 'react-router-dom';

import * as ROUTES from 'constants/routes';

const TripCard = ({ trip }) => {
  const match = useRouteMatch(`${ROUTES.RIDER}/${trip.id}`);

  return (
    <li className="list-group-item" key={trip.id}>
      {trip.driver && (
        <h5 className="card-title">{trip.driver.fullname}</h5>
      )}
      <p className="card-text">
        Pick up Address:&nbsp;
        {trip.pick_up_address}
      </p>
      <p className="card-text">
        Drop off Address:&nbsp;
        {trip.drop_off_address}
      </p>
      <p className="card-text">
        Status: &nbsp;
        {trip.status}
      </p>
      {!match && (
        <Link
          to={`${ROUTES.RIDER}/${trip.id}`}
          className="btn btn-primary"
        >
          Details
        </Link>
      )}
    </li>
  );
};

TripCard.propTypes = {
  trip: PropTypes.shape({
    id: PropTypes.string.isRequired,
    driver: PropTypes.shape({
      fullname: PropTypes.string.isRequired,
    }),
    drop_off_address: PropTypes.string.isRequired,
    pick_up_address: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
  }).isRequired,
};

export default TripCard;
