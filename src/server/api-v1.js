/*
 * Routes for version 1 endpoints.
 */

'use strict';

const express = require('express');
const router = express.Router();

router.use('/users', require('server/v1-users'));
router.use('/search', require('server/v1-search'));
router.use('/recommend', require('server/v1-recommend'));

module.exports = router;
