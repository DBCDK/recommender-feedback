/*
 * Routes for version 1 endpoints.
 */

'use strict';

const express = require('express');
const router = express.Router();

router.use('/users', require('server/v1-users'));
router.use('/search', require('server/v1-search'));

module.exports = router;
