---
tipo: gotcha
id: G012
archivos: [src/data/catalog.js, src/data/powers.js, src/systems/character-balance.js, src/systems/sideral-kit.js, src/systems/cirilo-kit.js, src/systems/chamelin-kit.js, src/systems/cristorata-kit.js, src/systems/marciano-kit.js, src/systems/cirilo-ur.js]
verificado: 2026-10-31
---
# G012 · Valores sobrescritos por archivos posteriores

- **Síntoma:** cambias una estadística en `src/data/catalog.js` y en el juego no cambia;
  o una nota cita un número que no es el que se usa.
- **Causa:** archivos posteriores en `scripts/modules.cjs` reescriben `P.Data`:
  - `Object.assign(P.Data.characters.find(...),patch)` en `src/data/powers.js:82`:
    `cristorata.power` 16 (`catalog.js:5`) → **18**; `alberto` hp 120/power 28;
    `g5` hp 135/speed 195/power 36.
  - `Object.assign(P.Data.attacks.X,…)` en `src/data/powers.js:60,83-92,102-103`
    (p. ej. `pigShotgun`, `g5Kick`).
  - Ataques redefinidos en kits: `P.Data.attacks[id]=…` en `sideral-kit.js:78`,
    `cirilo-kit.js:49`, `chamelin-kit.js:47`, `cristorata-kit.js:38`, `marciano-kit.js:52`;
    `P.Data.attacks.ciriloVomit` en `cirilo-ur.js:80`.
  - En ejecución, `P.CharacterBalance.apply` reescribe `hp`, `power`, `speed` de cada
    personaje con el balance del servidor (`src/systems/character-balance.js:21`); se
    aplica en `Game.start` (`:23`) y en el VM (`backend/simulation.cjs:19`).
- **Cómo evitarla:** el valor efectivo es el **último** en orden de carga (o el balance
  activo). Busca todas las asignaciones antes de cambiar o citar un número:
  `grep -rn "attacks.<id>\|id==='<id>'" src`.
- **Cómo detectarla:** cargar el motor y leer el valor:
  `new (require('./backend/simulation.cjs').Simulation)('campo',[0,1]).P.Data...`.
