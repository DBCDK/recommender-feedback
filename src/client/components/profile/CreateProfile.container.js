import React from 'react';
import {connect} from 'react-redux';
import CreateProfileForm from './CreateProfileForm.component';
import {ON_PROFILE_CREATE_REQUEST} from '../../redux';

class CreateProfile extends React.Component {

  render() {
    return (
      <div className="login--container container col-md-6 col-centered">
        <h2 className="title--thin text-center">Giver vi gode forslag til læsning?</h2>

        <div className='row'>
          <div className="login--description">
            <p>
              Vi vil bede dig om at give feedback på vores forslag til læsning.
              Det gør du ved at svare på, om de forslag, du får om lidt, er gode.
              Du skal ikke vurdere bøger, men forslag til læsning.
              Med andre ord: giver forslaget mening i forhold til den bog, der har inspireret forslaget?
            </p>
            <p>
              Sådan gør du:
            </p>
            <ol>
              <li>Log ind ved at indtaste din emailadresse i nedenstående felt, og følg det tilsendte link.</li>
              <li>Søg et værk frem, som skal danne udgangspunkt for forslagene.</li>
              <li>Gennemgå forslagene, og giv os feedback på, hvor gode de enkelte forslag er.</li>
            </ol>
            <p className='mt-4'>Gennemgå processen med så mange værker, du har lyst til. Jo flere des bedre.</p>
          </div>
        </div>
        {this.props.profileState.status !== 'CREATED' && <CreateProfileForm
          onSubmitEmail={email => {
            this.props.dispatch({type: ON_PROFILE_CREATE_REQUEST, email});
          }}/>}
        {this.props.profileState.status === 'CREATED' &&
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
