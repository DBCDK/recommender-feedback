'use strict';

const constants = require('./constants')();

const expect = require('chai').expect;
const request = require('supertest');

describe('endpoints', () => {
  const webapp = request(`http://${constants.webAppServiceName}:${constants.port}`);
  before(done => {
    done();
  });
  beforeEach(done => {
    done();
  });
  describe('GET /api', () => {
    it('should give an empty list', done => {
      webapp.get('/api')
        .expect(200)
        .expect('Content-Type', /json/)
        .expect(res => {
          expect(res.body).to.have.property('data');
          expect(res.body.data).to.equal([]);
        })
        .end(done);
    });
  });
  describe('POST /api', () => {
    it('should return location', done => {
      const location = '/api/1';
      webapp.post('/api')
        .send({name: 'ost'})
        .expect(201)
        .expect('Content-Type', /json/)
        .expect('location', location)
        .end(done);
    });
  });
});
