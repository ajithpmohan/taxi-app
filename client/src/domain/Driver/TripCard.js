import React from 'react';
import PropTypes from 'prop-types';
import { Link, useRouteMatch } from 'react-router-dom';

import * as ROUTES from 'constants/routes';
import { withWebSocket } from 'components/WebSocket';
import { CompleteTripBtn, DropoffBtn, PickupBtn } from './TripAction';

const buttonStates = ({ handleTrip }) => ({
  Requested: <PickupBtn handleTrip={handleTrip} />,
  Started: <DropoffBtn handleTrip={handleTrip} />,
  'In Progress': <CompleteTripBtn handleTrip={handleTrip} />,
});

const TripCard = ({ trip, ws }) => {
  const match = useRouteMatch(`${ROUTES.DRIVER}/${trip.id}`);

  const handleTrip = (event, actionType) => {
    event.preventDefault();
    ws.next({
      type: actionType,
      data: {
        id: trip.id,
      },
    });
  };

  return (
    <li className="list-group-item" key={trip.id}>
      <h5 className="card-title">{trip.rider.fullname}</h5>
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

      {!match ? (
        <Link
          to={`${ROUTES.DRIVER}/${trip.id}`}
          className="btn btn-primary"
        >
          Details
        </Link>
      ) : (
        buttonStates({ handleTrip })[trip.status]
      )}
    </li>
  );
};

TripCard.propTypes = {
  trip: PropTypes.shape({
    id: PropTypes.string.isRequired,
    rider: PropTypes.shape({
      fullname: PropTypes.string.isRequired,
    }),
    drop_off_address: PropTypes.string.isRequired,
    pick_up_address: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
  }).isRequired,
  ws: PropTypes.objectOf(
    PropTypes.oneOfType([
      PropTypes.bool,
      PropTypes.array,
      PropTypes.object,
    ]),
  ),
};

TripCard.defaultProps = {
  ws: null,
};

export default withWebSocket(TripCard);
