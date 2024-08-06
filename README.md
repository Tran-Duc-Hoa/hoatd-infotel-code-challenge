<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
</p>

## Installation

```bash
# Install dependencies
$ npm install
```
Create a .env in the root directory, then add the environment variables I've attached to my email

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

<p>The server is running on <a href="http://localhost:3000">http://localhost:3000</a></p>

## Documentation

<p>Visit <a href="http://localhost:3000/api">http://localhost:3000/api</a> to access more interactive documentation with Swagger UI</p>

### Authentication

<div style="margin-left: 10px">

#### Sign up

- **Endpoint:** `POST /users`

- **Description:** Create a new user with email, password.

- **Request Body:** `{ email: string, password: string }`.

- **Response:** JSON data in the specified format.

**Example Response:**

```
{
"_id": "66b07c7f0870b9c420299beb"
"email": "test@google.com"
}
```

#### Login

- **Endpoint:** `POST /auth/login`

- **Description:** Login with email, password.

- **Request Body:** `{ email: string, password: string }`.

- **Response:** Return with access_token, refresh_token in the cookies.

#### Refresh tokens

- **Endpoint:** `POST /auth/refresh`

- **Description:** Generate new access-refresh tokens pair when access_token is expired.

- **Response:** Return with new access_token, refresh_token in the cookies.

#### Google Login

- **Endpoint:** `POST /auth/google`

- **Description:** Login with Google.

</div>

### XML Processing

<div style="margin-left: 10px">

- **Endpoint:** `GET /booking/:confirmationNo`

- **Description:** Retrieves booking data based on the confirmation number provided in the path.

- **Security:** JWT Authentication required.

- **Response:** JSON data in the specified format.

**Example Response:**

```
{
"confirmation_no": "531340616",
"resv_name_id": "37596129",
"arrival": "2024-07-24",
"departure": "2024-07-26",
"adults": 4,
"children": 0,
"roomtype": "V2GDK",
"ratecode": "BGBARGIB",
"rateamount": {
"amount": 9831780,
"currency": "VND"
},
"guarantee": "GRD",
"method_payment": "VA",
"computed_resv_status": "InHouse",
"last_name": "Smith",
"first_name": "Alan",
"title": "Mr",
"phone_number": "+84123456789",
"email": "test@email.com",
"booking_balance": 39327120,
"booking_created_date": "2024-07-22"
}
```

</div>

### Payment API

<div style="margin-left: 10px">

- **Endpoint:** `POST /payment/:confirmationNo`

- **Description:** Initiates a payment process for the booking associated with the confirmation number. This endpoint will redirect the client to the Vietcombank payment page.<br> When the transaction is successful, the client will be redirected to a success-page on the frontend hosted in localhost:3000/payment-success. Else, if failed, the client will be redirected to localhost:3000 /payment-fail.

- **Security:** JWT Authentication required.

- **Response:** JSON data in the specified format.

**Example Response:**

```
{
"confirmation_no": "531340616",
"resv_name_id": "37596129",
"arrival": "2024-07-24",
"departure": "2024-07-26",
"adults": 4,
"children": 0,
"roomtype": "V2GDK",
"ratecode": "BGBARGIB",
"rateamount": {
"amount": 9831780,
"currency": "VND"
},
"guarantee": "GRD",
"method_payment": "VA",
"computed_resv_status": "InHouse",
"last_name": "Smith",
"first_name": "Alan",
"title": "Mr",
"phone_number": "+84123456789",
"email": "test@email.com",
"booking_balance": 39327120,
"booking_created_date": "2024-07-22"
}
```

**Success Redirect**: http://localhost:3000/payment-success <br>
**Failure Redirect**: http://localhost:3000/payment-fail

</div>

## Technology

<div style="margin-left: 10px">

- Server: NestJS
- Database: MongoDB
- Authentication: Passport, JWT, Google

</div>

## Refresh Tokens Explanation

<div style="margin-left: 10px">

First, we need user provides their credentials (`email, password`) through the login endpoint `POST /auth/login` <br>
Then, our server will response with `access_token`, `refresh_token` stored as HTTP-only cookies.

- `access_token`: carry user details, with short-lived
- `refresh_token`: enable prolonged re-authentication without exposing sensitive information to client-side JavaScript.

When `access_token` expires, we can get new `access_token`, `refresh_token` by sending a request to the refresh endpoint `POST /auth/refresh`

With this implementation, we can easily persist users between refreshes and login without any credentials.

</div>
