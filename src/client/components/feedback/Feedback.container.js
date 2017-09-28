import React from 'react';
import {connect} from 'react-redux';

const SelectedWork = (props) => {
  return (
    <div className='row selected-work text-left'>
      <div className='col-xs-2 col-sm-1'>
        <img alt='' src={props.work.cover}/>
      </div>
      <div className='col-xs-10 col-sm-11'>
        <div className='title'>{props.work.title}</div>
        <div className='creator'>{props.work.creator}</div>
      </div>
    </div>
  );
};
const RecommenderList = (props) => {
  return (
    <div className='row recommender-list'>
      {props.works.map(work => <RecommenderRow key={work.pid} work={work}/>)}
    </div>
  );
};
const RecommenderRow = (props) => {
  return (
    <div className='row recommender-row text-left'>
      <div className='col-xs-3 col-sm-2'>
        <img alt='' src={props.work.cover}/>
      </div>
      <div className='col-xs-9 col-sm-7'>
        <div className='title'>{props.work.title}</div>
        <div className='creator'>{props.work.creator}</div>
        <div className='description extra'>{props.work.description}</div>
        <div className='subjects extra'>{props.work.subjects}</div>
        <div className='details extra'>{props.work.details}</div>
        <div className='extra'>
          <a href=''>Se mere på bibliotek.dk</a>
        </div>
      </div>
    </div>
  );
};

class Feedback extends React.Component {

  onFeedbackSave = () => {
    this.props.dispatch({type: 'ON_FEEDBACK_SAVE'});
  }

  render() {
    const selected = this.props.feedbackState.work;
    const recommendations = this.props.feedbackState.recommendations;

    return (
      <div className='row feedback--container'>
        <div className='col-md-8 col-centered'>
          <h2 className='title--thin text-center'>Her er anbefalinger for</h2>
          {selected && <SelectedWork work={selected}/>}
          <div className="row">
            <div className='col-xs-12 text-right'>
              <button className='btn btn-success' onClick={this.onFeedbackSave}>Gem feedback</button>
            </div>
          </div>
          <br/>
          <hr/>
          {this.props.feedbackState.isFetching && <h3>Indlæser anbefalinger</h3>}
          {recommendations && <RecommenderList works={recommendations}/>}
        </div>
      </div>
    );
  }

}
export default connect(
  // Map redux state to group prop
  (state) => {
    return {feedbackState: state.feedbackReducer};
  }
)(Feedback);
