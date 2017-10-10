import {combineReducers} from 'redux';
import request from 'superagent';

// constants
export const ON_PROFILE_CREATE_REQUEST = 'ON_PROFILE_CREATE_REQUEST';
export const ON_PROFILE_CREATE_RESPONSE = 'ON_PROFILE_CREATE_RESPONSE';
export const ON_LOGIN_REQUEST = 'ON_LOGIN_REQUEST';
export const ON_LOGIN_RESPONSE = 'ON_LOGIN_RESPONSE';
export const ON_LOGOUT_REQUEST = 'ON_LOGOUT_REQUEST';

export const ON_SEARCH_REQUEST = 'ON_SEARCH_REQUEST';
export const ON_SEARCH_RESPONSE = 'ON_SEARCH_RESPONSE';

export const ON_RECOMMEND_REQUEST = 'ON_RECOMMEND_REQUEST';
export const ON_RECOMMEND_RESPONSE = 'ON_RECOMMEND_RESPONSE';
export const ON_RATING = 'ON_RATING';

export const HISTORY_PUSH = 'HISTORY_PUSH';
export const HISTORY_REPLACE = 'HISTORY_REPLACE';
export const ON_LOCATION_CHANGE = 'ON_LOCATION_CHANGE';

// default states
const defaultProfileState = {
  status: 'IS_NOT_LOGGED_IN',
  uuid: null,
  email: null,
  time: 0
};
const defaultSearchState = {
  isFetching: false,
  works: null
};
const defaultFeedbackState = {
  isFetching: false,
  work: null,
  recommendations: null
};

// reducers
const profileReducer = (state = defaultProfileState, action) => {
  switch (action.type) {
    case ON_PROFILE_CREATE_RESPONSE:
      return Object.assign({}, defaultProfileState, {status: 'CREATED', email: action.email, time: new Date().getTime()});
    case ON_LOGIN_REQUEST:
      return Object.assign({}, defaultProfileState, {status: 'FETCHING', time: new Date().getTime()});
    case ON_LOGIN_RESPONSE:
      return {
        status: action.email ? 'IS_LOGGED_IN' : 'LOGIN_FAILED',
        uuid: action.uuid,
        email: action.email,
        time: new Date().getTime()
      };
    case ON_LOGOUT_REQUEST:
      return Object.assign({}, defaultProfileState, {time: new Date().getTime()});
    default:
      return state;
  }
};
const PARAMS_REGEX = /[?&](\w*)=([\w-]*)/g;
const routerReducer = (state = {}, action) => {
  switch (action.type) {
    case ON_LOCATION_CHANGE: {
      const params = {};
      let regexResult;
      // eslint-disable-next-line
      while ((regexResult = PARAMS_REGEX.exec(action.location.search)) !== null) {
        const key = regexResult[1];
        const value = regexResult[2];
        if (!params[key]) {
          params[key] = [];
        }
        params[key].push(value);
      }
      return {path: action.path, params};
    }
    default:
      return state;
  }
};
const searchReducer = (state = defaultSearchState, action) => {
  switch (action.type) {
    case ON_SEARCH_REQUEST:
      return Object.assign({}, defaultSearchState, {isFetching: true});
    case ON_SEARCH_RESPONSE:
      return {isFetching: false, works: action.works};
    default:
      return state;
  }
};
const feedbackReducer = (state = defaultFeedbackState, action) => {
  switch (action.type) {
    case ON_RECOMMEND_REQUEST:
      return Object.assign({}, defaultFeedbackState, {isFetching: true, work: action.work});
    case ON_RECOMMEND_RESPONSE:
      return Object.assign({}, state, {isFetching: false, recommendations: action.works});
    case ON_RATING: {
      const recommendations = state.recommendations.map(work => {
        if (work.pid === action.pid) {
          return Object.assign({}, work, {rating: action.rating});
        }
        return work;
      });
      return Object.assign({}, state, {recommendations});
    }
    default:
      return state;
  }
};
const LOCAL_STORAGE_KEY = 'recommender-feedback';
const getLocalStorage = (storage) => {
  const storageString = storage.getItem(LOCAL_STORAGE_KEY);
  return (storageString && JSON.parse(storageString)) || {};
};

const setLocalStorage = (state, storage) => {
  storage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(state));
};
const combined = combineReducers({
  profileReducer,
  routerReducer,
  searchReducer,
  feedbackReducer
});

export const rootReducer = (state = Object.assign(getLocalStorage(sessionStorage), getLocalStorage(localStorage)), action) => {
  let newState = combined(state, action);
  setLocalStorage(newState, sessionStorage);
  return newState;
};

// middleware
export const requestMiddleware = store => next => action => {
  switch (action.type) {
    case ON_PROFILE_CREATE_REQUEST:
      request.post('/v1/users')
        .send({email: action.email})
        .then(() => {
          store.dispatch({type: ON_PROFILE_CREATE_RESPONSE,
            email: action.email});
        })
        .catch(() => {

        });
      return next(action);

    case ON_LOGIN_REQUEST:
      request.post('/v1/login')
        .send({token: action.token})
        .then(res => {
          store.dispatch({type: ON_LOGIN_RESPONSE,
            email: res.body.data.email,
            uuid: res.body.data.uuid});
        })
        .catch(() => {
          store.dispatch({type: ON_LOGIN_RESPONSE});
        });
      return next(action);

    case ON_SEARCH_REQUEST:
      request.get('/v1/search')
        .query({query: `'${action.query}'`})
        .then(res => {
          store.dispatch({type: ON_SEARCH_RESPONSE,
            works: res.body.data
          });
        })
        .catch(() => {
          store.dispatch({type: ON_SEARCH_RESPONSE,
            works: []
          });
        });
      return next(action);

    case ON_RECOMMEND_REQUEST:
      request.get('/v1/recommend')
        .query({pid: action.work.pid[0]})
        .then(res => {
          store.dispatch({type: ON_RECOMMEND_RESPONSE,
            works: res.body.data
          });
        })
        .catch(() => {
          store.dispatch({type: ON_RECOMMEND_RESPONSE,
            works: []
          });
        });
      return next(action);

    default:
      return next(action);
  }
};
export const loggerMiddleware = store => next => action => {
  try {
    const res = next(action);
    // eslint-disable-next-line
    console.log(action.type, {action, nextState: store.getState()});
    return res;
  }
  catch (error) {
    // eslint-disable-next-line
    console.log('Action failed', {action, error});
  }
};

/** Handle profile state across browser tabs.
 * For instance if profile is logged out in one tab
 * we want the other tabs to log out as well
 */
export const profileMiddleware = store => next => action => {
  const res = next(action);
  const nextState = store.getState();
  const localStorageState = getLocalStorage(localStorage);

  // Check if we have been logged out in another tab
  if (localStorageState && localStorageState.profileReducer
      && localStorageState.profileReducer.time > nextState.profileReducer.time
      && localStorageState.profileReducer.status === 'IS_NOT_LOGGED_IN') {
    store.dispatch({type: ON_LOGOUT_REQUEST});
  }

  setLocalStorage({profileReducer: nextState.profileReducer}, localStorage);
  return res;
};

const paramsToString = (params) => {
  let res = '';
  Object.keys(params).forEach(key => {
    if (Array.isArray(params[key])) {
      params[key].forEach(value => {
        const separator = res === '' ? '?' : '&';
        res += `${separator}${key}=${value}`;
      });
    }
    else {
      const separator = res === '' ? '?' : '&';
      res += `${separator}${key}=${params[key]}`;
    }
  });
  return res;
};
export const historyMiddleware = history => store => next => action => {
  switch (action.type) {
    case HISTORY_PUSH:
      if (store.getState().routerReducer.path !== action.path) {
        const paramsString = action.params ? paramsToString(action.params) : '';
        history.push(action.path + paramsString);
        window.scrollTo(0, 0);
      }
      break;
    case HISTORY_REPLACE: {
      const paramsString = action.params ? paramsToString(action.params) : '';
      history.replace(action.path + paramsString);
      window.scrollTo(0, 0);
      break;
    }
    default:
      return next(action);
  }
};
