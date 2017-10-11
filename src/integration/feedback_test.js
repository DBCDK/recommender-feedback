'use strict';

const {expect} = require('chai');
const request = require('supertest');
const config = require('server/config');
const knex = require('knex')(config.db);
const dbUtil = require('./cleanup-db')(knex);
const {expectFailure, expectSuccess, expectValidate} = require('./output-verifiers');
const mock = require('./mock-server');

describe('Feedback', () => {
  const webapp = request(mock.server);
  beforeEach(async () => {
    await dbUtil.clear();
    await knex.seed.run();
  });
  afterEach(mock.afterEach);
  after(mock.after);
  describe('GET /v1/feedback', () => {
    it('should return all existing feedback', done => {
      const location = '/v1/feedback';
      webapp.get(location)
        .expect(res => {
          expectSuccess(res.body, (links, data) => {
            expectValidate(links, 'schemas/feedbacks-links-out.json');
            expect(links.self).to.equal(location);
            expectValidate(data, 'schemas/feedbacks-data-out.json');
            expect(data).to.have.length(3);
            for (let item of data) {
              expectValidate(item.feedback, 'schemas/feedback-data-out.json');
              expectValidate(item.links, 'schemas/feedback-links-out.json');
              expect(item.links.self).to.match(/\/v1\/feedback\//);
            }
          });
        })
        .expect(200)
        .end(done);
    });
    it('should reject unknown arguments', done => {
      webapp.get('/v1/feedback?work=654321-basis:31539489&foo=bar&quux=ost')
        .expect(res => {
          expectFailure(res.body, errors => {
            expect(errors).to.have.length(1);
            const error = errors[0];
            expect(error.title).to.match(/unknown arguments/i);
            expect(error.detail).to.match(/known arguments are "work" and "user"/i);
            expect(error).to.have.property('meta');
            expect(error.meta).to.have.property('problems');
            const problems = error.meta.problems;
            expect(problems).to.have.lengthOf.at.least(2);
            expect(problems).to.deep.include('argument foo is invalid');
            expect(problems).to.deep.include('argument quux is invalid');
          });
        })
        .expect(400)
        .end(done);
    });
    it('should reject non-existent user', done => {
      const user = '/v1/users/5ce53f85-1350-4367-8aee-b7eb80899068';
      const location = '/v1/feedback?user=' + user;
      webapp.get(location)
        .expect(res => {
          expectFailure(res.body, errors => {
            expect(errors).to.have.length(1);
            const error = errors[0];
            expect(error.title).to.match(/unknown user/i);
            expect(error.detail).to.equal(`User ${user} does not exist`);
          });
        })
        .expect(404)
        .end(done);
    });
    it('should filter on users', done => {
      const user = '/v1/users/258c43f0-bf42-47dd-a062-77e9a367cea7';
      const location = '/v1/feedback?user=' + user;
      webapp.get(location)
        .expect(res => {
          expectSuccess(res.body, (links, data) => {
            expectValidate(links, 'schemas/feedbacks-links-out.json');
            expect(links.self).to.equal(location);
            expectValidate(data, 'schemas/feedbacks-data-out.json');
            expect(data).to.have.length(2);
            data.forEach(item => {
              expectValidate(item.feedback, 'schemas/feedback-data-out.json');
              expectValidate(item.links, 'schemas/feedback-links-out.json');
            });
          });
        })
        .expect(200)
        .end(done);
    });
    it('should filter on work (input) PID', done => {
      const pid = '654321-basis:31539489';
      const location = '/v1/feedback?work=' + pid;
      webapp.get(location)
        .expect(res => {
          expectSuccess(res.body, (links, data) => {
            expectValidate(links, 'schemas/feedbacks-links-out.json');
            expect(links.self).to.equal(location);
            expectValidate(data, 'schemas/feedbacks-data-out.json');
            expect(data).to.have.length(1);
            const feedback = data[0].feedback;
            expectValidate(feedback, 'schemas/feedback-data-out.json');
            expect(feedback.work).to.equal(pid);
            expect(feedback.recommendation).to.equal('123456-basis:22629344');
            expect(feedback.rating).to.equal(4);
            expect(feedback.recommender).to.equal('recommender_01');
            expectValidate(data[0].links, 'schemas/feedback-links-out.json');
            expect(data[0].links.self).to.equal('/v1/feedback/83e29b0e-149e-48e3-99b5-e1c66acafff2');
          });
        })
        .expect(200)
        .end(done);
    });
    it('should filter on both work PID and user', done => {
      const user = '/v1/users/258c43f0-bf42-47dd-a062-77e9a367cea7';
      const pid = '836352-basis:93636493';
      const location = '/v1/feedback?user=' + user + '&work=' + pid;
      webapp.get(location)
        .expect(res => {
          expectSuccess(res.body, (links, data) => {
            expectValidate(links, 'schemas/feedbacks-links-out.json');
            expect(links.self).to.equal(location);
            expectValidate(data, 'schemas/feedbacks-data-out.json');
            expect(data).to.have.length(1);
            const feedback = data[0].feedback;
            expectValidate(feedback, 'schemas/feedback-data-out.json');
            expect(feedback.work).to.equal(pid);
            expect(feedback.recommendation).to.equal('638473-basis:83776443');
            expect(feedback.rating).to.equal(5);
            expect(feedback.recommender).to.equal('recommender_02');
            expectValidate(data[0].links, 'schemas/feedback-links-out.json');
            expect(data[0].links.self).to.equal('/v1/feedback/d592293a-e11e-4c86-8c7e-ca1949009685');
          });
        })
        .expect(200)
        .end(done);
    });
  });
  describe('GET /v1/feedback/:uuid', () => {
    it('should detect non-existent feedback', done => {
      const location = '/v1/feedback/ost';
      webapp.get(location)
        .expect(res => {
          expectFailure(res.body, errors => {
            expect(errors).to.have.length(1);
            const error = errors[0];
            expect(error.title).to.match(/unknown feedback/i);
            expect(error.detail).to.equal(`Feedback ${location} does not exist`);
            expect(error).to.have.property('meta');
            expect(error.meta).to.have.property('resource');
            expect(error.meta.resource).to.equal(location);
          });
        })
        .expect(404)
        .end(done);
    });
    it('should return existing feedback', done => {
      const location = '/v1/feedback/4c798fd7-66c5-4eec-a223-3337445e5bdf';
      webapp.get(location)
        .expect(res => {
          expectSuccess(res.body, (links, data) => {
            expectValidate(links, 'schemas/feedback-links-out.json');
            expect(links.self).to.equal(location);
            expectValidate(data, 'schemas/feedback-data-out.json');
            expect(data).to.deep.equal({
              work: '123456-basis:53188931',
              recommendation: '123456-basis:22629344',
              rating: 5,
              recommender: 'recommender_01'
            });
          });
        })
        .expect(200)
        .end(done);
    });
  });
  describe('POST /v1/feedback', () => {
    it('should reject wrong content type', done => {
      webapp.post('/v1/feedback')
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
    it('should reject malformed feedback', done => {
      webapp.post('/v1/feedback')
        .type('application/json')
        .send({email: 'you@ost.dk', rating: 'It is awesome'})
        .expect(res => {
          expectFailure(res.body, errors => {
            expect(errors).to.have.length(1);
            const error = errors[0];
            expect(error.title).to.match(/malformed user data/i);
            expect(error.detail).to.match(/feedback does not adhere to/i);
            expect(error).to.have.property('meta');
            expect(error.meta).to.have.property('problems');
            const problems = error.meta.problems;
            expect(problems).to.have.lengthOf.at.least(4);
            expect(problems).to.deep.include('data has additional properties');
            expect(problems).to.deep.include('field user is required');
            expect(problems).to.deep.include('field work is required');
            expect(problems).to.deep.include('field recommendation is required');
            expect(problems).to.deep.include('field rating is the wrong type');
            expect(problems).to.deep.include('field recommender is required');
          });
        })
        .expect(400)
        .end(done);
    });
    it('should reject malformed user location', done => {
      webapp.post('/v1/feedback')
        .type('application/json')
        .send({
          user: 'you@ost.dk',
          work: '870970-basis:53188931',
          recommendation: '870970-basis:22629344',
          rating: 3,
          recommender: 'recommender01'
        })
        .expect(res => {
          expectFailure(res.body, errors => {
            expect(errors).to.have.length(1);
            const error = errors[0];
            expect(error.title).to.match(/malformed uri/i);
            expect(error.detail).to.match(/you@ost\.dk is not a proper unified resource/i);
          });
        })
        .expect(400)
        .end(done);
    });
    it('should reject unknown user', done => {
      webapp.post('/v1/feedback')
        .type('application/json')
        .send({
          user: '/v1/users/847F5E06-8310-4D5D-8685-9BCA51873F40',
          work: '870970-basis:53188931',
          recommendation: '870970-basis:22629344',
          rating: 3,
          recommender: 'recommender01'
        })
        .expect(res => {
          expectFailure(res.body, errors => {
            expect(errors).to.have.length(1);
            const error = errors[0];
            expect(error.title).to.match(/unknown user/i);
            expect(error.detail).to.match(/user \/v1\/users\/847F5E06-8310-4D5D-8685-9BCA51873F40 does not exist/i);
          });
        })
        .expect(404)
        .end(done);
    });
    it('should accept valid feedback', done => {
      webapp.post('/v1/feedback')
        .type('application/json')
        .send({
          user: '/v1/users/258C43F0-BF42-47DD-A062-77E9A367CEA7',
          work: '870970-basis:53188931',
          recommendation: '870970-basis:22629344',
          rating: 3,
          recommender: 'recommender01'
        })
        .expect(res => {
          expectSuccess(res.body, (links, data) => {
            expectValidate(links, 'schemas/feedback-links-out.json');
            expectValidate(data, 'schemas/feedback-data-out.json');
            expect(data).to.deep.equal({
              work: '870970-basis:53188931',
              recommendation: '870970-basis:22629344',
              rating: 3,
              recommender: 'recommender01'
            });
          });
        })
        .expect(201)
        .expect('location', /\/v1\/feedback/)
        .end(done);
    });
    it('should store & retrieve feedback', done => {
      let location;
      webapp.post('/v1/feedback')
        .type('application/json')
        .send({
          user: '/v1/users/258C43F0-BF42-47DD-A062-77E9A367CEA7',
          work: '870970-basis:53188931',
          recommendation: '870970-basis:22629344',
          rating: 3,
          recommender: 'recommender01'
        })
        .expect(res => {
          expectSuccess(res.body, (links) => {
            location = links.self;
          });
        })
        .expect(201)
        .then(() => {
          webapp.get(location)
            .expect(res => {
              expectSuccess(res.body, (links, data) => {
                expectValidate(links, 'schemas/feedback-links-out.json');
                expectValidate(data, 'schemas/feedback-data-out.json');
                expect(data).to.deep.equal({
                  work: '870970-basis:53188931',
                  recommendation: '870970-basis:22629344',
                  rating: 3,
                  recommender: 'recommender01'
                });
              });
            })
            .end(done);
        })
        .catch(done);
    });
    it('should overwrite existing feedback when user and PIDs match');
  });
  describe('PUT /v1/feedback/:uuid', () => {
    it('should overwrite existing feedback');
  });
});
