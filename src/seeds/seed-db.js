'use strict';

const constants = require('server/constants')();
const userTable = constants.users.table;
const loginTable = constants.login.table;

exports.seed = async knex => {
  await knex(userTable).insert({
    uuid: '258c43f0-bf42-47dd-a062-77e9a367cea7',
    email: 'me@mail.dk'
  });
  await knex(loginTable).insert({
    uuid: '52c2b560-ab86-41a6-8b0a-8ae9bf51d223',
    user: '258c43f0-bf42-47dd-a062-77e9a367cea7'
  });
};
