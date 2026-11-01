---
tipo: arquitectura
id: build
archivos: [scripts/build.cjs, check.cjs, scripts/check-syntax.cjs, scripts/release-budget.cjs, package.json, server.cjs]
verificado: 2026-10-31
---
# Build y scripts

## `scripts/build.cjs` (`npm run build`)
- Borra y recrea `dist/` (`scripts/build.cjs:29-31`); se niega si `dist` es un enlace simbólico.
- Copia `src/index.html` y minifica `src/ui/styles.css` → `dist/style.css` (`:32-33`).
- **Sin empaquetar:** copia cada módulo de `scripts/modules.cjs` a `dist/js/<output>` (`:34`).
- Copia `public/` → `dist/` con filtro (`:35`). Excluye:
  - `sourceMetadata` (`:7-9`): JSON de atlas y manifiestos de autoría.
  - `archivedAsset()` (`:13`): `.gitkeep`, `.prompt.txt`, cinemáticas archivadas (`:6`),
    atlas de mapa archivados (`:4`) y assets reemplazados.
  - `*prompt(s).json`, `.png` con `.webp` hermano, `-walk-v1.webp` con `-walk-v2.webp`.
- Copia `backend/` y escribe `dist/backend/modules.json`, `package.json` y scripts de ops (`:36-41`).
- Huella SHA-256 de todo `dist/` → `version.json` y `<meta name="game-version">` (`:43-44`).
- Añade `?v=<hash>` a cada `js/*.js` y `style.css` en `index.html` (`:44`).
- Imprime `Build listo: dist/ (N módulos)` (`:46`). **Nunca edites `dist/`.**

## Filtrado de assets por strings en renderers
`archivedAsset` lee el código fuente para decidir qué publicar:
| Lee | Busca | Efecto |
|---|---|---|
| `src/rendering/walk-art.js` | `directionalIds:[…]` (regex, `:11`) | Excluye `assets/attacks/<id>-attack-v1.webp` |
| `src/rendering/court-art.js` | `judge-joints-v2` | Excluye `court/judge-v1`, `fujimori-objection-v1` (`:12`) |
| `src/rendering/boss-art.js` | `combi-packed-v2`, `boss-atlas-packed-v2` | Excluye versiones v1 |
| `src/rendering/chosicano-art.js` | `chosicano-v2` | Excluye `bosses/chosicano-v1.webp` |
| `src/rendering/map-art.js` | `simpleStyle: true` | Excluye atlas `*-props-v1`, `ground-tiles-v1` |
- Si se renombra `directionalIds`, `match(...)[1]` lanza y el build cae.
- Ver [[gotchas/G002-build-filtra-assets]].

## `check.cjs` (raíz)
- Compatibilidad histórica (`check.cjs:1`): hace `build()` y corre
  `tests/build.test.cjs`, `tests/gameplay.test.cjs`, `tests/server.test.cjs` (`check.cjs:4`).
- No es `npm run check`.

## `npm run check` → `scripts/check-syntax.cjs`
- Compila cada módulo con `vm.Script` sin ejecutarlo (`scripts/check-syntax.cjs:3`).

## Presupuesto de release (`npm run release:budget`)
- `scripts/release-budget.cjs:4-5`: máximo **80 MiB** (`RELEASE_MAX_CONTENT`) y
  **1000 archivos** (`RELEASE_MAX_FILES`) en `dist/`. Verificado.
- Exige `dist/index.html` (`:6`); lista los 12 grupos más pesados (`:14`).

## Scripts de `package.json`
| Script | Hace |
|---|---|
| `build` | `node scripts/build.cjs` |
| `release:budget` | `node scripts/release-budget.cjs` |
| `prestart` | `npm run build` |
| `start` | `node server.cjs` (sirve `dist/`, `server.cjs:2`; puerto 4173, `server.cjs:14`) |
| `check` | `node scripts/check-syntax.cjs` |
| `pretest` | build + 7 tests (`marciano-kit`, `dynamic-zones`, `explosive-barrels`, `encounter-navigation`, `holiday-boss`, `vulture-domain`, `fujimori-contract`) |
| `test` | `node --test` con 93 archivos listados a mano |
| `coop` | `node backend/cooperative.cjs` (servidor cooperativo aislado) |
- 103 archivos `tests/*.test.cjs`; 3 no están en ninguna lista: [[gotchas/G006-tests-manuales]].

## Qué se publica
- Los 4 módulos de `src/development/` están en `scripts/modules.cjs` y llegan a `dist/js/`:
  [[gotchas/G008-development-en-produccion]].
