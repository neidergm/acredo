import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      globals: globals.browser,
    },
    rules: {
      '@typescript-eslint/consistent-type-imports': [
        'error',
        { prefer: 'type-imports', fixStyle: 'inline-type-imports' },
      ],
      // '@react-hooks/exhaustive-deps': 'off',
      // // Alinear con tsconfig (`noUnusedLocals`/`noUnusedParameters` ya ignoran prefix `_`).
      // '@typescript-eslint/no-unused-vars': ['error', {
      //   argsIgnorePattern: '^_',
      //   varsIgnorePattern: '^_',
      //   caughtErrorsIgnorePattern: '^_',
      //   destructuredArrayIgnorePattern: '^_',
      //   ignoreRestSiblings: true,
      // }],
      // // Permitir short-circuit (`a && fn()`) y ternarios como statements — son
      // // patrones idiomáticos de fire-and-forget usados en todo el codebase.
      // '@typescript-eslint/no-unused-expressions': ['error', {
      //   allowShortCircuit: true,
      //   allowTernary: true,
      // }],
    },
  },
])
