import React from 'react';
import {connect} from 'react-redux';
import {ON_LOGOUT_REQUEST} from '../../redux';

class TopBar extends React.Component {

  onLogout = () => {
    this.props.dispatch({type: ON_LOGOUT_REQUEST});
  }

  render() {
    const user = this.props.profileState.user || 'some@email.dk';
    return (
      this.props.profileState.isLoggedIn &&
      <div className="top-bar row text-right">
        <span className="username">{user}</span>
        <span className="logout-btn" onClick={this.onLogout}>log ud</span>
      </div>
    );
  }

}

export default connect(
  // Map redux state to group prop
  (state) => {
    return {profileState: state.profileReducer};
  }
)(TopBar);
