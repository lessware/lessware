/* eslint-env mocha */

const { assert } = require('chai')
const { framework } = require('../src')

describe('framework', function() {
  it('should support a basic chain', async function() {
    const chain = framework([
      async context => ({...context, b: 'b'}),
      async context => ({ a: context.a, b: context.b, })
    ])

    const results = await chain({a: 'a'})
    assert.deepEqual(results, {a: 'a', b: 'b'})
  })

  it('should support decorating another chain', async function() {
    const chain = framework([
      async context => ({...context, b: 'b'}),
      async context => ({...context, c: 'c'})
    ])

    const decorated = framework([
      async context => ({...context, a: 'a'}),
      chain,
    ])

    const results = await decorated({})
    assert.deepEqual(results, {a: 'a', b: 'b', c: 'c'})
  })
})
