'use strict';

const constants = require('server/constants')();
const userTable = constants.users.table;
const loginTable = constants.login.table;
const feedbackTable = constants.feedback.table;

exports.seed = async knex => {
  await knex(userTable).insert({
    uuid: '258c43f0-bf42-47dd-a062-77e9a367cea7',
    email: 'me@mail.dk'
  });
  await knex(loginTable).insert({
    uuid: '52c2b560-ab86-41a6-8b0a-8ae9bf51d223',
    user: '258c43f0-bf42-47dd-a062-77e9a367cea7'
  });
  await knex(feedbackTable).insert({
    uuid: '4c798fd7-66c5-4eec-a223-3337445e5bdf',
    email: 'foo@bar.quux.com',
    work_pid: '123456-basis:53188931',
    recommendation_pid: '123456-basis:22629344',
    rating: 5,
    recommender: 'recommender_01'
  });
  await knex(feedbackTable).insert({
    uuid: '83e29b0e-149e-48e3-99b5-e1c66acafff2',
    email: 'one@two.three',
    work_pid: '654321-basis:31539489',
    recommendation_pid: '123456-basis:22629344',
    rating: 5,
    recommender: 'recommender_01'
  });
};
