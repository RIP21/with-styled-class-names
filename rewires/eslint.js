const rewireEslint = config => {
  const eslintLoader = config.module.rules[0] // Eslint loader is first in the list
  eslintLoader.use[0].options.useEslintrc = true
}

module.exports = rewireEslint
