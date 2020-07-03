import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import { withRouter } from 'react-router-dom';

import { doSetAuthUser } from '../../actions';
import { withAPI } from '../../api';
import * as ROUTES from '../../constants/routes';

class SignOutButton extends React.Component {
  onSignOut = () => {
    const { api, history, onSetAuthUser } = this.props;
    localStorage.removeItem('authUser');
    onSetAuthUser(null);

    api.doSignOut(); // TODO
    history.push(ROUTES.HOME);
  };

  render() {
    return (
      <button
        type="button"
        className="dropdown-item"
        onClick={this.onSignOut}
      >
        SignOut
      </button>
    );
  }
}

SignOutButton.propTypes = {
  api: PropTypes.shape({
    doSignOut: PropTypes.func.isRequired,
  }).isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
  onSetAuthUser: PropTypes.func.isRequired,
};

const mapDispatchToProps = (dispatch) => ({
  onSetAuthUser: (authUser) => dispatch(doSetAuthUser(authUser)),
});

const SignOut = compose(
  withAPI,
  withRouter,
  connect(null, mapDispatchToProps),
)(SignOutButton);

export default SignOut;
