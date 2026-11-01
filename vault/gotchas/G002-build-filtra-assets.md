---
tipo: gotcha
id: G002
archivos: [scripts/build.cjs, src/rendering/walk-art.js, src/rendering/court-art.js, src/rendering/boss-art.js, src/rendering/chosicano-art.js, src/rendering/map-art.js]
verificado: 2026-10-31
---
# G002 · `build.cjs` decide qué assets publicar leyendo strings de los renderers

- **Síntoma:** tras renombrar un asset o una clave, `npm run build` lanza
  `TypeError` o el juego publicado no carga una imagen (404) que en local sí estaba.
- **Causa:** `archivedAsset()` (`scripts/build.cjs:13`) excluye assets según aparezcan
  ciertos textos en el código fuente:
  - `directionalIds:[…]` en `src/rendering/walk-art.js`, leído con regex
    (`scripts/build.cjs:11`). Si cambia el nombre o el formato, `match(...)` es `null` y el
    build cae.
  - `judge-joints-v2` (`court-art.js`), `combi-packed-v2` y `boss-atlas-packed-v2`
    (`boss-art.js`), `chosicano-v2` (`chosicano-art.js`), `simpleStyle: true` (`map-art.js`).
  - Además excluye `.png` con `.webp` hermano y `-walk-v1.webp` con `-walk-v2.webp` (`:35`).
- **Cómo evitarla:** antes de renombrar un asset o esas claves, busca el nombre en
  `scripts/build.cjs`. Mantén el formato literal `directionalIds:[...]`.
- **Cómo detectarla:** `npm run build` y `node --test tests/build.test.cjs`
  (verifica assets publicados en `dist/`). Revisa `npm run release:budget`.
- Más: [[arquitectura/build]].
