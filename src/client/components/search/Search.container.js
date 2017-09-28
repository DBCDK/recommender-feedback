import React from 'react';
import {connect} from 'react-redux';

const WorkList = (props) => {
  return (
    <div className='row work-list'>
      {props.works.map((work, idx) => <WorkRow key={idx} work={work} onWorkSelect={props.onWorkSelect}/>)}
    </div>
  );
};

const WorkRow = (props) => {
  return (
    <div className='row work-row text-left' onClick={
      () => {
        props.onWorkSelect(props.work);
      }
    }>
      <div className='col-xs-3 col-sm-2'>
        <img alt='' src={props.work.cover}/>
      </div>
      <div className='col-xs-9 col-sm-10'>
        <div className='title'>{props.work.title}</div>
        <div className='creator'>{props.work.creator}</div>
      </div>
    </div>
  );
};

const SearchForm = (props) => {
  return (
    <div className='row search-form'>
      <div className='col-sm-10'>
        <input
          type="text"
          className="form-control"
          id="search-input"
          placeholder="Søg"
          onChange={
            (e) => {
              props.onQueryChange(e.target.value);
            }
          }
          value={props.value}
        />
      </div>
      <div className='col-sm-2'>
        <button type="submit" className="btn btn-primary btn-block"
          onClick={props.onSearch}>
          Søg
        </button>
      </div>
    </div>
  );
};

class Search extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      query: ''
    };
  }

  onWorkSelect = (work) => {
    this.props.dispatch({type: 'ON_WORK_SELECT', work});
  };

  onSearch = () => {
    this.props.dispatch({type: 'ON_SEARCH', query: this.state.query});
  };

  onQueryChange = (query) => {
    this.setState({query});
  };

  render() {
    const dummyWorkList = [
      {pid: 'somepid1', title: 'hest', creator: 'Ole Z.', cover: 'https://images.gr-assets.com/books/1447303603l/2767052.jpg'},
      {pid: 'somepid2', title: 'hest2', creator: 'Ole B.', cover: 'https://images.gr-assets.com/books/1447303603l/2767052.jpg'},
      {pid: 'somepid3', title: 'hest3', creator: 'Ole B.', cover: 'https://images.gr-assets.com/books/1447303603l/2767052.jpg'}
    ];

    return (
      <div className='row search--container'>
        <div className='col-md-8 col-centered'>
          <h2 className='title--thin text-center'>Hvilken bog vil du se anbefalinger for?</h2>
          <SearchForm
            onSearch={this.onSearch}
            onQueryChange={this.onQueryChange}
            value={this.state.query}/>
          <WorkList works={dummyWorkList} onWorkSelect={this.onWorkSelect}/>
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
)(Search);
