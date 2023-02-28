import React from 'react';
import ServerCtx from './serverCtx';

const withServerConsumer = (Component) => {
  const WithServerConsumer = (props) => (
    <ServerCtx.Consumer>
      {(serverAPI) => <Component {...props} serverAPI={serverAPI} />}
    </ServerCtx.Consumer>
  );
  return WithServerConsumer;
};

export default withServerConsumer;
