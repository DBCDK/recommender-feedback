'use strict';

/**
 * @file
 * Implementing Smaug
 */
const config = require('server/config');
const request = require('superagent');
const logger = require('__/logging')(config.logger);

const TOKENS = {};

/**
 * Returns the current set TOKEN.access_token.
 * If the current set token is invalid a new one will be requested and returned.
 *
 * @return {string}
 */
async function getToken(agencyId = '') {
  if (tokenIsValid(agencyId)) {
    return TOKENS[agencyId].access_token;
  }

  await setToken(agencyId);
  return TOKENS[agencyId].access_token;
}

/**
 * Requests a new token from smaug and sets TOKEN upon sucess
 */
async function setToken(agencyId) {
  const response = await getNewTokenFromSmaug(agencyId);
  const token = response.body;
  if (token.error) {
    logger.log.error('Error while retrieving token from Smaug', {response: token});
  }
  else {
    token.expires = Date.now() + (token.expires_in * 1000) - 100000;
    logger.log.info('Smaug token was set', {token});
    TOKENS[agencyId] = token;
  }
}

/**
 * Validated the current set TOKEN is valid.
 *
 * @return {boolean}
 */
function tokenIsValid(agencyId) {

  if (!TOKENS[agencyId]) {
    return false;
  }

  if (!TOKENS[agencyId].access_token) {
    return false;
  }

  if (Date.now() >= TOKENS[agencyId].expires) {
    return false;
  }

  return true;
}

/**
 * Requests a new token from Smaug and return the response
 *
 * @return {*}
 */
function getNewTokenFromSmaug(agencyId = '') {
  return request.post(`${config.openPlatform.smaug.uri}/oauth/token`)
    .type('form')
    .send({
      grant_type: 'password',
      username: `@${agencyId}`,
      password: `@${agencyId}`
    })
    .auth(config.openPlatform.smaug.clientId, config.openPlatform.smaug.clientSecret);
}

exports.getToken = getToken;
exports.setToken = setToken;
