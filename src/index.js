import React from 'react';
import ReactDOM from 'react-dom';
import './client/styles/index.css';
import App from './client/app';
import registerServiceWorker from './client/registerServiceWorker';

ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();
