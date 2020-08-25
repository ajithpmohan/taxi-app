import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import * as ROUTES from '../../constants/routes';

const REDIRECT_URL = {
  DRIVER: ROUTES.DRIVER,
  RIDER: ROUTES.RIDER,
  ADMIN: ROUTES.HOME,
};

const withAuthorization = (condition) => (Component) => {
  class WithAuthorization extends React.Component {
    componentDidMount() {
      this.checkAndRedirect();
    }

    componentDidUpdate() {
      this.checkAndRedirect();
    }

    checkAndRedirect() {
      const { userRole, history } = this.props;
      if (!condition(userRole)) {
        history.push(REDIRECT_URL[userRole]);
      }
    }

    render() {
      const { userRole } = this.props;
      return condition(userRole) ? (
        <Component {...this.props} />
      ) : null;
    }
  }

  WithAuthorization.propTypes = {
    userRole: PropTypes.string,
    history: PropTypes.shape({
      push: PropTypes.func.isRequired,
    }).isRequired,
  };

  WithAuthorization.defaultProps = {
    userRole: null,
  };

  const mapStateToProps = (state) => ({
    userRole: state.sessionState.authUser.user?.type,
  });

  return compose(
    withRouter,
    connect(mapStateToProps),
  )(WithAuthorization);
};

export default withAuthorization;
