## Description

A simple API to manage orders with the following features:

- Create a new order
- Get an order
- Change the status of an order
- Delete an order

For the purpose of this project, the orders are stored in the SQLite database.

## Project setup

```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Testing the API

# Create a new order

```bash
curl -XPOST -H "Content-type: application/json" -d '{"customer": "John Doe", "product": "Test"}' 'http://localhost:3000/orders'
```

# Get an order

```bash
curl 'http://localhost:3000/orders/1'
```

# Change the status of an order

```bash
curl -XPOST -H "Content-type: application/json" -d '{"status": "completed"}' 'http://localhost:3000/orders/1/status'
```

# Delete an order

```bash
curl -XDELETE 'http://localhost:3000/orders/1'
```
