# Service endpoints

The responses from the backend are either raw images or JSON loosely based on the [JSON-API](http://jsonapi.org/) specification, see [schemas used when testing](../src/integration/schemas/).

## Users

### `POST /v1/user`

The body must be [of the form](../src/server/schemas/login-in.json)

    { "email": "me@mail.dk"
    }

The results is a 202 and a body [status structure](../src/integration/schemas/success-out.json), like

    { "data":
      { "email": "me@mail.dk"
      }
    , "links":
      { "self": "/v1/user/e3f779c9-ac73-4e90-81fd-5e2e5b8be9d9"
      , "progress": "/v1/progress/e3f779c9-ac73-4e90-81fd-5e2e5b8be9d9"
      }
    }

The `progress` link can be requested to see how far the backend is with sending an email to the user.

The `self` (and `Location`) link will not succeed until the user has logged in.

### `GET /v1/user/`*uuid*

Returns [user information](../src/integration/schemas/user-data-out.json), provided that the user has logged in, like

    { "data":
      { "email": "me@mail.dk"
      }
    , "links":
      { "self": "/v1/user/e3f779c9-ac73-4e90-81fd-5e2e5b8be9d9"
      }
    }

If the user is not logged in, the result is an [error](../src/integration/schemas/failure-out.json) like

    { "errors":
      [ { "status": 401
        , "code": "401"
        , "title": "User is not loged in"
        , "detail": "Login for UUID e3f779c9-ac73-4e90-81fd-5e2e5b8be9d9 is pending"
        }
      ]
    , "links":
      { "resource": "/v1/user/e3f779c9-ac73-4e90-81fd-5e2e5b8be9d9"
      , "new-login": "/v1/user"
      }
    }

If the user is unknown, the result is a 404.

## Login

### `POST /v1/login/`*temp-uuid*

Returns [user data](../src/integration/schemas/user-data-out.json) if the temporary login UUID is known by the server, like

    { "data":
      { "email": "me@mail.dk"
      }
    , "links":
      { "self": "/v1/user/e3f779c9-ac73-4e90-81fd-5e2e5b8be9d9"
      }
    }

Or, if the temporary login UUID is *not* known by the server, an [error](../src/integration/schemas/failure-out.json) like

    { "errors":
      [ { "status": 404
        , "code": "404"
        , "title": "Unknown login UUID"
        , "detail": "UUID 258c43f0-bf42-47dd-a062-77e9a367cea7 is not a pending login"
        }
      ]
    , "links":
      { "resource": "/v1/login/258c43f0-bf42-47dd-a062-77e9a367cea7"
      , "new-login": "/v1/user"
      }
    }

### `GET /v1/progress/`*uuid*

Returns the [state of sending](../src/integration/schemas/progress-data-out.json) login email to the user, like

    { "data":
      { "progress": 0.5
      , "status": "Sending email"
      }
    , "links":
      { "self": "/v1/progress/e3f779c9-ac73-4e90-81fd-5e2e5b8be9d9"
      }
    }

