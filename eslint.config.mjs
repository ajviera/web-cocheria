import * as espree from 'espree';
import nextCoreWebVitals from 'eslint-config-next/core-web-vitals';

/** @type {import('eslint').Linter.Config[]} */
const config = [
  {
    ignores: ['.next/**', 'coverage/**', 'next-env.d.ts'],
  },
  ...nextCoreWebVitals,
  {
    // eslint-config-next applies its bundled Babel parser
    // (next/dist/compiled/babel/eslint-parser) to every file. That parser does
    // not implement ScopeManager#addGlobals, which ESLint 10 now requires, so
    // linting plain JS/MJS files (e.g. config files) crashes. TS/TSX files are
    // unaffected because a later block reassigns the typescript-eslint parser.
    // Reset non-TS files to ESLint's default espree parser, which supports it.
    files: ['**/*.{js,cjs,mjs,jsx}'],
    languageOptions: {
      parser: espree,
    },
  },
  {
    // eslint-config-next 16 bundles eslint-plugin-react 7.37.5, whose "detect"
    // React-version path calls context.getFilename() — removed in ESLint 10 —
    // and crashes. Pinning an explicit version skips detection entirely.
    settings: {
      react: {
        version: '19.2',
      },
    },
    rules: {
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
    },
  },
];

export default config;
