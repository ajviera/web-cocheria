# Git hooks

Versioned git hooks for this repo. They live here (instead of `.git/hooks`, which
is not tracked) so everyone shares the same checks.

## Enable

Run once per clone:

```bash
git config core.hooksPath .githooks
```

## Hooks

### `pre-push`

Runs the web-cocheria quality gates and **blocks the push** unless all pass:

1. `npm run lint` — ESLint (`eslint-config-next`)
2. `npm run typecheck` — `tsc --noEmit` (strict mode)
3. `npm run test:coverage:check` — Jest with coverage, then a **per-file** gate
   (via `scripts/check-coverage.js`) that fails if any non-excluded source file
   is below **100%** on statements, branches, functions, or lines. When the gate
   fails it lists every offending file/metric.

On a fresh clone with no `node_modules`, the hook runs `npm ci` first.

- Skip only the (slow) coverage gate for one push: `SKIP_COVERAGE=1 git push`
  (still runs lint, typecheck, and the test suite).
- Bypass everything intentionally (e.g. docs-only change): `git push --no-verify`

Coverage exclusions (barrel `index.ts/tsx`, `src/types/`, `src/styles/`,
`src/i18n/`, `src/test-utils/`) are defined in `jest.config.mjs`.
