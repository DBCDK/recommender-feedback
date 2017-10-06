'use strict';

const {expect, assert} = require('chai');
const request = require('supertest');
const config = require('server/config');
// const logger = require('__/logging')(config.logger);
const knex = require('knex')(config.db);
const dbUtil = require('./cleanup-db')(knex);
const {expectFailure, expectSuccess, expectValidate} = require('./output-verifiers');
const mock = require('./mock-server');

describe('User data', () => {
  const webapp = request(mock.server);
  before(async () => {
    await knex.migrate.latest();
  });
  beforeEach(async () => {
    await dbUtil.clear();
    await knex.seed.run();
  });
  afterEach(mock.afterEach);
  after(mock.after);
  describe('GET /v1/users/:uuid', () => {
    it('should detect non-existent user', done => {
      const uuid = 'e3f779c9-ac73-4e90-81fd-5e2e5b8be9d9';
      const location = `/v1/users/${uuid}`;
      webapp.get(location)
        .expect(res => {
          expectFailure(res.body, errors => {
            expect(errors).to.have.length(1);
            const error = errors[0];
            expect(error.title).to.match(/unknown user/i);
            expect(error).to.have.property('detail');
            expect(error.detail).to.equal(`User ${uuid} does not exist`);
            expect(error).to.have.property('meta');
            expect(error.meta).to.have.property('resource');
            expect(error.meta.resource).to.equal(location);
          });
        })
        .expect(404)
        .end(done);
    });
    it('should return user data for existing user', done => {
      const uuid = '258c43f0-bf42-47dd-a062-77e9a367cea7';
      const location = `/v1/users/${uuid}`;
      webapp.get(location)
        .expect(res => {
          expectSuccess(res.body, (links, data) => {
            expectValidate(links, 'schemas/user-links-out.json');
            expect(links.self).to.equal(location);
            expectValidate(data, 'schemas/user-data-out.json');
            expect(data.email).to.equal('me@mail.dk');
            expect(data.uuid).to.equal(uuid);
          });
        })
        .expect(200)
        .end(done);
    });
  });
  describe('POST /v1/users', () => {
    it('should reject wrong content type', done => {
      webapp.post('/v1/users')
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
    it('should reject malformed user data', done => {
      webapp.post('/v1/users')
        .type('application/json')
        .send({mail: 'you@ost.dk', notes: 'Is it really you?'})
        .expect(res => {
          expectFailure(res.body, errors => {
            expect(errors).to.have.length(1);
            const error = errors[0];
            expect(error.title).to.match(/malformed user data/i);
            expect(error.detail).to.match(/user data does not adhere to/i);
            expect(error).to.have.property('meta');
            expect(error.meta).to.have.property('problems');
            const problems = error.meta.problems;
            expect(problems).to.have.lengthOf.at.least(2);
            expect(problems).to.deep.include('data has additional properties');
            expect(problems).to.deep.include('field email is required');
          });
        })
        .expect(400)
        .end(done);
    });
    it('should reject bad email address', done => {
      webapp.post('/v1/users')
        .type('application/json')
        .send({email: 'you_at_ost'})
        .expect(res => {
          expectFailure(res.body, errors => {
            expect(errors).to.have.length(1);
            const error = errors[0];
            expect(error.title).to.match(/malformed email/i);
            expect(error.detail).to.match(/you_at_ost is not.*a proper email/i);
          });
        })
        .expect(400)
        .end(done);
    });
    it('should handle failure to send email', done => {
      mock.mailer.mock.shouldFailOnce();
      webapp.post('/v1/users')
        .type('application/json')
        .send({email: 'another.one@open-mail.dk'})
        .expect(res => {
          expectFailure(res.body, errors => {
            expect(errors).to.have.length(1);
            const error = errors[0];
            expect(error.title).to.match(/cannot send email/i);
            expect(error.detail).to.match(/problems with mailhost\.dbc\.dk/i);
          });
        })
        .expect(502)
        .end(done);
    });
    it('should create user, send a login link, and allow login', done => {
      const address = 'some+one@open.mail.dk';
      webapp.post('/v1/users')
        .type('application/json')
        .send({email: address})
        .expect(res => {
          expectSuccess(res.body, (links, data) => {
            expectValidate(links, 'schemas/user-create-links-out.json');
            expectValidate(data, 'schemas/user-create-data-out.json');
            expect(data).to.include(address);
          });
        })
        .expect(201)
        .then(() => {
          const emails = mock.mailer.mock.sentMail();
          expect(emails).to.have.length(1);
          const email = emails[0];
          expect(email.from).to.include(config.email.from);
          expect(email.subject).to.equal(config.email.subject);
          expect(email.text).to.include('://' + config.email.hostname + '/login?id=');
          const link = /https?:\/\/[^/]+\/login\?id=([-a-z0-9]+)/i;
          const found = email.text.match(link);
          assert(found, `Email body does not contain a link matching ${link}`);
          const token = found[1];
          webapp.post('/v1/login')
            .type('application/json')
            .send({token})
            .expect(res => {
              expectSuccess(res.body, (links, data) => {
                expectValidate(links, 'schemas/user-links-out.json');
                expectValidate(data, 'schemas/user-data-out.json');
                expect(data.email).to.equal(address);
              });
            })
            .expect(200)
            .end(done);
        })
        .catch(done);
    });
  });
});
