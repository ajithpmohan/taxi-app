import React from 'react';
import PropTypes from 'prop-types';

export const PickupBtn = ({ handleTrip }) => (
  <button
    type="button"
    className="btn btn-primary"
    onClick={(e) => handleTrip(e, 'trip.pickup')}
  >
    Drive To Pick Up
  </button>
);

export const DropoffBtn = ({ handleTrip }) => (
  <button
    type="button"
    className="btn btn-primary"
    onClick={(e) => handleTrip(e, 'trip.dropoff')}
  >
    Drive To Drop off
  </button>
);

export const CompleteTripBtn = ({ handleTrip }) => (
  <button
    type="button"
    className="btn btn-primary"
    onClick={(e) => handleTrip(e, 'trip.complete')}
  >
    Complete Trip
  </button>
);

PickupBtn.propTypes = {
  handleTrip: PropTypes.func.isRequired,
};

DropoffBtn.propTypes = PickupBtn.propTypes;

CompleteTripBtn.propTypes = PickupBtn.propTypes;
