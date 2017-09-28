import React from 'react';
import {connect} from 'react-redux';
import {ON_LOGIN_REQUEST, HISTORY_REPLACE} from '../../redux';

class Login extends React.Component {

  componentDidMount() {
    const urlParams = this.props.routerState.params;
    if (urlParams.id && urlParams.id.length > 0) {
      this.props.dispatch({type: ON_LOGIN_REQUEST, profileId: urlParams.id[0]});
    }
    else {
      this.props.dispatch({type: HISTORY_REPLACE, path: '/tilmeld'});
    }
  }

  componentDidUpdate() {
    if (this.props.profileState.isLoggedIn) {
      this.props.dispatch({type: HISTORY_REPLACE, path: '/søg'});
    }
  }

  render() {
    return <div>Logger ind</div>;
  }
}

export default connect(
  // Map redux state to group prop
  (state) => {
    return {profileState: state.profileReducer, routerState: state.routerReducer};
  }
)(Login);
