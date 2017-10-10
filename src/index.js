import React from 'react';
import ReactDOM from 'react-dom';
import App from './client/app';
import {createBrowserHistory} from 'history';
import {Provider} from 'react-redux';
import {createStore, applyMiddleware} from 'redux';
import {rootReducer, loggerMiddleware, historyMiddleware, requestMiddleware, profileMiddleware, ON_LOCATION_CHANGE} from './client/redux';
import registerServiceWorker from './client/registerServiceWorker';

import './client/styles/index.css';
import './client/styles/login.css';
import './client/styles/search.css';
import './client/styles/topbar.css';
import './client/styles/feedback.css';

const history = createBrowserHistory();
const store = createStore(rootReducer, applyMiddleware(loggerMiddleware, historyMiddleware(history), requestMiddleware, profileMiddleware));

// Redux-first routing is used as described:
// https://medium.freecodecamp.org/an-introduction-to-the-redux-first-routing-model-98926ebf53cb
// We subscribe to history-changes, making sure path is always synced and stored in global state.
// In this way we change page by dispatching a HISTORY_PUSH action; historyMiddleware pushes
// path to history object, and the history listener below dispatches ON_LOCATION_CHANGE, which updates state.
// The state is then the single source of truth, as we always use the path stored in state when rendering.
store.dispatch({type: ON_LOCATION_CHANGE, path: history.location.pathname, location: history.location});
history.listen((location) => {
  store.dispatch({type: ON_LOCATION_CHANGE, path: location.pathname, location});
});

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);
registerServiceWorker();
