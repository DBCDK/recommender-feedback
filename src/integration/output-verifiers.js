/*
 * Common verifiers and JSON validator functions for endpoint testing.
 */

'use strict';

const {expect, assert} = require('chai');
const validator = require('is-my-json-valid/require');
const formats = require('server/schemas/formats');
const {nicifyJsonValidationErrors} = require('__/json');

function expectSuccess(document, next) {
  const schema = 'schemas/success-out.json';
  const validate = validator(schema);
  validate(document);
  const problems = nicifyJsonValidationErrors(validate);
  if (problems.length > 0) {
    assert(false, `Validating against ${schema}, got JSON ${JSON.stringify(document)} with the following problems: ${problems}`);
  }
  const links = document.links;
  expect(document).to.have.property('data');
  const data = document.data;
  next(links, data);
}
exports.expectSuccess = expectSuccess;

function expectFailure(document, next) {
  const schema = 'schemas/failure-out.json';
  const validate = validator(schema);
  validate(document);
  const problems = nicifyJsonValidationErrors(validate);
  if (problems.length > 0) {
    assert(false, `Validating against ${schema}, got JSON ${JSON.stringify(document)} with the following problems: ${problems}`);
  }
  expect(document).to.have.property('errors');
  const errors = document.errors;
  expect(errors).to.be.an('array');
  next(errors);
}
exports.expectFailure = expectFailure;

function expectValidate(document, schema) {
  const validate = validator(schema, formats);
  validate(document);
  const problems = nicifyJsonValidationErrors(validate);
  if (problems.length > 0) {
    assert(false, `Validating against ${schema}, got JSON ${JSON.stringify(document)} with the following problems: ${problems}`);
  }
  expect(problems).to.deep.equal([]);
}
exports.expectValidate = expectValidate;
