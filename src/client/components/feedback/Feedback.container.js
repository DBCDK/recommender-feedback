import React from 'react';
import {connect} from 'react-redux';
import Rating from './Rating.component';
import {ON_RATING, HISTORY_PUSH} from '../../redux';

const SelectedWork = (props) => {
  return (
    <div className='row selected-work text-left'>
      <div className='col-xs-2 col-sm-1'>
        <img alt='' src={props.work.coverUrlThumbnail || '/default-book-cover.png'}/>
      </div>
      <div className='col-xs-10 col-sm-11'>
        <div className='title'>{props.work.dcTitle}</div>
        <div className='creator'>{props.work.creator}</div>
      </div>
    </div>
  );
};
const RecommenderList = (props) => {
  return (
    <div className='row recommender-list'>
      {props.works.map(work => <RecommenderRow
        key={work.pid}
        work={work}
        onRating={(rating) => {
          props.onRating(work.pid, rating);
        }}/>)}
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
          <img alt='' src={this.props.work.coverUrlThumbnail || '/default-book-cover.png'}/>
        </div>
        <div className='col-xs-9 col-sm-7'>
          <div className='title'>{this.props.work.dcTitle}</div>
          <div className='creator'>{this.props.work.creator}</div>
          <div className='description extra'>{this.props.work.abstract}</div>
          {!this.state.collapsed &&
            <div>
              {this.props.work.subjectDBCS && <div className='subjects extra'>{this.props.work.subjectDBCS.join(', ')}</div>}
              <div>
                {this.props.work.extent && <span>{this.props.work.extent}</span>}
                {this.props.work.publisher && <span>, {this.props.work.publisher}</span>}
                {this.props.work.date && <span> {this.props.work.date}</span>}
              </div>
              <div className='details extra'>{this.props.work.details}</div>

              <div className='extra'>
                <a target='_blank' href={`https://bibliotek.dk/linkme.php?rec.id=${encodeURIComponent(this.props.work.pid)}`}>Se mere på bibliotek.dk</a>
              </div>
            </div>}
          <button className='btn btn-default mt-1' onClick={() => {
            this.setState({collapsed: !this.state.collapsed});
          }}>{this.state.collapsed ? 'Mere' : 'Mindre'}</button>
        </div>
        <div className='col-xs-12 col-sm-3 text-right'>
          <Rating rating={this.props.work.rating} onRating={this.props.onRating}/>
        </div>
      </div>
    );
  }
}

class Feedback extends React.Component {

  onFeedbackSave = () => {
    this.props.dispatch({type: HISTORY_PUSH, path: '/tak'});
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
                  <span><em>{selected.dcTitle}</em></span>
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
          <hr className='mt-1 mb-0'/>
          {this.props.feedbackState.isFetching && <h3>Indlæser anbefalinger</h3>}
          {recommendations && recommendations.length === 0 && <h3>Der kunne ikke findes anbefalinger</h3>}
          {recommendations && <RecommenderList
            works={recommendations}
            onRating={(pid, rating) => {
              this.props.dispatch({type: ON_RATING, pid, rating});
            }}/>}
          <div className="row">
            <div className='col-xs-12 text-right'>
              <button className='btn btn-success' onClick={this.onFeedbackSave}>Gem feedback</button>
            </div>
          </div>
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
