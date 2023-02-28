import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import { webSocket } from 'rxjs/webSocket';

import * as actionTypes from 'constants/actionTypes';
import { updateToast } from 'constants/utils';
import { doSetTrip } from 'actions';
import WebSocketContext from './context';

const WebSocketProvider = ({ children }) => {
  const [ws, setWebSocket] = useState(null);

  const accessToken = useSelector(
    (state) => state.sessionState.authUser?.access,
  );
  const userRole = useSelector(
    (state) => state.sessionState.authUser.user?.role,
  );

  const dispatch = useDispatch();
  const SERVER_BASE_URL = process.env.REACT_APP_SERVER_DOMAIN;

  useEffect(() => {
    if (accessToken && !ws) {
      const ws = webSocket(
        `ws://${SERVER_BASE_URL}/ws/trip/?token=${accessToken}`,
      );
      ws.subscribe((res) => {
        dispatch(doSetTrip(res));

        userRole === 'RIDER' &&
          [
            actionTypes.SET_CURRENT_TRIP,
            actionTypes.UPDATE_RECENT_TRIPS,
          ].includes(res.action) &&
          updateToast(res.payload);
      });
      setWebSocket(ws);
    }
    if (!accessToken && ws) {
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
