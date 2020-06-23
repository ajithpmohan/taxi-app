import React from 'react';

import './RequestTrip.css';
import GoogleMap from '../GoogleMap';

const RequestTripPage = () => (
  <div>
    <h3>Request a Trip</h3>
    <div>
      <label htmlFor="pickup">Pick up address:</label>
      <input
        id="origin-input"
        className="controls"
        type="text"
        placeholder="Enter Pick up Address"
        name="pickup"
      />
    </div>
    <GoogleMap />
    <div>
      <label htmlFor="dropoff">Drop off address:</label>
      <input
        id="destination-input"
        className="controls"
        type="text"
        placeholder="Enter Drop off Address"
        name="dropoff"
      />
    </div>
  </div>
);

export default RequestTripPage;
