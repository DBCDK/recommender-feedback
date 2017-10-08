'use strict';

const express = require('express');
const router = express.Router({mergeParams: true});
const {asyncMiddleware} = require('__/async-express');
const config = require('server/config');
const knex = require('knex')(config.db);
const constants = require('server/constants')();
const userTable = constants.users.table;
const loginTable = constants.login.table;
const {validatingInput} = require('server/json-verifiers');
const isEmail = require('isemail');
const mailer = require('nodemailer');
const handlebars = require('handlebars');
const fs = require('fs');
const {promisify} = require('util');
const readFileAsync = promisify(fs.readFile);
const resolve = require('resolve');
const uuidv4 = require('uuid/v4');

router.route('/')
  //
  // POST /v1/users
  //
  .post(asyncMiddleware(async (req, res, next) => {
    // Validate input.
    const contentType = req.get('content-type');
    if (contentType !== 'application/json') {
      return next({
        status: 400,
        title: 'User data has to be provided as application/json',
        detail: `Content type ${contentType} is not supported`
      });
    }
    const schema = 'schemas/user-in.json';
    try {
      await validatingInput(req.body, schema);
    }
    catch (error) {
      return next({
        status: 400,
        title: 'Malformed user data',
        detail: `User data does not adhere to ${schema}`,
        meta: error.meta || error
      });
    }
    let address = req.body.email;
    if (!isEmail.validate(address)) {
      return next({
        status: 400,
        title: 'Malformed email address',
        detail: `${address} is not considered a proper email address`
      });
    }
    // Create user and login token.
    const uuid = uuidv4();
    const token = uuidv4();
    try {
      await knex(userTable).insert({uuid, email: address});
      await knex(loginTable).insert({uuid: token, user: uuid});
    }
    catch (error) {
      return next({
        status: 500,
        title: 'Database operation failed',
        detail: error
      });
    }
    // Generate email from template.
    const mailhost = config.email.mailserver;
    const transporter = mailer.createTransport({
      host: mailhost,
      port: 25,
      secure: false
    });
    let template;
    const templateFile = 'server/login-email.handlebars';
    try {
      // It is probably OK to load the template each time a user requests a
      // new login, because it will throttle attacks a bit.
      template = await readFileAsync(resolve.sync(templateFile));
    }
    catch (error) {
      return next({
        status: 500,
        title: 'File not found',
        detail: `Template file ${templateFile}`
      });
    }
    const compiler = handlebars.compile(template.toString());
    const email = {
      to: address,
      from: config.email.from,
      subject: config.email.subject,
      text: compiler({host: config.email.hostname, token})
    };
    // Send email.
    transporter.sendMail(email)
      .then(info => {
        res.status(201).json({
          data: `Login token sent via email to ${address}`,
          links: {
            'message-id': info.messageId
          }
        });
      })
      .catch(error => {
        if (error) {
          return next({
            status: 502,
            title: 'Cannot send email',
            detail: `Problems with ${mailhost}`,
            meta: {error}
          });
        }
      });
  }))
;

router.route('/:uuid')
  //
  // GET /v1/users/:uuid
  //
  .get(asyncMiddleware(async (req, res, next) => {
    const uuid = req.params.uuid;
    const location = `${req.baseUrl}/${uuid}`;
    let existing;
    try {
      existing = await knex(userTable).where({uuid}).select('uuid', 'email');
    }
    catch (error) {
      return next({
        status: 500,
        title: 'Database operation failed',
        detail: error,
        meta: {resource: location}
      });
    }
    if (existing.length === 0) {
      return next({
        status: 404,
        title: 'Unknown user',
        detail: `User ${uuid} does not exist`,
        meta: {resource: location}
      });
    }
    res.status(200).json({
      data: existing[0],
      links: {self: location}
    });
  }))
;

module.exports = router;
