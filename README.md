# Lessware
A framework and extensions for serverless middleware.

## Install
`npm i -S lessware`

## Example Usage - API Route Controller

```javascript
const { framework } = require('lessware')

module.exports = framework([
  async context => ({...context, message: 'hello world'}),
  async context => ({
    statusCode: 200,
    body: JSON.stringify({message: context.message}),
  })
])
```

# Maintainers

When buidling releases,
- run tests: `npm test`
- follow [guides for libraries](https://github.com/dherman/defense-of-dot-js/blob/master/proposal.md#typical-usage)
