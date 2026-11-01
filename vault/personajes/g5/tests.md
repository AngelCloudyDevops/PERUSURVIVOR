---
tipo: personaje
id: g5
archivos: [tests/gameplay.test.cjs, tests/miniboss-phase.test.cjs, tests/trio-balance.test.cjs, tests/progressive-combat.test.cjs]
verificado: 2026-10-31
---
# La G5 · tests

Sin archivo propio; todos registrados en el script `test` de `package.json`.
- `tests/gameplay.test.cjs:141-142,151,178`: arco de 145°, sin disparo si no hay blanco, mejora de proyectiles, Q inactiva.
- `tests/trio-balance.test.cjs:3-5`: conserva geometría de `g5Kick` y sus valores de balance (reducción base y evolucionada). La auditoría lee `docs/balance/datos/trio-balance-runs.json`.
- `tests/miniboss-phase.test.cjs:142,149,169,173`: contra minijefes.
- `tests/progressive-combat.test.cjs:8`: poses de patada.
- `tests/roster-balance.test.cjs:3-5`: lee `docs/balance/datos/roster-audit.json` (18 personajes); el test de escala de evolución sí usa la simulación.
- `tests/save-validation.test.cjs:32` y `tests/domain.test.cjs:76`: colección y compañeros.
