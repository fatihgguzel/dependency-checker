## Setup
- Node version `18.18.2`
- npm version `9.8.1`
- `npm ci` to get versioned modules

## Linting
- `npm run lint`

## Start
- For development,
    - You need to have a `redis` server on background. Docker has its own.
    - `npm run dev`
    -  w/o `nodemon`; `npm run dev-alt`
- `docker-compose up`
- create an .env file with respect to the .template.env for `development` purposes

## Docker
- Docker has its env variables set up, see `docker-compose.yml`
