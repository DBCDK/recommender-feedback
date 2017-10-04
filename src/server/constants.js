'use strict';

const constants = {
  apiversion: '1',
  users: {
    table: 'users'
  },
  login: {
    table: 'login'
  }
};

module.exports = () => {
  return Object.assign({}, constants);
};
