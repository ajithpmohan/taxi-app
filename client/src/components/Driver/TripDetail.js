import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { connect } from 'react-redux';

import * as ROLES from '../../constants/roles';
import { withAPI } from '../../api';
import { withAuthorization } from '../Session';

const TripDetail = ({ access, api, location, match }) => {
  const { id } = match.params;
  const [trip, setTrip] = React.useState(location?.state);

  React.useEffect(() => {
    if (!trip) {
      api
        .dofetchTrip(id, access)
        .then((resp) => {
          setTrip(resp.data);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [access, api, id, trip]);

  return (
    <React.Fragment>
      <div className="card col-sm-6">
        <h5 className="card-header">Requested Trip</h5>
        <div className="card-body">
          <ul className="list-group list-group-flush">
            <li className="list-group-item" key={trip?.id}>
              <h5 className="card-title">{trip?.rider.fullname}</h5>
              <p className="card-text">
                Pick up Address:&nbsp;
                {trip?.pick_up_address}
              </p>
              <p className="card-text">
                Drop off Address:&nbsp;
                {trip?.drop_off_address}
              </p>
              <p className="card-text">{trip?.status}</p>
            </li>
          </ul>
        </div>
      </div>
    </React.Fragment>
  );
};

TripDetail.propTypes = {
  access: PropTypes.string,
  api: PropTypes.shape({
    dofetchTrip: PropTypes.func.isRequired,
  }).isRequired,
  location: PropTypes.shape({
    state: PropTypes.object,
  }).isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
};

TripDetail.defaultProps = {
  access: null,
};

const mapStateToProps = (state) => ({
  access: state.sessionState.authUser.access,
});

const condition = (userrole) => userrole === ROLES.DRIVER;

export default compose(
  withAuthorization(condition),
  withAPI,
  connect(mapStateToProps),
)(TripDetail);
