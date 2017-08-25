import React from 'react';
import {connect} from 'react-redux';

class Feedback extends React.Component {

  render() {
    return (
      <div>Giv feedback her</div>
    );
  }

}
export default connect(
  // Map redux state to group prop
  (state) => {
    return {state};
  }
)(Feedback);
