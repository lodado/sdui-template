module.exports = {
  root: true,
  // This tells ESLint to load the config from the package `eslint-config`
  extends: ['eslint-config-sdui-template', 'plugin:storybook/recommended'],
  overrides: [
    {
      files: ['packages/sdui-template-component/src/shared/ui/**/*.{ts,tsx}'],
      excludedFiles: ['**/*.test.*'],
      plugins: ['@lodado/sdui'],
      parserOptions: {
        project: './packages/sdui-template-component/tsconfig.json',
        tsconfigRootDir: __dirname,
      },
      rules: { '@lodado/sdui/no-hook-data-prop-drilling': 'warn' },
    },
  ],
  settings: {
    next: {
      rootDir: ['apps/*/'],
    },
  },
}
