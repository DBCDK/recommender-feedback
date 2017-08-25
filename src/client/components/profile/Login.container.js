import React from 'react';
import {connect} from 'react-redux';
import LoginForm from './LoginForm.component';

class CreateProfile extends React.Component {

  render() {
    console.log('render');
    return (
      <div className="login--container container col-md-6 col-centered">
        <h2 className="title--thin text-center">Test af anbefalinger</h2>

        <div className='row'>
          <div className="login--description">
            <p>
              Vi vil bede dig om at give feedback på vores anbefalingsalgoritmer.
              Det betyder, at du skal give os respons på, hvad du mener er en god anbefaling, i stedet for hvad du mener er en god bog.
              Med andre ord: giver anbefalingen mening i forhold til den bog, de er lavet på baggrund af?
            </p>
            <p>
              Du skal gøre følgende:
            </p>
            <ol>
              <li>Log ind med din emailadresse</li>
              <li>Søg et værk frem, som skal danne udgangspunkt for anbefalingerne.</li>
              <li>Gennemgå listerne med anbefalinger fra tre forskellige systemer og giv os feedback både på listerne som helhed og på de enkelte værker.</li>
            </ol>
          </div>
        </div>
        <LoginForm
          createUser={()=>{
            this.props.dispatch({type: 'CHANGE_PAGE', page: 'CREATE_USER'});
          }}
          onLogin={(username, password) => {
            console.log('blah');
            this.props.dispatch({type: 'LOGIN', username, password});
          }}/>

      </div>
    );
  }
}

export default connect(
  // Map redux state to group prop
  (state) => {
    return {state};
  }
)(CreateProfile);
