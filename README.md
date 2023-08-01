# Test Incode

Simple organization user structure management operations

## Table of contents

- [Technologies](#technologies)
- [Setup](#setup)
- [Env](#env)

## Technologies

Project is created with:

- NodeJS: 18.6
- PostgresSQL: 15.3
- Docker Compose: 3.8

## Setup

To run this project, install it locally using npm:

```
cd ../test-incode
npm install
docker-compose up
npx prisma migrate dev
npm start:dev
```

## Env

- `DATABASE_URL` - the database connection string.
- `BCRYPT_SALT_ROUNDS` - the salt to be used in encryption.
- `JWT_SECRET` - the secret of JWT
- `JWT_EXPIRES_IN` - the expiration time of JWT
- `REST_PORT` - the port on which the app runs
