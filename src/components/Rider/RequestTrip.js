import React from 'react';
import { webSocket } from 'rxjs/webSocket';

import './RequestTrip.css';
import GoogleMap from '../GoogleMap';

const RequestTripPage = () => {
  const pickup = React.useRef();
  const dropoff = React.useRef();

  const handleSubmit = (event) => {
    const ws = webSocket('ws://localhost:9000/ws/trip/');
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

export default RequestTripPage;
