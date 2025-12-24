module.exports = {
  root: true,
  // This tells ESLint to load the config from the package `eslint-config`
  extends: ['eeslint-config-sdui-template'],
  settings: {
    next: {
      rootDir: ['apps/*/'],
    },
  },
}
