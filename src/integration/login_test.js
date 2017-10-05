'use strict';

const {expect} = require('chai');
const request = require('supertest');
const config = require('server/config');
// const logger = require('__/logging')(config.logger);
const knex = require('knex')(config.db);
const dbUtil = require('./cleanup-db')(knex);
const {expectFailure, expectSuccess, expectValidate} = require('./output-verifiers');
const mock = require('./mock-server');

describe('Login', () => {
  const webapp = request(mock.server);
  before(async () => {
    await knex.migrate.latest();
  });
  beforeEach(async () => {
    await dbUtil.clear();
    await knex.seed.run();
  });
  afterEach(mock.afterEach);
  after(mock.afterEach);
  describe('POST /v1/login', () => {
    it('should reject wrong content type', done => {
      webapp.post('/v1/login')
        .type('text/plain')
        .send('broken')
        .expect(res => {
          expectFailure(res.body, errors => {
            expect(errors).to.have.length(1);
            const error = errors[0];
            expect(error.title).to.match(/provided as application\/json/i);
            expect(error).to.have.property('detail');
            expect(error.detail).to.match(/text\/plain .*not supported/i);
          });
        })
        .expect(400)
        .end(done);
    });
    it('should reject malformed login data', done => {
      webapp.post('/v1/login')
        .type('application/json')
        .send({uuid: 'yo'})
        .expect(res => {
          expectFailure(res.body, errors => {
            expect(errors).to.have.length(1);
            const error = errors[0];
            expect(error.title).to.match(/malformed login data/i);
            expect(error.detail).to.match(/login data does not adhere to/i);
            expect(error).to.have.property('meta');
            expect(error.meta).to.have.property('problems');
            const problems = error.meta.problems;
            expect(problems).to.have.lengthOf.at.least(2);
            expect(problems).to.deep.include('data has additional properties');
            expect(problems).to.deep.include('field token is required');
          });
        })
        .expect(400)
        .end(done);
    });
    it('should reject non-existing login token', done => {
      webapp.post('/v1/login')
        .type('application/json')
        .send({token: 'some-token'})
        .expect(res => {
          expectFailure(res.body, errors => {
            expect(errors).to.have.length(1);
            const error = errors[0];
            expect(error.title).to.match(/unknown login token/i);
            expect(error.detail).to.match(/is not a pending login/i);
          });
        })
        .expect(404)
        .end(done);
    });
    it('should log in user for valid login token', done => {
      webapp.post('/v1/login')
        .type('application/json')
        .send({token: '52c2b560-ab86-41a6-8b0a-8ae9bf51d223'})
        .expect(res => {
          expectSuccess(res.body, (links, data) => {
            expectValidate(links, 'schemas/user-links-out.json');
            expectValidate(data, 'schemas/user-data-out.json');
            expect(data.email).to.equal('me@mail.dk');
          });
        })
        .expect(200)
        .end(done);
    });
    it('should reject already-used login token', done => {
      const token = '52c2b560-ab86-41a6-8b0a-8ae9bf51d223';
      webapp.post('/v1/login')
        .type('application/json')
        .send({token})
        .expect(200)
        .then(() => {
          webapp.post('/v1/login')
            .type('application/json')
            .send({token})
            .expect(res => {
              expectFailure(res.body, errors => {
                expect(errors).to.have.length(1);
                const error = errors[0];
                expect(error.title).to.match(/unknown login token/i);
                expect(error.detail).to.match(/is not a pending login/i);
              });
            })
            .expect(404)
            .end(done);
        })
        .catch(done);
    });
  });
});
