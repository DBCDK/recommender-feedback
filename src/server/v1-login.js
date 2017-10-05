'use strict';

const express = require('express');
const router = express.Router({mergeParams: true});
const asyncMiddleware = require('__/async-express').asyncMiddleware;
const config = require('server/config');
const knex = require('knex')(config.db);
const constants = require('server/constants')();
const loginTable = constants.login.table;
const userTable = constants.users.table;
const {validatingInput} = require('server/json-verifiers');

router.route('/')
  .post(asyncMiddleware(async (req, res, next) => {
    const contentType = req.get('content-type');
    if (contentType !== 'application/json') {
      return next({
        status: 400,
        title: 'Login token has to be provided as application/json',
        detail: `Content type ${contentType} is not supported`
      });
    }
    const schema = 'schemas/login-in.json';
    try {
      await validatingInput(req.body, schema);
    }
    catch (error) {
      return next({
        status: 400,
        title: 'Malformed login data',
        detail: `Login data does not adhere to ${schema}`,
        meta: error.meta || error
      });
    }
    const token = req.body.token;
    let existing;
    try {
      existing = await knex(loginTable).where({uuid: token}).select('user');
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
        title: 'Unknown login token',
        detail: `Token ${token} is not a pending login`
      });
    }
    const uuid = existing[0].user;
    try {
      await knex(loginTable).where({uuid: token}).del();
    }
    catch (error) {
      return next({
        status: 500,
        title: 'Database operation failed',
        detail: error
      });
    }
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
        status: 410,
        title: 'User no longer exists',
        detail: `User ${uuid} is gone`
      });
    }
    res.status(200).json({
      data: {
        email: existing[0].email
      },
      links: {
        self: `/v1/users/${uuid}`
      }
    });
  }))
;

module.exports = router;
