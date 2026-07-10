# Spec — Landing redesign (Cochería Nogués & Martínez)

> Date: 2026-07-10
> Status: approved for implementation
> Reference organization: [murziez.com.ar](https://murziez.com.ar) (multi-page funeral home; we take its **section ordering** and its always-at-hand contact pattern, not its multi-page architecture).

## 1. Objective

Reorganize the one-page landing so that:

- The scroll has a clear, scannable order (identity → services → who we are → contact).
- **Contact stays always at hand** (CTA in the nav + a contact block that merges in the location).
- The sober, serene, empathetic register typical of the industry is preserved.

No stack changes: **static one-page site, no backend or database**, Next.js App Router, single locale `es-419`, text via i18n, styles via tokens.

## 2. Scope

**Includes:** information architecture (section ordering), per-section content, CTAs, tone, theme behavior, accessibility, i18n, and acceptance criteria.

**Does not include (YAGNI, explicitly discarded):** 24/7 emergency messaging in the hero, testimonials, plans/coverage, customer login, online payments, new languages, embedded map (iframe).

## 3. Information architecture

One-page. Scroll order:

```
Nav (sticky, theme toggle + "Contacto" CTA)
 └─ Hero            → identity + serene proposal + CTA to WhatsApp/tel
 └─ Servicios       → card grid (4 services)
 └─ Sobre nosotros  → who we are + commitment
 └─ Contacto        → WhatsApp + phone + address + "Cómo llegar"  (merges in location)
 └─ Footer          → minimalist (brand, short address, theme toggle)
```

Changes relative to the current state (`hero/`, `services/`, `about/`, `contact/` + `nav/`, `footer/`):

- **Contact absorbs the location.** A single block at the end with: WhatsApp, phone, address, and a "Cómo llegar" button. There is no separate location section.
- **Nav adds a visible "Contacto" CTA** (anchor `#contacto`), in addition to the existing theme toggle.

## 4. Per-section content

Copy source: `spec-docs/init-spec.md`. Every visible string lives in `messages/es-419.json` (source of truth for text). **Nothing hardcoded in components.**

### 4.1 Hero
- Brand title: "Cochería Nogués & Martínez".
- Proposal text: the opening option from init-spec — *"Acompañamos a cada familia con respeto, calidez y compromiso en los momentos más difíciles. Disponemos de modernas salas velatorias y un equipo humano preparado para brindar un servicio integral, ofreciendo contención y asesoramiento durante todo el proceso."*
- CTAs: primary button → WhatsApp (`whatsappHref`); secondary → phone (`telHref`).

### 4.2 Servicios
Grid of 4 cards (copy verbatim from init-spec):
1. **Servicios Fúnebres** — comprehensive, personalized service.
2. **Traslados** — domestic, international, and repatriation; coordination and documentation.
3. **Velación en Domicilios** — funeral chapel, an intimate and respectful space.
4. **Arreglos Florales** — variety and guidance.

The cards carry no CTA of their own. A global CTA at the end of the section → anchor `#contacto`.

### 4.3 Sobre nosotros
The "Nosotros" block from init-spec (2 paragraphs):
- Commitment: respect, warmth, and professionalism; peace of mind and support.
- Team: guidance on burials, cremations, domestic/international transfers, dealings with PAMI, and paperwork.

### 4.4 Contacto (with location)
- Brief empathetic heading message.
- WhatsApp (`whatsappHref`), phone (`telHref`), address (`SITE.address` from `NEXT_PUBLIC_CONTACT_ADDRESS`).
- **"Cómo llegar"** button → link to Google Maps in a new tab:
  `https://www.google.com/maps/search/?api=1&query=<address url-encoded>`.
  No embedded iframe (keeps the site static and avoids CSP/performance issues).

### 4.5 Footer
Minimalist: brand, short address, and theme toggle. No extensive navigation.

## 5. Tone

Sober, serene, and empathetic. Rioplatense register (voseo). No aggressive commercial language. Prioritizes dignity, support, and closeness.

## 6. Behavior and theme

- **Light theme by default** (matches the server render, avoids hydration mismatch). The value persisted in `localStorage` (`cocheria-theme`) is adopted after mount. It is reflected as `data-theme="dark"` on `<html>`. **No changes to the current mechanism.**
- Contact data by environment via `SITE` in `src/config/site.ts` (`NEXT_PUBLIC_*`). Use the `telHref` and `whatsappHref` helpers.

## 7. Styles

- Only tokens from `src/styles/tokens.css` (light in `:root`, dark in `[data-theme='dark']`).
- Each section with its colocated `.module.css`. No loose hex values or inline styles.

## 8. Accessibility

- Each section is a `<section>` with `aria-labelledby` pointing to its heading.
- Navigable anchors: `#servicios`, `#nosotros`, `#contacto`.
- External links (Google Maps, WhatsApp) with `target="_blank"` and `rel="noopener noreferrer"`.
- Contrast guaranteed by tokens in both themes.

## 9. i18n

- All new/modified strings in `messages/es-419.json`.
- Single locale, no URL prefix, resolved server-side in `src/i18n/request.ts`. **Do not add languages.**

## 10. Testing

Per-file coverage gate at **100%** (`npm run test:coverage:check`, mirrored by `.githooks/pre-push`).

- Tests colocated per component, using `src/test-utils/render-with-intl.tsx`.
- Verify per section: render with the i18n copy, presence of the anchor, and correct `href`s:
  - Contact: `wa.me/...`, `tel:...`, and the Google Maps URL with the address.
  - Hero: WhatsApp and phone CTAs.
- Query CTAs by role/accessible name (`getByRole('link'/'button', { name: ... })`).
- During development use `npm test` or `--testPathPatterns`; leave `--coverage` for the end.

## 11. Acceptance criteria

1. The scroll respects the order: Hero → Servicios → Sobre nosotros → Contacto → Footer, with a sticky nav and a Contacto CTA.
2. Each section has a working anchor (`#servicios`, `#nosotros`, `#contacto`).
3. Contact shows WhatsApp, phone, address, and "Cómo llegar", with `href`s derived from `NEXT_PUBLIC_*`.
4. Zero hardcoded strings (everything via i18n) and zero colors outside tokens.
5. `npm run lint`, `npm run typecheck`, and `npm run test:coverage:check` all green.
