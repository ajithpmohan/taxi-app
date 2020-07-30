import React from 'react';

import WebSocketContext from './context';

const withWebSocket = (Component) => (props) => (
  <WebSocketContext.Consumer>
    {(ws) => <Component {...props} ws={ws} />}
  </WebSocketContext.Consumer>
);

export default withWebSocket;
