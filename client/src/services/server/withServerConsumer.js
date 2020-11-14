import React from 'react';
import ServerCtx from './serverCtx';

const withServerConsumer = (Component) => (props) => (
  <ServerCtx.Consumer>
    {(serverAPI) => <Component {...props} serverAPI={serverAPI} />}
  </ServerCtx.Consumer>
);

export default withServerConsumer;
