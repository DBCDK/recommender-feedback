'use strict';

const express = require('express');
const router = express.Router({mergeParams: true});
const asyncMiddleware = require('__/async-express').asyncMiddleware;
const config = require('server/config');
const knex = require('knex')(config.db);
const constants = require('server/constants')();
const table = constants.users.table;
const validatingInput = require('server/json-verifiers').validatingInput;
const isEmail = require('isemail');

router.route('/')
  .post(asyncMiddleware(async (req, res, next) => {
    const contentType = req.get('content-type');
    if (contentType !== 'application/json') {
      return next({
        status: 400,
        title: 'User data has to be provided as application/json',
        detail: `Content type ${contentType} is not supported`
      });
    }
    const schema = 'schemas/login-in.json';
    let email;
    try {
      await validatingInput(req.body, schema);
    }
    catch (error) {
      return next({
        status: 400,
        title: 'Malformed user data',
        detail: `User data does not adhere to ${schema}`,
        meta: error.meta || error
      });
    }
    email = req.body.email;
    if (!isEmail.validate(email)) {
      return next({
        status: 400,
        title: 'Malformed email address',
        detail: `${email} is not considered a proper email address`
      });
    }
  }))
;

router.route('/:uuid')
  .get(asyncMiddleware(async (req, res, next) => {
    const uuid = req.params.uuid;
    const location = `${req.baseUrl}/${uuid}`;
    let existing;
    try {
      existing = await knex(table).where({uuid}).select('email');
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
        detail: `User ${uuid} does not exist`,
        meta: {resource: location}
      });
    }
    res.status(200).json({
      data: existing[0],
      links: {self: location}
    });
  }))
;

module.exports = router;
