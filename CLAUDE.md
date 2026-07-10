# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

Sitio institucional de una sola página (landing) para **Cochería Nogués & Martínez**,
una funeraria de José C. Paz, Provincia de Buenos Aires, Argentina. Registro sobrio,
sereno y profesional. Sin backend ni base de datos: es un sitio de marketing estático
renderizado con el App Router de Next.js.

## Stack

- **Next.js 16** (App Router) + **React 19** + **TypeScript** estricto.
- **next-intl v4** con un único locale `es-419` (español rioplatense).
- **CSS Modules** + design tokens en `src/styles/tokens.css`. Sin Tailwind ni CSS-in-JS.
- **Jest + React Testing Library** (jsdom), cobertura por-archivo al 100%.
- **Vercel** para deploy, con `@vercel/analytics` y `@vercel/speed-insights`.
- Alias de imports: `@/*` → `src/*`.

## Comandos

| Comando | Qué hace |
| --- | --- |
| `npm run dev` | Servidor de desarrollo (`next dev`). |
| `npm run build` | Build de producción (`next build`). |
| `npm start` | Sirve el build de producción (`next start`). |
| `npm run lint` | ESLint sobre todo el repo (`eslint .`). |
| `npm run typecheck` | Chequeo de tipos estricto (`tsc --noEmit`). |
| `npm test` | Corre Jest una vez. |
| `npm run test:watch` | Jest en modo watch. |
| `npm test -- --testPathPatterns Nav` | Corre un único archivo/carpeta de tests (patrón por ruta). |
| `npm run test:coverage` | Jest con reporte de cobertura. |
| `npm run test:coverage:check` | Cobertura + gate **por-archivo** al 100% (`scripts/check-coverage.js`). |

## Estructura del proyecto

```
app/                      # App Router: layout raíz + page
  layout.tsx              # Fuentes (next/font), NextIntlClientProvider, Analytics
  page.tsx                # Renderiza <Landing />
src/
  components/             # Compartidos: nav/, footer/, theme-toggle/
  contexts/               # ThemeContext.tsx (claro/oscuro)
  config/site.ts          # SITE + helpers telHref/whatsappHref (lee NEXT_PUBLIC_*)
  features/landing/       # Secciones: hero/, services/, about/, contact/
    Landing.tsx           # Compone ThemeProvider > Nav > secciones > Footer
  i18n/                   # config.ts (locales) + request.ts (resolución server-side)
  styles/                 # tokens.css (design tokens) + global.css
  test-utils/             # render-with-intl.tsx (wrapper de RTL con provider i18n)
  types/                  # tipos compartidos
messages/es-419.json      # Único catálogo de traducciones (fuente de verdad de textos)
scripts/check-coverage.js # Gate de cobertura por-archivo
.githooks/pre-push        # lint + typecheck + coverage gate antes de push
.claude/rules/            # Reglas de estilo React/TS del harness
```

Cada componente vive en su carpeta con un barrel `index.ts` que hace re-export nombrado
(p. ej. `src/components/nav/{Nav.tsx, Nav.module.css, index.ts}`).

## Hechos NO obvios

- **Locale único sin prefijo en la URL.** Solo existe `es-419` y las rutas NO llevan
  prefijo de locale. El locale se resuelve **server-side** en `src/i18n/request.ts`
  leyendo la cookie `NEXT_LOCALE` (fallback a `es-419`). No hay ruteo i18n ni
  selector de idioma; no agregues idiomas nuevos salvo pedido explícito.
- **Textos por i18n, siempre.** Ningún string visible se hardcodea en componentes:
  todo pasa por `next-intl` y vive en `messages/es-419.json`. Ese archivo es la
  fuente de verdad de los textos.
- **Datos de contacto por entorno.** Los datos públicos (teléfono, WhatsApp,
  dirección) se leen desde variables `NEXT_PUBLIC_*` en `src/config/site.ts`
  (objeto `SITE`). NO hay email en el sitio; los canales son WhatsApp, teléfono
  y dirección. Usá los helpers `telHref` y `whatsappHref` para armar los links.
- **Tema claro por defecto, con toggle.** El tema arranca en claro para coincidir
  con el render del servidor (evita mismatch de hidratación); el valor persistido
  en `localStorage` (`cocheria-theme`) se adopta después del mount. El tema se
  refleja como `data-theme="dark"` en `<html>` y los tokens CSS reaccionan a eso.
- **Sin colores hardcodeados.** Todo color/estilo sale de los tokens en
  `src/styles/tokens.css` (tema claro en `:root`, oscuro en `[data-theme='dark']`).
  Nada de estilos inline ni hex sueltos en componentes.
- **Cobertura por-archivo al 100%.** El gate (`test:coverage:check`, espejado por
  el hook `pre-push`) exige 100% en **cada** archivo no excluido, no un promedio.
  NO corras `--coverage` después de cada edición: es lento. Usá `npm test` (o un
  patrón puntual con `--testPathPatterns`) durante el desarrollo y dejá el gate de
  cobertura para antes de pushear.
- **Fuentes vía `next/font/google`** en `app/layout.tsx`: `Inter` (`--font-inter`,
  sans) y `Cormorant_Garamond` (`--font-cormorant`, serif), expuestas como
  variables CSS en `<html>` y referenciadas desde los tokens (`--font-sans`,
  `--font-serif`).

## Variables de entorno

Definidas en `.env` (públicas, sin secretos; overrides locales en `.env.local`):

| Variable | Ejemplo | Uso |
| --- | --- | --- |
| `NEXT_PUBLIC_CONTACT_PHONE` | `15-6151-2447` | Teléfono para mostrar. |
| `NEXT_PUBLIC_CONTACT_TEL` | `+5491161512447` | `href="tel:"` (formato internacional). |
| `NEXT_PUBLIC_CONTACT_WHATSAPP` | `5491161512447` | Link `wa.me` (solo dígitos). |
| `NEXT_PUBLIC_CONTACT_ADDRESS` | `Av. Gaspar Campos 4848, José C. Paz, Buenos Aires` | Dirección. |

`jest.setup.ts` fija estos mismos valores para que los tests sean deterministas.

## Convenciones

- **Feature-folders + barrels.** Cada componente/sección en su carpeta, con
  `index.ts` que re-exporta. **Solo exports nombrados** (no `default` en componentes).
- **`.tsx` + `.module.css` juntos.** Cada componente pares su hoja de estilos.
- **Tests colocados.** Los `*.test.tsx` viven junto al componente que prueban;
  usá `src/test-utils/render-with-intl.tsx` para envolver con el provider de i18n.
- **Componentes cliente** (`'use client'`) solo donde hace falta interactividad
  (tema, nav). El layout y las páginas son Server Components.
- **Commits** en Conventional Commits; **ramas** `{type}/{description}` (creá
  rama solo si se pide explícitamente).

## Reglas de código

Al escribir o revisar código React/TypeScript, seguí las reglas del harness:

- @.claude/rules/react-components.md
- @.claude/rules/react-hooks.md
- @.claude/rules/react-performance.md
- @.claude/rules/react-state.md
- @.claude/rules/react-testing.md
- @.claude/rules/react-typescript.md
