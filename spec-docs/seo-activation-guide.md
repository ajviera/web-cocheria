# SEO Activation Guide — step-by-step runbook (human-in-the-loop)

> **Companion to** `spec-docs/seo-spec.md` (the spec) and `spec-docs/seo-implementation-report.md` (what already shipped).
> **Purpose:** the P0+P1 **code** is implemented, tested, and green — but the SEO is **not yet 100% functional in production**. Everything that remains depends on facts or actions that live *outside the codebase* (a real domain, brand images, Google accounts, verified data). This document is the ordered, exact procedure to close that gap.
> **Audience:** an **agent driving a developer/owner**. Each step is discrete and checkable. Locale of the docs: English; any **site copy** is quoted **verbatim in Spanish (es-419)**.

---

## 0. How the agent should use this runbook

1. **Work top-to-bottom, respecting `Blocked by`.** Steps are ordered by dependency and by real ranking impact for a *local* funeral home.
2. **Before a step, collect its `Inputs required`** from the human. If an input is missing, **stop and ask** — never invent a domain, a coordinate, a founding year, a price, or a certification. Fabricated YMYL data can trigger a Google manual action.
3. **For every `Agent-assisted (code)` step**, after applying the change run the gate and keep it green:
   ```bash
   npm run lint && npm run typecheck && npm run test:coverage:check
   ```
   The repo enforces **100% per-file coverage** — if a code step adds a branch, add the test that covers it *in the same step*.
4. **After a step, tick its checkbox** (`- [ ]` → `- [x]`) and record the value the human provided in the "Input ledger" (§ end) so the run is resumable.
5. **Never commit or deploy without explicit approval** from the human (repo rule: work on the current branch, commit only when asked).

---

## 1. What is still missing (gap summary)

| # | Gap | Owner | Impact | Type |
| --- | --- | --- | --- | --- |
| 1 | Real production domain in Vercel (`NEXT_PUBLIC_SITE_URL`) | Human + Agent | **Critical** (unblocks everything) | Config |
| 2 | Brand/social binary assets (favicon, icons, OG image) | Human (design) + Agent | **Critical** (favicon + WhatsApp card) | Assets |
| 3 | Google Business Profile created, optimized, verified | Human | **Critical** (governs the Map Pack) | Operational |
| 4 | NAP consistency contract (site ↔ .env ↔ GBP) | Human + Agent | High | Operational |
| 5 | Search Console: register + verify + submit sitemap | Human + Agent | High | Operational + Code |
| 6 | Structured-data + Open Graph validation | Human + Agent | High | QA |
| 7 | Enrichment code gated on real data: `geo`, `sameAs`, `verification.google`, E-E-A-T, coverage localities | Agent (needs inputs) | Medium–High | Code |
| 8 | Directory citations (Bing, Apple, Páginas Amarillas, social) | Human | Medium | Operational |
| 9 | Reviews strategy + conversion tracking (WhatsApp/tel) | Human + Agent | Medium | Operational + Code |

**Dependency spine:** `1 domain` → (`2 assets`, `3 GBP`) → `4 NAP` → `5 Search Console` → `6 validation` → `7 enrichment` → (`8 citations`, `9 reviews/tracking`).

---

## 2. Input ledger (fill as you go)

The agent must obtain these from the human before the steps that consume them. Do not proceed on a placeholder.

| Key | Consumed by | Value (fill in) | Confirmed? |
| --- | --- | --- | --- |
| Production domain (no trailing slash) | Step 1 | `________` | ☐ |
| Brand assets delivered (5 files) | Step 2 | `________` | ☐ |
| Exact door coordinates `lat,lng` | Step 7a | `________` | ☐ |
| Public URLs for `sameAs` (GBP, FB, IG) | Step 7b | `________` | ☐ |
| Search Console verification (DNS TXT or meta token) | Step 5 / 7c | `________` | ☐ |
| Truthful E-E-A-T facts (year, licence, etc.) | Step 7d | `________` | ☐ |
| Truthful covered localities | Step 7e | `________` | ☐ |
| Analytics event names for WhatsApp/tel | Step 9 | `________` | ☐ |

---

## Step 1 — Set the real production domain
- [ ] **done**
- **Owner:** Human + Agent · **Impact:** Critical · **Blocked by:** —
- **Inputs required:** the confirmed production domain (e.g. `https://cocherianoguesymartinez.com.ar`), **no trailing slash**, exactly as it will be published in the Google Business Profile.

**Why first:** until this is set, `metadataBase`, `canonical`, the sitemap URL, `robots`' sitemap pointer, `og:url`, the absolute `og:image`, and every `url`/`@id` in the `FuneralHome` JSON-LD point at the placeholder (`https://REEMPLAZAR-CON-DOMINIO-REAL.com.ar`) or fall back to `localhost`. **Do not deploy to production before this.**

**Actions (human, in Vercel):**
1. Vercel → Project → **Settings → Environment Variables**.
2. Add `NEXT_PUBLIC_SITE_URL` = the real domain, scoped to **Production** *and* **Preview**.
3. Point the domain at the project (Settings → **Domains**) and confirm DNS.

**Actions (agent, in the repo):**
1. Update the committed baseline in `.env` — replace the placeholder line:
   ```bash
   # .env
   NEXT_PUBLIC_SITE_URL=https://<REAL-DOMAIN>       # ← no trailing slash
   ```
2. Leave `jest.setup.ts` as `http://localhost:3000` (tests stay deterministic).

**Verification / done when:**
- `npm run typecheck && npm run test:coverage:check` still green.
- On a Preview deploy, `curl -s https://<preview> | grep -i 'og:url\|canonical'` shows the real host (not the placeholder, not localhost).

---

## Step 2 — Deliver and place the brand/social assets
- [ ] **done**
- **Owner:** Human (design) + Agent · **Impact:** Critical (favicon + the **WhatsApp share card**, which is the primary channel) · **Blocked by:** Step 1 (OG image URL resolves against the domain)
- **Inputs required:** five files produced from the real logo mark / palette:

| File to place | Format / size | Notes |
| --- | --- | --- |
| `app/favicon.ico` | multi-size ICO (16/32) | browser tab |
| `app/icon.png` | PNG 512×512 | referenced by the manifest |
| `app/apple-icon.png` | PNG 180×180 | **no transparency** (iOS composites on black) |
| `app/opengraph-image.png` | PNG **exactly 1200×630**, < 300 KB | name + tagline legible as a WhatsApp thumbnail |
| `app/opengraph-image.alt.txt` | 1 line of plain text | alt in Spanish |

**Why:** Next.js only emits `<link rel="icon">` / `og:image` when these convention files exist. Right now the manifest's `/icon.png` and the JSON-LD's `/opengraph-image.png` resolve to nothing. Never ship an `image` pointing to a 404 — absent is better than broken.

**Actions (agent):**
1. Place the delivered files at the exact paths above (they are binaries — no code, no test).
2. Create `app/opengraph-image.alt.txt` with, verbatim:
   ```text
   Cochería Nogués & Martínez — Servicios Fúnebres en José C. Paz, Buenos Aires
   ```

**Verification / done when:**
- `npm run build` succeeds; the built HTML contains `og:image`, `apple-icon`, and `icon` tags.
- Continue to Step 6 to validate the card renders in a real WhatsApp chat.

---

## Step 3 — Create, optimize and verify the Google Business Profile (GBP)
- [ ] **done**
- **Owner:** Human · **Impact:** Critical — for a neighbourhood funeral home the **GBP governs the Map Pack**, which resolves most searches. The site only *reinforces* it. · **Blocked by:** Step 1 (for the "Website" link)
- **Inputs required:** access to `business.google.com`; the canonical NAP from `.env` (`NEXT_PUBLIC_CONTACT_*`); 10–15 real photos (façade, wake rooms, vehicles, team — with consent).

**Actions (human) — follow `seo-spec.md` §8.1 exactly:**
1. Claim/create with the **exact** name `Cochería Nogués & Martínez` — **no extra keywords** in the name (violates guidelines → suspension).
2. Primary category **"Funeraria"**; secondaries if truthful: "Servicio de cremación", "Floristería", "Servicio de traslado".
3. Address `Av. Gaspar Campos 4848, José C. Paz, Buenos Aires, 1665, Argentina` — **character-for-character** identical to `NEXT_PUBLIC_CONTACT_ADDRESS`.
4. Phone `+5491161512447` / `15-6151-2447` — same as `.env`.
5. Hours: **"Abierto las 24 horas"**, all 7 days.
6. Service area: José C. Paz + (only if truthful) Del Viso, Pilar, San Miguel, Malvinas Argentinas, Los Polvorines, Grand Bourg.
7. Upload the photos; set attributes and payment methods; set the **"Website"** link to the real domain from Step 1.
8. **Verify** the profile (mail/phone/video) — it does not rank until verified.

**Verification / done when:** the profile is **Verified**, shows 24 hs, and its pin drops on the correct door (note the pin's lat/lng — you'll need it in Step 7a).

---

## Step 4 — NAP consistency contract
- [ ] **done**
- **Owner:** Human + Agent · **Impact:** High (inconsistent NAP is the #1 cause of Google distrust) · **Blocked by:** Steps 1, 3

**Actions (agent):** confirm the site never hardcodes contact data — it must always flow from `SITE` in `src/config/site.ts`. Quick audit:
```bash
grep -rnE '5491161512447|Gaspar Campos|15-6151-2447' src app --include=*.tsx --include=*.ts | grep -v config/site.ts
```
Expected: no hits outside `src/config/site.ts` (tests and the address string may legitimately appear — verify each is fed from `SITE`).

**Actions (human):** keep a one-line canonical NAP block (name / address / phone) and paste it **identically** into every listing in Steps 3 and 8. Always "José C. Paz" **with the accent and the period**.

**Verification / done when:** site, `.env`, and GBP show byte-identical name, address, and phone.

---

## Step 5 — Register Search Console, verify the domain, submit the sitemap
- [ ] **done**
- **Owner:** Human + Agent · **Impact:** High · **Blocked by:** Step 1 (domain live)
- **Inputs required:** access to `search.google.com/search-console`; ability to add a DNS TXT record (or capture the HTML meta token).

**Actions (human):**
1. Add a **Domain property** for the real domain.
2. Verify via the **DNS TXT** record Google provides (recommended for a domain property). *(If you can only use a URL-prefix property, capture the HTML meta token instead → that feeds Step 7c.)*
3. After verification, submit the sitemap: `https://<REAL-DOMAIN>/sitemap.xml`.
4. Request indexing for the home URL.

**Verification / done when:** Search Console shows the property **Verified**, the sitemap **Success** (1 URL read), and (within days) the home indexed with no coverage errors.

---

## Step 6 — Validate structured data and the Open Graph card
- [ ] **done**
- **Owner:** Human + Agent · **Impact:** High (WhatsApp is the main channel) · **Blocked by:** Steps 1, 2

**Actions:**
1. **Rich Results Test / Schema Markup Validator** on the live URL → the `FuneralHome` and `FAQPage` blocks must show **zero errors** (warnings for optional fields like `geo`/`sameAs`/`aggregateRating` are expected until Step 7; do **not** silence them by inventing data).
2. **Open Graph:** paste the live URL into a **real WhatsApp chat** and a Facebook sharing debugger → the card must show title, description, and the 1200×630 image from Step 2.
3. Note the FAQ realism caveat from `seo-spec.md` §7.6: since 2023 Google rarely shows the `FAQPage` rich snippet for non-gov/health sites — the FAQ's value here is on-page content, not the snippet. Do not treat a missing snippet as a bug.

**Verification / done when:** validators are error-free and the WhatsApp card renders with the image.

---

## Step 7 — Enrichment code (each sub-step gated on a real input)

> These are **`Agent-assisted (code)`** steps. Apply each **only** once its input is confirmed. Each must keep the 100% coverage gate green — where a sub-step adds a conditional to the JSON-LD builder, add both branch tests in the same sub-step.

### Step 7a — Add `geo` coordinates to the JSON-LD
- [ ] **done** · **Blocked by:** Step 3 · **Input:** exact `lat,lng` of number 4848 (ideally read off the verified GBP pin). **Do not invent** — if unknown, skip and leave `geo` omitted.

**Actions (agent):**
1. Add coordinates to `.env` (public, no secret) and mirror in `jest.setup.ts`:
   ```bash
   # .env
   NEXT_PUBLIC_CONTACT_LAT=-34.52395
   NEXT_PUBLIC_CONTACT_LNG=-58.75487
   ```
2. Derive them in `src/config/site.ts` (this file is coverage-excluded, so parsing lives here):
   ```ts
   // add inside SITE
   latitude: process.env.NEXT_PUBLIC_CONTACT_LAT ? Number(process.env.NEXT_PUBLIC_CONTACT_LAT) : undefined,
   longitude: process.env.NEXT_PUBLIC_CONTACT_LNG ? Number(process.env.NEXT_PUBLIC_CONTACT_LNG) : undefined,
   ```
3. Extend the pure builder `src/components/json-ld/build-funeral-home-json-ld.ts` — add optional params and a conditional spread so the field only appears when present:
   ```ts
   // params
   latitude?: number;
   longitude?: number;
   // in the returned object, after `areaServed`:
   ...(latitude !== undefined && longitude !== undefined
     ? { geo: { '@type': 'GeoCoordinates', latitude, longitude } }
     : {}),
   ```
4. Pass `latitude: SITE.latitude, longitude: SITE.longitude` in the `buildFuneralHomeJsonLd({...})` call in `app/layout.tsx`.
5. **Coverage:** in `build-funeral-home-json-ld.test.ts` add two cases — one **with** and one **without** coordinates — to cover both branches.

**Verification:** gate green; Rich Results Test now shows a `geo` with the correct pin.

### Step 7b — Add `sameAs` (official profiles)
- [ ] **done** · **Blocked by:** Steps 3, 8 · **Input:** the real public URLs (GBP short link, Facebook, Instagram). Only add profiles that **exist**.

**Actions (agent):**
1. `.env` (+ `jest.setup.ts`): `NEXT_PUBLIC_SAMEAS=https://facebook.com/...,https://instagram.com/...` (comma-separated).
2. `src/config/site.ts`: `sameAs: (process.env.NEXT_PUBLIC_SAMEAS ?? '').split(',').map(s => s.trim()).filter(Boolean)`.
3. Builder: add `sameAs?: readonly string[]` and `...(sameAs && sameAs.length > 0 ? { sameAs } : {})`.
4. Pass `sameAs: SITE.sameAs` from `app/layout.tsx`.
5. **Coverage:** add builder test cases for the empty and non-empty branches.

**Verification:** gate green; `sameAs` array present in the validated JSON-LD.

### Step 7c — Add `verification.google` (only if using a URL-prefix / meta-tag verification)
- [ ] **done** · **Blocked by:** Step 5 · **Input:** the Search Console **HTML meta** token. *(If you verified by DNS TXT in Step 5, this sub-step is optional — skip it.)*

**Actions (agent):**
1. `.env`: `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION=<token>`.
2. In `app/layout.tsx` `generateMetadata`, add a **conditional** field so nothing is emitted when unset:
   ```ts
   const gsv = process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION;
   // in the returned Metadata object:
   ...(gsv ? { verification: { google: gsv } } : {}),
   ```
3. **Coverage:** `app/layout.test.tsx` must cover **both** branches (token set / unset) — add a test that sets the env var and asserts `metadata.verification.google`, keeping the existing unset assertion.

**Verification:** gate green; live `<head>` contains `<meta name="google-site-verification" ...>`.

### Step 7d — Firm up truthful E-E-A-T copy
- [ ] **done** · **Blocked by:** — · **Input:** owner-confirmed verifiable facts (year of founding, municipal licence, area). **Do not fabricate track record or certifications.**

**Actions (agent):** add the confirmed fact to an existing i18n key in `messages/es-419.json` — a sentence in `about.body1`/`about.body2` or a new item under `about.highlights` — **verbatim Spanish**, sober register, no superlatives. Example shape (replace with the real, confirmed value):
```json
"about": { "highlights": { "trayectoria": "Más de XX años acompañando a las familias de José C. Paz" } }
```
If a new `highlights` key is added, wire it in `About.tsx` and extend `About.test.tsx` to keep coverage at 100%.

**Verification:** gate green; the claim is truthful and backed by the owner.

### Step 7e — Truthful coverage-area copy + `areaServed`
- [ ] **done** · **Blocked by:** Step 3 · **Input:** the list of localities where service is **actually** provided (transfers/wakes). Max 5–6, **no repetition/stuffing**.

**Actions (agent):**
1. Add one sober paragraph as a new i18n key (e.g. `contact.coverage` or `about.coverage`), verbatim Spanish, e.g.:
   > `"Brindamos servicio en José C. Paz y zonas aledañas: Del Viso, Pilar, San Miguel, Malvinas Argentinas, Los Polvorines y Grand Bourg."`
2. Render it in the relevant section and extend that section's test.
3. *(Optional, coverage-safe)* upgrade the JSON-LD `areaServed` from the single string to an array of `City` objects built from the same list; add builder branch tests.

**Verification:** gate green; copy mentions only real localities.

---

## Step 8 — Directory citations (operational)
- [ ] **done**
- **Owner:** Human · **Impact:** Medium · **Blocked by:** Step 4 (canonical NAP)

**Actions (human) — in priority order (`seo-spec.md` §8.3):** 1) GBP (done), 2) **Bing Places for Business**, 3) **Apple Business Connect / Apple Maps** (heavy iPhone use in AR), 4) **Páginas Amarillas Argentina** ("Funerarias"), 5) provincial funeral chambers if any, 6) **Facebook Business + Instagram** (these feed `sameAs` → Step 7b), 7) José C. Paz chamber/business directory. Paste the **identical** NAP everywhere.

**Verification / done when:** each listing is live with the canonical NAP; the social URLs are handed back for Step 7b.

---

## Step 9 — Reviews strategy + conversion tracking
- [ ] **done**
- **Owner:** Human + Agent · **Impact:** Medium · **Blocked by:** Step 3 (reviews), Step 1 (tracking live)

**Reviews (human) — sensitive niche, `seo-spec.md` §8.4:** ask **days/weeks after** the service (never same day), by WhatsApp, respectfully; **never** offer incentives; respond to **all** reviews within 24–48 h (empathetic, no data about the deceased/family); no templates, no bought/exchanged reviews.

**Conversion tracking (agent) — `Agent-assisted (code)`:** · **Input:** agreed event names (e.g. `whatsapp_click`, `tel_click`).
1. Instrument the WhatsApp and `tel:` links with `@vercel/analytics`' `track(...)` on click. The link markup lives in `Contact.tsx` (and the Hero/Nav CTAs); adding an `onClick` handler requires those to be client components — add `'use client'` where needed or extract a small tracked-link client component.
2. **Coverage:** add tests asserting `track` is called with the agreed event name on click (mock `@vercel/analytics`); keep every touched file at 100%.
3. Cross-reference these events with GBP calls/directions. **GA4 is optional** (product decision — decide with the owner; not required, `@vercel/analytics` already covers measurement).

**Verification / done when:** clicking WhatsApp/tel fires the event (visible in Vercel Analytics) and the gate is green.

---

## Step 10 — P2 polish (optional, after the above)
- [ ] Semantic `<address>` wrapping the address in `Contact`/`Footer` (extend the relevant tests).
- [ ] Documented `alt`/anchor-text convention for future images (`seo-spec.md` §7 P2 / §13).
- [ ] *(Alternative, only if a static OG asset is ever unwanted)* dynamic OG image via `ImageResponse` — see `seo-spec.md` §4 / §6 P2 (needs a coverage exclusion).

---

## 11. Definition of "100% functional" (final acceptance)

The SEO is functionally complete when **all** of the following hold:
- [ ] `NEXT_PUBLIC_SITE_URL` is the real domain in Vercel (Prod+Preview); no placeholder/localhost in the live HTML.
- [ ] Favicon renders and the **WhatsApp share card** shows the 1200×630 image.
- [ ] GBP is **verified**, category "Funeraria", 24 hs, NAP identical to the site.
- [ ] Search Console: property **verified**, sitemap **submitted & read**, home **indexed**, no coverage errors.
- [ ] `FuneralHome` + `FAQPage` validate with **zero errors** in the Rich Results Test.
- [ ] Enrichment applied for every input the owner could confirm (`geo`, `sameAs`, E-E-A-T, coverage) — and honestly omitted for any they could not.
- [ ] Citations live with the canonical NAP; reviews process in place.
- [ ] WhatsApp/tel conversion events measured.
- [ ] `npm run lint && npm run typecheck && npm run test:coverage:check` green after every code step.

> **Golden rule for the driving agent:** when an input is missing, *ask* — never fabricate. In this YMYL industry, an honest omission is always better than an invented fact.
