'use strict';

const constants = require('./constants')();

const expect = require('chai').expect;
const request = require('supertest');
const config = require('server/config');
const knex = require('knex')(config.db);
const dbUtil = require('./cleanup-db')(knex);
const seedDb = require('./seed-db').seed;

describe('endpoints', () => {
  const webapp = request(`http://${constants.webAppServiceName}:${constants.port}`);
  before(done => {
    done();
  });
  beforeEach(done => {
    dbUtil.clear()
      .then(() => {
        return seedDb(knex);
      })
      .then(() => {
        done();
      })
      .catch(errors => {
        done(errors);
      });
  });
  describe('GET /api', () => {
    it('should give list with one element', done => {
      webapp.get('/api')
        .expect(200)
        .expect('Content-Type', /json/)
        .expect(res => {
          expect(res.body).to.have.property('data');
          expect(res.body.data).to.deep.equal([{id: 1, name: 'spændende'}]);
        })
        .end(done);
    });
  });
  describe('POST /api', () => {
    it('should return location', done => {
      const location = '/api/2';
      webapp.post('/api')
        .send({name: 'ost'})
        .expect(201)
        .expect('Content-Type', /json/)
        .expect('location', location)
        .end(done);
    });
  });
});
