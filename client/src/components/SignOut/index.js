import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import { withRouter } from 'react-router-dom';

import { doSetAuthUser } from 'actions';
import * as ROUTES from 'constants/routes';

class SignOutButton extends React.Component {
  onSignOut = () => {
    const { history, onSetAuthUser } = this.props;
    localStorage.removeItem('authUser');
    onSetAuthUser(null);

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
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
  onSetAuthUser: PropTypes.func.isRequired,
};

const mapDispatchToProps = (dispatch) => ({
  onSetAuthUser: (authUser) => dispatch(doSetAuthUser(authUser)),
});

const SignOut = compose(
  withRouter,
  connect(null, mapDispatchToProps),
)(SignOutButton);

export default SignOut;
