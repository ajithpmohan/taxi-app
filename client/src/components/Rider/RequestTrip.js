import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { withRouter } from 'react-router-dom';

import GoogleMap from '../GoogleMap';
import { withAuthorization, withTripValidator } from '../Session';
import { withWebSocket } from '../WebSocket';
import * as ROLES from '../../constants/roles';
import * as ROUTES from '../../constants/routes';

import './index.css';

const RequestTripPage = ({ ws, history }) => {
  const pickup = React.useRef();
  const dropoff = React.useRef();

  const handleSubmit = (event) => {
    ws.next({
      type: 'create.trip',
      data: {
        pick_up_address: pickup.current.value,
        drop_off_address: dropoff.current.value,
      },
    });
    history.push(ROUTES.RIDER);

    event.preventDefault();
  };

  return (
    <div>
      <h3>Request a Trip</h3>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="pickup">Pick up address:</label>
          <input
            id="origin-input"
            className="controls"
            type="text"
            placeholder="Enter Pick up Address"
            name="pickup"
            ref={pickup}
          />
        </div>
        <GoogleMap />
        <div className="form-group">
          <label htmlFor="dropoff">Drop off address:</label>
          <input
            id="destination-input"
            className="controls"
            type="text"
            placeholder="Enter Drop off Address"
            name="dropoff"
            ref={dropoff}
          />
        </div>
        <button className="btn btn-primary" type="submit">
          Submit
        </button>
      </form>
    </div>
  );
};

RequestTripPage.propTypes = {
  ws: PropTypes.objectOf(
    PropTypes.oneOfType([
      PropTypes.bool,
      PropTypes.array,
      PropTypes.object,
    ]),
  ),
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
};

RequestTripPage.defaultProps = {
  ws: null,
};

const roleValidator = (userrole) => userrole === ROLES.RIDER;

const tripValidator = (currenttrip) => !!currenttrip;

export default compose(
  withAuthorization(roleValidator),
  withTripValidator(tripValidator),
  withWebSocket,
  withRouter,
)(RequestTripPage);
