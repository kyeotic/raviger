module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'jest'],
  extends: [
    'plugin:react-hooks/recommended',
    'plugin:jest/recommended',
    'plugin:@typescript-eslint/recommended',
  ],
  rules: {
    'react/display-name': 0,
    '@typescript-eslint/no-use-before-define': ['error', { functions: false }],
  },
  env: {
    'jest/globals': true,
    browser: true,
  },
  settings: {
    jest: {
      version: 27,
    },
  },
}
