const { name, version } = require('./package.json')

module.exports = {
  meta: { name, version },
  rules: {
    'no-hook-data-prop-drilling': require('./rules/no-hook-data-prop-drilling'),
  },
}
