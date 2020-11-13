import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import * as ROLES from 'constants/roles';
import * as ROUTES from 'constants/routes';
import { withAuthorization } from 'components/Session';

const Dashboard = ({ currentTrip, availableTrips }) => (
  <React.Fragment>
    <div className="card col-sm-6">
      <h5 className="card-header">Current Trip</h5>
      <div className="card-body">
        {!currentTrip ? (
          <p className="card-text">No Trip</p>
        ) : (
          <React.Fragment>
            <h5 className="card-title">
              {currentTrip.rider.fullname}
            </h5>
            <p className="card-text">
              Pick up Address:&nbsp;
              {currentTrip.pick_up_address}
            </p>
            <p className="card-text">
              Drop off Address:&nbsp;
              {currentTrip.drop_off_address}
            </p>
            <p className="card-text">{currentTrip.status}</p>
            <Link to="#" className="btn btn-primary">
              Details
            </Link>
          </React.Fragment>
        )}
      </div>
    </div>
    <div className="card col-sm-6">
      <h5 className="card-header">Requested Trips</h5>
      <div className="card-body">
        <ul className="list-group list-group-flush">
          {!availableTrips.length ? (
            <li className="list-group-item">No Trips</li>
          ) : (
            availableTrips.map((trip) => (
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
                <p className="card-text">{trip.status}</p>
                <Link
                  to={{
                    pathname: `${ROUTES.DRIVER}/${trip.id}`,
                    state: {
                      ...trip,
                    },
                  }}
                  className="btn btn-primary"
                >
                  Details
                </Link>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
    <div className="card col-sm-6">
      <h5 className="card-header">Recent Trips</h5>
      <div className="card-body">No Trips</div>
    </div>
  </React.Fragment>
);

Dashboard.propTypes = {
  currentTrip: PropTypes.shape({
    rider: PropTypes.shape({
      fullname: PropTypes.string,
    }),
    drop_off_address: PropTypes.string,
    pick_up_address: PropTypes.string,
    status: PropTypes.string,
  }),
  availableTrips: PropTypes.arrayOf(PropTypes.object).isRequired,
};

Dashboard.defaultProps = {
  currentTrip: null,
};

const roleValidator = (userrole) => userrole === ROLES.DRIVER;

const mapStateToProps = (state) => ({
  currentTrip: state.tripState.currentTrip,
  availableTrips: state.tripState.availableTrips,
});

export default compose(
  withAuthorization(roleValidator),
  connect(mapStateToProps),
)(Dashboard);
