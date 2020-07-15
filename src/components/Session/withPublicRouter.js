import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import { withRouter } from 'react-router-dom';

import * as ROUTES from '../../constants/routes';

const REDIRECT_URL = {
  DRIVER: ROUTES.DRIVER,
  RIDER: ROUTES.RIDER,
  ADMIN: ROUTES.HOME,
};

const withPublicRouter = (Component) => {
  class WithPublicRouter extends React.Component {
    componentDidMount() {
      this.checkAndRedirect();
    }

    componentDidUpdate() {
      this.checkAndRedirect();
    }

    checkAndRedirect() {
      const { authUser, history } = this.props;
      if (authUser) {
        history.push(REDIRECT_URL[authUser?.user.type]);
      }
    }

    render() {
      const { authUser } = this.props;
      return (
        <div>{!authUser ? <Component {...this.props} /> : null}</div>
      );
    }
  }

  WithPublicRouter.propTypes = {
    authUser: PropTypes.shape({
      refresh: PropTypes.string,
      access: PropTypes.string,
      user: PropTypes.object,
    }),
    history: PropTypes.shape({
      push: PropTypes.func.isRequired,
    }).isRequired,
  };

  WithPublicRouter.defaultProps = {
    authUser: null,
  };

  const mapStateToProps = (state) => ({
    authUser: state.sessionState.authUser,
  });

  return compose(
    withRouter,
    connect(mapStateToProps),
  )(WithPublicRouter);
};

export default withPublicRouter;
