'use strict';

const tcp = require('__/tcp');
const hostname = require('os').hostname;
const knexfile = require('./knexfile');

// This is the only place to read process.env settings.  The point is that the
// servive should use the configuration like
//
//     const config = require('server/config')
//
// and just extract needed configuration parts and pass them on to modules that
// need them, like
//
//     mymodule(config.logger)
//
// or alternatively
//
//     const port = require('server/config').server.port
//     mymodule(port)

function failIfEmpty(key) {
  if (typeof process.env[key] === 'undefined' || process.env[key] === null || process.env[key] === '') {
    throw `Missing environment variable: '${key}'`;
  }
  return process.env[key];
}

function Defaults () {
  return {
    environment: process.env.NODE_ENV || 'development',
    port: tcp.normalizePort(process.env.PORT) || 3001,
    prettyLog: parseInt(process.env.PRETTY_LOG || 1, 10),
    logLevel: process.env.LOG_LEVEL || 'INFO',
    logServiceErrors: parseInt(process.env.LOG_SERVICE_ERRORS || 1, 10),
    hostname: hostname().replace('.domain_not_set.invalid', ''),
    externalHostname: 'recommender-feedback.dbc.dk'
  };
}

const defaults = new Defaults();

/*
 * Configuration groups for various modules.
 */

exports.server = {
  environment: defaults.environment,
  logServiceErrors: defaults.logServiceErrors,
  port: defaults.port,
  hostname: defaults.externalHostname
};

exports.logger = {
  environment: defaults.environment,
  level: defaults.logLevel,
  pretty: defaults.prettyLog,
  hostname: defaults.hostname
};

exports.email = {
  from: process.env.LOGIN_MAIL_FROM || 'Læsekompasset <afb@dbc.dk>',
  subject: process.env.LOGIN_MAIL_SUBJECT || 'Velkommen til Læsekompasset',
  mailserver: process.env.LOGIN_MAIL_SERVER || 'mailhost.dbc.dk',
  hostname: defaults.externalHostname
};

exports.openPlatform = {
  serviceProvider: {
    uri: failIfEmpty('SERVICE_PROVIDER_URI')
  },
  smaug: {
    uri: failIfEmpty('SMAUG_URI'),
    clientId: failIfEmpty('SMAUG_CLIENT_ID'),
    clientSecret: failIfEmpty('SMAUG_CLIENT_SECRET')
  }
};

exports.db = knexfile[defaults.environment];
