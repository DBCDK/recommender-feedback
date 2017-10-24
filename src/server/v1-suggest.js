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
    let titleResponse;
    let creatorResponse;

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
      const titleReq = suggest({query: req.query.query, type: 'title'});
      const creatorReq = suggest({query: req.query.query, type: 'creator'});

      titleResponse = await titleReq;
      creatorResponse = await creatorReq;
    }
    catch (error) {
      return next({
        status: 500,
        title: 'Suggest request failed',
        detail: error.response.text
      });
    }

    if (titleResponse.statusCode !== 200 || creatorResponse.statusCode !== 200) {
      return next({
        status: 500,
        title: 'Suggest request failed',
        detail: titleResponse.error || creatorResponse.error || 'Unknown error'
      });
    }

    res.status(200).json({
      data: {titles: titleResponse.data, creators: creatorResponse.data},
      links: {self: location}
    });
  }
  ))
;

module.exports = router;
