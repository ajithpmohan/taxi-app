import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { doSetAuthUser } from '../../actions';

const withAuthentication = (Component) => {
  class WithAuthentication extends React.Component {
    componentDidMount() {
      const { authUser, onSetAuthUser } = this.props;
      !authUser &&
        onSetAuthUser(JSON.parse(localStorage.getItem('authUser')));
    }

    render() {
      return <Component {...this.props} />;
    }
  }

  WithAuthentication.propTypes = {
    authUser: PropTypes.objectOf(PropTypes.string).isRequired,
    onSetAuthUser: PropTypes.func.isRequired,
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
