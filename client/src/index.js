import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import App from 'domain/App';
import WebSocketProvider from 'components/WebSocket';
import store from 'store';
import ServerCtx, { ServerAPI } from 'services/server';
import * as serviceWorker from 'serviceWorker';
import 'index.css';

// Importing the Bootstrap CSS
import 'bootstrap/dist/css/bootstrap.min.css';
// Importing the React Toastr CSS
import 'react-toastify/dist/ReactToastify.css';

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <WebSocketProvider>
        <ServerCtx.Provider value={new ServerAPI()}>
          <App />
        </ServerCtx.Provider>
      </WebSocketProvider>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root'),
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
