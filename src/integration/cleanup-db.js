'use strict';

/**
 * Database manipulation for use when testing.
 *
 * Use like this in *_test.js files:
 * const dbUtil = require('cleanup-db')(knex);
 */

const constants = require('server/constants')();
const userTable = constants.users.table;
const loginTable = constants.login.table;
const feedbackTable = constants.feedback.table;

module.exports = knex => {

  /**
   * Truncate all tables in the current database.
   */
  function clear() {
    return knex.raw(`truncate table ${feedbackTable}, ${loginTable}, ${userTable} cascade`);
  }

  /**
   * Completely clean up the database and migrations.
   */
  function dropAll() {
    return knex.schema.dropTableIfExists('test')
      .then(() => {
        return knex.schema.dropTableIfExists(feedbackTable);
      })
      .then(() => {
        return knex.schema.dropTableIfExists(loginTable);
      })
      .then(() => {
        return knex.schema.dropTableIfExists(userTable);
      })
      .then(() => {
        return knex.schema.dropTableIfExists('knex_migrations');
      })
      .then(() => {
        return knex.schema.dropTableIfExists('knex_migrations_lock');
      });
  }

  return {
    clear,
    dropAll
  };
};
