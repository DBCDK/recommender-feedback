'use strict';

/**
 * One-time login tokens.
 */

const constants = require('server/constants')();
const loginTable = constants.login.table;
const userTable = constants.users.table;

exports.up = function(knex) {
  return knex.schema.createTable(loginTable, table => {
    table.string('uuid').primary();
    table.string('user').notNullable();
    table.foreign('user').references(`${userTable}.uuid`);
    table.integer('created_epoch').notNullable().defaultTo(knex.raw('extract(\'epoch\' from now())'));
  });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists(loginTable);
};
