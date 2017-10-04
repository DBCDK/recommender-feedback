'use strict';

const {getToken} = require('./smaug.client');
const config = require('server/config');
const request = require('superagent');

const search = async ({query, fields}, agencyId='') => {
  return await makeRequestToServiceProvider({q: query, fields}, agencyId, 'search');
};

const makeRequestToServiceProvider = async function (params, agencyId, endpoint) {
  const token = await getToken(agencyId);

  const response = await request.post(`${config.openPlatform.serviceProvider.uri}/${endpoint}`)
    .send(Object.assign(params, {access_token: token}));
  return response.body;
};

exports.search = search;
