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
  describe('GET /api', () => {
    it('should give an empty list', done => {
      webapp.get('/api')
        .expect(200)
        .expect('Content-Type', /text/)
        .expect(/^[0-9]+$/)
        .end(done);
    });
  });
  describe('POST /api', () => {
    it('should return location', done => {
      const location = `/v1/community/1/action/1`;
      webapp.post('/api')
        .send({name: 'ost'})
        .expect(201)
        .expect('Content-Type', /json/)
        .expect('location', location)
        .end(done);
    });
  });
});
