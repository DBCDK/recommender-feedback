import React from 'react';

export default class Spinner extends React.Component {
  render() {
    return <div style={{textAlign: 'center'}}><div style={{borderLeftColor: 'black'}} className="spinner">Loading...</div></div>;
  }
}

Spinner.propTypes = {};
