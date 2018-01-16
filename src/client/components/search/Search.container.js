import React from 'react';
import {connect} from 'react-redux';
import {ON_SEARCH_REQUEST, ON_SUGGEST_REQUEST, HISTORY_PUSH, ON_RECOMMEND_REQUEST} from '../../redux';
import Spinner from '../spinner/Spinner.component';

const MIN_SUGGEST_QUERY_LENGTH = 3;

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
        <span className='glyphicon glyphicon-chevron-right' style={{float: 'right'}}></span>
      </div>
    </div>
  );
};

const SearchForm = (props) => {
  const numSuggestions = props.suggestions ? props.suggestions.titles.length + props.suggestions.creators.length : 0;
  const showSuggestions = props.focusValue && numSuggestions > 0;
  const handleSuggestPress = (suggestion) => {
    props.onQueryChange(suggestion.term);
    props.onSearch();
  };

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
            placeholder="Søg på titel eller forfatter"
            onChange={
              (e) => {
                props.onQueryChange(e.target.value);
              }
            }
            onKeyDown={e => {
              if (e.keyCode === 38) {
                // up
                if (showSuggestions) {
                  props.onHoverChange(Math.max(0, props.hoverIndex -1));
                }
                e.preventDefault();
              }
              else if (e.keyCode === 40) {
                // down
                if (showSuggestions) {
                  props.onHoverChange(Math.min(numSuggestions-1, props.hoverIndex +1));
                }
                e.preventDefault();
              }
            }}
            onFocus={props.onFocus}
            onBlur={props.onBlur}
            value={props.value}
            autoComplete='off'
          />
          {showSuggestions && <div className='autocomplete panel panel-default drop-shadow col-xs-8'>
            {props.suggestions.titles.length > 0 &&
              <div>
                <h4>Titler</h4>
                <ul>
                  {props.suggestions.titles.map((s, idx) => {
                    const className = props.hoverIndex === idx ? 'hover' : null;
                    return <li
                      onMouseOver={() => {
                        props.onHoverChange(idx);
                      }}
                      onClick={() => handleSuggestPress(s)}
                      className={className} key={s.term+idx}>{s.term}
                    </li>;
                  })}
                </ul>
              </div>}
            {props.suggestions.creators.length > 0 &&
              <div>
                <h4>Forfattere</h4>
                <ul>
                  {props.suggestions.creators.map((s, idx) => {
                    const id = idx + props.suggestions.titles.length;
                    const className = props.hoverIndex === id ? 'hover' : null;
                    return <li
                      onMouseOver={() => {
                        props.onHoverChange(id);
                      }}
                      onClick={() => handleSuggestPress(s)}
                      className={className} key={s.term+id}>{s.term}
                    </li>;
                  })}
                </ul>
              </div>}
          </div>}
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
      query: '',
      focusValue: false,
      hoverIndex: -1
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
    if (query.length >= MIN_SUGGEST_QUERY_LENGTH) {
      this.props.dispatch({type: ON_SUGGEST_REQUEST, query: this.state.query});
    }
    this.setState({query, hoverIndex: -1});
  };

  render() {
    return (
      <div className='row search--container'>
        <div className='col-md-8 col-centered'>
          <h2 className='title--thin text-center'>Hvilken bog vil du se forslag for?</h2>
          <p className='mt-4'>Søg et værk frem (fra før 2016), som skal danne udgangspunkt for forslagene.</p>
          <SearchForm
            onSearch={this.onSearch}
            onQueryChange={this.onQueryChange}
            value={this.state.query}
            suggestions={this.state.query.length >= MIN_SUGGEST_QUERY_LENGTH ? this.props.searchState.suggestions : null}
            hoverIndex={this.state.hoverIndex}
            onFocus={() => {
              this.setState({searchFocus: true});
            }}
            onBlur={() => {
              // Hack to get suggest onClick to work
              // tried using onMouseDown/onTouchDown, but was not satisfactory
              setTimeout(() => {
                this.setState({searchFocus: false});
              }, 200);
            }}
            focusValue={this.state.searchFocus}
            onHoverChange={hoverIndex => {
              const allSuggestions = [...this.props.searchState.suggestions.titles, ...this.props.searchState.suggestions.creators];
              const query = allSuggestions[hoverIndex].term;
              this.setState({hoverIndex, query});
            }}/>
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
