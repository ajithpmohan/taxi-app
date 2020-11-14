import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { webSocket } from 'rxjs/webSocket';

import { doSetTrip } from 'actions';
import WebSocketContext from './context';

class WebSocketProvider extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      ws: null,
    };
  }

  componentDidMount = () => {
    this.connect();
  };

  componentDidUpdate = () => {
    this.connect();
  };

  connect = () => {
    const { access, onSetTrip } = this.props;
    let { ws } = this.state;
    if (access && !ws) {
      const domain = process.env.REACT_APP_SERVER_DOMAIN;
      ws = webSocket(`ws://${domain}/ws/trip/?token=${access}`);
      ws.subscribe((resp) => onSetTrip(resp));
      this.setState({ ws });
    }
    if (!access && ws) {
      this.setState({ ws: null });
    }
  };

  render() {
    const { ws } = this.state;
    const { children } = this.props;
    return (
      <WebSocketContext.Provider value={ws}>
        {children}
      </WebSocketContext.Provider>
    );
  }
}

WebSocketProvider.propTypes = {
  access: PropTypes.string,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
  onSetTrip: PropTypes.func.isRequired,
};

WebSocketProvider.defaultProps = {
  access: null,
};

const mapStateToProps = (state) => ({
  access: state.sessionState.authUser.access,
});

const mapDispatchToProps = (dispatch) => ({
  onSetTrip: (payload) => dispatch(doSetTrip(payload)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(WebSocketProvider);
