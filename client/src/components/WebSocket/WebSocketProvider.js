import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import { webSocket } from 'rxjs/webSocket';

import { doSetTrip } from 'actions';
import WebSocketContext from './context';

const WebSocketProvider = ({ children }) => {
  const [ws, setWebSocket] = useState(null);

  const access = useSelector(
    (state) => state.sessionState.authUser.access,
  );
  const dispatch = useDispatch();

  const SERVER_BASE_URL = process.env.REACT_APP_SERVER_DOMAIN;

  useEffect(() => {
    if (access && !ws) {
      const ws = webSocket(
        `ws://${SERVER_BASE_URL}/ws/trip/?token=${access}`,
      );
      ws.subscribe((payload) => dispatch(doSetTrip(payload)));
      setWebSocket(ws);
    }
    if (!access && ws) {
      setWebSocket(null);
    }
  });

  return (
    <WebSocketContext.Provider value={ws}>
      {children}
    </WebSocketContext.Provider>
  );
};

WebSocketProvider.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
};

export default WebSocketProvider;
