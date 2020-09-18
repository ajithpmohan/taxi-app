import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import * as ROLES from '../../constants/roles';
import { withAuthorization } from '../Session';

import './index.css';

const Dashboard = ({ currentTrip }) => (
  <React.Fragment>
    <div className="card col-sm-6">
      <h5 className="card-header">Current Trip</h5>
      <div className="card-body">
        {currentTrip ? (
          <React.Fragment>
            {currentTrip.driver && (
              <h5 className="card-title">
                {currentTrip?.driver.fullname}
              </h5>
            )}
            <p className="card-text">
              Pick up Address:&nbsp;
              {currentTrip?.pick_up_address}
            </p>
            <p className="card-text">
              Drop off Address:&nbsp;
              {currentTrip?.drop_off_address}
            </p>
            <p className="card-text">
              Status:&nbsp;
              {currentTrip?.status}
            </p>
            <Link to="#" className="btn btn-primary">
              Details
            </Link>
          </React.Fragment>
        ) : (
          <p className="card-text">No Trip</p>
        )}
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
    driver: PropTypes.shape({
      fullname: PropTypes.string,
    }),
    drop_off_address: PropTypes.string,
    pick_up_address: PropTypes.string,
    status: PropTypes.string,
  }),
};

Dashboard.defaultProps = {
  currentTrip: null,
};

const condition = (userrole) => userrole === ROLES.RIDER;

const mapStateToProps = (state) => ({
  currentTrip: state.tripState.currentTrip,
});

export default compose(
  withAuthorization(condition),
  connect(mapStateToProps),
)(Dashboard);
