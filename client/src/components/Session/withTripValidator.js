import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import * as ROUTES from '../../constants/routes';

const REDIRECT_URL = {
  DRIVER: ROUTES.DRIVER,
  RIDER: ROUTES.RIDER,
};

const withTripValidator = (condition) => (Component) => {
  class WithTripValidator extends React.Component {
    componentDidMount() {
      this.checkAndRedirect();
    }

    componentDidUpdate() {
      this.checkAndRedirect();
    }

    checkAndRedirect() {
      const { currentTrip, history, userRole } = this.props;
      if (condition(currentTrip)) {
        history.push(REDIRECT_URL[userRole]);
      }
    }

    render() {
      const { currentTrip } = this.props;
      return !condition(currentTrip) ? (
        <Component {...this.props} />
      ) : null;
    }
  }

  WithTripValidator.propTypes = {
    currentTrip: PropTypes.shape({
      status: PropTypes.string,
    }),
    history: PropTypes.shape({
      push: PropTypes.func.isRequired,
    }).isRequired,
    userRole: PropTypes.string,
  };

  WithTripValidator.defaultProps = {
    currentTrip: null,
    userRole: null,
  };

  const mapStateToProps = (state) => ({
    currentTrip: state.tripState.currentTrip,
    userRole: state.sessionState.authUser.user?.role,
  });

  return compose(
    withRouter,
    connect(mapStateToProps),
  )(WithTripValidator);
};

export default withTripValidator;
