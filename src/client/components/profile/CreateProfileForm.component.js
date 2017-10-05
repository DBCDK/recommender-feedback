import React from 'react';

export default class CreateProfileForm extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      email: ''
    };
  }

  render() {
    return (
      <div className='row well create-profile--form text-left'>
        <h4>Log ind med email</h4>
        <form onSubmit={event => {
          if (this.state.email) {
            this.props.onSubmitEmail(this.state.email);
          }
          event.preventDefault();
        }}>
          <div className="col-xs-12 col-sm-8">
            <input
              type='Email'
              className={'form-control'}
              id='email-input'
              placeholder='Email'
              onChange={
                (e) => {
                  this.setState({email: e.target.value});
                }
              }
            />
          </div>
          <div className="col-xs-12 col-sm-4">
            <button type="submit" className="btn btn-primary btn-block">
              Send engangs-login
            </button>
          </div>
        </form>
      </div>
    );
  }

}
