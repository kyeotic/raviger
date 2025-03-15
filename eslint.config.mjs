import { defineConfig } from 'eslint/config'
import reactHooks from 'eslint-plugin-react-hooks'
import jest from 'eslint-plugin-jest'
import eslint from '@eslint/js'
import tseslint from 'typescript-eslint'

export default tseslint.config(
  // This global ignore syntax is maximum wtf
  { ignores: ['node_modules/', 'coverage/', 'dist/', 'example/'] },
  {
    extends: [
      eslint.configs.recommended,
      tseslint.configs.recommended,
      // reactHooks.configs.recommended,
      // jest.configs.recommended,
    ],
    files: ['{src,test}/**/*.{ts,tsx}'],

    plugins: {
      jest,
      'react-hooks': reactHooks,
    },
    rules: {
      'react/display-name': 0,
      '@typescript-eslint/no-use-before-define': ['error', { functions: false }],
      '@typescript-eslint/ban-ts-comment': 0,
    },
  },
)
