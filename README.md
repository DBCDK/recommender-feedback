# Recommender Feedback

For a bird eye's view of the system, see the [software architecture context & containers](doc/architecturet.pdf).

## Environments

You can edit `current.env` after the above steps to further control the settings.  Templates exist in `env/`, and most these templates can be used as-is.  But if you need to tweak settings, the application obeys the following environment variables.

| Environment variable    | Default     | Effect                           |
| ----------------------- | ----------- | -------------------------------- |
| DB_CONNECTIONS_POOL_MAX | 10          | Maximum connections in DB pool   |
| DB_CONNECTIONS_POOL_MIN | 2           | Minimum connections in DB pool   |
| DB_HOST                 | 127.0.0.1   | Database host                    |
| DB_NAME                 | feedback    | Name of the database             |
| DB_USER                 |             | Database user                    |
| DB_USER_PASSWORD        |             | Database password                |
| LOG_LEVEL               | INFO        | Verbosity of service log (OFF, ERROR, WARN, WARNING, INFO, DEBUG, TRACE) |
| LOG_SERVICE_ERRORS      | 1           | Record all 5xx errors (1), or ignore errors (0) |
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
