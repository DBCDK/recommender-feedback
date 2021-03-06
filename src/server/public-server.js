'use strict';

/*
 * Configuration
 */
const config = require('server/config');
const constants = require('server/constants')();

/*
 * Logging & stuff.
 */
const logger = require('__/logging')(config.logger);
const _ = require('lodash');

/**
 * Database wrapper.
 */
const database = require('server/database');

/*
 * Web server.
 */
const express = require('express');
const app = express();

/*
 * Static frontend content.
 */
const path = require('path');
const staticPath = path.join(__dirname, '..', '..', 'build');
app.use(express.static(staticPath));

/*
 * Securing headers.
 */
const helmet = require('helmet');
app.use(helmet());

/*
 * All request bodies must be JSON.
 */
const parser = require('body-parser');
app.use(parser.json({
  type: 'application/json',
  // Allow lone values.
  strict: false
}));

/*
 * Administrative API.
 */
app.get('/howru', async(req, res) => {
  const ok = await database.testingConnection();
  const configWithouSecrets = _.omit(config, [
    'db.connection.user',
    'db.connection.password',
    'openPlatform.smaug.clientId',
    'openPlatform.smaug.clientSecret'
  ]);
  if (ok) {
    return res.json({
      ok: true,
      version: require('../../package').version,
      'api-version': constants.apiversion,
      hostname: req.hostname,
      address: req.ip,
      config: configWithouSecrets
    });
  }
  res.json({
    ok: false,
    errorText: database.getCurrentError(),
    errorLog: database.getErrorLog(),
    version: require('../../package').version,
    'api-version': constants.apiversion,
    hostname: req.hostname,
    address: req.ip,
    config: configWithouSecrets
  });
});

app.get('/pid', (req, res) => {
  res.type('text/plain');
  res.send(process.pid.toString());
});

/*
 * API routes.
 */
const apiRoutes = require('server/api-v1');
app.use('/v1', apiRoutes);

/*
 * Let frontend React handle all other routes.
 */
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '..', '..', 'build', 'index.html'));
});

/*
 * Error handlers.
 */
app.use((req, res, next) => {
  next({
    status: 404,
    title: 'Unknown endpoint',
    meta: {resource: req.path}
  });
});

app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    next({
      status: err.status,
      title: 'Malformed body',
      detail: 'JSON syntax error',
      meta: {body: err.body}
    });
  }
  else {
    next(err);
  }
});

/*
 * General error handler.
 *
 * err properties supported (in accordance with http://jsonapi.org/format/#errors):
 * @param {status} HTTP status code to return.
 * @param {title} Stable identification of the error.
 * @param {detail} Detailed identification of the error.
 * @param {meta} Additional information.
 *
 * Additionally, in non-production mode, any stack trace and other properties
 * from err are included.
 */
app.use((err, req, res, next) => { // eslint-disable-line no-unused-vars
  err.status = err.status || 500;
  let returnedError = {
    status: err.status,
    code: err.code || err.status.toString(),
    title: err.title || (err.message || 'Unknown error')
  };
  if (err.detail) {
    returnedError.detail = err.detail;
  }
  if (err.meta) {
    returnedError.meta = err.meta;
  }
  res.status(returnedError.status);
  if (config.server.environment !== 'production') {
    // More information for non-produciton.
    Object.assign(returnedError, err);
    if (err.stack) {
      returnedError.stack = err.stack;
    }
  }
  if (returnedError.status >= 500 && config.server.logServiceErrors === 1) {
    logger.log.error(returnedError);
  }
  res.json({errors: [returnedError]});
});

module.exports = app;
