import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { useSelector } from 'react-redux';
import { withRouter } from 'react-router-dom';

import * as ROLES from 'constants/roles';
import * as ROUTES from 'constants/routes';
import { withAuthorization } from 'components/Session';
import { withServerConsumer } from 'services/server';
import { getAccessToken, getUserRole } from 'selectors';

const REDIRECT_URL = {
  DRIVER: ROUTES.DRIVER,
  RIDER: ROUTES.RIDER,
};

const TripCard = ({
  history,
  location: { state },
  match: {
    params: { id },
  },
  serverAPI,
}) => {
  const accessToken = useSelector((reduxState) =>
    getAccessToken(reduxState),
  );

  const userRole = useSelector((reduxState) =>
    getUserRole(reduxState),
  );

  const [trip, setTrip] = React.useState(state);

  React.useEffect(async () => {
    if (!trip) {
      const res = await serverAPI
        .dofetchTrip(id, accessToken)
        .catch(({ response }) => response);
      res.status === 200
        ? setTrip(res.data)
        : history.push(REDIRECT_URL[userRole]);
    }
  }, [accessToken, id, serverAPI, trip]);

  return (
    <>
      {trip && (
        <div className="card col-sm-6">
          <h5 className="card-header">Trip</h5>
          <div className="card-body">
            <ul className="list-group list-group-flush">
              <li className="list-group-item" key={trip?.id}>
                <h5 className="card-title">{trip?.rider.fullname}</h5>
                {trip && trip.driver && (
                  <p className="card-text">
                    Driver:&nbsp;
                    {trip.driver?.fullname}
                  </p>
                )}
                <p className="card-text">
                  Pick up Address:&nbsp;
                  {trip?.pick_up_address}
                </p>
                <p className="card-text">
                  Drop off Address:&nbsp;
                  {trip?.drop_off_address}
                </p>
                <p className="card-text">
                  Status: &nbsp;
                  {trip?.status}
                </p>
              </li>
            </ul>
          </div>
        </div>
      )}
    </>
  );
};

TripCard.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
  location: PropTypes.shape({
    state: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  }).isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
  serverAPI: PropTypes.shape({
    dofetchTrip: PropTypes.func.isRequired,
  }).isRequired,
};

const roleValidator = (userrole) => userrole === ROLES.RIDER;

export default compose(
  withAuthorization(roleValidator),
  withRouter,
  withServerConsumer,
)(TripCard);
