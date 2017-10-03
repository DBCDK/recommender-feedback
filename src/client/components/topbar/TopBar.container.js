import React from 'react';
import {connect} from 'react-redux';
import {ON_LOGOUT_REQUEST, HISTORY_REPLACE} from '../../redux';

class TopBar extends React.Component {

  onLogout = () => {
    this.props.dispatch({type: ON_LOGOUT_REQUEST});
  }

  render() {
    const user = this.props.profileState.user || 'some@email.dk';
    let backBtn = null;
    if (this.props.routerState.path === '/feedback') {
      backBtn = <span className='back-btn' onClick={() => {
        this.props.dispatch({type: HISTORY_REPLACE, path: '/søg'});
      }}>
        <span className='glyphicon glyphicon-chevron-left'/>
        {'FIND BOG'}
      </span>;
    }
    return (
      this.props.profileState.isLoggedIn &&
      <div className='top-bar row'>
        <div className="text-left col-xs-4">
          {backBtn}
        </div>
        <div className="text-right col-xs-8">
          <span className="username">{user}</span>
          <span className="logout-btn" onClick={this.onLogout}>log ud</span>
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
)(TopBar);
