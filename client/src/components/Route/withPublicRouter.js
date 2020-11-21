import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import { withRouter } from 'react-router-dom';

import * as ROUTES from 'constants/routes';

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
      if (authUser.isAuthenticated) {
        history.push(REDIRECT_URL[authUser.user?.role]);
      }
    }

    render() {
      const { authUser } = this.props;
      return (
        <div className="row">
          <div className="col-sm-9 col-md-7 col-lg-4 mx-auto">
            <div className="card card-signin my-5">
              <div className="card-body">
                {!authUser.isAuthenticated ? (
                  <Component {...this.props} />
                ) : null}
              </div>
            </div>
          </div>
        </div>
      );
    }
  }

  WithPublicRouter.propTypes = {
    authUser: PropTypes.shape({
      refresh: PropTypes.string,
      access: PropTypes.string,
      user: PropTypes.objectOf(PropTypes.string),
      isAuthenticated: PropTypes.bool,
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
