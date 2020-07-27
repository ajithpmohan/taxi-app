import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import { webSocket } from 'rxjs/webSocket';

import * as ROLES from '../../constants/roles';
import { withAuthorization } from '../Session';
import GoogleMap from '../GoogleMap';
import './RequestTrip.css';

const RequestTripPage = ({ access }) => {
  const pickup = React.useRef();
  const dropoff = React.useRef();

  const handleSubmit = (event) => {
    const ws = webSocket(
      `ws://localhost:9000/ws/trip/?token=${access}`,
    );
    ws.subscribe();
    ws.next({
      type: 'create.trip',
      data: {
        pick_up_address: pickup.current.value,
        drop_off_address: dropoff.current.value,
      },
    });
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
  access: PropTypes.string,
};

RequestTripPage.defaultProps = {
  access: null,
};

const mapStateToProps = (state) => ({
  access: state.sessionState.authUser.access,
});

const condition = (userrole) => userrole === ROLES.RIDER;

export default compose(
  withAuthorization(condition),
  connect(mapStateToProps),
)(RequestTripPage);
