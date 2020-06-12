# MyRecipe App Server

MyRecipe App is an application to search recipes based on keyword. This app has:

-   Login using Google account
-   Search recipes (client) on edamam API database
-   Send email using SendGrid API

Before running this app, please adding the following environment variables:

-   APP_PORT
-   JWT_SECRET
-   SENDGRID_API_KEY
-   GOOGLE_OAUTH_CLIENT_ID

# RESTFul Endpoints

## Global Response

#### (401 - Unauthorized)

> This error describes invalid user on resources access attempt

```json
{
    "error_code": "INVALID_USER",
    "message": "Invalid user!"
}
```

> This error describes access token missing

```json
{
    "error_code": "MISSING_TOKEN",
    "message": "Access token missing!"
}
```

#### (403 - Forbidden)

> This error describes resources access attempt by unprivileged user

```json
{
    "error_code": "FORBIDDEN",
    "message": "User has no rights to access this resource!"
}
```

#### (404 - Not Found)

> This error describes resources not exists

```json
{
    "error_code": "RESOURCE_NOT_FOUND",
    "message": "Resource not found!"
}
```

#### Response (500 - Internal server error)

> this error describes access token invalid

```json
{
    "error_code": "INVALID_ACCESS_TOKEN",
    "message": "Invalid access token!"
}
```

> This error describes server errors and undefined errors

```json
{
    "error_code": "INTERNAL_SERVER_ERROR",
    "message": "Internal server error!"
}
```

---

## USER

### POST /users/register

> Create new user

#### Request Header

```json
{
    "Content-Type": "application/json"
}
```

#### Request Body

| Field    |  Type  | Constraint   | Required |
| :------- | :----: | :----------- | :------: |
| email    | String | email format |   True   |
| password | String | min 7        |   True   |

_Example:_

```json
{
    "email": "user@example.com",
    "password": "password"
}
```

#### Response (201 - Created)

```json
{
    "email": "user@example.com",
    "password": "password
}
```

#### Response (400 - Bad Request)

```json
{
    "error_code": "VALIDATION_ERROR",
    "message": [
        "Email already exist",
        "Email is required",
        "Invalid email format",
        "Password is required",
        "Password has minimal length 7 characters",
        "All data must be filled",
        "Email is being used"
    ]
}
```

---

### POST /users/login

> Login user

#### Request Header

```json
{
    "Content-Type": "application/json"
}
```

#### Request Body

| Field    |  Type  | Constraint | Required |
| :------- | :----: | :--------- | :------: |
| email    | String | -          |   True   |
| password | String | -          |   True   |

_Example:_

```json
{
    "email": "user@example.com",
    "password": "password"
}
```

#### Response (200 - OK)

```json
{
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNTkxNzE2MDQ1fQ.Qxvchgcala47BVY0oCUUQ7XWO4ll0iAebJQEM_OpHYA"
}
```

#### Response (401 - Unauthorized)

```json
{
    "error_code": "LOGIN_FAIL",
    "message": "Email and Password combination not found!"
}
```

---

### POST /users/google

> Register or Login user using Google account

#### Request Header

```json
{
    "Content-Type": "application/json"
}
```

#### Request Body

| Field        |  Type  | Constraint              | Required |
| :----------- | :----: | :---------------------- | :------: |
| google_token | String | Google account id_token |   True   |

_Example:_

```json
{
    "google_token": "eyJpZCI6MSwiaWF0IjoxNT...ll0iAebJQEM_OpHYA"
}
```

#### Response (200 - OK)

```json
{
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNTkxNzE2MDQ1fQ.Qxvchgcala47BVY0oCUUQ7XWO4ll0iAebJQEM_OpHYA"
}
```

---

## Email

### POST /emails/send

> Send email

#### Request Header

```json
{
    "Content-Type": "application/json"
}
```

#### Request Body

| Field   |  Type  | Constraint   | Required |
| :------ | :----: | :----------- | :------: |
| to      | String | email format |   True   |
| subject | String | -            |   True   |
| message | String | -            |   True   |

_Example:_

```json
{
    "subject": "Email Subject",
    "message": "Hi there!"
}
```

#### Response (200 - OK)

```json
{
    "message": "success"
}
```
