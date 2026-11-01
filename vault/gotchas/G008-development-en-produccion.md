---
tipo: gotcha
id: G008
archivos: [scripts/modules.cjs, src/development/lab.js, src/development/performance.js, src/development/test-bench.js, src/development/equipment-bench.js]
verificado: 2026-10-31
---
# G008 · `src/development/` se publica en producción

- **Síntoma:** algo pensado «solo para desarrollo» (laboratorio, banco de pruebas,
  panel de rendimiento) es visible o accesible en la web publicada.
- **Causa:** los 4 archivos de `src/development/` están en `scripts/modules.cjs`
  (posiciones 85 `lab.js`, 94 `performance.js`, 114 `test-bench.js`,
  169 `equipment-bench.js`) y `scripts/build.cjs:34` los copia a `dist/js/`.
  Solo el cliente los oculta (p. ej. `isAdmin()` en `src/development/test-bench.js:6`
  mira `P.Account.user.role`).
- Además corren en el VM del servidor y envuelven funciones de juego
  (`test-bench.js:143-146`): [[arquitectura/envoltorios]].
- **Cómo evitarla:** nada secreto (claves, rutas internas, trucos de admin con efecto en
  servidor) en `src/development/`. La autorización real va en `backend/`.
- **Cómo detectarla:** `npm run build && ls dist/js | grep -E "lab|test-bench|performance|equipment-bench"`.
