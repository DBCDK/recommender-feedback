import {combineReducers} from 'redux';

// constants
export const ON_PROFILE_CREATE_REQUEST = 'ON_PROFILE_CREATE_REQUEST';
export const ON_PROFILE_CREATE_RESPONSE = 'ON_PROFILE_CREATE_RESPONSE';
export const ON_LOGIN_REQUEST = 'ON_LOGIN_REQUEST';
export const ON_LOGIN_RESPONSE = 'ON_LOGIN_RESPONSE';
export const ON_LOGOUT_REQUEST = 'ON_LOGOUT_REQUEST';

export const HISTORY_PUSH = 'HISTORY_PUSH';
export const HISTORY_REPLACE = 'HISTORY_REPLACE';
export const ON_LOCATION_CHANGE = 'ON_LOCATION_CHANGE';

// middleware
export const requestMiddleware = store => next => action => {
  switch (action.type) {
    case ON_PROFILE_CREATE_REQUEST:
      // here we want to actually call endpoint
      window.setTimeout(() => {
        store.dispatch({type: ON_PROFILE_CREATE_RESPONSE,
          email: action.email,
          profileId: '234fgh45'});
      }, 500);
      return next(action);

    case ON_LOGIN_REQUEST:
      // here we want to actually call endpoint
      window.setTimeout(() => {
        store.dispatch({type: ON_LOGIN_RESPONSE,
          email: 'some@dbc.dk',
          profileId: '234fgh45'});
      }, 500);
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


// reducers
const defaultProfileState = {
  isFetching: false,
  isLoggedIn: false,
  isCreated: false,
  profileId: null,
  email: null
};

const profileReducer = (state = defaultProfileState, action) => {
  switch (action.type) {
    case ON_PROFILE_CREATE_RESPONSE:
      return Object.assign({}, defaultProfileState, {isCreated: true, email: action.email});
    case ON_LOGIN_REQUEST:
      return Object.assign({}, defaultProfileState, {isFetching: true});
    case ON_LOGIN_RESPONSE:
      return {
        isFetching: false,
        isLoggedIn: action.email !== '',
        profileId: action.profileId,
        email: null
      };
    case ON_LOGOUT_REQUEST:
      return defaultProfileState;
    default:
      return state;
  }
};
const PARAMS_REGEX = /[?&](\w*)=(\w*)/g;
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

const combined = combineReducers({
  profileReducer,
  routerReducer
});

export const rootReducer = (state = {}, action) => {
  return combined(state, action);
};
