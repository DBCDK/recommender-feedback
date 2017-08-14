'use strict';

// Must be the service name defined in docker-compose.integration.
const serviceName = 'webapp'

const expect = require('chai').expect;
const request = require('supertest');

describe('endpoints', () => {
  const webapp = request(`http://${serviceName}:3000`);
  before(done => {
    done();
  });
  beforeEach(done => {
    done();
  });
  describe('GET /pid', () => {
    it('should return a number', () => {
      webapp.get('/pid')
        .expect(200)
        .expect('Content-Type', /text/)
        .expect(/^[0-9]+$/);
    });
  });
});
