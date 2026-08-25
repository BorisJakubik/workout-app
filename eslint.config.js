import js from '@eslint/js'
import reactHooks from 'eslint-plugin-react-hooks'
import tsParser from '@typescript-eslint/parser'
export default [js.configs.recommended, { files: ['src/**/*.{js,jsx,ts,tsx}'], languageOptions: { parser: tsParser, parserOptions: { ecmaFeatures: { jsx: true } }, globals: { window: 'readonly', document: 'readonly', crypto: 'readonly', fetch: 'readonly', console: 'readonly', FileReader: 'readonly' } }, plugins: { 'react-hooks': reactHooks }, rules: { ...reactHooks.configs.recommended.rules, 'react-hooks/set-state-in-effect': 'off', 'react-hooks/exhaustive-deps': 'off', 'no-unused-vars': ['off'] } }]
