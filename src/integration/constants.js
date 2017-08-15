'use strict';

const constants = {
  // Must be the service name defined in docker-compose.integration.
  webAppServiceName: 'webapp',
  port: 3000
};

module.exports = () => {
  return Object.assign({}, constants);
};
