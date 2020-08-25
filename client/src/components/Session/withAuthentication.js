import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { doSetAuthUser } from '../../actions';

const withAuthentication = (Component) => {
  class WithAuthentication extends React.Component {
    componentDidMount() {
      const { authUser, onSetAuthUser } = this.props;
      !authUser.isAuthenticated &&
        onSetAuthUser(JSON.parse(localStorage.getItem('authUser')));
    }

    render() {
      return <Component {...this.props} />;
    }
  }

  WithAuthentication.propTypes = {
    authUser: PropTypes.shape({
      refresh: PropTypes.string,
      access: PropTypes.string,
      user: PropTypes.object,
      isAuthenticated: PropTypes.bool,
    }),
    onSetAuthUser: PropTypes.func.isRequired,
  };

  WithAuthentication.defaultProps = {
    authUser: null,
  };

  const mapStateToProps = (state) => ({
    authUser: state.sessionState.authUser,
  });

  const mapDispatchToProps = (dispatch) => ({
    onSetAuthUser: (authUser) => dispatch(doSetAuthUser(authUser)),
  });

  return connect(
    mapStateToProps,
    mapDispatchToProps,
  )(WithAuthentication);
};

export default withAuthentication;
