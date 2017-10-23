'use strict';

const express = require('express');
const router = express.Router({mergeParams: true});
const asyncMiddleware = require('__/async-express').asyncMiddleware;
const {suggest} = require('./clients/openplatform.client');
const validatingInput = require('server/json-verifiers').validatingInput;

router.route('/')
  .get(asyncMiddleware(async (req, res, next) => {
    const location = req.originalUrl;
    const schema = 'schemas/suggest-in.json';
    let response;

    try {
      await validatingInput(req.query, schema);
    }
    catch (error) {
      return next({
        status: 400,
        title: 'Malformed user data',
        detail: `User data does not adhere to ${schema}`,
        meta: error.meta || error
      });
    }
    try {
      response = await suggest({query: req.query.query, type: req.query.type});
    }
    catch (error) {
      return next({
        status: 500,
        title: 'Suggest request failed',
        detail: error.response.text
      });
    }

    if (response.statusCode !== 200) {
      return next({
        status: 500,
        title: 'Suggest request failed',
        detail: response.error
      });
    }

    res.status(200).json({
      data: response.data,
      links: {self: location}
    });
  }
  ))
;

module.exports = router;
