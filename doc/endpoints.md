# Service endpoints

The responses from the backend are either raw images or JSON loosely based on the [JSON-API](http://jsonapi.org/) specification, see [schemas used when testing](../src/integration/schemas/).

## Users

### `POST /v1/user`

The body must be [of the form](../src/server/schemas/login-in.json)

    { "email": "me@mail.dk"
    }

The results is a 204.  The server sends an email to the user with a permanent link that logs in the user.

### `GET /v1/user/`*uuid*

Returns [user information](../src/integration/schemas/user-data-out.json), like

    { "data":
      { "email": "me@mail.dk"
      }
    , "links":
      { "self": "/v1/user/e3f779c9-ac73-4e90-81fd-5e2e5b8be9d9"
      }
    }

If the user is unknown, the result is a 404.
