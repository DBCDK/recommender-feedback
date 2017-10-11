'use strict';

const express = require('express');
const router = express.Router({mergeParams: true});
const config = require('server/config');
const knex = require('knex')(config.db);
const constants = require('server/constants')();
const userTable = constants.users.table;
const feedbackTable = constants.feedback.table;
const {asyncMiddleware} = require('__/async-express');
const {validatingInput} = require('server/json-verifiers');
const restApi = require('__/rest-api');
const uuidv4 = require('uuid/v4');
const _ = require('lodash');

router.route('/')
  //
  // GET /v1/feedback
  //
  .get(asyncMiddleware(async (req, res, next) => {
    // Validate arguments.
    const location = req.originalUrl;
    const knownArguments = ['work', 'user'];
    const excess = _.omit(req.query, knownArguments);
    if (!_.isEmpty(excess)) {
      return next({
        status: 400,
        title: 'Unknown arguments',
        detail: 'known arguments are "work" and "user"',
        meta: {
          problems: _.map(_.keys(excess), key => {
            return `argument ${key} is invalid`;
          })
        }
      });
    }
    // Collect constraints for the database query.
    let constraints = {};
    if (req.query.user) {
      // Find user email.
      const user = req.query.user;
      let existing;
      try {
        const uuid = restApi.extractUuid('/v1/users/', user);
        existing = await knex(userTable).where({uuid}).select('email');
      }
      catch (error) {
        return next({
          status: 500,
          title: 'Database operation failed',
          detail: error,
          meta: {resource: location}
        });
      }
      if (existing.length === 0) {
        return next({
          status: 404,
          title: 'Unknown user',
          detail: `User ${user} does not exist`
        });
      }
      // Match on email.
      constraints.email = existing[0].email;
    }
    if (req.query.work) {
      // Match on work PID.
      constraints.work_pid = req.query.work;
    }
    // Find feedback.
    let extract;
    try {
      extract = await knex(feedbackTable)
        .where(constraints)
        .select('uuid', 'work_pid', 'recommendation_pid', 'rating', 'recommender');
    }
    catch (error) {
      return next({
        status: 500,
        title: 'Database operation failed',
        detail: error,
        meta: {resource: location}
      });
    }
    // Massage output.
    const result = _.map(extract, raw => {
      return {
        feedback: {
          work: raw.work_pid,
          recommendation: raw.recommendation_pid,
          rating: raw.rating,
          recommender: raw.recommender
        },
        links: {
          self: '/v1/feedback/' + raw.uuid
        }
      };
    });
    res.status(200).json({
      data: result,
      links: {self: location}
    });
  }))
  //
  // POST /v1/feedback
  //
  .post(asyncMiddleware(async (req, res, next) => {
    validatingFeedback(req)
      .then(async email => {
        // Check whether similar feedback is already stored.
        let existing;
        try {
          existing = await knex(feedbackTable).where({
            email: email,
            work_pid: req.body.work,
            recommendation_pid: req.body.recommendation
          }).select();
        }
        catch (error) {
          return next({
            status: 500,
            title: 'Database operation failed',
            detail: error
          });
        }
        if (existing.length !== 0) {
          // Update existing feedback.
          const feedbackUuid = existing[0].uuid;
          const location = `/v1/feedback/${feedbackUuid}`;
          try {
            await knex(feedbackTable).where({uuid: feedbackUuid}).update({
              uuid: feedbackUuid,
              email: email,
              work_pid: req.body.work,
              recommendation_pid: req.body.recommendation,
              rating: req.body.rating,
              recommender: req.body.recommender
            });
          }
          catch (error) {
            return next({
              status: 500,
              title: 'Database operation failed',
              detail: error,
              meta: {resource: location}
            });
          }
          return res.status(200).json({
            data: {
              work: req.body.work,
              recommendation: req.body.recommendation,
              rating: req.body.rating,
              recommender: req.body.recommender
            },
            links: {
              self: location
            }
          });
        }
        // Store feedback.
        const feedbackUuid = uuidv4();
        const location = `/v1/feedback/${feedbackUuid}`;
        try {
          await knex(feedbackTable).insert({
            uuid: feedbackUuid,
            email: email,
            work_pid: req.body.work,
            recommendation_pid: req.body.recommendation,
            rating: req.body.rating,
            recommender: req.body.recommender
          });
        }
        catch (error) {
          return next({
            status: 500,
            title: 'Database operation failed',
            detail: error,
            meta: {resource: location}
          });
        }
        res.status(201).location(location).json({
          data: {
            work: req.body.work,
            recommendation: req.body.recommendation,
            rating: req.body.rating,
            recommender: req.body.recommender
          },
          links: {
            self: location
          }
        });
      })
      .catch(next);
  }))
;

router.route('/:uuid')
  //
  // GET /v1/feedback/:uuid
  //
  .get(asyncMiddleware(async (req, res, next) => {
    const uuid = req.params.uuid;
    const location = `${req.baseUrl}/${uuid}`;
    let existing;
    try {
      existing = await knex(feedbackTable).where({uuid})
        .select('work_pid', 'recommendation_pid', 'rating', 'recommender');
    }
    catch (error) {
      return next({
        status: 500,
        title: 'Database operation failed',
        detail: error,
        meta: {resource: location}
      });
    }
    if (existing.length === 0) {
      return next({
        status: 404,
        title: 'Unknown feedback',
        detail: `Feedback ${location} does not exist`,
        meta: {resource: location}
      });
    }
    res.status(200).json({
      data: {
        work: existing[0].work_pid,
        recommendation: existing[0].recommendation_pid,
        rating: existing[0].rating,
        recommender: existing[0].recommender
      },
      links: {self: location}
    });
  }))
  //
  // PUT /v1/feedback
  //
  .put(asyncMiddleware(async (req, res, next) => {
    validatingFeedback(req)
      .then(async email => {
        // Find existing feedback.
        const feedbackUuid = req.params.uuid;
        let existing;
        try {
          existing = await knex(feedbackTable).where({uuid: feedbackUuid});
        }
        catch (error) {
          return next({
            status: 500,
            title: 'Database operation failed',
            detail: error
          });
        }
        const location = req.originalUrl;
        if (existing.length === 0) {
          return next({
            status: 404,
            title: 'Unknown feedback',
            detail: `Feedback ${location} does not exist`
          });
        }
        // Update feedback.
        try {
          await knex(feedbackTable).where({uuid: feedbackUuid}).update({
            uuid: feedbackUuid,
            email: email,
            work_pid: req.body.work,
            recommendation_pid: req.body.recommendation,
            rating: req.body.rating,
            recommender: req.body.recommender
          });
        }
        catch (error) {
          return next({
            status: 500,
            title: 'Database operation failed',
            detail: error,
            meta: {resource: location}
          });
        }
        res.status(200).json({
          data: {
            work: req.body.work,
            recommendation: req.body.recommendation,
            rating: req.body.rating,
            recommender: req.body.recommender
          },
          links: {
            self: location
          }
        });

      })
      .catch(next);
  }))
;

/**
 * Promise that validates POST/PUT feedback data.
 * @param  {Request} req Express request value.
 * @return {string}      User's email address
 */
function validatingFeedback (req) {
  return new Promise(async (resolve, reject) => {
    // Validate input.
    const contentType = req.get('content-type');
    if (contentType !== 'application/json') {
      return reject({
        status: 400,
        title: 'Feedback has to be provided as application/json',
        detail: `Content type ${contentType} is not supported`
      });
    }
    const schema = 'schemas/feedback-in.json';
    try {
      await validatingInput(req.body, schema);
    }
    catch (error) {
      return reject({
        status: 400,
        title: 'Malformed user data',
        detail: `Feedback does not adhere to ${schema}`,
        meta: error.meta || error
      });
    }
    // Extract user uuid.
    const user = req.body.user;
    const uuid = restApi.extractUuid('/v1/users/', user);
    if (!uuid) {
      return reject({
        status: 400,
        title: 'Malformed URI',
        detail: `${user} is not a proper unified resource identifier`
      });
    }
    // Find user.
    let existing;
    try {
      existing = await knex(userTable).where({uuid}).select('email');
    }
    catch (error) {
      return reject({
        status: 500,
        title: 'Database operation failed',
        detail: error
      });
    }
    if (existing.length === 0) {
      return reject({
        status: 404,
        title: 'Unknown user',
        detail: `User ${user} does not exist`
      });
    }
    const email = existing[0].email;
    return resolve(email);
  });
}

module.exports = router;
