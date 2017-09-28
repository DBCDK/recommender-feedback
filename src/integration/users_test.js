// This is a placeholder to give an idea of how to test the API.
'use strict';

// const expect = require('chai').expect;
// const request = require('supertest');
const config = require('server/config');
const logger = require('__/logging')(config.logger);
const knex = require('knex')(config.db);
const dbUtil = require('./cleanup-db')(knex);
// const expectFailure = require('./output-verifiers').expectFailure;
// const expectSuccess = require('./output-verifiers').expectSuccess;
// const expectValidate = require('./output-verifiers').expectValidate;

describe('User data', () => {
  // const webapp = request(`http://localhost:${config.server.port}`);
  before(async () => {
    await dbUtil.dropAll();
    await knex.migrate.latest();
  });
  beforeEach(async () => {
    await dbUtil.clear();
    await knex.seed.run();
    logger.log.debug('Database is now seeded.');
  });
  describe('GET /v1/users/:uuid', () => {
    it('should detect non-existent user');
    it('should return user data for existing user');
  });
  describe('POST /v1/users', () => {
    it('should reject bad email address');
    it('should create user and send login link');
  });
});
