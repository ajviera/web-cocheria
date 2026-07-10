# SEO Implementation — Completion Report

**Project:** Cochería Nogués & Martínez (José C. Paz, Buenos Aires)
**Date:** 2026-07-10
**Scope:** Phase P0 + P1 of `spec-docs/seo-spec.md`, mapped against the Section 12 Acceptance Checklist (Definition of Done).
**Branch:** `main` (working tree, uncommitted).

---

## Summary

This change set makes the static landing crawlable, shareable, and machine-readable. It ships the full P0 metadata surface (`generateMetadata` with `metadataBase`, canonical, Open Graph, Twitter, and robots directives), the crawl-control routes (`app/robots.ts`, `app/sitemap.ts`), and a `FuneralHome` JSON-LD block injected in the root layout. On top of that it ships the P1 layer that is expressible in code: a PWA `app/manifest.ts`, a visible FAQ section backed by `FAQPage` structured data, an embedded location map in Contact, structured-address env plumbing, and SEO-tuned i18n copy (title, description, hero body). Lint, typecheck, and the per-file 100% coverage gate are all green.

What is intentionally **not** in this change set is everything that depends on facts we do not own: the real production domain, binary brand/social image assets, exact geo coordinates, and truthful E-E-A-T / operational tasks (Google Business Profile, citations). Those are enumerated under "Deferred / blocked" with the reason each was left out, so nothing ships as fabricated or broken.

---

## Implemented (mapped to the DoD checklist)

### Phase P0

- **[done] `NEXT_PUBLIC_SITE_URL` + structured address env wiring.** Added to `.env` (marked as a placeholder — see Deferred), mirrored in `jest.setup.ts`, and exported as `SITE_URL` from `src/config/site.ts` (falls back to `http://localhost:3000` so `next dev` and tests never crash). Also added `NEXT_PUBLIC_CONTACT_LOCALITY` / `NEXT_PUBLIC_CONTACT_REGION` to feed the JSON-LD `PostalAddress`.
- **[done] `generateMetadata` full surface.** `app/layout.tsx` now emits `metadataBase`, `alternates.canonical: '/'`, `openGraph` (title/description/url/siteName/`locale: 'es_LA'`/type), `twitter` (`summary_large_image`), and `robots` (index/follow + `googleBot.max-image-preview: 'large'`). `app/layout.test.tsx` extended and green.
- **[done] `app/robots.ts` + `app/robots.test.ts`.** Two-branch logic: `allow: '/'` when `VERCEL_ENV === 'production'`, `disallow: '/'` otherwise; advertises `${SITE_URL}/sitemap.xml`. Both branches covered.
- **[done] `app/sitemap.ts` + `app/sitemap.test.ts`.** Single-URL sitemap (`priority: 1`, `changeFrequency: 'monthly'`) rooted at `SITE_URL`.
- **[done] `FuneralHome` JSON-LD in the layout.** `src/components/json-ld/{JsonLd.tsx, build-funeral-home-json-ld.ts}` with colocated tests. The builder emits `@type: FuneralHome`, `@id`, name/description/url/telephone/image, a `PostalAddress` (`addressCountry: 'AR'`), `areaServed`, and a 24/7 `OpeningHoursSpecification` (`00:00`–`23:59`, all days). `JsonLd` escapes `<` as `<` as defense-in-depth against `</script>` injection.
- **[done] `metadata.title` / `metadata.description` updated in i18n.** Now `"Cochería en José C. Paz | Nogués & Martínez — Atención 24 hs"` and `"Cochería en José C. Paz: sepelios, cremaciones, traslados y velatorios. Atención las 24 horas, los 365 días. Gestión PAMI. Contáctenos por WhatsApp."`
- **[done] Local phrase + urgency woven into `hero.body`.** Now reads `"...Como cochería en José C. Paz, disponemos de modernas salas velatorias... con contención y asesoramiento las 24 horas, los 365 días del año."` — local intent and urgency, no keyword stuffing.
- **[deferred] GBP created / verified.** Operational, not code — see Deferred.
- **[done] `lint`, `typecheck`, `test:coverage:check` green.** See Verification.

### Phase P1

- **[partial] Icon / social binary assets.** `app/manifest.ts` and the JSON-LD reference `/icon.png` and `/opengraph-image.png`, but the binary files (`favicon.ico`, `icon.png`, `apple-icon.png`, `opengraph-image.png` + `.alt.txt`) are **not** present. Next.js only emits the corresponding `<link rel="icon">` / `og:image` tags when the files exist, so this is code-ready but blocked on assets — see Deferred.
- **[done] `app/manifest.ts` + `app/manifest.test.ts`.** Localized `name`/`short_name` from `nav.brand`, `display: 'standalone'`, theme/background colors kept in sync with `tokens.css`, one `512x512` icon entry.
- **[done] Visible FAQ section + `FAQPage` structured data.** New `src/features/landing/faq/` (`Faq.tsx`, `.module.css`, `Faq.test.tsx`, barrel), six Q&A driven entirely by i18n (`primerasHoras`, `urgencia`, `pami`, `traslados`, `cremacionSepelio`, `costos`), native `<details>`/`<summary>` disclosure, and inline `FAQPage` JSON-LD built from the same i18n keys. Wired into `Landing.tsx` between `About` and `Contact`.
- **[partial] Truthful coverage copy + real E-E-A-T data.** The FAQ/service copy is deliberately hedged (PAMI/ANSES amounts, costs, and coverage stated as "confirmed with the family / consult us" rather than asserted). No E-E-A-T author/organization credentials were fabricated — see Deferred.
- **[done] Embedded map in Contact + extended test.** `Contact.tsx` renders a lazy Google Maps `<iframe>` (`output=embed`, address URL-encoded, `referrerPolicy="no-referrer-when-downgrade"`) with an i18n `title` (`contact.mapTitle`). `Contact.module.css` and `Contact.test.tsx` extended.
- **[deferred] Citations (Bing, Apple, Páginas Amarillas, social).** Operational — see Deferred.
- **[deferred] Conversion events (WhatsApp/tel measured).** Not implemented in this change set — no tracking calls were added to the WhatsApp/tel links — see Deferred.

### Phase P2 — not started (see Deferred)

- Semantic `<address>` in Contact/Footer.
- `verification.google` (needs the Search Console token).
- Documented `alt`/anchor convention for future images.

---

## Deferred / blocked (and why)

- **Production domain is a placeholder.** `.env` sets `NEXT_PUBLIC_SITE_URL=https://REEMPLAZAR-CON-DOMINIO-REAL.com.ar`. Until the real domain is set as an environment variable in Vercel, `metadataBase`, `canonical`, the sitemap URL, `robots`' sitemap pointer, and every absolute URL in the JSON-LD will point at the placeholder (or fall back to localhost). **This must be set in Vercel before the production deploy.**
- **Binary design assets are absent.** `favicon.ico`, `icon.png`, `apple-icon.png`, `opengraph-image.png`, and `opengraph-image.alt.txt` do not exist yet. Next.js **omits** the icon and `og:image` tags until these files are placed in `app/`, so the manifest's `/icon.png` and the JSON-LD's `/opengraph-image.png` currently resolve to nothing. These are design deliverables, not code, and cannot be invented.
- **Exact geo coordinates omitted from JSON-LD.** The builder intentionally emits no `geo` (lat/lng) block because we do not have verified coordinates; a `PostalAddress` + `areaServed` was shipped instead. Add `geo` once the exact coordinates are confirmed (ideally from the GBP pin).
- **Google Business Profile, citations, and reviews are operational.** GBP creation/verification (category "Funeraria", 24 hs, exact NAP), directory citations (Bing Places, Apple Maps, Páginas Amarillas, social profiles), and review generation cannot be done from the codebase. The NAP the site publishes must match these listings **exactly**.
- **Truthful E-E-A-T and coverage/locality copy needs client confirmation.** Any claim about years in business, staff credentials, exact coverage radius, PAMI/ANSES subsidy amounts, or licensing was left hedged rather than asserted, to avoid fabricating facts. The owner must confirm these before they can be stated as fact.
- **Conversion-event measurement (P1) deferred.** Measuring WhatsApp/tel clicks (e.g. via `@vercel/analytics`' `track`) was not implemented. It should be added once the analytics event taxonomy is agreed.
- **P2 items deferred by design.** Semantic `<address>` in Contact/Footer, `verification.google` (blocked on the Search Console token, which only exists after the domain is live and verified), and the documented image `alt`/anchor convention are follow-ups after the domain and assets land.

---

## Verification

Reported by the gate agent, run from the repo root:

| Check | Command | Result |
| --- | --- | --- |
| Lint | `npm run lint` | **Pass** (clean on first pass, no changes) |
| Typecheck | `npm run typecheck` | **Pass** (clean on first pass, no changes) |
| Coverage gate | `npm run test:coverage:check` | **Pass** — 17 suites / 41 tests, every file 100% stmts/branch/funcs/lines |

**One fix applied during the gate:** `src/features/landing/hero/Hero.test.tsx` asserted an old hero body string that no longer matched the SEO-updated `messages/es-419.json` `body` value. The test expectation was realigned to the current catalog string verbatim (`"Acompañamos a cada familia... Como cochería en José C. Paz, disponemos de modernas salas velatorias... con contención y asesoramiento las 24 horas, los 365 días del año."`). No source or i18n content was changed — only the stale test expectation. Coverage itself was already 100% per file; no thresholds were altered and no `eslint-disable` was introduced.

**Remaining blockers:** none in code. All open items are the operational / asset / domain dependencies listed above.

---

## Next actions for the client / owner (ordered)

1. **Set `NEXT_PUBLIC_SITE_URL` in Vercel** (Production + Preview) to the real domain, no trailing slash, matching exactly what the GBP will publish. **Do not deploy to production before this.**
2. **Provide the binary brand/social assets** so they can be placed in `app/`: `favicon.ico`, `icon.png` (512×512), `apple-icon.png`, `opengraph-image.png` (1200×630) and its `opengraph-image.alt.txt`. Until then the icon and `og:image` tags will not render.
3. **Confirm the exact geo coordinates** (from the GBP map pin) so a `geo` block can be added to the `FuneralHome` JSON-LD.
4. **Create and verify the Google Business Profile** — category "Funeraria", 24 hs hours, exact NAP identical to the site.
5. **Confirm the truthful E-E-A-T / coverage facts** (years in business, staff credentials, coverage area, PAMI/ANSES specifics) so the hedged copy can be firmed up where warranted.
6. **Register directory citations** (Bing Places, Apple Maps, Páginas Amarillas, social profiles) with the identical NAP.
7. **After the domain is live and verified in Search Console,** supply the verification token so `verification.google` (P2) can be added, then submit the sitemap.
8. **Agree the analytics event taxonomy** so WhatsApp/tel conversion tracking (P1) and the remaining P2 items (semantic `<address>`, image `alt`/anchor convention) can be scheduled.
