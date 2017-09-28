'use strict';

const constants = require('server/constants')();
const userTable = constants.users.table;

exports.seed = async knex => {
  await knex(userTable).insert({
    uuid: '258c43f0-bf42-47dd-a062-77e9a367cea7',
    email: 'me@mail.dk'
  });
};
