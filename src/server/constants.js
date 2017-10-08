'use strict';

const constants = {
  apiversion: '1',
  users: {
    table: 'users'
  },
  login: {
    table: 'login'
  },
  feedback: {
    table: 'feedback'
  }

};

module.exports = () => {
  return Object.assign({}, constants);
};
