import React from 'react';
import {connect} from 'react-redux';
import {ON_SEARCH_REQUEST, HISTORY_PUSH, ON_RECOMMEND_REQUEST} from '../../redux';
import Spinner from '../spinner/Spinner.component';

const WorkList = (props) => {
  return (
    <div className='row work-list'>
      {props.works.map(work => <WorkRow key={work.pid} work={work} onWorkSelect={props.onWorkSelect}/>)}
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
        <img alt='' src={props.work.coverUrlThumbnail || '/default-book-cover.png'}/>
      </div>
      <div className='col-xs-8 col-sm-9'>
        <div className='title'>{props.work.dcTitle}</div>
        <div className='creator'>{props.work.creator}</div>
      </div>
      <div className='col-xs-1 arrow'>
        <span style={{float: 'right'}}>></span>
      </div>
    </div>
  );
};

const SearchForm = (props) => {
  return (
    <div className='row search-form'>
      <form onSubmit={event => {
        props.onSearch();
        event.preventDefault();
      }}>
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
          <button type="submit" className="btn btn-primary btn-block">
            Søg
          </button>
        </div>
      </form>
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
    this.props.dispatch({type: ON_RECOMMEND_REQUEST, work});
    this.props.dispatch({type: HISTORY_PUSH, path: '/feedback'});
  };

  onSearch = () => {
    this.props.dispatch({type: ON_SEARCH_REQUEST, query: this.state.query});
  };

  onQueryChange = (query) => {
    this.setState({query});
  };

  render() {
    return (
      <div className='row search--container'>
        <div className='col-md-8 col-centered'>
          <h2 className='title--thin text-center'>Hvilken bog vil du se anbefalinger for?</h2>
          <SearchForm
            onSearch={this.onSearch}
            onQueryChange={this.onQueryChange}
            value={this.state.query}/>
          {this.props.searchState.isFetching && <Spinner/>}
          {this.props.searchState.works && this.props.searchState.works.length === 0 && <h3>Søgning gav tomt resultat</h3>}
          {this.props.searchState.works && <WorkList works={this.props.searchState.works} onWorkSelect={this.onWorkSelect}/>}
        </div>
      </div>
    );
  }

}
export default connect(
  // Map redux state to group prop
  (state) => {
    return {searchState: state.searchReducer};
  }
)(Search);
