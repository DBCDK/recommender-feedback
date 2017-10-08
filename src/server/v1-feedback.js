'use strict';

const express = require('express');
const router = express.Router({mergeParams: true});
const config = require('server/config');
const knex = require('knex')(config.db);
const constants = require('server/constants')();
const userTable = constants.users.table;
const {asyncMiddleware} = require('__/async-express');
const {validatingInput} = require('server/json-verifiers');
const restApi = require('__/rest-api');
const uuidv4 = require('uuid/v4');

router.route('/')
  //
  // POST /v1/feedback
  //
  .post(asyncMiddleware(async (req, res, next) => {
    // const location = req.originalUrl;
    // Validate input.
    const contentType = req.get('content-type');
    if (contentType !== 'application/json') {
      return next({
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
      return next({
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
      return next({
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
      return next({
        status: 500,
        title: 'Database operation failed',
        detail: error
      });
    }
    if (existing.length === 0) {
      return next({
        status: 404,
        title: 'Unknown user',
        detail: `User ${user} does not exist`
      });
    }
    // Store feedback.
    // const email = existing.email;
    const feedbackUuid = uuidv4();
    const location = `/v1/feedback/${feedbackUuid}`;
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
  }))
;

module.exports = router;
