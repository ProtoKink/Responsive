import eslint from '@eslint/js';
import stylistic from '@stylistic/eslint-plugin';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import { defineConfig } from 'eslint/config';

export default defineConfig(
  eslint.configs.recommended,
  tseslint.configs.recommended,
  {
    ignores: ['dist/']
  },
  {
    plugins: {
      '@typescript-eslint': tseslint.plugin,
      '@stylistic-eslint': stylistic
    },
    rules: {
      '@stylistic-eslint/indent': ['warn', 2],
      '@stylistic-eslint/quotes': ['warn', 'single'],
      '@stylistic-eslint/semi': ['warn', 'always'],
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': ['warn', {
        'args': 'all',
        'argsIgnorePattern': '^_',
        'caughtErrors': 'all',
        'caughtErrorsIgnorePattern': '^_',
        'destructuredArrayIgnorePattern': '^_',
        'varsIgnorePattern': '^_',
      }],
      'eqeqeq': ['warn', 'always'],
    },
    languageOptions: { globals: { ...globals.browser } },
  },
);