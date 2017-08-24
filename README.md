# Recommender Feedback

For a bird eye's view of the system, see the [software architecture context & containers](doc/architecturet.pdf).

## Starting the system

There are these ways to run the system:

### Manual testing during development

    $ touch current.env    // Use default configuration.
    $ docker-compose up -d // Start local PostgreSQL database.
    $ npm start            // Run both backend and frontend services in parallel.

### Unit testing on local machine

    $ npm run test

### Integration test on local machine.

...  with *ci* settings ...

### Production

...

## Environments

The backend service controlled by environment variables.  Most scripts assume that such variables are set in your local file `current.env`.  If you are just running the system on your own machine during development, you can most likely just use an empty `current.env`, but it has to exist.  The [`env`](env/) directory holds templates for other used configurations.  If you need to tweak settings, the application obeys the following environment variables.

| Environment variable    | Default     | Effect                           |
| ----------------------- | ----------- | -------------------------------- |
| DB_CONNECTIONS_POOL_MAX | 10          | Maximum connections in DB pool   |
| DB_CONNECTIONS_POOL_MIN | 2           | Minimum connections in DB pool   |
| DB_HOST                 | 127.0.0.1   | Database host                    |
| DB_NAME                 | feedback    | Name of the database             |
| DB_USER                 | feedback    | Database user                    |
| DB_USER_PASSWORD        |             | Database password                |
| LOG_LEVEL               | DEBUG       | Verbosity of service log (OFF, ERROR, WARN, WARNING, INFO, DEBUG, TRACE) |
| LOG_SERVICE_ERRORS      | 1           | Record all 5xx errors (1), or ignore 5xx errors (0) |
| NODE_ENV                | development | Controls other service settings (development, ci, production) |
| PORT                    | 3001        | TCP port for the service         |
| PRETTY_LOG              | 1           | Pretty printed log statements (1), or one-line log statements (0) |


## Endpoints

The backend service has the following admistrative endpoints:

| Endpoint  | Function |
| --------- | -------- |
| `/status` | Returns the service status as JSON. |
| `/pid`    | Returns the process id of the service.   |

## Caveats

- After adding new packages with `npm install --save newpackage`, you have to run `npm run postinstall` to re-establish the symbolic links in `node_modules`.

----

[![Build Status](https://travis-ci.org/DBCDK/recommender-feedback.svg?branch=master)](https://travis-ci.org/DBCDK/recommender-feedback)
[![bitHound Overall Score](https://www.bithound.io/github/DBCDK/recommender-feedback/badges/score.svg)](https://www.bithound.io/github/DBCDK/recommender-feedback)
