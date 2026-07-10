# Technical spec — SEO for Cochería Nogués & Martínez

> Technical specification document. Author: Spec Writer. Locale: es-419 (Rioplatense Spanish).
> Scope: add SEO to the institutional landing of **Cochería Nogués & Martínez** (funeral home, José C. Paz, Province of Buenos Aires).

## 1. Executive summary

The goal is for the funeral home to show up when someone in José C. Paz and the surrounding area searches for a funeral service —both in the immediate emergency ("cochería José C. Paz", "cochería 24 horas", "cerca de mí") and in the prior deliberation ("qué hacer cuando fallece un familiar", "PAMI sepelio")—, and for that discovery to lead to contact via WhatsApp or phone. Today the site only emits `title`/`description`: it lacks the entire technical SEO foundation (complete metadata, robots, sitemap, icons, Open Graph, JSON-LD) and there is no local presence on Google.

The strategy combines three fronts, ordered by real impact for a **local** funeral home: (1) **operational local SEO** —create and optimize the Google Business Profile (GBP) with a consistent NAP, which is what actually governs the Map Pack—; (2) **technical foundations in code** —`metadataBase`, canonical, Open Graph/Twitter, `robots.ts`, `sitemap.ts`, icons/manifest, and **`FuneralHome` JSON-LD** that reinforces the GBP with machine-readable data—; and (3) **on-page content** —anchor the local phrase in the copy, shorten the title/description, and add a **FAQ** section with `FAQPage`—. All while respecting the repo's hard conventions: text via i18n (`messages/es-419.json`), data via `NEXT_PUBLIC_*` env vars, colors via tokens, named exports, feature-folders with barrels, and 100% per-file coverage. The only blocker is external: **the production domain is unknown** and must be provided as `NEXT_PUBLIC_SITE_URL`.

## 2. Objectives and KPIs

| Objective | Signal / KPI | Measurement tool |
| --- | --- | --- |
| Correct indexing of the site | Home indexed, no coverage errors, sitemap submitted and read | Google Search Console |
| Visibility in local search | Appear in the Map Pack for "cochería José C. Paz" and variants | GBP Insights + Search Console |
| Visibility on Google Maps | Profile views, direction requests | GBP Insights |
| Conversion (the business's real channel) | Clicks to WhatsApp (`wa.me`) and to `tel:` | @vercel/analytics (events) + GBP (calls) |
| Correct preview when sharing via WhatsApp | Card with title, description, and image (OG) | OG validators / manual test in WhatsApp |
| Valid structured data | `FuneralHome` and `FAQPage` without errors/warnings | Rich Results Test / Search Console |
| Performance / CWV | LCP, INP, CLS in the green | @vercel/speed-insights |

> **Contact** (WhatsApp / phone) is the primary conversion: there is no email or form. The whole strategy pushes toward those two channels.

## 3. Current state

**What is already good:**
- `generateMetadata()` in `app/layout.tsx` emits `title` and `description` from i18n (namespace `metadata`).
- `<html lang={locale}>` (es-419) + `suppressHydrationWarning` (for the theme toggle) — correct.
- Fonts optimized with `next/font/google` (Inter, Cormorant_Garamond, `display: 'swap'`).
- `@vercel/analytics` and `@vercel/speed-insights` already injected.
- Solid semantic structure: a single `<h1>` (Hero), one `<h2>` per section, `<h3>` in the 4 service cards; `<nav aria-label>`, `<dl>/<dt>/<dd>` in contact, `aria-hidden` on decorative elements.
- Contact data centralized in `src/config/site.ts` (`SITE` + `telHref`/`whatsappHref`), read from `NEXT_PUBLIC_*`.
- Text centralized in `messages/es-419.json`.

**What is missing (from the audit):**
- There is no `metadataBase`, canonical, Open Graph, Twitter, `robots`, `icons`, or `verification` in the metadata.
- There is no `app/robots.ts`, `app/sitemap.ts`, or `app/manifest.ts`.
- There is no JSON-LD / structured data anywhere.
- There is no `public/` folder or assets (favicon, OG image, icons).
- There is no domain env var (`NEXT_PUBLIC_SITE_URL`) — **the production domain is unknown**.
- The current `title` (~76 chars) and `description` (~257 chars) exceed what Google displays without truncating.
- The local phrase "cochería en José C. Paz" does not appear in the visible copy (only split across the brand + metadata).
- There is no presence on Google Business Profile (outside the code, but it is lever #1).

## 4. Scope and non-scope

**In scope:**
- **Single-page** landing, **single locale `es-419`** with no URL prefix, **no backend**.
- Complete metadata, `robots.ts`, `sitemap.ts`, `manifest.ts`, icons/OG via file convention, `FuneralHome` JSON-LD, FAQ section + `FAQPage`, copy/title/description adjustments.
- `NEXT_PUBLIC_SITE_URL` env var and structured address data.
- Operational guide for GBP, citations, and reviews (outside the code, but part of the spec).

**Out of scope (do not implement without an explicit request):**
- Blog / informational guides with new routes (`app/guias/[slug]`) — it breaks the single-page premise of `CLAUDE.md`. Documented as an optional future.
- Second locale / `hreflang` / `alternates.languages` — today there is a single locale with no URL of its own; adding it provides no signal. Documented, not implemented.
- Dynamic OG image with `ImageResponse` — static assets are chosen instead (see §7.3). The dynamic variant is left as a documented P2 alternative.
- GA4 — optional; measurement is currently covered by `@vercel/analytics`. See §10.

## 5. Assumptions and required inputs

> **BLOCKER:** several tasks depend on external inputs that are unknown today. Do not ship placeholders to production.

| Input | Status | Blocks | Action |
| --- | --- | --- | --- |
| **Production domain** (`NEXT_PUBLIC_SITE_URL`) | **Unknown** | `metadataBase`, canonical, `sitemap`, `robots`, `og:url`, absolute `og:image`, `url`/`@id` of the JSON-LD, GBP link | Confirm with the client. Until then, an explicitly marked placeholder. |
| **Visual assets**: `favicon.ico`, `icon.png`, `apple-icon.png`, `opengraph-image.png` | Do not exist | Favicon, OG card, icons | Design (real logo mark/palette). Without them Next does not emit those tags (does not break the build). |
| **Exact geo coordinates** of number 4848 | Approximate (Altube and Gaspar Campos intersection: -34.52395 / -58.75487) | `geo` of the JSON-LD | Geocode the exact door. **Do not invent.** If it cannot be confirmed, omit `geo`. |
| **GBP URL + social media** (`sameAs`) | Do not exist | `sameAs` of the JSON-LD | Create GBP/social first. Do not leave placeholder entries in prod. |
| **Search Console verification ID** | Does not exist | `verification.google` | Obtained when registering the property. Implement only then. |
| **Real E-E-A-T data** (year, municipal license, area) | To be confirmed | `about` copy | Ask the client. **Do not fabricate** track record or certifications. |
| **GA4** (yes/no) | Product decision | Extra measurement | Optional; decide with the client. |
| **Neighboring localities covered** | To be confirmed | Coverage copy + `areaServed` | Truthful only if service is actually provided there (transfers/wakes). |

**Proposed env vars (add to `.env`, `NEXT_PUBLIC_*` pattern):**

```bash
# .env
# --- SEO / production domain ---
# TODO: replace with the real domain before deploying to production.
# Without this value, metadataBase falls back to localhost and canonical/sitemap/robots
# end up malformed in production.
NEXT_PUBLIC_SITE_URL=https://REEMPLAZAR-CON-DOMINIO-REAL.com.ar

# --- Structured address (for JSON-LD PostalAddress) ---
# Complements NEXT_PUBLIC_CONTACT_ADDRESS (free-form string shown in the UI).
NEXT_PUBLIC_CONTACT_LOCALITY=José C. Paz
NEXT_PUBLIC_CONTACT_REGION=Buenos Aires
```

In `jest.setup.ts`, set these same values (alongside the `NEXT_PUBLIC_CONTACT_*` already present) for deterministic tests:

```ts
// jest.setup.ts (add)
process.env.NEXT_PUBLIC_SITE_URL = 'http://localhost:3000';
process.env.NEXT_PUBLIC_CONTACT_LOCALITY = 'José C. Paz';
process.env.NEXT_PUBLIC_CONTACT_REGION = 'Buenos Aires';
```

In Vercel, configure `NEXT_PUBLIC_SITE_URL` as a **Production** env var pointing to the real domain as soon as it is confirmed.

## 6. Phased plan (P0 / P1 / P2)

Ordered by real impact on the **local** ranking of a funeral home, and by dependency.

### Phase P0 — Foundations (unblock everything else)

| # | Task | Type | Depends on |
| --- | --- | --- | --- |
| 1 | Define `NEXT_PUBLIC_SITE_URL` + expose `SITE_URL` in `src/config/site.ts` | Code | Domain (input) |
| 2 | Create and optimize the **Google Business Profile** (exact NAP, Funeraria category, 24 hs) | Operational | Domain (for the link) |
| 3 | Complete `generateMetadata`: `metadataBase`, canonical, Open Graph, Twitter, robots | Code | #1 |
| 4 | `app/robots.ts` (blocks Vercel previews) | Code | #1 |
| 5 | `app/sitemap.ts` | Code | #1 |
| 6 | **`FuneralHome`** JSON-LD in the layout (NAP, 24/7, areaServed) | Code | #1 |
| 7 | Rewrite `metadata.title` / `metadata.description` (shorten) in i18n | Code (i18n) | — |
| 8 | Anchor the local phrase + urgency in `hero.body` / `services.subtitle` (i18n) | Code (i18n) | — |
| 9 | **NAP** consistency site ↔ GBP ↔ `.env` (contract) | Operational | #1, #2 |

### Phase P1 — Amplification

| # | Task | Type |
| --- | --- | --- |
| 10 | Icons + OG image as convention files in `app/` | Design + Code |
| 11 | `app/manifest.ts` (PWA-lite) | Code |
| 12 | Visible **FAQ** section + `FAQPage` JSON-LD | Code (i18n + feature) |
| 13 | **Coverage area** copy (neighboring localities, no stuffing) | Code (i18n) |
| 14 | Embed **Google Maps** (static iframe, no API key) in Contact | Code |
| 15 | Reinforce real **E-E-A-T** in `about` (verifiable data) | Content |
| 16 | **Citations**: Bing Places, Apple Maps, Páginas Amarillas, social | Operational |
| 17 | **Reviews** strategy on GBP (request/respond carefully) | Operational |
| 18 | Conversion measurement (WhatsApp/tel click events) + Search Console | Code + Operational |

### Phase P2 — Improvements and future

| # | Task | Type |
| --- | --- | --- |
| 19 | Mark up the address with a semantic `<address>` | Code |
| 20 | `verification.google` once the Search Console ID exists | Code |
| 21 | `alt`/anchor text guide for future images | Convention |
| 22 | (Future, requires a product decision) Blog / informational guides | Out of scope |
| 23 | (Alternative) Dynamic OG image with `ImageResponse` | Code (with coverage exclusion) |

## 7. Technical detail by area

### 7.1 Domain env var and its propagation

Extend `src/config/site.ts` (already excluded from coverage via `!src/config/**`, no new test required):

```ts
// src/config/site.ts
/**
 * Public site configuration sourced from NEXT_PUBLIC_* environment variables.
 * Inlined at build time. Safe to expose (no secrets).
 */
export const SITE = {
  phone: process.env.NEXT_PUBLIC_CONTACT_PHONE ?? '', // display "15-6151-2447"
  tel: process.env.NEXT_PUBLIC_CONTACT_TEL ?? '', // "+5491161512447"
  whatsapp: process.env.NEXT_PUBLIC_CONTACT_WHATSAPP ?? '', // "5491161512447"
  address: process.env.NEXT_PUBLIC_CONTACT_ADDRESS ?? '', // address (free-form string)
  locality: process.env.NEXT_PUBLIC_CONTACT_LOCALITY ?? '', // "José C. Paz"
  region: process.env.NEXT_PUBLIC_CONTACT_REGION ?? '', // "Buenos Aires"
} as const;

/**
 * Production domain, used by metadataBase/canonical/sitemap/robots/JSON-LD.
 * Falls back to localhost so `next dev`/tests never crash on an unset env.
 * Must match EXACTLY the link published in the GBP (no trailing slash).
 */
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';

/** `tel:` href with spaces removed. */
export const telHref = (tel: string): string => `tel:${tel.replace(/\s+/g, '')}`;

/** WhatsApp click-to-chat for a digits-only number. */
export const whatsappHref = (n: string): string => `https://wa.me/${n}`;
```

`SITE_URL` is the single source of the domain for `metadataBase`, `robots`, `sitemap`, and JSON-LD.

### 7.2 Metadata (`app/layout.tsx`) integrated with next-intl

`t('metadata.title')`/`t('metadata.description')` are kept as the single source of text and `nav('brand')` is reused as `og:site_name` (no new i18n keys). `icons` and `openGraph.images` are **not** defined by hand: by placing the convention files (§7.3), Next 16 detects and injects them with an absolute URL resolved against `metadataBase`.

```tsx
// app/layout.tsx
import type { Metadata } from 'next';
import { Cormorant_Garamond, Inter } from 'next/font/google';
import { NextIntlClientProvider } from 'next-intl';
import { getLocale, getMessages, getTranslations } from 'next-intl/server';
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { SITE, SITE_URL } from '@/config/site';
import { JsonLd, buildFuneralHomeJsonLd } from '@/components/json-ld';
import '@/styles/tokens.css';
import '@/styles/global.css';

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-inter',
  display: 'swap',
});

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-cormorant',
  display: 'swap',
});

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('metadata');
  const nav = await getTranslations('nav');
  const title = t('title');
  const description = t('description');

  return {
    metadataBase: new URL(SITE_URL),
    title,
    description,
    alternates: { canonical: '/' },
    openGraph: {
      title,
      description,
      url: '/',
      siteName: nav('brand'),
      // Facebook does not recognize 'es_419'; use 'es_LA' as the umbrella
      // locale for Latin American Spanish. Do not confuse with <html lang> (es-419).
      locale: 'es_LA',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
    },
  };
}

const RootLayout = async ({ children }: { children: React.ReactNode }) => {
  const locale = await getLocale();
  const messages = await getMessages();
  const t = await getTranslations('metadata');
  const nav = await getTranslations('nav');

  const jsonLd = buildFuneralHomeJsonLd({
    name: nav('brand'),
    description: t('description'),
    url: SITE_URL,
    telephone: SITE.tel,
    address: SITE.address,
    locality: SITE.locality,
    region: SITE.region,
    imageUrl: `${SITE_URL}/opengraph-image.png`,
  });

  return (
    <html
      lang={locale}
      className={`${inter.variable} ${cormorant.variable}`}
      suppressHydrationWarning
    >
      <body>
        <JsonLd data={jsonLd} />
        <NextIntlClientProvider locale={locale} messages={messages}>
          {children}
        </NextIntlClientProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
};

export default RootLayout;
```

> Note on `og:locale`: `es_419` is **not** valid for Facebook; use `es_LA`. The site's real `<html lang="es-419">` is kept as is (resolved by `getLocale()` via the `NEXT_LOCALE` cookie).

### 7.3 `app/robots.ts` and `app/sitemap.ts`

**`app/robots.ts`** — automatically blocks indexing of Vercel previews (avoids duplicate content on `*.vercel.app`) using `VERCEL_ENV`.

```ts
// app/robots.ts
import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/config/site';

const robots = (): MetadataRoute.Robots => {
  const isProduction = process.env.VERCEL_ENV === 'production';

  return {
    rules: isProduction
      ? { userAgent: '*', allow: '/' }
      : { userAgent: '*', disallow: '/' },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
};

export default robots;
```

**`app/sitemap.ts`** — a single URL (single-page), but in a valid shape.

```ts
// app/sitemap.ts
import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/config/site';

const sitemap = (): MetadataRoute.Sitemap => [
  {
    url: SITE_URL,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 1,
  },
];

export default sitemap;
```

> `app/**/*.ts` falls within `collectCoverageFrom`: both require a colocated test at 100% coverage (see §11).

### 7.4 Icons, OG image, and `app/manifest.ts`

**Icons and OG image as convention files inside `app/`** (not in `public/`, not generated): Next 16 detects and emits the `<link>`/`<meta>` automatically, with an absolute URL resolved against `metadataBase`. Zero code, zero friction with the coverage gate (they are binaries).

| File | Format / size | Notes |
| --- | --- | --- |
| `app/favicon.ico` | Multi-size ICO (16/32) | — |
| `app/icon.png` | PNG 512×512 | Brand logo mark / `--accent` |
| `app/apple-icon.png` | PNG 180×180 | **No transparency** (iOS uses a black background) |
| `app/opengraph-image.png` | PNG exactly 1200×630, <300 KB | Name + tagline legible in the WhatsApp thumbnail |
| `app/opengraph-image.alt.txt` | Plain text, 1 line | Alt in Spanish (see below) |

```text
# app/opengraph-image.alt.txt
Cochería Nogués & Martínez — Servicios Fúnebres en José C. Paz, Buenos Aires
```

> These are **design assets** (real logo mark/palette): this spec only fixes the names/formats/dimensions that Next recognizes. Without them, Next simply does not emit those tags (does not break the build).

**`app/manifest.ts`** — PWA-lite (installable, no service worker). Reuses `nav.brand`; the colors are copied **by hand** from `tokens.css` with a sync comment (a `.ts` file cannot read CSS custom properties at build time).

```ts
// app/manifest.ts
import type { MetadataRoute } from 'next';
import { getTranslations } from 'next-intl/server';

// Keep manually in sync with src/styles/tokens.css (:root).
const THEME_COLOR = '#1f5fbf'; // --accent (light theme)
const BACKGROUND_COLOR = '#f6f9fc'; // --bg (light theme)

const manifest = async (): Promise<MetadataRoute.Manifest> => {
  const t = await getTranslations('nav');
  const name = t('brand');

  return {
    name,
    short_name: name,
    start_url: '/',
    display: 'standalone',
    background_color: BACKGROUND_COLOR,
    theme_color: THEME_COLOR,
    icons: [{ src: '/icon.png', sizes: '512x512', type: 'image/png' }],
  };
};

export default manifest;
```

> Verify in the real environment that `getTranslations()` works inside the metadata Route Handler (it should, since `cookies()` is available). If not, replace it with a documented literal.

### 7.5 `FuneralHome` JSON-LD

`FuneralHome` (a subtype of `LocalBusiness`) is the correct type for the industry and gives Google an unambiguous signal of NAP, 24/7 hours, and area. It is structured across two files + a barrel to respect the feature-folder convention and coverage:

- `src/components/json-ld/JsonLd.tsx` — pure Server Component that injects the `<script>`.
- `src/components/json-ld/build-funeral-home-json-ld.ts` — pure function (kebab-case, non-component) that builds the object.
- `src/components/json-ld/index.ts` — barrel (excluded from coverage).
- Colocated tests (§11).

```tsx
// src/components/json-ld/JsonLd.tsx
interface JsonLdProps {
  data: Record<string, unknown>;
}

export const JsonLd = ({ data }: JsonLdProps) => (
  <script
    type="application/ld+json"
    // JSON-LD requires raw script injection. `data` is built
    // server-side from our own config/i18n, never from user input.
    // Escape '<' as defense in depth against '</script>'.
    dangerouslySetInnerHTML={{
      __html: JSON.stringify(data).replace(/</g, '\\u003c'),
    }}
  />
);
```

```ts
// src/components/json-ld/build-funeral-home-json-ld.ts
interface BuildFuneralHomeJsonLdParams {
  name: string;
  description: string;
  url: string;
  telephone: string;
  address: string;
  locality: string;
  region: string;
  imageUrl: string;
}

export const buildFuneralHomeJsonLd = ({
  name,
  description,
  url,
  telephone,
  address,
  locality,
  region,
  imageUrl,
}: BuildFuneralHomeJsonLdParams): Record<string, unknown> => ({
  '@context': 'https://schema.org',
  '@type': 'FuneralHome',
  '@id': `${url}/#organization`,
  name,
  description,
  url,
  telephone,
  image: imageUrl,
  address: {
    '@type': 'PostalAddress',
    streetAddress: address,
    addressLocality: locality,
    addressRegion: region,
    addressCountry: 'AR',
  },
  areaServed: `${locality}, ${region}, Argentina`,
  openingHoursSpecification: {
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: [
      'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday',
    ],
    opens: '00:00',
    closes: '23:59',
  },
});
```

```ts
// src/components/json-ld/index.ts
export { JsonLd } from './JsonLd';
export { buildFuneralHomeJsonLd } from './build-funeral-home-json-ld';
```

**Resulting JSON-LD block (with the real data):**

```json
{
  "@context": "https://schema.org",
  "@type": "FuneralHome",
  "@id": "https://REEMPLAZAR-CON-DOMINIO-REAL.com.ar/#organization",
  "name": "Cochería Nogués & Martínez",
  "description": "Cochería en José C. Paz: sepelios, cremaciones, traslados y velatorios. Atención las 24 horas, los 365 días. Gestión PAMI. Contáctenos por WhatsApp.",
  "url": "https://REEMPLAZAR-CON-DOMINIO-REAL.com.ar",
  "telephone": "+5491161512447",
  "image": "https://REEMPLAZAR-CON-DOMINIO-REAL.com.ar/opengraph-image.png",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Av. Gaspar Campos 4848, José C. Paz, Buenos Aires",
    "addressLocality": "José C. Paz",
    "addressRegion": "Buenos Aires",
    "addressCountry": "AR"
  },
  "areaServed": "José C. Paz, Buenos Aires, Argentina",
  "openingHoursSpecification": {
    "@type": "OpeningHoursSpecification",
    "dayOfWeek": ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"],
    "opens": "00:00",
    "closes": "23:59"
  }
}
```

**Deliberate decisions (YMYL industry):**
- Do **not** include fabricated `aggregateRating`/`review` — Google may apply a manual action for structured data spam.
- `geo` is **omitted** until the exact door (number 4848) is geocoded. Do not invent coordinates.
- `sameAs` is added only once real URLs exist (GBP, Facebook, Instagram).
- `image`/`logo` only if the asset exists (a prop pointing to a 404 is worse than absent).

> **NAP consistency:** `telephone`/`address` must match EXACTLY what is loaded into the GBP. Always from `SITE`, never hardcoded.

### 7.6 FAQ + `FAQPage` (P1)

New feature-folder `src/features/landing/faq/` following the pattern of `about`/`services`/`contact`. Server Component (no `use client`), native `<details>/<summary>` accordion (accessible without JS), and `FAQPage` JSON-LD generated from the same visible i18n keys (Google requires that what is marked up be visible in the DOM).

```tsx
// src/features/landing/faq/Faq.tsx
import { useTranslations } from 'next-intl';
import styles from './Faq.module.css';

interface FaqItem {
  id: string;
  questionKey: string;
  answerKey: string;
}

const FAQ_ITEMS: readonly FaqItem[] = [
  { id: 'primerasHoras', questionKey: 'items.primerasHoras.question', answerKey: 'items.primerasHoras.answer' },
  { id: 'urgencia', questionKey: 'items.urgencia.question', answerKey: 'items.urgencia.answer' },
  { id: 'pami', questionKey: 'items.pami.question', answerKey: 'items.pami.answer' },
  { id: 'traslados', questionKey: 'items.traslados.question', answerKey: 'items.traslados.answer' },
  { id: 'cremacionSepelio', questionKey: 'items.cremacionSepelio.question', answerKey: 'items.cremacionSepelio.answer' },
  { id: 'costos', questionKey: 'items.costos.question', answerKey: 'items.costos.answer' },
];

export const Faq = () => {
  const t = useTranslations('faq');

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQ_ITEMS.map((item) => ({
      '@type': 'Question',
      name: t(item.questionKey),
      acceptedAnswer: { '@type': 'Answer', text: t(item.answerKey) },
    })),
  };

  return (
    <section id="preguntas-frecuentes" className={styles.faq}>
      <header className={styles.header}>
        <p className={styles.eyebrow}>{t('eyebrow')}</p>
        <h2 className={styles.title}>{t('title')}</h2>
        <p className={styles.subtitle}>{t('subtitle')}</p>
      </header>

      <div className={styles.list}>
        {FAQ_ITEMS.map((item) => (
          <details key={item.id} className={styles.item}>
            <summary className={styles.question}>{t(item.questionKey)}</summary>
            <p className={styles.answer}>{t(item.answerKey)}</p>
          </details>
        ))}
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }}
      />
    </section>
  );
};
```

```ts
// src/features/landing/faq/index.ts
export { Faq } from './Faq';
```

Wiring in `src/features/landing/Landing.tsx`: insert `<Faq />` between `<About />` and `<Contact />` (flow: what we offer → who we are → questions → contact).

`Faq.module.css` uses exclusively existing tokens (colors, radii, typography). The `<h2>` follows the `eyebrow`/`title`/`subtitle` pattern; the questions go in `<summary>` (not in headings) so as not to overpopulate the outline.

> **Realistic note:** since 2023, Google limits the `FAQPage` rich snippet mostly to government/health sites. The real value of the FAQ section is the on-page content (long-tail, friction reduction), not the rich snippet.

### 7.7 Embedded map in Contact (P1)

In `src/features/landing/contact/Contact.tsx`, a static iframe with no API key:

```tsx
// inside <section id="contacto">, after the existing <dl>
<div className={styles.mapWrapper}>
  <iframe
    src={`https://www.google.com/maps?q=${encodeURIComponent(SITE.address)}&output=embed`}
    title={t('mapTitle')}
    loading="lazy"
    referrerPolicy="no-referrer-when-downgrade"
    className={styles.map}
  />
</div>
```

Add `contact.mapTitle` to i18n; `mapWrapper`/`map` in `Contact.module.css` with `aspect-ratio` and existing tokens (no hex or inline styles). Extend `Contact.test.tsx` (do not create a new one).

## 8. Local SEO (mostly operational)

> For a neighborhood funeral home, local SEO weighs **more** than any on-page tactic: most searches are resolved in the Map Pack, governed by the GBP, not by the site. The site is support (it reinforces the NAP and the JSON-LD).

### 8.1 Google Business Profile (action #1 — operational)

1. **Claim/create** at business.google.com with the **EXACT** name `Cochería Nogués & Martínez` (no extra keywords in the name — it violates guidelines and can get the profile suspended).
2. **Primary category:** "Funeraria". Secondary ones if applicable: "Servicio de cremación", "Floristería" (floral arrangements), "Servicio de traslado". Never a generic "Empresa".
3. **Address** exactly `Av. Gaspar Campos 4848, José C. Paz, Buenos Aires, 1665, Argentina` — character for character identical to `NEXT_PUBLIC_CONTACT_ADDRESS`.
4. **Phone:** the same `+5491161512447` / `15-6151-2447` from the `.env`.
5. **Hours:** "Abierto las 24 horas" all 7 days (matches "Atención 24 hs, 365 días").
6. **Service area:** José C. Paz + (if truthful) Del Viso, Pilar, San Miguel, Malvinas Argentinas, Los Polvorines, Grand Bourg.
7. **Photos:** façade, wake rooms, vehicles, team (with consent). At least 10-15, no generic stock.
8. **Attributes** and payment methods; **"Website" link** to the real domain (pending input).
9. **Verify** the profile (mail/phone/video) before it starts to rank.

### 8.2 NAP — consistency contract

NAP inconsistencies are the #1 cause of Google's distrust in the business's identity. **Rule in code:** always use `SITE.phone/tel/whatsapp/address` (never re-hardcode). **Operational:** keep a checklist with the canonical values and paste them identically into every directory (e.g. "José C. Paz" always with the accent and period).

### 8.3 Citations / directories (operational, in priority order)

1. Google Business Profile (§8.1). 2. Bing Places for Business. 3. Apple Business Connect / Apple Maps (iPhone is heavily used in AR). 4. Páginas Amarillas Argentina ("Funerarias" category). 5. Funeral-industry directories / provincial chambers if any exist. 6. Facebook Business + Instagram (typical source of `sameAs`). 7. Business directory / chamber of commerce of José C. Paz. In all of them, paste the canonical NAP without variations.

### 8.4 Reviews on GBP (operational, sensitive niche)

- Ask for them **days/weeks after** the service (never the same day), via WhatsApp, in a respectful tone thanking them for their trust. **Never** offer incentives (violates Google policy and is inappropriate in this industry).
- Generate the short link from the GBP; optional printed QR at the premises.
- Respond to **all** reviews within 24-48 hs: positive ones personalized; negative ones with a calm, empathetic tone, without exposing data about the deceased/family, inviting them to resolve it in private.
- Do not use identical templates; do not buy or exchange reviews (risk of suspension, catastrophic in this industry).

### 8.5 On-page local signals (in code)

- Semantic `<address>` wrapping the address in Contact/Footer (P2).
- Truthful coverage copy (§9), without "city name stuffing" (max 5-6 localities, no repetition).
- Embedded map (§7.7).

## 9. Content and on-page

### 9.1 Title and description (edit in `messages/es-419.json` → `metadata`)

`generateMetadata()` already reads these keys; the component is **not** touched.

| Field | Current | Proposed | Reason |
| --- | --- | --- | --- |
| `title` | ~76 chars (truncated) | `Cochería en José C. Paz \| Nogués & Martínez — Atención 24 hs` (~62) | local keyword + brand + urgency, without truncating |
| `description` | ~257 chars (truncated) | see below (~152) | local keyword + services + urgency + CTA |

```json
{
  "metadata": {
    "title": "Cochería en José C. Paz | Nogués & Martínez — Atención 24 hs",
    "description": "Cochería en José C. Paz: sepelios, cremaciones, traslados y velatorios. Atención las 24 horas, los 365 días. Gestión PAMI. Contáctenos por WhatsApp."
  }
}
```

### 9.2 Local keyword and urgency in the visible copy (i18n)

Weave the phrase **only once** in a natural way (no stuffing). Edit existing keys:

```json
{
  "hero": {
    "body": "Acompañamos a cada familia en los momentos más difíciles. Como cochería en José C. Paz, disponemos de modernas salas velatorias y un equipo humano preparado para brindar un servicio integral, con contención y asesoramiento las 24 horas, los 365 días del año."
  }
}
```

### 9.3 Heading hierarchy (already correct — a rule to maintain)

A single `<h1>` (Hero), one `<h2>` per `<section>`, `<h3>` for repeated items (cards). The FAQ adds **one** `<h2>` and uses `<summary>` for the questions. Do **not** introduce a second `<h1>` or use `<h2>` for the questions.

### 9.4 Proposed FAQ (new `faq` namespace in i18n)

Six questions covering the high-anxiety informational cluster, in a sober tone, **without fixed amounts** for subsidies:

```json
{
  "faq": {
    "eyebrow": "Dudas frecuentes",
    "title": "Preguntas frecuentes",
    "subtitle": "Resolvemos las consultas más habituales sobre nuestros servicios funerarios en José C. Paz. Ante cualquier duda, escríbanos por WhatsApp o llámenos: estamos disponibles las 24 horas.",
    "items": {
      "primerasHoras": {
        "question": "¿Qué hacer en las primeras horas tras un fallecimiento?",
        "answer": "Ante un fallecimiento, lo primero es contactar a la cochería para coordinar el traslado del fallecido y comenzar los trámites correspondientes. En Cochería Nogués & Martínez lo asesoramos desde el primer llamado, las 24 horas, para acompañarlo en cada paso: certificado de defunción, elección de sala velatoria y organización del servicio."
      },
      "urgencia": {
        "question": "¿Cómo los contacto ante una urgencia?",
        "answer": "Puede comunicarse por teléfono o WhatsApp en cualquier momento, los 365 días del año. Nuestro equipo responde de inmediato para coordinar el traslado y brindarle contención desde el primer contacto."
      },
      "pami": {
        "question": "¿Gestionan sepelios para afiliados de PAMI o ANSES?",
        "answer": "Sí. Asesoramos y gestionamos la documentación necesaria para tramitar el subsidio por sepelio ante PAMI y ANSES. El monto y los requisitos vigentes los confirmamos junto a la familia al iniciar el trámite, ya que pueden actualizarse."
      },
      "traslados": {
        "question": "¿Realizan traslados fuera de José C. Paz o al exterior?",
        "answer": "Sí, coordinamos traslados dentro del país y repatriaciones internacionales, ocupándonos de toda la documentación y logística necesaria para que el proceso sea seguro y sin trámites adicionales para la familia."
      },
      "cremacionSepelio": {
        "question": "¿Cómo elijo entre sepelio y cremación?",
        "answer": "Ambas opciones son igual de respetuosas; la elección depende de las creencias, los deseos de la familia y, en algunos casos, de disposiciones previas del fallecido. Nuestro equipo lo asesora sin apuro para que pueda tomar la decisión que mejor se ajuste a su situación."
      },
      "costos": {
        "question": "¿Cuál es el costo de un servicio fúnebre?",
        "answer": "El costo varía según el tipo de servicio, la modalidad de sepelio o cremación y las coberturas disponibles (PAMI, obra social o particular). Prefiera consultarnos por teléfono o WhatsApp: le brindamos un presupuesto claro y sin compromiso, adaptado a su situación."
      }
    }
  }
}
```

### 9.5 Coverage and E-E-A-T (YMYL)

- **Coverage copy** (only if truthful) as an additional paragraph in `About`/`Contact`, styled soberly: `"Brindamos servicio en José C. Paz y zonas aledañas: Del Viso, Pilar, San Miguel, Malvinas Argentinas, Los Polvorines y Grand Bourg."` (new i18n key, e.g. `contact.coverage` or `about.coverage`).
- **Real E-E-A-T:** add 1-2 verifiable data points (year of founding, municipal license, area) that the client can back up, as a sentence in `about.body1` or an item in `about.highlights`. **Do not fabricate** years or certifications.
- **Tone:** always advisory/accompaniment, never a guarantee about third-party procedures (PAMI/ANSES). No false urgency, superlatives, or keyword stuffing. Religious neutrality (already present).

## 10. Measurement and rollout

1. **Search Console:** register the property (domain), verify it (later `verification.google`, §7 P2), submit `https://{dominio}/sitemap.xml`. Monitor coverage and indexing.
2. **Structured data:** validate `FuneralHome` and `FAQPage` with the Rich Results Test / Search Console. Zero errors/warnings.
3. **Open Graph:** validate the card (title/description/image) — **critical** because WhatsApp is the main channel. Test by sharing the link in a real chat.
4. **Conversions:** measure clicks to WhatsApp and `tel:` as events in `@vercel/analytics`. Cross-reference with GBP calls/directions. **GA4 optional** (product decision).
5. **Core Web Vitals:** track LCP/INP/CLS in `@vercel/speed-insights`. The fonts already use `display: swap`.
6. **Accessibility:** maintain the current semantics (`<nav aria-label>`, `<dl>`, `aria-hidden` on decorative elements, `<address>`), FAQ keyboard-accessible via native `<details>`.
7. **Bing/Apple:** register the listings (§8.3) for Bing/Copilot and Siri/Maps.

## 11. Testing and quality (100% per-file gate)

`collectCoverageFrom` includes `app/**/*.{ts,tsx}` and `src/**`. Excluded: `index.ts` (barrels), `src/config/**`, `src/types`, `src/styles`, `src/i18n`, `src/test-utils`.

| New/edited file | Requires a test? | What to test |
| --- | --- | --- |
| `src/config/site.ts` (`SITE_URL`) | No | Excluded (`!src/config/**`) |
| `app/layout.tsx` (`generateMetadata`) | Yes (already has `layout.test.tsx`) | Extend: mock `next-intl/server`, assert `metadataBase`, `alternates.canonical`, `openGraph`, `twitter`, `robots`; and that `<JsonLd>` is rendered |
| `app/robots.ts` | Yes — `app/robots.test.ts` | Two branches of `VERCEL_ENV` |
| `app/sitemap.ts` | Yes — `app/sitemap.test.ts` | Single entry, without coupling to the exact timestamp |
| `app/manifest.ts` | Yes — `app/manifest.test.ts` | Mock `getTranslations`, manifest shape |
| `src/components/json-ld/JsonLd.tsx` | Yes — `JsonLd.test.tsx` | That it embeds the `<script type="application/ld+json">` with the data |
| `src/components/json-ld/build-funeral-home-json-ld.ts` | Yes — `.test.ts` | Expected `@type` and `address` (pure function, one case reaches 100%) |
| `src/components/json-ld/index.ts` | No | Barrel excluded |
| `src/features/landing/faq/Faq.tsx` | Yes — `Faq.test.tsx` | Render with `render-with-intl`; each question/answer in the DOM; parse the JSON-LD and assert `FAQPage`/`mainEntity` |
| `src/features/landing/faq/index.ts` | No | Barrel excluded |
| `Contact.tsx` (map) | Yes (extend `Contact.test.tsx`) | Iframe with the correct `title` and `src` with the URL-encoded address |
| `Landing.tsx` (`<Faq/>` wiring) | Yes (extend `Landing.test.tsx`) | That `<Faq/>` is rendered |

**Patterns:**

```ts
// app/robots.test.ts
describe('robots', () => {
  const originalEnv = process.env.VERCEL_ENV;
  afterEach(() => {
    process.env.VERCEL_ENV = originalEnv;
    jest.resetModules();
  });

  describe('when running in production', () => {
    it('should allow all crawling', async () => {
      process.env.VERCEL_ENV = 'production';
      jest.resetModules();
      const { default: robots } = await import('./robots');
      expect(robots()).toEqual({
        rules: { userAgent: '*', allow: '/' },
        sitemap: 'http://localhost:3000/sitemap.xml',
      });
    });
  });

  describe('when not running in production', () => {
    it('should disallow all crawling', async () => {
      process.env.VERCEL_ENV = 'preview';
      jest.resetModules();
      const { default: robots } = await import('./robots');
      expect(robots()).toEqual({
        rules: { userAgent: '*', disallow: '/' },
        sitemap: 'http://localhost:3000/sitemap.xml',
      });
    });
  });
});
```

```ts
// app/sitemap.test.ts
import sitemap from './sitemap';

describe('sitemap', () => {
  describe('when called', () => {
    it('should return a single entry for the site root', () => {
      const [entry] = sitemap();
      expect(entry.url).toBe('http://localhost:3000');
      expect(entry.changeFrequency).toBe('monthly');
      expect(entry.priority).toBe(1);
      expect(entry.lastModified).toBeInstanceOf(Date);
    });
  });
});
```

```ts
// app/manifest.test.ts
jest.mock('next-intl/server', () => ({
  getTranslations: jest.fn(
    async () => (key: string) =>
      key === 'brand' ? 'Cochería Nogués & Martínez' : key,
  ),
}));

import manifest from './manifest';

describe('manifest', () => {
  describe('when called', () => {
    it('should return the app manifest with the site name', async () => {
      const result = await manifest();
      expect(result.name).toBe('Cochería Nogués & Martínez');
      expect(result.short_name).toBe('Cochería Nogués & Martínez');
      expect(result.icons).toEqual([
        { src: '/icon.png', sizes: '512x512', type: 'image/png' },
      ]);
    });
  });
});
```

```tsx
// src/components/json-ld/JsonLd.test.tsx
import { render } from '@testing-library/react';
import { JsonLd } from './JsonLd';

describe('JsonLd', () => {
  describe('when rendered', () => {
    it('should embed the given data as a JSON-LD script tag', () => {
      const data = { '@context': 'https://schema.org', '@type': 'FuneralHome', name: 'Test' };
      const { container } = render(<JsonLd data={data} />);
      const script = container.querySelector('script[type="application/ld+json"]');
      expect(script).not.toBeNull();
      expect(JSON.parse(script?.innerHTML ?? '')).toEqual(data);
    });
  });
});
```

> The `Faq` Server Component is not `async`, so it is tested normally with `render-with-intl`. If in the future a JSON-LD component becomes `async`, it is invoked as a function (`await StructuredData({})`) and the resolved JSX is rendered (RTL does not support async components directly). Do **not** run `--coverage` after each edit: use `npm test -- --testPathPatterns <archivo>` during development and leave `npm run test:coverage:check` for before pushing.

## 12. Acceptance checklist (Definition of Done)

**Phase P0**
- [ ] `NEXT_PUBLIC_SITE_URL` in `.env` (marked placeholder) and in `jest.setup.ts`; `SITE_URL` exported in `src/config/site.ts`.
- [ ] `generateMetadata` emits `metadataBase`, `alternates.canonical`, `openGraph`, `twitter`, `robots`; `layout.test.tsx` green.
- [ ] `app/robots.ts` + `app/robots.test.ts` (two branches) at 100%.
- [ ] `app/sitemap.ts` + `app/sitemap.test.ts` at 100%.
- [ ] `FuneralHome` JSON-LD rendered in the layout; `JsonLd`/`build-funeral-home-json-ld` with tests at 100%.
- [ ] `metadata.title` (~62 chars) and `metadata.description` (~152 chars) updated in i18n.
- [ ] Local phrase + urgency woven into `hero.body` (no stuffing).
- [ ] GBP created, "Funeraria" category, 24 hs, exact NAP, verified.
- [ ] `npm run lint`, `npm run typecheck`, `npm run test:coverage:check` green.

**Phase P1**
- [ ] `app/favicon.ico`, `app/icon.png`, `app/apple-icon.png`, `app/opengraph-image.png` + `.alt.txt` placed.
- [ ] `app/manifest.ts` + test at 100%.
- [ ] Visible FAQ section + `FAQPage`; `Faq.test.tsx` at 100%; wiring in `Landing.tsx`.
- [ ] Coverage copy (truthful) and real E-E-A-T data.
- [ ] Embedded map in Contact; `Contact.test.tsx` extended.
- [ ] Citations (Bing, Apple, Páginas Amarillas, social) registered with the canonical NAP.
- [ ] Conversion events (WhatsApp/tel) measured.

**Phase P2**
- [ ] Semantic `<address>` in Contact/Footer.
- [ ] `verification.google` once the Search Console ID exists.
- [ ] `alt`/anchor convention documented for future images.

## 13. Risks and considerations

- **Unknown domain (blocker):** everything that depends on `NEXT_PUBLIC_SITE_URL` stays as a placeholder. **Do not deploy to production** with the example value.
- **YMYL / sensitive industry:** do not fabricate `aggregateRating`/`review`, coordinates, prices, years of track record, or certifications. Risk of a Google manual action and reputational damage.
- **Exact GBP name:** no extra keywords in the name (violates guidelines → suspension → loss of all local visibility).
- **Vercel previews:** without `robots.ts` using `VERCEL_ENV`, every `*.vercel.app` preview is indexable (duplicate content). Covered by the proposed design.
- **Inconsistent NAP:** any discrepancy between site/GBP/directories dilutes local SEO. Single source: `SITE`.
- **`og:locale`:** use `es_LA` (Facebook does not recognize `es_419`); do not touch the `<html lang="es-419">`.
- **Do not break theme hydration:** keep `suppressHydrationWarning` and the light theme by default in the server render.
- **Repo conventions:** text always via i18n; data via `NEXT_PUBLIC_*`; colors only via tokens (incl. `theme_color`/`background_color` of the manifest, copied by hand with a sync comment); named exports; feature-folders + barrels; 100% per-file coverage.
- **Limited `FAQPage` rich snippet:** justify the FAQ by the on-page content, not by the snippet.
- **Missing assets:** publishing `image`/`logo` pointing to a 404 is worse than omitting them. Create the asset before declaring the prop.
- **Sanitize JSON-LD:** escape `<` (`<`) before `dangerouslySetInnerHTML` so that a translated value cannot close the `<script>`.
- **`getTranslations()` in the manifest:** verify in the real environment; documented literal fallback if it does not resolve.
- **Neighboring localities:** mention them only if service there is real; misleading content hurts rather than helps.

## 14. Sources

- generateMetadata — Next.js Docs: https://nextjs.org/docs/app/api-reference/functions/generate-metadata
- robots.ts — Next.js Docs: https://nextjs.org/docs/app/api-reference/file-conventions/metadata/robots
- sitemap.ts — Next.js Docs: https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap
- manifest.ts — Next.js Docs: https://nextjs.org/docs/app/api-reference/file-conventions/metadata/manifest
- opengraph-image / twitter-image — Next.js Docs: https://nextjs.org/docs/app/api-reference/file-conventions/metadata/opengraph-image
- App Icons (favicon, icon, apple-icon) — Next.js Docs: https://nextjs.org/docs/app/api-reference/file-conventions/metadata/app-icons
- Facebook supported locales (es_LA vs es_419): https://gist.github.com/mechastorm/3626739
- schema.org FuneralHome: https://schema.org/FuneralHome
- Local Business Structured Data — Google Search Central: https://developers.google.com/search/docs/appearance/structured-data/local-business
- FAQ Structured Data (FAQPage JSON-LD): https://www.incremys.com/en/resources/blog/faq-structured-data
- Google Maps Embed API: https://developers.google.com/maps/documentation/embed/get-started
- Gestionar reseñas — Ayuda de Perfil de Empresa en Google: https://support.google.com/business/answer/3474050?hl=es
- Conseguir más reseñas — Ayuda de Perfil de Empresa en Google: https://support.google.com/business/answer/3474122?hl=es
- Google Business Profile for Funeral Directors — IFM: https://independentfuneralmarketing.com/blog/google-business-profile-for-funeral-directors/
- Funeral Home GBP Optimization Guide — DeathcareSEO: https://www.deathcareseo.com/post/funeral-home-gbp-optimization-guide
- On-Page SEO for Funeral Homes [2026] — IFM: https://independentfuneralmarketing.com/blog/on-page-seo-funeral-homes/
- 9 SEO Strategies for Funeral Homes 2026 — 4Spot: https://4spotconsulting.com/seo-for-funeral-homes/
- Google Business Profile: Guía de Optimización 2026: https://somostumarketing.com/google-business-profile-optimizacion/
- SEO para funerarias — TePublico.NET: https://tepublico.net/seo-para-funerarias/
- NAP Consistency / citations: https://www.jasminedirectory.com/blog/business-directory-citations-explained-nap-consistency-and-why-it-matters/
- Subsidio de contención familiar por fallecimiento — ANSES: https://www.anses.gob.ar/viudez-y-fallecimiento/subsidio-de-contencion-familiar/subsidio-de-contencion-familiar-por-fallecimiento-de-un-jubilado-o-pensionado
- Código postal 1665 José C. Paz: https://codigo-postal.ar/1665-jose-c-paz
