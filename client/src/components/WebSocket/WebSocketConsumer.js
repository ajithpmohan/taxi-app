import React from 'react';

import WebSocketContext from './context';

const withWebSocket = (Component) => {
  const WithWebSocket = (props) => (
    <WebSocketContext.Consumer>
      {(ws) => <Component {...props} ws={ws} />}
    </WebSocketContext.Consumer>
  );
  return WithWebSocket;
};

export default withWebSocket;
