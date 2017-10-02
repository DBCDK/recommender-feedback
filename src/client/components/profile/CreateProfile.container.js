import React from 'react';
import {connect} from 'react-redux';
import CreateProfileForm from './CreateProfileForm.component';
import {ON_PROFILE_CREATE_REQUEST} from '../../redux';

class CreateProfile extends React.Component {

  render() {
    return (
      <div className="login--container container col-md-6 col-centered">
        <h2 className="title--thin text-center">Test af anbefalinger</h2>

        <div className='row'>
          <div className="login--description">
            <p>
              Vi vil bede dig om at give feedback på vores anbefalinger.
              Det gør du ved at give os respons på, hvad du mener er en god anbefaling, i stedet for hvad du mener er en god bog.
              Med andre ord: giver anbefalingen mening i forhold til den bog, de er lavet på baggrund af?
            </p>
            <p>
              Gør følgende:
            </p>
            <ol>
              <li>Opret profil ved at indtaste din email i nedenstående formular.</li>
              <li>Vi sender et link til din email, som du skal benytte fremover, når du vil give feedback på anbefalinger.</li>
              <li>Søg et værk frem, som skal danne udgangspunkt for anbefalingerne.</li>
              <li>Gennemgå listerne med anbefalinger fra tre forskellige systemer og giv os feedback både på listerne som helhed og på de enkelte værker.</li>
            </ol>
          </div>
        </div>
        {!this.props.profileState.isCreated && <CreateProfileForm
          onSubmitEmail={email => {
            this.props.dispatch({type: ON_PROFILE_CREATE_REQUEST, email});
          }}/>}
        {this.props.profileState.isCreated &&
          <div className='text-center'>
            <h3>Et link er sendt til {this.props.profileState.email}</h3>
          </div>}
      </div>
    );
  }
}

export default connect(
  // Map redux state to group prop
  (state) => {
    return {profileState: state.profileReducer};
  }
)(CreateProfile);
