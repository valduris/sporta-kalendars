# Sports Calendar

## Initial setup

Download and install PostgreSQL from http://www.enterprisedb.com/products-services-training/pgdownload

`psql -U postgres`
`create database sportscalendar;`
`\c sportscalendar`

## Run

`npm i`
`node_modules/.bin/db-migrate up --config src/server/config/database.json -env development -m src/server/migrations`
`npm run watch`
`npm run start`

Open `localhost:3333/run-all-scrapers` to fetch data, then go to `localhost:3333/` to view calendar.

## Migrations

### Create

`node_modules/.bin/db-migrate create migration-name --config src/server/config/database.json -env development -m src/server/migrations`