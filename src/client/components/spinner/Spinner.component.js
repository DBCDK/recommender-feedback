import React from 'react';

export default class Spinner extends React.Component {
  render() {
    return <div style={{textAlign: 'center'}}><span style={{borderLeftColor: 'black'}} className="spinner"></span></div>;
  }
}

Spinner.propTypes = {};
