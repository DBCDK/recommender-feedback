import React from 'react';
import ReactDOM from 'react-dom';
import App from './client/App';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import reducer from './client/reducers/reducer'
import registerServiceWorker from './client/registerServiceWorker';

import './client/styles/index.css';
import './client/styles/login.css';
import './client/styles/search.css';

let store = createStore(reducer)

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);
registerServiceWorker();
