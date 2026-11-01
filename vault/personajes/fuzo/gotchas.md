---
tipo: gotcha
id: fuzo
archivos: [tests/trio-balance.test.cjs, docs/balance/datos/trio-balance-baseline.json, src/data/powers.js, src/systems/evolutions.js]
verificado: 2026-10-31
---
# Fuzo · trampas

Volver: [[personajes/fuzo/README]] · índice general: [[gotchas/README]]

1. **`bankCards` está congelada por test.** `tests/trio-balance.test.cjs:3` compara `kind, range, count, pierce, spread` con `docs/balance/datos/trio-balance-baseline.json` y exige `powerScale` 0,8 y `damageScale` 0,58 de la evolución. Tocar cualquiera rompe el test; `:4` además mide jefe base y evolucionado.
2. **El texto de la evolución no coincide con el código.** «Atraviesan ocho rivales» (`src/systems/evolutions.js:18`), pero `remaining = pierce + primaryPierce` (`src/systems/combat.js:22`) da **10** tras evolucionar (medido con `Simulation`).
3. **`powerScale` en tres sitios.** Definición `src/data/powers.js:67`, parche `:89` (manda) y `damageScale` en `evolutions.js:54`.
4. **No existen Q ni R**; ver [[personajes/fuzo/poderes]].
