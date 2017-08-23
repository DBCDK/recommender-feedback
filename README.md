# Recommender Feedback

For a bird eye's view of the system, see the [software architecture context & containers](doc/architecturet.pdf).

## Environments

There are these ways to start the system:

1. **Unit testing on local machine**: The web app is built by `docker build src`, which runs all unit tests and, if the tests succeed, produces the *production container*.  This production container is what is used in all the subsequent tests, and finally used in production if all tests pass.
2. **Testing during development on local machine.**  The system is started by `docker-compose up --build`, which will run the production container with *development* settings together with a blank (or seeded?) local database container.  The web app will run on `http://localhost:3000` .
3. **Integration test on local machine.**  The integration test is started by `run-integration-test.sh` which will run the production container with *ci* settings together with a seeded local database container.  In addition, an integration container is created that runs all the integration tests and terminates.
4. **Production**:  The production container is pushed to Mesos with a configuration that connects it to an existing production database.

The production image of the web app is controlled by environment variables.  When running on a local machine (that is, not in production), these variables are set in the docker-compose files that bring up the whole system locally.  If you need to tweak settings, the application obeys the following environment variables.

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
| PORT                    | 3000        | TCP port for the service         |
| PRETTY_LOG              | 1           | Pretty printed log statements (1), or one-line log statements (0) |


## Endpoints

The web service has the following admistrative endpoints:

| Endpoint  | Function |
| --------- | -------- |
| `/status` | Returns the service status as JSON |
| `/pid`    | Returns the service's process id   |

----

[![Build Status](https://travis-ci.org/DBCDK/recommender-feedback.svg?branch=master)](https://travis-ci.org/DBCDK/recommender-feedback)
[![bitHound Overall Score](https://www.bithound.io/github/DBCDK/recommender-feedback/badges/score.svg)](https://www.bithound.io/github/DBCDK/recommender-feedback)
