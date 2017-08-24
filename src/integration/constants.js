'use strict';

const constants = {
  // Must be the service name and port defined in docker-compose.integration.
  webAppServiceName: 'webapp',
  port: 3001
};

module.exports = () => {
  return Object.assign({}, constants);
};
