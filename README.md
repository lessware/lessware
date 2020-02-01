# Lessware
A framework and extensions for serverless middleware.

## Background
Middleware can be asynchronous. Javascript natively defines a chaining mechanism for async operations. Promise chains are a natural way to implement middleware.

This framework does nothing more than chain, in series, an array of functions that each return a promise. Each function is expected to pass the sole argument onto the next function in the chain, with the exception of the final function, which should return the desired output shape.

## Install
`npm i -S lessware`

## API
`framework` - a function to make a function,
- input: an array of middleware functions, each whose input takes the `context` object to read or write to, and output is a Promise.
- output: a function whose input is the `context` object to be decorated, and output is a Promise.

## Example Usage - API Route Controller

```javascript
// -- hello.js --
const { framework } = require('lessware')

const chain = [
  // simply adds a new field to the payload
  async context => ({...context, message: 'hello world'}),

  // use field added in chain's previous method
  async context => ({
    statusCode: 200,
    body: JSON.stringify({message: context.message}),
  })
]

module.exports = framework(chain)
```

## Example Usage - Entry Point Integration

```javascript
// -- index.js --
// dependency module from previous example
const hello = require('./hello')
const router = {hello}

// persist connections setup by middleware
const db = {}

exports.handler = async (event, ctx) => {
  const controller = router[event.fieldName]

  // initialize and pass the context parameter for the chain
  return controller({event, ctx, db})
}
```

## Example Usage - Decorate all routes

```javascript
// -- index.js --
const hello = require('./hello')
const { framework } = require('lessware')

// define a common configuration middleware
const configMiddleware = async context => ({
  ...context,
  config: {
    aws: {
      region: process.env.AWS_DEFAULT_REGION,
    },
    mongo: {
      secretConnection: process.env.NAME_SECRET_MONGO_CONNECTION,
    },
  }
})

// define router
const routes = {hello}
const router = Object.keys(routes).reduce((accum, path) => ({
  ...accum,
  // decorate routes with common middleware
  [path]: framework([configMiddleware, routes[path]]),
}), {})

// persist connections setup by middleware
const db = {}

exports.handler = async (event, ctx) => {
  const controller = router[event.fieldName]

  // initialize and pass the context parameter for the chain
  return controller({event, ctx, db})
}
```

# Maintainers

When buidling releases,
1. `npm test`
2. `git commit -m "your message"`
3. bump version 
   1. `npm version patch`
   2. `npm version minor`
4. `git push`
5. `npm publish`
