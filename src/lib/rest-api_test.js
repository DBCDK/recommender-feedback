/* eslint-env mocha */
/* eslint-disable no-unused-expressions */
'use strict';

const {expect} = require('chai');
const restApi = require('__/rest-api');

describe('REST API', () => {
  describe('extractUuid', () => {
    it('should reject malformed URI', () => {
      expect(restApi.extractUuid('/v1', 'someone@mail.com')).to.be.null;
    });
    it('should extract lower-case UUID from URI', () => {
      expect(restApi.extractUuid('/v1/users/', '/v1/users/258C43F0-BF42-47DD-A062-77E9A367CEA7'))
        .to.equal('258c43f0-bf42-47dd-a062-77e9a367cea7');
    });
  });
});
