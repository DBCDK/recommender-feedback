'use strict';

const config = require('./config');
const server = require('server/public-server');
const logger = require('__/logging')(config.logger);

const serverListener = server.listen(config.server.port, () => {
  logger.log.info('Service runs', {
    hostname: config.server.hostname,
    status: 'Service up',
    pid: process.pid,
    port: serverListener.address().port
  });
});
