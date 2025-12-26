module.exports = {
  root: true,
  // This tells ESLint to load the config from the package `eslint-config`
  extends: ['eslint-config-sdui-template', 'plugin:storybook/recommended'],
  settings: {
    next: {
      rootDir: ['apps/*/'],
    },
  },
}
