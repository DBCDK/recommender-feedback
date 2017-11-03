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
  'coverUrlThumbnail',
  'subjectDBCS'
];

const suggest = async ({query, type}, agencyId='') => {
  return await makeRequestToServiceProvider({q: query, type}, agencyId, 'suggest');
};

const search = async ({query, fields=defaultFields}, agencyId='') => {
  return await makeRequestToServiceProvider({q: query, fields}, agencyId, 'search');
};

const floodfilter = (works, creator) => {
  const seenCreators = {};
  seenCreators[creator] = true;
  return works.filter(w => {
    let c = w.creator ? w.creator : null;
    c = c && Array.isArray(c) && c.length > 0 ? c[0] : c;
    if (!c || seenCreators[c]) {
      return false; // there is already a recommendatino by this creator
    }
    seenCreators[c] = true;
    return true; // first recommendation by this creator
  });
};

const recommend = async ({like, fields=defaultFields, limit=10}, agencyId='') => {

  // first, fetch the recommended pids
  const response = await makeRequestToServiceProvider({like, limit: limit*2}, agencyId, 'recommend');
  let recommendations = response.data;

  if (recommendations && recommendations.length === 0) {
    return response;
  }

  const creatorResponse = (await work({pids: like, fields: ['creator']}));
  const creator = creatorResponse.data[0].creator ? creatorResponse.data[0].creator[0] : null;

  // simple flood filtering
  // Recommend no more than one book per creator
  recommendations = floodfilter(recommendations, creator);
  recommendations = recommendations.slice(0, limit);

  // create pid to score mapping
  const pidToScore = {};
  recommendations.forEach(work => {
    pidToScore[work.pid] = work.val;
  });

  // we need to fetch works, to get the required fields
  const pids = recommendations.map(work => work.pid);
  const works = await work({pids: pids, fields});

  // apply the scores
  works.data.forEach(work => {
    work.score = pidToScore[work.pid] || 0;
  });

  // and we run a flood filtering after works are fetched from open platform
  // since creator might differ from recommender creators
  works.data = floodfilter(works.data, creator);

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
exports.suggest = suggest;
