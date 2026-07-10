<!--
  Thanks for contributing!

  Fill in every section. Do not delete a checklist item — check it,
  leave it unchecked, or mark it N/A with a one-line reason.
  Claims must be evidence-based: link to commits, command output, or
  screenshots rather than asserting "done".
-->

## Description

<!--- Describe your changes in detail: what changed and why. -->

## Type of Change

<!--- Put an `x` in all the boxes that apply: -->

- [ ] ✨ New feature (page, section, component)
- [ ] 🛠️ Bug fix (non-breaking change which fixes an issue)
- [ ] ❌ Breaking change (changes existing routes or the i18n contract)
- [ ] 🧹 Code refactor
- [ ] ✅ Build/CI configuration change
- [ ] 📝 Documentation only
- [ ] 🗑️ Chore

## Quality agreement

<!--- Put an `x` in EVERY box that applies. If a box does not apply, write "N/A — <reason>" next to it instead of leaving it blank. -->

### Code changes (`src/`, `app/`)

- [ ] ✅ `npm run lint` passes with no new warnings/errors
- [ ] ✅ `npm run typecheck` passes (`tsc --noEmit`, strict mode)
- [ ] ✅ `npm test` passes locally
- [ ] 📊 Every touched source file is at **100%** coverage — the gate (`npm run test:coverage:check`, mirrored by the pre-push hook) is **per-file**, not an average — lowest file: __%
- [ ] 🧩 New component pairs a `.tsx` with a `.module.css`, uses **named exports only**, and has a colocated `.test.tsx`
- [ ] 🎨 No inline styles or hardcoded colors — uses design tokens in [src/styles/tokens.css](../src/styles/tokens.css)

### Internationalization (`messages/`)

- [ ] 🔤 No hardcoded user-facing strings in components — all text goes through `next-intl` (`es-419` is the source of truth)

### General

- [ ] 🧪 Manual verification performed (describe below) — not just type-checking/tests
- [ ] 📝 Commit messages follow Conventional Commits
- [ ] 🌿 Branch name follows `{type}/{description}`
- [ ] 🙅 No environment variables or secrets committed into source control

## Tests

<!-- What was tested and how. Required even for docs-only PRs if behavior is affected. -->
-

## Documentation

<!-- Docs/README/CLAUDE.md updates, with links/paths. -->
-

## Evidence

<!-- Command output, screenshots, logs, or links that prove the change works. -->
-
