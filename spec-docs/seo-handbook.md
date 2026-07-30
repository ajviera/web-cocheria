# SEO Handbook — Cochería Nogués & Martínez

> **What this is:** the single, ordered, agent-drivable runbook to take this site from
> "SEO code shipped but inert" to "SEO configured and working in production".
> **Audience:** an agent driving the developer/owner, step by step.
> **Companions:** `spec-docs/seo-spec.md` (the *why* and the full strategy — 908 lines, read on demand)
> and `spec-docs/seo-implementation-report.md` (what shipped on 2026-07-10).
> This handbook **supersedes** `spec-docs/seo-activation-guide.md`, whose state snapshot is stale
> (it predates the branding + landing-redesign commits).
>
> **Docs language:** English. **Site copy quoted here stays verbatim in Spanish (es-419).**
> **State verified against the working tree on 2026-07-30** (branch `main`, commit `56b70eb`).

---

## 0. Operating protocol for the driving agent

1. **Work top-to-bottom, respecting `Blocked by`.** The order encodes real dependencies and real
   ranking impact for a neighbourhood funeral home.
2. **Never fabricate.** No invented domain, coordinate, founding year, price, licence, review, or
   locality. This is a **YMYL** niche: an invented fact can earn a Google manual action and, worse,
   mislead a grieving family. When an input is missing → **stop and ask the human**. An honest
   omission always beats an invented value.
3. **Collect `Inputs required` before starting a step.** Record every value the human gives you in
   the **Input ledger** (§2) so the run is resumable across sessions.
4. **After every code step, keep the gate green:**
   ```bash
   npm run lint && npm run typecheck && npm run test:coverage:check
   ```
   The repo enforces **100% per-file** coverage (not an average). If a step adds a branch, add the
   test covering **both** sides *in the same step*. `src/config/**`, `src/i18n/**`, `src/types/**`,
   `src/styles/**`, `src/test-utils/**` and every `index.ts` are excluded from coverage
   (`jest.config.mjs`) — conditional env parsing belongs in `src/config/site.ts` for that reason.
5. **Tick the checkbox** (`- [ ]` → `- [x]`) when a step is verified, and commit the handbook update
   with the step's work.
6. **Do not commit, push, or deploy without explicit approval.** Repo rule: work on the current
   branch; never create a branch unless asked.
7. **One step = one commit** (Conventional Commits), so a failed step can be reverted alone.

---

## 1. Verified current state (2026-07-30)

### 1.1 Already shipped and working in code

| Area | Where | Notes |
| --- | --- | --- |
| Full metadata surface | [app/layout.tsx](app/layout.tsx) | `metadataBase`, `alternates.canonical: '/'`, Open Graph (`locale: 'es_LA'`), Twitter `summary_large_image`, `robots` incl. `googleBot['max-image-preview']: 'large'` |
| Crawl control | [app/robots.ts](app/robots.ts) | `allow: '/'` only when `VERCEL_ENV === 'production'`; otherwise `disallow: '/'` (previews stay out of the index) |
| Sitemap | [app/sitemap.ts](app/sitemap.ts) | Single URL, `priority: 1`, `changeFrequency: 'monthly'` |
| `FuneralHome` JSON-LD | [src/components/json-ld/build-funeral-home-json-ld.ts](src/components/json-ld/build-funeral-home-json-ld.ts) | `@id`, name/description/url/telephone/image, `PostalAddress` (`addressCountry: 'AR'`), `areaServed`, 24/7 `OpeningHoursSpecification` |
| `FAQPage` JSON-LD + visible FAQ | [src/features/landing/faq/Faq.tsx](src/features/landing/faq/Faq.tsx) | 6 Q&A, all from i18n, native `<details>`/`<summary>` |
| PWA manifest | [app/manifest.ts](app/manifest.ts) | Localized name, theme/background colors synced with `tokens.css`, one 512×512 icon |
| Heading hierarchy | landing sections | Exactly one `<h1>` (Hero), `<h2>` per section, `<h3>` per service card — **correct, don't touch** |
| Semantic landmarks | [src/features/landing/Landing.tsx](src/features/landing/Landing.tsx) | `<nav>` / `<main>` / `<section id>` / `<footer>` |
| Contact map + channels | [src/features/landing/contact/Contact.tsx](src/features/landing/contact/Contact.tsx) | Lazy Google Maps iframe with i18n `title`; WhatsApp/tel/directions links all fed from `SITE` |
| Hero LCP image | [src/features/landing/hero/Hero.tsx](src/features/landing/hero/Hero.tsx) | `next/image` with `fill`, `priority`, `sizes="100vw"`, descriptive i18n `alt` |
| App icon | `app/icon.png` | 512×512 PNG, present — Next emits `<link rel="icon">` |
| NAP single source | [src/config/site.ts](src/config/site.ts) | Phone/tel/WhatsApp/address/locality/region all from `NEXT_PUBLIC_*` |

### 1.2 What is missing or inert — the actual gap

| # | Gap | Owner | Impact | Step |
| --- | --- | --- | --- | --- |
| ~~1~~ | ~~Production self-canonicalising to `web-cocheria.vercel.app`~~ | — | **Fixed 2026-07-30** | A1b ✅ |
| ~~1b~~ | ~~Apex and `www` both returning HTTP 200~~ | — | **Fixed 2026-07-30** (apex 308 → `www`) | A1c ✅ |
| 2 | Brand name lost its accents in `messages/es-419.json` (commit `656e037`): `"Cocheria Nogues & Martinez"`, and the title tag reads `"Cocheria en José C. Paz"` | Human decision + Agent | **High** — NAP consistency + the head keyword is a misspelling of the common noun *cochería* | A2 |
| ~~3~~ | ~~`opengraph-image.png` / `apple-icon.png` / `favicon.ico` missing~~ | — | **Generated 2026-07-30 from `app/icon.png` + the script wordmark; verified in a local production build. Pending deploy.** | A3 ✅ |
| 4 | Google Business Profile not created/verified | Human | **Critical** — the Map Pack, not the site, resolves most local searches | B1 |
| 5 | Search Console not registered; sitemap never submitted | Human + Agent | High | B2 |
| 6 | Structured data / OG card never validated against a live URL | Human + Agent | High | B3 |
| 7 | JSON-LD has no `geo`, no `sameAs`, no `aggregateRating` | Agent (needs inputs) | Medium–High | C1, C2 |
| 8 | No `verification.google` meta support in `generateMetadata` | Agent | Medium (only if URL-prefix verification is used) | C3 |
| ~~9~~ | ~~Carousel photos use `alt=""`~~ | — | **Fixed 2026-07-30** — 8 distinct alts via i18n | C4 ✅ |
| ~~10~~ | ~~Address not wrapped in a semantic `<address>`~~ | — | **Fixed 2026-07-30** — Contact + Footer | C5 ✅ |
| 11 | Truthful E-E-A-T facts (years, licence) and real coverage localities not stated | Human + Agent | Medium | C6 |
| ~~12~~ | ~~WhatsApp/tel clicks not measured~~ | — | **Fixed 2026-07-30** — `TrackedLink` + 3 events. Pending deploy to see data | C7 ✅ |
| 13 | Directory citations (Bing, Apple, Páginas Amarillas, socials) absent | Human | Medium | D1 |
| 14 | No review-generation process | Human | Medium | D2 |
| 15 | No CI workflow — only the local `.githooks/pre-push` gate | Agent | Low | E2 |

**Dependency spine:** `A1 domain` → (`A2 brand`, `A3 assets`) → `B1 GBP` → `B2 Search Console` → `B3 validation` → `C* enrichment` → (`D1 citations`, `D2 reviews`) → `E* polish`.

---

## 2. Input ledger

Collect from the human **before** the step that consumes it. Do not proceed on a placeholder.

| Key | Consumed by | Value (fill in) | Confirmed? |
| --- | --- | --- | --- |
| Production domain, no trailing slash | A1 | `https://www.cocherianoguesymartinez.com` | ✅ 2026-07-30 |
| Brand-name spelling decision (accented / unaccented) | A2 | `________` | ☐ |
| Brand/social assets | A3 | Generated from `app/icon.png` + script wordmark | ✅ 2026-07-30 |
| Exact door coordinates `lat,lng` (from the verified GBP pin) | C1 | `________` | ☐ |
| Public profile URLs for `sameAs` (GBP short link, Facebook, Instagram) | C2 | `________` | ☐ |
| Search Console verification method + token (if meta) | B2 / C3 | `________` | ☐ |
| Truthful E-E-A-T facts (founding year, municipal licence…) | C6 | `________` | ☐ |
| Localities where service is **actually** provided | C6 | `________` | ☐ |
| Analytics event names for WhatsApp / tel | C7 | `whatsapp_click`, `tel_click`, `directions_click` (+ `location`) | ✅ 2026-07-30 |

---

## Phase A — Unblock production

### A1 — Set the real production domain
- **Owner:** Human (Vercel) + Agent (repo) · **Impact:** Critical · **Blocked by:** —
- **Confirmed domain:** `https://www.cocherianoguesymartinez.com`

> **The canonical host is `www`, https, with NO trailing slash.** The owner supplied it as
> `https://www.cocherianoguesymartinez.com/`; the trailing slash is dropped on purpose, because
> `metadataBase` and the JSON-LD `@id` append their own path and would emit `//`.
> Publish this exact string — same host, same casing, no slash — in the GBP and in every citation.

**Why first:** `SITE_URL` ([src/config/site.ts](src/config/site.ts)) feeds `metadataBase`, the
canonical, `og:url`, the sitemap entry, the `robots` sitemap pointer, and every `url`/`@id` in the
`FuneralHome` JSON-LD.

#### A1a — Repo baseline
- [x] **done (2026-07-30)** — `.env` now sets
  `NEXT_PUBLIC_SITE_URL=https://www.cocherianoguesymartinez.com`. `jest.setup.ts` deliberately stays
  on `http://localhost:3000` so tests never depend on the real domain. Documented in `README.md`,
  `CLAUDE.md` and this handbook.

#### A1b — Fix the Vercel environment variable
- [x] **done (2026-07-30)** — applied via the Vercel CLI, production redeployed and verified live.

**The bug that was found (audited live on 2026-07-30):** production was emitting

```
<link rel="canonical" href="https://web-cocheria.vercel.app"/>
og:url          → https://web-cocheria.vercel.app
JSON-LD "@id"   → https://web-cocheria.vercel.app/#organization
sitemap.xml     → <loc>https://web-cocheria.vercel.app</loc>
robots.txt      → Sitemap: https://web-cocheria.vercel.app/sitemap.xml
```

So `NEXT_PUBLIC_SITE_URL` **is** set in Vercel, but to the preview host `https://web-cocheria.vercel.app`.
This is worse than the placeholder ever was: the custom domain is serving a canonical tag that points
somewhere else, i.e. instructing Google to **drop `www.cocherianoguesymartinez.com` and index the
`vercel.app` subdomain instead**, and to treat the real domain as a duplicate. Every link, citation
and GBP click that lands on the real domain currently passes its authority to the wrong host.

> **Vercel's dashboard variable overrides the committed `.env`.** Fixing `.env` (done in A1a) does
> **not** fix production on its own — `process.env` from the Vercel project wins over `.env` files.
> This step is mandatory.

**What was run** (`vercel env update` takes the value from stdin; `printf` avoids the trailing
newline that `echo` would append to the value):
```bash
printf 'https://www.cocherianoguesymartinez.com' | vercel env update NEXT_PUBLIC_SITE_URL production --yes
printf 'https://www.cocherianoguesymartinez.com' | vercel env update NEXT_PUBLIC_SITE_URL preview --yes
vercel redeploy web-cocheria-8si5z1zvx-ariel-martinez-viera-s-projects.vercel.app
```

`NEXT_PUBLIC_*` is inlined at **build** time, so the running deployment kept the old value until it
was rebuilt — the redeploy is not optional. The live production deployment was built from commit
`56b70eb` on `main`, so redeploying *that* deployment rebuilds the same source with the corrected
env var, instead of `vercel --prod` pushing an uncommitted local working tree.

**Verified:**
```bash
curl -s https://www.cocherianoguesymartinez.com | grep -oE '<link rel="canonical"[^>]*>'
curl -s https://www.cocherianoguesymartinez.com/sitemap.xml
```
```
<link rel="canonical" href="https://www.cocherianoguesymartinez.com"/>
og:url        → https://www.cocherianoguesymartinez.com
JSON-LD @id   → https://www.cocherianoguesymartinez.com/#organization
sitemap.xml   → <loc>https://www.cocherianoguesymartinez.com</loc>
robots.txt    → Allow: / + Sitemap: https://www.cocherianoguesymartinez.com/sitemap.xml
```
Zero occurrences of `vercel.app` in the live HTML. The `web-cocheria.vercel.app` host now also
serves a canonical pointing at the real domain, which consolidates anything Google already indexed
there onto `www.cocherianoguesymartinez.com`.

#### A1c — Apex → `www` redirect
- [x] **done (2026-07-30)** — apex now answers `308` → `https://www.cocherianoguesymartinez.com/`.

**DNS was already correct; no Cloudflare change was needed:**

| Host | Record | Value | Status |
| --- | --- | --- | --- |
| `cocherianoguesymartinez.com` | A | `76.76.21.21` (Vercel anycast) | ✅ resolves to Vercel |
| `www.cocherianoguesymartinez.com` | CNAME | `cname.vercel-dns.com` | ✅ resolves to Vercel |
| Nameservers | NS | `keenan/sloan.ns.cloudflare.com` | Cloudflare, **DNS-only (grey cloud)** — responses carry `server: Vercel`, not Cloudflare |

**The problem:** both hosts answer **HTTP 200**. Two hosts serving byte-identical content with no
redirect is classic duplicate content — Google picks a canonical on its own and the signal splits.

**Do it in Vercel, not in Cloudflare.** Cloudflare is running as DNS-only here, so Cloudflare
**Redirect Rules would never fire** (they only apply to proxied/orange-cloud traffic). Turning the
proxy on just to add a redirect would also put a second CDN in front of Vercel and complicate TLS
issuance — not worth it.

**How it was applied.** `vercel domains` has no redirect subcommand, so this went through the REST
API with the token the CLI already stores locally:
```bash
TOKEN=$(node -p "require(require('os').homedir()+'/Library/Application Support/com.vercel.cli/auth.json').token")
curl -X PATCH "https://api.vercel.com/v9/projects/$PROJECT_ID/domains/cocherianoguesymartinez.com?teamId=$TEAM_ID" \
  -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \
  -d '{"redirect":"www.cocherianoguesymartinez.com","redirectStatusCode":308}'
```
The dashboard equivalent is **Settings → Domains** → make `www` primary → set the apex to
*Redirect to `www.cocherianoguesymartinez.com`*, **308 Permanent**.

**Verified:**
```bash
curl -sI https://cocherianoguesymartinez.com/ | grep -iE '^HTTP|^location'
# HTTP/2 308
# location: https://www.cocherianoguesymartinez.com/
```

**Verify — done when:**
```bash
npm run typecheck && npm run test:coverage:check
curl -sI https://cocherianoguesymartinez.com | grep -i 'location'      # → 301 to the www host
curl -s https://www.cocherianoguesymartinez.com | grep -iE 'og:url|canonical|"@id"'
```
shows `https://www.cocherianoguesymartinez.com` — no `localhost`, no placeholder, no `//`.

---

### A2 — Resolve the brand-name spelling (NAP decision)
- [ ] done
- **Owner:** Human decides · Agent applies · **Impact:** High · **Blocked by:** —
- **Inputs required:** the owner's decision on how the business name is officially written.

**The finding:** commit `656e037` (`feat(branding)`) stripped the accents across
`messages/es-419.json`. Current values:

| Key | Today | Before `656e037` |
| --- | --- | --- |
| `metadata.title` | `"Cocheria en José C. Paz \| Nogues & Martinez — Atención 24 hs"` | `"Cochería en José C. Paz \| Nogués & Martínez — Atención 24 hs"` |
| `nav.brand`, `hero.title`, `footer.brand` | `"Cocheria Nogues & Martinez"` | `"Cochería Nogués & Martínez"` |
| `faq.items.primerasHoras.answer` | `"…contactar a la cocheria…"` | `"…contactar a la cochería…"` |

Two distinct things got conflated:
- **The proper noun** (the logotype). If the owner's sign and paperwork read *Nogues & Martinez*
  without accents, that is legitimate — but it must then be written **identically** in the GBP and in
  every citation, because that is the NAP "N".
- **The common noun** `cochería`. Unaccented `cocheria` is simply a **misspelling** in Spanish, and
  it sits in the `<title>`, in the FAQ body, and in `hero.body`. Google folds accents for matching,
  so ranking damage is limited — the real cost is a credibility signal to a grieving reader in the
  most visible string on the page.

**Ask the human, exactly:**
> ¿El nombre propio del negocio se escribe *Nogués & Martínez* (con tildes) o *Nogues & Martinez*
> (sin tildes, como el logo)? Y, aparte: ¿podemos corregir la palabra común "cochería" (con tilde)
> en el título y en los textos?

**Actions (agent), once decided:**
1. Apply the decision across `messages/es-419.json` — proper noun per the owner, common noun
   `cochería` **always accented**. Keep `José C. Paz` with its accent and period everywhere.
2. Realign any test asserting those strings verbatim (`Hero.test.tsx`, `Nav.test.tsx`,
   `Footer.test.tsx`, `Faq.test.tsx`, `layout.test.tsx`). Change only stale expectations — never
   loosen an assertion to make it pass.
3. Record the chosen proper-noun spelling in the ledger — **B1 and D1 must reuse it byte-for-byte.**

**Verify — done when:** gate green, and one grep shows a single consistent spelling:
```bash
grep -rn "Cocher\|Nogu\|Mart[ií]nez" messages/es-419.json
```

---

### A3 — Deliver and place the brand / social assets
- [ ] done
- **Owner:** Human (design) + Agent (placement) · **Impact:** Critical (the **WhatsApp share card** is
  the primary channel for this business) · **Blocked by:** A1

**Status after the 2026-07-30 generation pass** — all files present, verified in a local production build:

| File | Format / size | Status | Notes |
| --- | --- | --- | --- |
| `app/icon.png` | PNG 512×512 | ✅ pre-existing | The source every other asset was derived from |
| `app/opengraph-image.png` | PNG 1200×630, 123 KB | ✅ **generated** | Brand gradient + white script wordmark + two lines of copy |
| `app/opengraph-image.alt.txt` | 1 line, **no trailing newline** | ✅ **generated** | See the gotcha below |
| `app/apple-icon.png` | PNG 180×180, no alpha | ✅ **generated** | Transparent corners filled with a matching gradient so iOS's mask leaves no seam |
| `app/favicon.ico` | ICO 48/32/16 | ✅ **generated** | Sharper at small sizes than a browser-downscaled 512 PNG |

**Why the OG image matters:** Next.js only emits `og:image` when the convention file exists. Before
this pass the live HTML had **no `og:image` at all** — sharing the link on WhatsApp (the primary
channel for this business) showed a bare text preview — while the JSON-LD `image` field already
pointed at `${SITE_URL}/opengraph-image.png`, which 404'd. Never ship an `image` pointing at a 404;
an absent field is better than a broken one.

> ### ⚠️ Gotcha: `opengraph-image.alt.txt` must NOT end in a newline
> Next 16 reads the file with `readFile(..., 'utf8')` and does **not** trim it
> (`next/dist/build/webpack/loaders/next-metadata-image-loader.js`). With a trailing `\n` the alt is
> parsed into the bundle but **silently dropped from the HTML** — no `og:image:alt`, no error, no
> warning. Write it with `printf`, never with `echo` or an editor that adds a final newline:
> ```bash
> printf 'Cocheria Nogues & Martinez — Servicios Fúnebres en José C. Paz, Buenos Aires' > app/opengraph-image.alt.txt
> ```
> Verified both ways on 2026-07-30: with the newline the tag is absent; without it, `og:image:alt`
> **and** `twitter:image:alt` are emitted.

**How they were generated (2026-07-30).** No new design input was available, so everything was
derived from assets already in the repo — `app/icon.png` (the N&M monogram tile) and
`public/logos/logo-script-white.png` (the script wordmark) — using ImageMagick. The background is the
brand gradient straight from `src/styles/tokens.css` (`--grad-1 #03294a` → `--grad-2 #005188` →
`--grad-3 #1a6ba3`), so nothing was invented and nothing drifts from the design system.

```bash
# OG image: diagonal brand gradient + white script wordmark + supporting copy
magick -size 1200x630 xc: -sparse-color bilinear \
  '0,0 #03294a  1199,0 #01406c  0,629 #01406c  1199,629 #1a6ba3' \
  \( public/logos/logo-script-white.png -resize 720x \) -gravity north -geometry +0+128 -composite \
  \( -size 200x1 xc:'rgba(255,255,255,0.38)' \) -gravity north -geometry +0+412 -composite \
  -gravity north -font /System/Library/Fonts/Supplemental/Georgia.ttf \
  -pointsize 40 -fill 'rgba(255,255,255,0.95)' -annotate +0+462 'Servicios Fúnebres — José C. Paz, Buenos Aires' \
  -pointsize 30 -fill 'rgba(255,255,255,0.70)' -annotate +0+522 'Atención las 24 horas, los 365 días del año' \
  -depth 8 -strip -define png:compression-level=9 app/opengraph-image.png

# apple-icon: no alpha (iOS composites on black); corners filled with a matching gradient
magick -size 180x180 xc: -sparse-color bilinear \
  '0,0 #0d3f68  179,0 #18486c  0,179 #00487e  179,179 #1e669c' \
  \( app/icon.png -resize 180x180 \) -composite -alpha remove -alpha off -depth 8 -strip app/apple-icon.png

# favicon.ico: multi-size
magick app/icon.png -background none -define icon:auto-resize=48,32,16 app/favicon.ico
```

`-depth 8` matters: the first render came out 16-bit and weighed 553 KB; at 8 bits it is 123 KB with
no visible difference on a gradient.

The OG copy is verbatim Spanish and consistent with the site (`hero.eyebrow`, `contact.availability`).
The brand name is carried by the **wordmark image**, not typed text — which deliberately sidesteps the
unresolved accent decision in **A2**: whatever is decided there, this image does not have to change.

If the owner later supplies professionally designed assets, replace the files in place — no code
change is needed. And if an OG image ever has to be removed entirely, also **remove** `imageUrl` from
the `buildFuneralHomeJsonLd` call rather than leaving a dead link (with the builder branch test).

**Verified locally (`npm run build` + `npm start`):**
```
<meta property="og:image"      content="…/opengraph-image.png?…"/>   1200×630
<meta property="og:image:alt"  content="Cocheria Nogues & Martinez — Servicios Fúnebres…"/>
<meta name="twitter:image:alt" content="…"/>
<link rel="icon"           href="/favicon.ico?…"  sizes="48x48"/>
<link rel="icon"           href="/icon.png?…"     sizes="512x512"/>
<link rel="apple-touch-icon" href="/apple-icon.png?…" sizes="180x180"/>
```
All four routes return **200**. Gate green (`lint`, `typecheck`, 60 tests, 100% per-file coverage).
**Still pending: deploy**, then **B3** to confirm the card renders in a real WhatsApp chat.

---

## Phase B — Off-site foundation (this is where local ranking is actually won)

### B1 — Create, optimize and verify the Google Business Profile
- [ ] done
- **Owner:** Human · **Impact:** **Critical — highest ROI item in this handbook.** For a
  neighbourhood funeral home the GBP governs the Map Pack, which resolves most searches. The website
  mostly *reinforces* the profile. · **Blocked by:** A1 (website link), A2 (exact name)
- **Inputs required:** access to `business.google.com`; the canonical NAP from `.env`; 10–15 real
  photos (façade, wake rooms, vehicles, floral arrangements, team — with consent).

**Actions (human) — follow `seo-spec.md` §8.1:**
1. Claim/create with the **exact** business name decided in A2 — **no keywords appended**
   ("… Servicios Fúnebres 24hs" in the name violates the guidelines → suspension risk).
2. Primary category **"Funeraria"**. Secondary categories only if truthful: "Servicio de cremación",
   "Floristería", "Servicio de traslado".
3. Address `Av. Gaspar Campos 4848, José C. Paz, Buenos Aires, 1665, Argentina` —
   **character-for-character** identical to `NEXT_PUBLIC_CONTACT_ADDRESS`.
4. Phone `+5491161512447` (display `15-6151-2447`) — same as `.env`.
5. Hours: **"Abierto las 24 horas"**, all 7 days (matches the site's `OpeningHoursSpecification`).
6. Service area: José C. Paz + only the localities where service is **actually** provided.
7. Upload the photos; fill attributes and payment methods; set the **Website** link to the exact
   canonical host from A1.
8. **Verify** the profile (postcard / phone / video). It does not rank until verified.

**Verify — done when:** the profile shows **Verified**, "Abierto las 24 horas", and its pin lands on
the correct door. **Write down the pin's lat/lng — C1 needs it.**

---

### B2 — Search Console: verify the domain and submit the sitemap
- [ ] done
- **Owner:** Human + Agent · **Impact:** High · **Blocked by:** A1
- **Inputs required:** access to `search.google.com/search-console`; ability to add a DNS TXT record
  (preferred) *or* the HTML meta token.

**Actions (human):**
1. Add a **Domain property** for the real domain.
2. Verify with the **DNS TXT** record Google provides. *(If only a URL-prefix property is possible,
   capture the HTML meta token instead → it feeds **C3**.)*
3. Submit the sitemap: `https://www.cocherianoguesymartinez.com/sitemap.xml`.
4. Request indexing for the home URL.
5. Also link the GBP and Search Console properties if prompted.

**Verify — done when:** the property is **Verified**, the sitemap reads **Success (1 URL)**, and
within a few days the home page is **indexed** with zero coverage errors.

> **Sanity check first:** `curl -s https://www.cocherianoguesymartinez.com/robots.txt` must show `Allow: /`.
> If it shows `Disallow: /`, the deploy is not running with `VERCEL_ENV=production`
> ([app/robots.ts](app/robots.ts)) — fix that before submitting anything.

---

### B3 — Validate structured data and the share card
- [ ] done
- **Owner:** Human + Agent · **Impact:** High · **Blocked by:** A1, A3

**Actions:**
1. **Rich Results Test** and **Schema Markup Validator** against the live URL. Both the `FuneralHome`
   and the `FAQPage` blocks must report **zero errors**. Warnings for optional fields (`geo`,
   `sameAs`, `aggregateRating`) are expected until Phase C — **do not silence them by inventing data.**
2. **Open Graph:** paste the live URL into a **real WhatsApp chat** and into the Facebook sharing
   debugger. The card must show title, description, and the 1200×630 image from A3.
3. **Lighthouse / PageSpeed Insights** on mobile: confirm LCP is the hero image (`priority` is already
   set) and note any regression. `public/fachada.jpg` is 386 KB served through `next/image` — fine,
   but re-check after any hero change.
4. **FAQ realism caveat** (`seo-spec.md` §7.6): since 2023 Google rarely renders the `FAQPage` rich
   snippet for non-government/health sites. The FAQ's value here is on-page content and long-tail
   coverage. A missing snippet is **not** a bug — do not "fix" it.

**Verify — done when:** validators are error-free and the WhatsApp card renders with its image.

---

## Phase C — Code enrichment, each gated on a confirmed input

> Every step here is a code change. Apply it **only** once its input is confirmed, and keep
> `npm run lint && npm run typecheck && npm run test:coverage:check` green in the same step.
> Optional fields must be emitted **conditionally** so nothing appears when the data is absent —
> which means each one adds a branch, which means **both branches need a test**.

### C1 — Add `geo` coordinates to the JSON-LD
- [ ] done · **Blocked by:** B1 · **Input:** exact `lat,lng` of number 4848, read off the verified GBP
  pin. **Do not invent.** If unknown, skip — `geo` stays omitted.

1. `.env` (public) **and** `jest.setup.ts`:
   ```bash
   NEXT_PUBLIC_CONTACT_LAT=-34.xxxxx
   NEXT_PUBLIC_CONTACT_LNG=-58.xxxxx
   ```
2. `src/config/site.ts` (coverage-excluded — parsing belongs here):
   ```ts
   latitude: process.env.NEXT_PUBLIC_CONTACT_LAT ? Number(process.env.NEXT_PUBLIC_CONTACT_LAT) : undefined,
   longitude: process.env.NEXT_PUBLIC_CONTACT_LNG ? Number(process.env.NEXT_PUBLIC_CONTACT_LNG) : undefined,
   ```
3. `src/components/json-ld/build-funeral-home-json-ld.ts` — optional params + conditional spread
   after `areaServed`:
   ```ts
   ...(latitude !== undefined && longitude !== undefined
     ? { geo: { '@type': 'GeoCoordinates', latitude, longitude } }
     : {}),
   ```
4. Pass `latitude: SITE.latitude, longitude: SITE.longitude` from [app/layout.tsx](app/layout.tsx).
5. **Coverage:** add two builder cases — with and without coordinates.

**Verify:** gate green; Rich Results Test shows `geo` on the right pin.

### C2 — Add `sameAs` (official profiles)
- [ ] done · **Blocked by:** B1, D1 · **Input:** real public URLs (GBP short link, Facebook,
  Instagram). Only list profiles that **exist and are controlled by the business**.

1. `.env` (+ `jest.setup.ts`): `NEXT_PUBLIC_SAMEAS=https://facebook.com/...,https://instagram.com/...`
2. `src/config/site.ts`:
   ```ts
   sameAs: (process.env.NEXT_PUBLIC_SAMEAS ?? '').split(',').map((s) => s.trim()).filter(Boolean),
   ```
3. Builder: `sameAs?: readonly string[]` + `...(sameAs && sameAs.length > 0 ? { sameAs } : {})`.
4. Pass `sameAs: SITE.sameAs` from the layout.
5. **Coverage:** empty and non-empty branches.

### C3 — Add `verification.google` (only for URL-prefix / meta-tag verification)
- [ ] done · **Blocked by:** B2 · **Input:** the Search Console HTML meta token.
  *(Verified by DNS TXT in B2? Skip this step entirely.)*

1. `.env`: `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION=<token>`
2. In `generateMetadata` ([app/layout.tsx](app/layout.tsx)), emit it conditionally:
   ```ts
   const gsv = process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION;
   // inside the returned Metadata object:
   ...(gsv ? { verification: { google: gsv } } : {}),
   ```
3. **Coverage:** `app/layout.test.tsx` must cover token-set *and* token-unset.

**Verify:** the live `<head>` contains `<meta name="google-site-verification" …>`.

### C4 — Give the carousel photos real alt text
- [x] **done (2026-07-30)**

[Carousel.tsx:114](src/features/landing/about/Carousel.tsx#L114) renders 8 photos with `alt=""`.
`alt=""` is correct for purely decorative imagery, but these are **real product photos** (floral
arrangements) inside a labelled gallery — they can earn Google Images traffic.

1. Add i18n keys under `about.carousel.photos.*` in `messages/es-419.json`, one sober Spanish line per
   photo, e.g. `"Arreglo floral de rosas blancas para servicio fúnebre en José C. Paz"`. Vary them —
   do **not** repeat the same string 8 times.
2. Map each carousel slide to its key and pass `alt={t(...)}`.
3. Extend `Carousel.test.tsx` (query by `getByRole('img', { name: … })`) to keep 100% coverage.

**Verify:** gate green; no image left with an empty `alt` in the gallery.

### C5 — Semantic `<address>` for the NAP
- [x] **done (2026-07-30)**

Wrap the address block in `Contact.tsx` and `Footer.tsx` in a semantic `<address>` element (style it
to remove the browser's default italics via the existing CSS modules — **no inline styles, no
hardcoded colors**). Extend both component tests.

**Verify:** gate green; the rendered NAP sits inside `<address>`.

### C6 — Firm up truthful E-E-A-T copy and coverage area
- [ ] done · **Blocked by:** B1 · **Inputs:** owner-confirmed founding year / municipal licence /
  team credentials, and the list of localities actually served. **Never fabricate a track record or a
  certification.**

1. Add the confirmed fact to `messages/es-419.json` — a sentence inside `about.body1`/`about.body2`
   or a new `about.highlights.*` item. Verbatim Spanish, sober register, **no superlatives**:
   ```json
   "highlights": { "trayectoria": "Más de XX años acompañando a las familias de José C. Paz" }
   ```
2. Add one coverage sentence (e.g. `about.coverage` or `contact.coverage`), max 5–6 localities, no
   repetition:
   > `"Brindamos servicio en José C. Paz y zonas aledañas: Del Viso, Pilar, San Miguel, Malvinas Argentinas, Los Polvorines y Grand Bourg."`
3. Wire any new key into its component and extend that component's test.
4. *(Optional)* upgrade the JSON-LD `areaServed` from a single string to an array of `City` objects
   built from the same list — with branch tests.

**Verify:** gate green; every claim on the page is one the owner can substantiate.

### C7 — Measure WhatsApp / tel conversions
- [x] **done (2026-07-30)** — pending deploy before any data shows up

`@vercel/analytics` is already installed and mounted in the layout. The WhatsApp/tel links live in
`Hero.tsx`, `Contact.tsx`, `Nav.tsx` and `Footer.tsx`. Note that
[Landing.tsx](src/features/landing/Landing.tsx) is already `'use client'`, so those subtrees are
client components — adding `onClick` needs no new boundary.

1. Extract a small `tracked-link` client component (one folder, barrel, colocated test) that wraps
   `<a>` and calls `track(eventName)` on click. Reuse it in all four call sites rather than
   duplicating handlers.
2. **Coverage:** mock `@vercel/analytics`, assert `track` is called with the agreed name on click,
   and keep every touched file at 100%.
3. Cross-reference these events with GBP "calls"/"directions" metrics. **GA4 is optional** — decide
   with the owner; `@vercel/analytics` already covers measurement.

**Verify:** clicking WhatsApp/tel shows the event in Vercel Analytics; gate green.

---

## Phase D — Off-site reinforcement

### D1 — Directory citations
- [ ] done · **Owner:** Human · **Impact:** Medium · **Blocked by:** A2 (canonical name), B1

In priority order (`seo-spec.md` §8.3): **1)** GBP (done in B1), **2)** Bing Places for Business,
**3)** Apple Business Connect / Apple Maps (heavy iPhone use in AR), **4)** Páginas Amarillas
Argentina (rubro "Funerarias"), **5)** provincial funeral chambers, **6)** Facebook Business +
Instagram (these feed `sameAs` → **C2**), **7)** the José C. Paz municipal/chamber directory.

Paste the **identical** NAP everywhere — same name spelling (A2), same address string, same phone.
Inconsistent NAP is the single most common cause of local-ranking distrust.

**Verify — done when:** every listing is live with the canonical NAP, and the social URLs are handed
back for C2.

### D2 — Reviews process
- [ ] done · **Owner:** Human · **Impact:** Medium · **Blocked by:** B1

Sensitive niche (`seo-spec.md` §8.4): ask **days or weeks after** the service, never the same day;
by WhatsApp, respectfully; **never** offer incentives; reply to **all** reviews within 24–48 h with
empathy and **zero** details about the deceased or the family; no templates, no bought or traded
reviews. Reviews are the strongest Map Pack ranking factor after proximity and category — and the
easiest one to ruin.

---

## Phase E — Optional polish (only after A–D)

- [ ] **E1 — Narrow the `'use client'` boundary.** `Landing.tsx` is a client component only because
  `ThemeProvider` wraps everything, so Hero/Services/About/Faq/Contact all ship as client JS. Moving
  the provider down (or to the layout with the sections staying server components) would cut the
  hydration payload. Content is already SSR'd, so this is a **performance** change, not a crawlability
  fix. Measure with Lighthouse before and after — don't do it blind.
- [ ] **E2 — Add a CI workflow.** Today the gate only runs via `.githooks/pre-push`, which a `--no-verify`
  push skips. A GitHub Actions job running `lint && typecheck && test:coverage:check` on PRs protects
  the metadata/JSON-LD tests from silent regressions.
- [ ] **E3 — Freeze `sitemap.lastModified`.** [app/sitemap.ts](app/sitemap.ts) calls `new Date()`, so
  every build advertises a fresh timestamp for unchanged content. Harmless, but a static date (or the
  build commit date) is more honest.
- [ ] **E4 — Document the image `alt` / anchor-text convention** for future contributors
  (`seo-spec.md` §13).
- [ ] **E5 — Dynamic OG image** via `ImageResponse`, only if a static asset is ever undesirable
  (`seo-spec.md` §4/§6 P2 — needs a coverage exclusion).

---

## 3. Definition of done — final acceptance

The SEO is functionally complete when **all** of these hold:

- [ ] `NEXT_PUBLIC_SITE_URL` is the real domain in Vercel (Production **and** Preview); no placeholder
      and no `localhost` anywhere in the live HTML.
- [ ] **Zero occurrences of `vercel.app`** in the live HTML, `sitemap.xml` and `robots.txt` of the
      custom domain (canonical, `og:url`, JSON-LD `@id`/`url` all on the real host).
- [ ] One canonical host (`www`); the apex 301/308-redirects to it.
- [ ] Brand-name spelling is one consistent decision across site, `.env`, GBP and every citation.
- [x] Favicon renders (already working via `app/icon.png`, verified 2026-07-30).
- [ ] The **WhatsApp share card** shows the 1200×630 image (`og:image` present in the live HTML — built and verified locally on 2026-07-30, **awaiting deploy**).

### Event taxonomy (frozen 2026-07-30)

| Event | Fired by | `location` values |
| --- | --- | --- |
| `whatsapp_click` | WhatsApp CTAs | `hero`, `contact` |
| `tel_click` | `tel:` links | `hero`, `contact`, `footer` |
| `directions_click` | Google Maps links | `contact` |

Names are snake_case and **append-only** — renaming one splits the series in the Vercel Analytics
dashboard. They live in `src/config/analytics.ts`; the `TrackedLink` component
(`src/components/tracked-link/`) is the only place that calls `track`.
- [ ] GBP is **Verified**, category "Funeraria", 24 hs, NAP identical to the site.
- [ ] Search Console: property **Verified**, sitemap **submitted and read**, home **indexed**, zero
      coverage errors.
- [ ] `https://www.cocherianoguesymartinez.com/robots.txt` shows `Allow: /`; `https://www.cocherianoguesymartinez.com/sitemap.xml` lists the real host.
- [ ] `FuneralHome` + `FAQPage` validate with **zero errors** in the Rich Results Test.
- [ ] Every enrichment the owner could confirm is applied (`geo`, `sameAs`, alts, E-E-A-T, coverage),
      and everything they could not is **honestly omitted**.
- [ ] Citations live with the canonical NAP; the review process is running.
- [ ] WhatsApp/tel conversion events are visible in Vercel Analytics.
- [ ] `npm run lint && npm run typecheck && npm run test:coverage:check` green.

---

## 4. Appendix

### 4.1 Command reference

```bash
npm run dev                      # local server
npm run build                    # production build — the only way to see emitted meta tags
npm test                         # fast, no coverage — use during development
npm test -- --testPathPatterns Faq
npm run test:coverage:check      # the 100%-per-file gate — run before pushing, not after each edit
npm run lint && npm run typecheck
```

### 4.2 SEO surface — file map

| Concern | File |
| --- | --- |
| Title, description, OG, Twitter, robots meta, JSON-LD injection | [app/layout.tsx](app/layout.tsx) |
| Crawl rules + sitemap pointer | [app/robots.ts](app/robots.ts) |
| Sitemap | [app/sitemap.ts](app/sitemap.ts) |
| PWA manifest | [app/manifest.ts](app/manifest.ts) |
| `FuneralHome` structured data | [src/components/json-ld/build-funeral-home-json-ld.ts](src/components/json-ld/build-funeral-home-json-ld.ts) |
| `FAQPage` structured data + visible FAQ | [src/features/landing/faq/Faq.tsx](src/features/landing/faq/Faq.tsx) |
| NAP / domain / link helpers | [src/config/site.ts](src/config/site.ts) |
| **All visible copy** (titles, descriptions, alts) | [messages/es-419.json](messages/es-419.json) |
| Icons / OG image (convention files) | `app/icon.png`, `app/favicon.ico`, `app/apple-icon.png`, `app/opengraph-image.png` |

### 4.3 Validators

| Tool | URL |
| --- | --- |
| Rich Results Test | `search.google.com/test/rich-results` |
| Schema Markup Validator | `validator.schema.org` |
| PageSpeed Insights | `pagespeed.web.dev` |
| Facebook Sharing Debugger | `developers.facebook.com/tools/debug/` |
| Search Console | `search.google.com/search-console` |
| Google Business Profile | `business.google.com` |

### 4.4 Anti-patterns — do not do these

| Don't | Why |
| --- | --- |
| Invent coordinates, years in business, licences, prices, or reviews | YMYL niche → manual action, and it misleads grieving families |
| Add keywords to the GBP business name | Guideline violation → profile suspension |
| Hardcode a phone/address in a component | Breaks the single NAP source (`SITE`) and drifts from the GBP |
| Hardcode a visible string in a component | All copy lives in `messages/es-419.json` |
| Hardcode a color or use an inline style | Everything comes from `src/styles/tokens.css` |
| Add locales or locale-prefixed routes | Single `es-419` locale by design; no i18n routing |
| Point `image`/`og:image` at a file that does not exist | A 404 image is worse than no image |
| Lower a coverage threshold or add `eslint-disable` to pass the gate | Fix the root cause instead |
| Run `--coverage` after every edit | Slow; use `npm test` while developing |
| Create a branch, commit, or deploy without being asked | Explicit repo rule |
