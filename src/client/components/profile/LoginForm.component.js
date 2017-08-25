import React from 'react';

export default class LoginForm extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: ''
    };
  }

  render() {
    return (
      <div className='row'>
        <div className="login--form text-left">
          <h4>Log ind med din email</h4>
          <div className='row'>
            <div className='row'>
              <div className="col-md-8">
                <input
                  type="Email"
                  className="form-control"
                  id="email-input"
                  placeholder="Email"
                  onChange={(e) => {this.setState({email: e.target.value})}}
                />
              </div>
            </div>
            <div className='row'>
              <div className="col-md-8">
                <input
                  type="Password"
                  className="form-control"
                  id="email-input"
                  placeholder="Password"
                  onChange={(e) => {
                    // Probably don't wanna see password in plain text in log
                    this.setState({password: e.target.value})
                  }}
                />
              </div>
              <div className="col-md-4">
                <button type="submit" className="btn btn-primary btn-block"
                  onClick={() => {
                    this.props.onLogin(this.state.email, this.state.password);
                  }}>Login</button>
              </div>
              <div className="text-left">
                <button type="button" className="btn btn-link" onClick={this.props.createUser}>
                  Opret bruger
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

}
