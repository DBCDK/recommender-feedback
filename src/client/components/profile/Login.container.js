import React from 'react';
import {connect} from 'react-redux';
import CreateProfileForm from './CreateProfileForm.component';
import {ON_LOGIN_REQUEST, ON_PROFILE_CREATE_REQUEST, HISTORY_REPLACE} from '../../redux';

class Login extends React.Component {

  componentDidMount() {
    if (this.props.profileState.status === 'IS_LOGGED_IN') {
      this.props.dispatch({type: HISTORY_REPLACE, path: '/søg'});
    }
    else {
      const urlParams = this.props.routerState.params;
      if (urlParams.token && urlParams.token.length > 0) {
        this.props.dispatch({type: ON_LOGIN_REQUEST, token: urlParams.token[0]});
      }
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.profileState.status === 'IS_LOGGED_IN') {
      this.props.dispatch({type: HISTORY_REPLACE, path: '/søg'});
    }
  }

  render() {
    return (<div className='container col-md-6 col-centered text-center'>
      {this.props.profileState.status === 'FETCHING' && <h3>Logger ind</h3>}
      {this.props.profileState.status === 'LOGIN_FAILED' &&
      <div>
        <h3>Ugyldig token</h3>
        <CreateProfileForm
          onSubmitEmail={email => {
            this.props.dispatch({type: ON_PROFILE_CREATE_REQUEST, email});
          }}/>
      </div>}
      {this.props.profileState.status === 'CREATED' &&
        <div className='text-center'>
          <h3>Et link er sendt til {this.props.profileState.email}</h3>
        </div>}
    </div>);
  }
}

export default connect(
  // Map redux state to group prop
  (state) => {
    return {profileState: state.profileReducer, routerState: state.routerReducer};
  }
)(Login);
