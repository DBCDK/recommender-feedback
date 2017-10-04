'use strict';

const express = require('express');
const router = express.Router({mergeParams: true});
const asyncMiddleware = require('__/async-express').asyncMiddleware;
const {search} = require('./clients/openplatform.client');
const validatingInput = require('server/json-verifiers').validatingInput;
const config = require('server/config');
const logger = require('__/logging')(config.logger);

const fields = [
  'dcTitle',
  'creator',
  'description',
  'abstract',
  'extent',
  'publisher',
  'version',
  'date',
  'subject',
  'pid',
  'type',
  'coverUrlThumbnail'
];

router.route('/')
  .get(asyncMiddleware(async (req, res, next) => {
    const location = req.originalUrl;
    const schema = 'schemas/search-in.json';
    let response;

    try {
      try {
        await validatingInput(req.query, schema);
      }
      catch (error) {
        throw {
          status: 400,
          detail: `Search data does not adhere to ${schema}`,
          meta: error.meta,
          origin: error
        };
      }
      try {
        response = await search({query: req.query.query, fields});
      }
      catch (error) {
        throw {detail: error.response.text, origin: error};
      }

      if (response.statusCode !== 200) {
        throw {status: 500, detail: response.error};
      }

      res.status(200).json({
        data: response.data,
        links: {self: location}
      });
    }
    catch (e) {
      const title = 'openplatform request failed';
      logger.log.error(title, e);
      return next({
        status: e.status || 500,
        title,
        detail: e.detail || 'Unknown error',
        meta: Object.assign({}, e.meta, {resource: location})
      });
    }
  }))
;

module.exports = router;
