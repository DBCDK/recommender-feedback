'use strict';

/**
 * The initial database setup.
 */

const constants = require('server/constants')();
const userTable = constants.users.table;

exports.up = function(knex) {
  return knex.schema.createTable(userTable, table => {
    table.string('uuid').primary();
    table.string('email').notNullable();
    table.integer('last_used_epoch').notNullable().defaultTo(knex.raw('extract(\'epoch\' from now())'));
  })
    .then(() => {
      return knex.schema.dropTableIfExists('test');
    });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists(userTable);
};
