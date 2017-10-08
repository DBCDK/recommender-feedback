'use strict';

/**
 * Feedback about recommenders collected from users.
 */

const constants = require('server/constants')();
const feedbackTable = constants.feedback.table;

exports.up = function(knex) {
  return knex.schema.createTable(feedbackTable, table => {
    table.string('uuid').primary();
    table.string('email').notNullable();
    table.string('work_pid').notNullable();
    table.string('recommendation_pid').notNullable();
    table.integer('rating');
    table.string('recommender');
    table.integer('created_epoch').notNullable().defaultTo(knex.raw('extract(\'epoch\' from now())'));
  });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists(feedbackTable);
};
