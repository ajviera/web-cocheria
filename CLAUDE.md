# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

Single-page institutional site (landing) for **Cochería Nogués & Martínez**,
a funeral home in José C. Paz, Provincia de Buenos Aires, Argentina. A sober,
serene, and professional register. No backend or database: it is a static
marketing site rendered with the Next.js App Router.

## Stack

- **Next.js 16** (App Router) + **React 19** + strict **TypeScript**.
- **next-intl v4** with a single `es-419` locale (Rioplatense Spanish).
- **CSS Modules** + design tokens in `src/styles/tokens.css`. No Tailwind or CSS-in-JS.
- **Jest + React Testing Library** (jsdom), 100% per-file coverage.
- **Vercel** for deploy, with `@vercel/analytics` and `@vercel/speed-insights`.
- Import alias: `@/*` → `src/*`.

## Commands

| Command | What it does |
| --- | --- |
| `npm run dev` | Development server (`next dev`). |
| `npm run build` | Production build (`next build`). |
| `npm start` | Serves the production build (`next start`). |
| `npm run lint` | ESLint over the whole repo (`eslint .`). |
| `npm run typecheck` | Strict type checking (`tsc --noEmit`). |
| `npm test` | Runs Jest once. |
| `npm run test:watch` | Jest in watch mode. |
| `npm test -- --testPathPatterns Nav` | Runs a single test file/folder (by-path pattern). |
| `npm run test:coverage` | Jest with a coverage report. |
| `npm run test:coverage:check` | Coverage + **per-file** 100% gate (`scripts/check-coverage.js`). |

## Project structure

```
app/                      # App Router: root layout + page
  layout.tsx              # Fonts (next/font), NextIntlClientProvider, Analytics
  page.tsx                # Renders <Landing />
src/
  components/             # Shared: nav/, footer/, theme-toggle/
  contexts/               # ThemeContext.tsx (light/dark)
  config/site.ts          # SITE + telHref/whatsappHref helpers (reads NEXT_PUBLIC_*)
  features/landing/       # Sections: hero/, services/, about/, contact/
    Landing.tsx           # Composes ThemeProvider > Nav > sections > Footer
  i18n/                   # config.ts (locales) + request.ts (server-side resolution)
  styles/                 # tokens.css (design tokens) + global.css
  test-utils/             # render-with-intl.tsx (RTL wrapper with i18n provider)
  types/                  # shared types
messages/es-419.json      # Single translation catalog (source of truth for texts)
scripts/check-coverage.js # Per-file coverage gate
.githooks/pre-push        # lint + typecheck + coverage gate before push
.claude/rules/            # React/TS style rules for the harness
```

Each component lives in its own folder with a barrel `index.ts` that does a named
re-export (e.g. `src/components/nav/{Nav.tsx, Nav.module.css, index.ts}`).

## Non-obvious facts

- **Single locale with no URL prefix.** Only `es-419` exists and routes do NOT carry
  a locale prefix. The locale is resolved **server-side** in `src/i18n/request.ts`
  by reading the `NEXT_LOCALE` cookie (fallback to `es-419`). There is no i18n routing
  or language selector; do not add new languages unless explicitly requested.
- **Texts via i18n, always.** No visible string is hardcoded in components:
  everything goes through `next-intl` and lives in `messages/es-419.json`. That file is
  the source of truth for the texts.
- **Contact data via environment.** Public data (phone, WhatsApp,
  address) is read from `NEXT_PUBLIC_*` variables in `src/config/site.ts`
  (`SITE` object). There is NO email on the site; the channels are WhatsApp, phone,
  and address. Use the `telHref` and `whatsappHref` helpers to build the links.
- **Light theme by default, with a toggle.** The theme starts light to match
  the server render (avoids a hydration mismatch); the value persisted
  in `localStorage` (`cocheria-theme`) is adopted after mount. The theme is
  reflected as `data-theme="dark"` on `<html>` and the CSS tokens react to that.
- **No hardcoded colors.** Every color/style comes from the tokens in
  `src/styles/tokens.css` (light theme in `:root`, dark in `[data-theme='dark']`).
  No inline styles or loose hex values in components.
- **Per-file 100% coverage.** The gate (`test:coverage:check`, mirrored by
  the `pre-push` hook) requires 100% on **every** non-excluded file, not an average.
  Do NOT run `--coverage` after each edit: it is slow. Use `npm test` (or a
  targeted pattern with `--testPathPatterns`) during development and leave the coverage
  gate for before pushing.
- **Fonts via `next/font/google`** in `app/layout.tsx`: `Inter` (`--font-inter`,
  sans) and `Cormorant_Garamond` (`--font-cormorant`, serif), exposed as
  CSS variables on `<html>` and referenced from the tokens (`--font-sans`,
  `--font-serif`).

## Environment variables

Defined in `.env` (public, no secrets; local overrides in `.env.local`):

| Variable | Example | Use |
| --- | --- | --- |
| `NEXT_PUBLIC_CONTACT_PHONE` | `15-6151-2447` | Phone to display. |
| `NEXT_PUBLIC_CONTACT_TEL` | `+5491161512447` | `href="tel:"` (international format). |
| `NEXT_PUBLIC_CONTACT_WHATSAPP` | `5491161512447` | `wa.me` link (digits only). |
| `NEXT_PUBLIC_CONTACT_ADDRESS` | `Av. Gaspar Campos 4848, José C. Paz, Buenos Aires` | Address. |

`jest.setup.ts` sets these same values so the tests are deterministic.

## Conventions

- **Feature-folders + barrels.** Each component/section in its own folder, with
  an `index.ts` that re-exports. **Named exports only** (no `default` in components).
- **`.tsx` + `.module.css` together.** Each component pairs with its stylesheet.
- **Colocated tests.** The `*.test.tsx` files live next to the component they test;
  use `src/test-utils/render-with-intl.tsx` to wrap with the i18n provider.
- **Client components** (`'use client'`) only where interactivity is needed
  (theme, nav). The layout and pages are Server Components.
- **Commits** in Conventional Commits; **branches** `{type}/{description}` (create
  a branch only if explicitly requested).
- **Documentation in English.** All project documentation is written in English:
  `README.md`, this `CLAUDE.md`, everything under `spec-docs/`, and the Claude Code
  harness files (`.claude/rules/*.md`, `.githooks/README.md`, the PR template).
  This is independent of the product: the **website content stays in Spanish only**
  (`es-419`). When a doc quotes copy destined for the site (i18n string values, meta
  `title`/`description`, hero/FAQ text, addresses, contact data), keep that copy
  **verbatim in Spanish**; translate only the surrounding prose.

## Code rules

When writing or reviewing React/TypeScript code, follow the harness rules:

- @.claude/rules/react-components.md
- @.claude/rules/react-hooks.md
- @.claude/rules/react-performance.md
- @.claude/rules/react-state.md
- @.claude/rules/react-testing.md
- @.claude/rules/react-typescript.md
