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

class RecommenderRow extends React.Component {
  constructor(props) {
    super(props);
    this.state = {collapsed: true};
  }
  render() {
    return (
      <div className='row recommender-row text-left'>
        <div className='col-xs-3 col-sm-2'>
          <img alt='' src={this.props.work.cover}/>
        </div>
        <div className='col-xs-9 col-sm-7'>
          <div className='title'>{this.props.work.title}</div>
          <div className='creator'>{this.props.work.creator}</div>
          <div className='description extra'>{this.props.work.description}</div>
          {!this.state.collapsed &&
            <div>
              <div className='subjects extra'>{this.props.work.subjects}</div>
              <div className='details extra'>{this.props.work.details}</div>
              <div className='extra'>
                <a href=''>Se mere på bibliotek.dk</a>
              </div>
            </div>}
          <button className='btn btn-default mt-1' onClick={() => {
            this.setState({collapsed: !this.state.collapsed});
          }}>{this.state.collapsed ? 'Mere' : 'Mindre'}</button>
        </div>
      </div>
    );
  }
}

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
          {selected &&
            <div>
              <SelectedWork work={selected}/>
              <div className='row'>
                <div className='col-xs-12 col-sm-6 question'>
                  <span>{'En af dine venner spørger dig: "Jeg har læst '}</span>
                  <span><em>{selected.title}</em></span>
                  <span>{', hvad vil du anbefale mig at læse nu?"'}</span>
                </div>
              </div>
              <div className='row'>
                <div className='col-xs-12 col-sm-6 mb-1'>
                  Vil du anbefale bøgerne i denne liste?
                </div>
              </div>
            </div>}
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
