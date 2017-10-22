const rewireEslint = require('./rewires/eslint')
const rewireSc = require('react-app-rewire-styled-components')
const rewireResolve = require('./rewires/resolve')

module.exports = function override(config, env) {
  rewireResolve(config)
  rewireEslint(config)
  rewireSc(config, env, {
    displayName: true,
  })
  return config
}
