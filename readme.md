# Recommender Feedback

The purpose of this service is to collect feedback about the quality of DBC's book recommenders.

For a bird eye's view of the system, see the [software architecture context & containers](doc/architecturet.pdf).

For development of the system, see [`src`](src/readme.md).

## Deployment

The service's test database requires at least PostgreSQL 9.6, but the schemas only require support for JSONB.

To run the database tests against the server (requires postgresql):

    $ . /nvm.sh
    $ nvm install
    $ npm install
    $ cp env/integration.env current.env
    $ npm run test-full --silent

To start the server in staging or production mode:

    $ . /nvm.sh
    $ nvm install
    $ npm install
    $ cp env/production.env current.env
    $ npm run build
    $ npm run start-backend

## Environments

The backend service controlled by environment variables.  Most scripts assume that such variables are set in your local file `current.env`.  The [`env`](env/) directory holds templates for other used configurations.  If you need to tweak settings, the application obeys the following environment variables.

| Environment variable    | Default     | Effect                           |
| ----------------------- | ----------- | -------------------------------- |
| DB_CONNECTIONS_POOL_MAX | 10          | Maximum connections in DB pool   |
| DB_CONNECTIONS_POOL_MIN | 2           | Minimum connections in DB pool   |
| DB_HOST                 | 127.0.0.1   | Database host                    |
| DB_NAME                 | feedback    | Name of the database             |
| DB_USER                 | feedback    | Database user                    |
| DB_USER_PASSWORD        |             | Database password                |
| LOG_LEVEL               | INFO        | Verbosity of service log (OFF, ERROR, WARN, WARNING, INFO, DEBUG, TRACE) |
| LOG_SERVICE_ERRORS      | 1           | Record all 5xx errors (1), or ignore 5xx errors (0) |
| LOGIN_MAIL_FROM         | xxx@dbc.dk  | Login email appear to be sent from this address |
| LOGIN_MAIL_SERVER       | mailhost.dbc.dk | Login email will be sent through this |
| LOGIN_MAIL_SUBJECT      | Velkommen til ... | Login email will have this subject |
| NODE_ENV                | development | Controls other service settings (development, ci, production) |
| PORT                    | 3001        | TCP port for the service         |
| PRETTY_LOG              | 1           | Pretty printed log statements (1), or one-line log statements (0) |
| SERVICE_PROVIDER_URI    |             |
| SMAUG_CLIENT_ID         |             |
| SMAUG_CLIENT_SECRET     |             |
| SMAUG_URI               |             |  

The template for the login email body must be changed directly in the [source code](src/server/login-email.handlebars). 

## Endpoints

The backend service has the following admistrative endpoints:

| Endpoint  | Function |
| --------- | -------- |
| `/howru`  | Returns the service status as JSON. |
| `/pid`    | Returns the process id of the service.   |

See also [service endpoints](doc/endpoints.md).

## Caveats

- After adding new packages with `npm install --save newpackage`, you have to `npm run postinstall` to re-establish the symbolic links in `node_modules`.
- In development mode, the `PORT` of the backend service needs to agree with the `proxy` setting in [`package.json`](package.json).

----

[![Build Status](https://travis-ci.org/DBCDK/recommender-feedback.svg?branch=master)](https://travis-ci.org/DBCDK/recommender-feedback)
[![bitHound Overall Score](https://www.bithound.io/github/DBCDK/recommender-feedback/badges/score.svg)](https://www.bithound.io/github/DBCDK/recommender-feedback)
[![Coverage Status](https://coveralls.io/repos/github/DBCDK/recommender-feedback/badge.svg?branch=master)](https://coveralls.io/github/DBCDK/recommender-feedback?branch=master)
