import React from 'react';
import {connect} from 'react-redux';

class TopBar extends React.Component {

  onLogout = () => {
    this.props.dispatch({type: 'ON_LOGOUT'});
    document.location.href = '/tilmeld';
  }

  render() {
    const user = this.props.user || 'some@email.dk';
    return (
      <div className="top-bar row text-left">
        <span className="description">Du er logget ind som </span>
        <span className="username">{user}</span>
        <button className="btn" onClick={this.onLogout}>log ud</button>
      </div>
    );
  }

}

export default connect(
  // Map redux state to group prop
  (state) => {
    return {state};
  }
)(TopBar);
