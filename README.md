# Cochería Nogués & Martínez

Institutional website for **Cochería Nogués & Martínez**, a funeral services
company in **José C. Paz, Provincia de Buenos Aires, Argentina**. It is a
single-page landing that introduces the funeral home, its services and its
contact channels, with service 24 hours a day, 365 days a year.

The site aims for a **sober, elegant, serene and professional** register, in
keeping with the field: supporting families with respect and warmth in the most
difficult moments.

## Services presented

- Comprehensive and personalized funeral services.
- National and international transfers (including repatriation).
- Home wakes with mourning chapel.
- Floral arrangements.
- Burials, cremations and paperwork management (including PAMI).

## Stack

- **Next.js 16** (App Router) + **React 19** + strict **TypeScript**.
- **next-intl v4** — single locale `es-419` (Rioplatense Spanish).
- **CSS Modules** + design tokens (`src/styles/tokens.css`). No Tailwind or CSS-in-JS.
- **Jest + React Testing Library** — 100% per-file coverage.
- **Vercel** — deploy, Analytics and Speed Insights.

## Structure

```
app/                    # App Router (root layout + page)
src/
  components/           # Shared: nav, footer, theme-toggle
  contexts/             # ThemeContext (light/dark)
  config/site.ts        # Contact data from NEXT_PUBLIC_*
  features/landing/     # Sections: hero, services, about, contact + Landing.tsx
  i18n/                 # Locale configuration and resolution
  styles/               # Design tokens and global styles
  test-utils/           # Testing helpers (render with i18n)
messages/es-419.json    # Text catalog (source of truth)
```

## Getting started

Requires Node.js 20+ and npm.

```bash
npm install
npm run dev
```

The site becomes available at `http://localhost:3000`.

## Environment variables

The contact data is public (no secrets) and lives in `.env`. For a local copy you
can override it in `.env.local` (ignored by git):

| Variable | Example | Use |
| --- | --- | --- |
| `NEXT_PUBLIC_CONTACT_PHONE` | `15-6151-2447` | Phone number to display. |
| `NEXT_PUBLIC_CONTACT_TEL` | `+5491161512447` | `tel:` link. |
| `NEXT_PUBLIC_CONTACT_WHATSAPP` | `5491161512447` | `wa.me` link (digits only). |
| `NEXT_PUBLIC_CONTACT_ADDRESS` | `Av. Gaspar Campos 4848, José C. Paz, Buenos Aires` | Address. |

There is no email: the contact channels are WhatsApp, phone and address.

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Development server. |
| `npm run build` | Production build. |
| `npm start` | Serves the production build. |
| `npm run lint` | ESLint. |
| `npm run typecheck` | Type checking (`tsc --noEmit`). |
| `npm test` | Runs the tests. |
| `npm run test:watch` | Tests in watch mode. |
| `npm run test:coverage` | Tests with coverage report. |
| `npm run test:coverage:check` | Coverage + 100% per-file gate. |

To run a single test: `npm test -- --testPathPatterns Nav`.

## Testing and coverage

The tests use Jest + React Testing Library and are colocated next to each
component (`*.test.tsx`). Coverage is required **per file** at 100% (statements,
branches, functions and lines), not as an average: `scripts/check-coverage.js`
walks the coverage summary and fails if any non-excluded file falls below.

The `pre-push` hook (`.githooks/pre-push`) runs lint, typecheck and the coverage
gate before every push. Enable it once per clone:

```bash
git config core.hooksPath .githooks
```

During development it is best to use `npm test` (fast) and leave
`test:coverage:check` for before pushing.

## Internationalization

All visible text is managed with `next-intl` and lives in `messages/es-419.json`
(source of truth). The site has a single locale (`es-419`) and the URLs carry no
language prefix; the locale is resolved server-side from a cookie. No strings are
hardcoded in the components.

## Themes (light/dark)

The theme starts in **light** (matching the server render) and adopts the value
persisted in `localStorage` after mount. The toggle reflects the theme as
`data-theme` on `<html>` and all colors come from the design tokens in
`src/styles/tokens.css` — colors are never hardcoded and inline styles are never
used.

## Deployment

The site is deployed on **Vercel**. Every push to the main branch triggers a
deploy; pull requests get preview deploys. Vercel Analytics and Speed Insights
are already integrated into the layout. Set the `NEXT_PUBLIC_CONTACT_*` variables
in the Vercel project for production.

## Conventions

- **Feature-folders + barrels**: each component/section in its own folder with a
  re-exporting `index.ts`; **named exports only**.
- **`.tsx` + `.module.css`** together per component; **colocated tests**.
- **No hardcoded colors or styles**: everything via design tokens.
- **Commits** in Conventional Commits; **branches** `{type}/{description}`.

---

For guides on working with Claude Code in this repo, see [`CLAUDE.md`](./CLAUDE.md).
