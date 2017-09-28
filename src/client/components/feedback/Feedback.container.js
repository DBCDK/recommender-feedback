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
      {props.works.map((work, idx) => <RecommenderRow key={idx} work={work}/>)}
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
    const selected = {
      pid: 'somepid1',
      title: 'hest',
      creator: 'Ole Z.',
      cover: 'https://images.gr-assets.com/books/1447303603l/2767052.jpg'
    };

    const recommendations = [
      {
        pid: 'somepid1',
        title: 'hest',
        creator: 'Ole Z.',
        cover: 'https://images.gr-assets.com/books/1447303603l/2767052.jpg',
        description: 'Det er en bog om kærlighed og heste og blabel bla b la bla b lba lbal b al bal oh bla bla',
        subjects: 'Kærlighed, krig, fred, heste',
        details: '138 sider. Udgivet af Blah.'
      },
      {pid: 'somepid2', title: 'hest2', creator: 'Ole B.', cover: 'https://images.gr-assets.com/books/1447303603l/2767052.jpg'},
      {pid: 'somepid3', title: 'hest3', creator: 'Ole B.', cover: 'https://images.gr-assets.com/books/1447303603l/2767052.jpg'}
    ];

    return (
      <div className='row feedback--container'>
        <div className='col-md-8 col-centered'>
          <h2 className='title--thin text-center'>Her er anbefalinger for</h2>
          <SelectedWork work={selected}/>
          <div className="row">
            <div className='col-xs-12 text-right'>
              <button className='btn btn-success' onClick={this.onFeedbackSave}>Gem feedback</button>
            </div>
          </div>
          <br/>
          <hr/>
          <RecommenderList works={recommendations}/>
        </div>
      </div>
    );
  }

}
export default connect(
  // Map redux state to group prop
  (state) => {
    return {state};
  }
)(Feedback);
