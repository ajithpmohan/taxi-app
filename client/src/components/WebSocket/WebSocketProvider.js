import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { webSocket } from 'rxjs/webSocket';

import WebSocketContext from './context';
import { doSetTrip } from '../../actions';

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
    const { access } = this.props;
    let { ws } = this.state;
    if (access && !ws) {
      const { onSetTrip } = this.props;
      const domain = process.env.REACT_APP_SERVER_DOMAIN;
      ws = webSocket(`ws://${domain}/ws/trip/?token=${access}`);
      ws.subscribe((payload) => onSetTrip(payload));
      this.setState({ ws });
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
