'use strict';

const {getToken} = require('./smaug.client');
const config = require('server/config');
const request = require('superagent');

const defaultFields = [
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

const search = async ({query, fields=defaultFields}, agencyId='') => {
  return await makeRequestToServiceProvider({q: query, fields}, agencyId, 'search');
};
const recommend = async ({like, fields=defaultFields, limit=10}, agencyId='') => {

  // first, fetch the recommended pids
  const response = await makeRequestToServiceProvider({like, limit}, agencyId, 'recommend');

  // create pid to score mapping
  const pidToScore = {};
  response.data.forEach(work => {
    pidToScore[work.pid] = work.val;
  });

  // we need to fetch works, to get the required fields
  const pids = response.data.map(work => work.pid);
  const works = await work({pids: pids, fields});

  // apply the scores
  works.data.forEach(work => {
    work.score = pidToScore[work.pid] || 0;
  });

  // sort works - highest score first
  works.data.sort((w1, w2) => w2.score-w1.score);
  return works;
};

const work = async ({pids, fields=defaultFields}, agencyId='') => {
  return await makeRequestToServiceProvider({pids, fields}, agencyId, 'work');
};

const makeRequestToServiceProvider = async function (params, agencyId, endpoint) {
  const token = await getToken(agencyId);

  const response = await request.post(`${config.openPlatform.serviceProvider.uri}/${endpoint}`)
    .send(Object.assign(params, {access_token: token}));
  return response.body;
};

exports.search = search;
exports.recommend = recommend;
exports.work = work;
