import React, {Component} from 'react';
import {BrowserRouter, Route, Redirect} from 'react-router-dom';
import Login from './components/profile/Login.container';
import Search from './components/search/Search.container';
import Feedback from './components/feedback/Feedback.container';

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <div className="app">
          <div className="container">
            <Route exact path="*" render={() => null} />
            <Route exact path={'/tilmeld'} component={Login} />
            <Route exact path={'/søg'} component={Search} />
            <Route exact path={'/feedback'} component={Feedback} />
          </div>
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
