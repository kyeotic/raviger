module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'jest'],
  extends: [
    'plugin:react-hooks/recommended',
    'plugin:jest/recommended',
    '@kyeotic/eslint-config',
    'plugin:@typescript-eslint/recommended',
  ],
  rules: {
    'react/display-name': 0,
    'import/extensions': 0,
    'import/no-unresolved': 0,
    'no-use-before-define': 'off',
    '@typescript-eslint/no-use-before-define': ['error', { functions: false }],
    'arrow-body-style': 0,
    'no-unused-expressions': 0,
    '@typescript-eslint/no-unused-expressions': ['error'],
    '@typescript-eslint/no-explicit-any': 0,
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
