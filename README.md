# Cochería Nogués & Martínez

Sitio web institucional de **Cochería Nogués & Martínez**, empresa de servicios
fúnebres de **José C. Paz, Provincia de Buenos Aires, Argentina**. Es una landing
de una sola página que presenta a la funeraria, sus servicios y sus canales de
contacto, con atención las 24 horas los 365 días del año.

El sitio busca un registro **sobrio, elegante, sereno y profesional**, acorde al
rubro: acompañar a las familias con respeto y calidez en los momentos más difíciles.

## Servicios que presenta

- Servicios fúnebres integrales y personalizados.
- Traslados nacionales e internacionales (incluida repatriación).
- Velación en domicilios con capilla ardiente.
- Arreglos florales.
- Sepelios, cremaciones y gestión de trámites (incluido PAMI).

## Stack

- **Next.js 16** (App Router) + **React 19** + **TypeScript** estricto.
- **next-intl v4** — único locale `es-419` (español rioplatense).
- **CSS Modules** + design tokens (`src/styles/tokens.css`). Sin Tailwind ni CSS-in-JS.
- **Jest + React Testing Library** — cobertura por-archivo al 100%.
- **Vercel** — deploy, Analytics y Speed Insights.

## Estructura

```
app/                    # App Router (layout raíz + page)
src/
  components/           # Compartidos: nav, footer, theme-toggle
  contexts/             # ThemeContext (claro/oscuro)
  config/site.ts        # Datos de contacto desde NEXT_PUBLIC_*
  features/landing/     # Secciones: hero, services, about, contact + Landing.tsx
  i18n/                 # Configuración y resolución de locale
  styles/               # Design tokens y estilos globales
  test-utils/           # Helpers de testing (render con i18n)
messages/es-419.json    # Catálogo de textos (fuente de verdad)
```

## Getting started

Requiere Node.js 20+ y npm.

```bash
npm install
npm run dev
```

El sitio queda disponible en `http://localhost:3000`.

## Variables de entorno

Los datos de contacto son públicos (sin secretos) y viven en `.env`. Para una
copia local podés sobrescribirlos en `.env.local` (ignorado por git):

| Variable | Ejemplo | Uso |
| --- | --- | --- |
| `NEXT_PUBLIC_CONTACT_PHONE` | `15-6151-2447` | Teléfono para mostrar. |
| `NEXT_PUBLIC_CONTACT_TEL` | `+5491161512447` | Link `tel:`. |
| `NEXT_PUBLIC_CONTACT_WHATSAPP` | `5491161512447` | Link `wa.me` (solo dígitos). |
| `NEXT_PUBLIC_CONTACT_ADDRESS` | `Av. Gaspar Campos 4848, José C. Paz, Buenos Aires` | Dirección. |

No hay email: los canales de contacto son WhatsApp, teléfono y dirección.

## Scripts

| Comando | Descripción |
| --- | --- |
| `npm run dev` | Servidor de desarrollo. |
| `npm run build` | Build de producción. |
| `npm start` | Sirve el build de producción. |
| `npm run lint` | ESLint. |
| `npm run typecheck` | Chequeo de tipos (`tsc --noEmit`). |
| `npm test` | Corre los tests. |
| `npm run test:watch` | Tests en modo watch. |
| `npm run test:coverage` | Tests con reporte de cobertura. |
| `npm run test:coverage:check` | Cobertura + gate por-archivo al 100%. |

Para correr un test puntual: `npm test -- --testPathPatterns Nav`.

## Testing y cobertura

Los tests usan Jest + React Testing Library y se colocan junto a cada componente
(`*.test.tsx`). La cobertura se exige **por archivo** al 100% (statements, branches,
functions y lines), no como promedio: `scripts/check-coverage.js` recorre el
resumen de cobertura y falla si cualquier archivo no excluido queda por debajo.

El hook `pre-push` (`.githooks/pre-push`) corre lint, typecheck y el gate de
cobertura antes de cada push. Habilitalo una vez por clon:

```bash
git config core.hooksPath .githooks
```

Durante el desarrollo conviene usar `npm test` (rápido) y dejar `test:coverage:check`
para antes de pushear.

## Internacionalización

Todos los textos visibles se gestionan con `next-intl` y viven en
`messages/es-419.json` (fuente de verdad). El sitio tiene un único locale
(`es-419`) y las URLs no llevan prefijo de idioma; el locale se resuelve del lado
del servidor por cookie. No se hardcodean strings en los componentes.

## Temas (claro/oscuro)

El tema arranca en **claro** (coincide con el render del servidor) y adopta el
valor persistido en `localStorage` después del mount. El toggle refleja el tema
como `data-theme` en `<html>` y todos los colores salen de los design tokens de
`src/styles/tokens.css` — nunca se hardcodean colores ni se usan estilos inline.

## Deployment

El sitio se despliega en **Vercel**. Cada push a la rama principal genera un
deploy; los pull requests obtienen deploys de preview. Analytics y Speed Insights
de Vercel ya están integrados en el layout. Configurá las variables
`NEXT_PUBLIC_CONTACT_*` en el proyecto de Vercel para producción.

## Convenciones

- **Feature-folders + barrels**: cada componente/sección en su carpeta con
  `index.ts` de re-export; **solo exports nombrados**.
- **`.tsx` + `.module.css`** juntos por componente; **tests colocados**.
- **Sin colores ni estilos hardcodeados**: todo vía design tokens.
- **Commits** en Conventional Commits; **ramas** `{type}/{description}`.

---

Para guías de trabajo con Claude Code en este repo, ver [`CLAUDE.md`](./CLAUDE.md).
