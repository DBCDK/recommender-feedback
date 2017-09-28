'use strict';

const constants = {
  apiversion: '1',
  users: {
    table: 'users'
  }
};

module.exports = () => {
  return Object.assign({}, constants);
};
