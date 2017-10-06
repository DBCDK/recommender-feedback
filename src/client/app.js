import React, {Component} from 'react';
import CreateProfile from './components/profile/CreateProfile.container';
import Search from './components/search/Search.container';
import Feedback from './components/feedback/Feedback.container';
import ThankYou from './components/thankyou/ThankYou.component';
import TopBar from './components/topbar/TopBar.container';
import Login from './components/profile/Login.container';
import {connect} from 'react-redux';
import {HISTORY_REPLACE} from './redux';

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {page: null};
  }

  route(props) {
    const path = props.routerState.path;
    const isLoggedIn = props.profileState.status === 'IS_LOGGED_IN';
    if (path === '/velkommen') {
      this.setState({page: <CreateProfile/>});
    }
    else if (path === '/login') {
      this.setState({page: <Login/>});
    }
    else if (path === '/søg' && isLoggedIn) {
      this.setState({page: <Search/>});
    }
    else if (path === '/feedback' && isLoggedIn) {
      this.setState({page: <Feedback/>});
    }
    else if (path === '/tak' && isLoggedIn) {
      this.setState({page: <ThankYou dispatch={this.props.dispatch}/>});
    }
    else if (isLoggedIn) {
      this.props.dispatch({type: HISTORY_REPLACE, path: '/søg'});
    }
    else {
      this.props.dispatch({type: HISTORY_REPLACE, path: '/velkommen'});
    }
  }

  componentDidMount() {
    this.route(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.route(nextProps);
  }

  render() {
    return (
      <div className="app">
        <TopBar/>
        <div className="container">
          {this.state.page}
        </div>
      </div>
    );
  }
}

export default connect(
  // Map redux state to group prop
  (state) => {
    return {profileState: state.profileReducer, routerState: state.routerReducer};
  }
)(App);
