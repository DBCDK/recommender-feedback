'use strict';

const mockery = require('mockery');

// Mock email sending.
const mailer = require('nodemailer-mock');
mockery.enable({warnOnUnregistered: false});
mockery.registerMock('nodemailer', mailer);

// And after that require the server so that it uses the mock.
module.exports = {
  server: require('server/public-server'),
  mailer,
  afterEach: () => {
    mailer.mock.reset();
  },
  after: () => {
    mockery.deregisterAll();
    mockery.disable();
  }
};
