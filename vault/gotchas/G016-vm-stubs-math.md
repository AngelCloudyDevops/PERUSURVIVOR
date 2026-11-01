---
tipo: gotcha
id: G016
archivos: [backend/simulation.cjs, scripts/benchmark-game.cjs, scripts/full-run-audit.cjs]
verificado: 2026-10-31
---
# G016 · Stubs del VM: sin DOM real, `localStorage` vacío y `Math` compartido

- **Síntoma:** el cooperativo se cae al crear sala (excepción al cargar módulos), o una
  sala altera la aleatoriedad de otra.
- **Causa:** `loadEngine` (`backend/simulation.cjs:7-10`) da al VM:
  - `document` falso: `querySelector` devuelve elementos con `style`, `dataset`,
    `classList`, `append`…; `getContext()` devuelve un Proxy que acepta cualquier método.
    No hay `Image`, `Audio`, `fetch`, `location` ni `navigator`.
  - `localStorage.getItem` devuelve `undefined` (no `null`).
  - `requestAnimationFrame` vacío; `innerWidth:1280`, `innerHeight:720`.
  - **El mismo objeto `Math` del host** (`:9`). `benchmark-game.cjs` sustituye
    `Math.random` por eso mismo (`scripts/benchmark-game.cjs:19,61`).
  - Cada script tiene `timeout:1000` en la carga (`:14`).
- **Cómo evitarla:** protege accesos al navegador:
  `typeof document!=='undefined'`, `typeof Image!=='undefined'`, `globalThis.navigator?.…`,
  `?.` en namespaces opcionales. No compares `getItem(...)===null`.
- **Cómo detectarla:** `node --test tests/cooperative.test.cjs` (carga el motor completo).
