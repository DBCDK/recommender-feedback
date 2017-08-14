'use strict';

const express = require('express');
const router = express.Router();
// const config = require('server/config');
// const logger = require('__/logging')(config.logger);
// const knex = require('knex')(config.db);
// const constants = require('server/constants')();
// const communityTable = constants.community.table;

router.route('/')

  .get((req, res) => {
    res.status(200).json(['ost']);
  })

  .post((req, res) => {
    const location = `${req.baseUrl}/1`;
    res.status(201).location(location).json({
      links: {self: location},
      data: 'ost'
    });
  });

module.exports = router;
