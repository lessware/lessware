
exports.asyncSeriesChain = (chain, next) => chain.then(next)

exports.framework = methods => async context => methods.reduce(exports.asyncSeriesChain, Promise.resolve(context))
