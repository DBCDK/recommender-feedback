'use strict';

// This is a placeholder until we have a proper DB.

const expect = require('chai').expect;
const request = require('supertest');
const server = require('server');
const config = require('server/config');
const dbconfig = config.db;
const knex = require('knex')(dbconfig);
const db = require('server/test-db')(knex);
const seedDb = require('server/seed-db').seed;

describe('Dummy DB endpoints', () => {
  const service = request(server);
  before(done => {
    db.dropAll()
      .then(() => {
        return knex.migrate.latest();
      })
      .then(() => {
        done();
      });
  });
  beforeEach(done => {
    db.clear()
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
  describe('GET /', () => {
    it('should return an empty list', () => {
      service.get('/')
        .expect(200)
        .expect('Content-Type', /json/)
        .expect(res => {
          expect(res.body).to.equal([]);
        });
    });
  });
});
