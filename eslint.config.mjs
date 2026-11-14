import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';

export default defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    rules: {
      // Imports entre features siempre por alias (@/...), nunca subiendo carpetas.
      'no-restricted-imports': ['error', { patterns: ['../../*'] }],
      'no-console': ['warn', { allow: ['warn', 'error'] }]
    }
  },
  globalIgnores(['.next/**', 'out/**', 'build/**', 'coverage/**', 'next-env.d.ts'])
]);
