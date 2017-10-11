# Service endpoints

The responses from the backend are either raw images or JSON loosely based on the [JSON-API](http://jsonapi.org/) specification, see [schemas used when testing](../src/integration/schemas/).

## Feedback

### `POST /v1/feedback`

The body must be [of the form](../src/server/schemas/feedback-in.json):

    { "user": "/v1/users/e3f779c9-ac73-4e90-81fd-5e2e5b8be9d9"
    , "work": "870970-basis:53188931"
    , "recommendation": "870970-basis:22629344"
    , "rating": 5
    , "recommender": "recommend01"
    }

The result is 201 with `Location` pointing to the inserted [feedback](../src/integration/schemas/feedback-data-out.json):

    { "data":
      { "work": "870970-basis:53188931"
      , "recommendation": "870970-basis:22629344"
      , "rating": 5
      , "recommender": "recommend01"
      }
    , "links":
      { "self": "/v1/feedback/6688f462-3257-4327-9292-87fc8e9cb227"
      }
    }

If the user does not exist, a 404 is returned.

### `PUT /v1/feedback/`*uuid*

Overwrite existing feedback.  The body must be of the same form as for a `POST`.

### `GET /v1/feedback/`*uuid*

The result is [feedback data](../src/integration/schemas/feedback-data-out.json):

    { "data":
      { "work": "870970-basis:53188931"
      , "recommendation": "870970-basis:22629344"
      , "rating": 5
      , "recommender": "recommend01"
      }
    , "links":
      { "self": "/v1/feedback/6688f462-3257-4327-9292-87fc8e9cb227"
      }
    }

If the feedback does not exist, a 404 is returned.

### `GET /v1/feedback`

Returns in a [list of feedback](../src/integration/schemas/feedbacks-data-out.json), each of the format as a single feedback entry, like

    { "data":
      [ { "feedback":
          { "work": "870970-basis:53188931"
          , "recommendation": "870970-basis:22629344"
          , "rating": 5
          , "recommender": "recommend01"
          }
        , "links":
          { "self": "/v1/feedback/6688f462-3257-4327-9292-87fc8e9cb227"
          }
        }
      , { "feedback":
          { "work": "846904-basis:93857422"
          , "recommendation": "870970-basis:00822341"
          , "rating": 5
          , "recommender": "recommend02"
          }
        , "links":
          { "self": "/v1/feedback/0c378e6c-87b9-4ffa-92f3-3e4e44ef8807"
          }
        }
      ]
    , "links":
      { "self": "/v1/feedback"
      }
    }

To include only recommendations for a specific book, include a `work=`*pid* argument.

To include only reccomendations from a specific user, include a `user=`*userURI* argument.

Examples:

    GET /v1/feedback?work=846904-basis:93857422
    GET /v1/feedback?user=/v1/users/258c43f0-bf42-47dd-a062-77e9a367cea7
    GET /v1/feedback?work=846904-basis:93857422&user=/v1/users/258c43f0-bf42-47dd-a062-77e9a367cea7

## Users

### `POST /v1/user`

The body must be [of the form](../src/server/schemas/user-in.json)

    { "email": "me@mail.dk"
    }

The results is a 202 with a `Location` pointing to where the user data can be found after the user has logged in, and a [result](../src/integration/schemas/user-create-data-out.json) like

    { "data": "Login token sent via email to some+one@open.mail.dk"
    , "links":
      { "message-id": "d3316133eaaeceb25f728748f127e898f6d0d9724a275e89"
      }
    }


The server sends an email to the user with a one-time link that logs in the user, like

    Tak fordi du vil hjælpe med at lave rigtig gode boganbefalinger.
    Du kan logge ind ved at bruge dette link:
        https://recommender-feedback.dbc.dk/login/258c43f0-bf42-47dd-a062-77e9a367cea7

### `GET /v1/user/`*uuid*

Returns [user information](../src/integration/schemas/user-data-out.json), like

    { "data":
      { "uuid": "e3f779c9-ac73-4e90-81fd-5e2e5b8be9d9"
      , "email": "me@mail.dk"
      }
    , "links":
      { "self": "/v1/user/e3f779c9-ac73-4e90-81fd-5e2e5b8be9d9"
      }
    }

If the user is unknown, the result is a 404.

## Login

### `POST /v1/login/`

The body must be [of the form](../src/server/schemas/login-in.json)

    { "token": "cfb16df1-1eea-42b8-a21c-d91650c9aec6"
    }

Returns [user data](../src/integration/schemas/user-data-out.json) if the temporary login UUID is known by the server, like

    { "data":
      { "uuid": "e3f779c9-ac73-4e90-81fd-5e2e5b8be9d9"
      , "email": "me@mail.dk"
      }
    , "links":
      { "self": "/v1/user/e3f779c9-ac73-4e90-81fd-5e2e5b8be9d9"
      }
    }

Or, if the temporary login UUID is *not* known by the server, an [error](../src/integration/schemas/failure-out.json) like

    { "errors":
      [ { "status": 404
        , "code": "404"
        , "title": "Unknown login token"
        , "detail": "Token 258c43f0-bf42-47dd-a062-77e9a367cea7 is not a pending login"
        }
      ]
    , "links":
      { "new-login": "/v1/user"
      }
    }

## Search

### `GET /v1/search?query=`*cql-query*

The query must be [of the form](../src/server/schemas/search-in.json)

Returns list of works, like

    { "data": [
        {
          "dcTitle": [
            "Økologisk ost som i gamle dage"
          ],
          "abstract": [
            "Smagstest af økologisk ost"
          ],
          "pid": [
            "somepid"
          ],
          "type": [
            "Avisartikel"
          ]
        },
        {
          "dcTitle": [
          "Mælk & ost"
          ],
          "pid": [
            "somepid"
          ],
          "type": [
            "Tidsskrift"
          ]
        }
      ]
    , "links":
      { "self": "/v1/search?query=ost"
      }
    }

## Recommend

### `GET /v1/recommend?pid=`*pid*

The query must be [of the form](../src/server/schemas/recommend-in.json)

Returns list of works, like

    { "data": [
        {
          "dcTitle": [
            "Økologisk ost som i gamle dage"
          ],
          "abstract": [
            "Smagstest af økologisk ost"
          ],
          "pid": [
            "somepid"
          ],
          "type": [
            "Avisartikel"
          ],
          score: 0.5
        },
        {
          "dcTitle": [
          "Mælk & ost"
          ],
          "pid": [
            "somepid"
          ],
          "type": [
            "Tidsskrift"
          ],
          score: 0.3
        }
      ]
    , "links":
      { "self": "/v1/recommend?pid=somepid"
      }
    }
