---
tipo: gotcha
id: G017
archivos: [backend/simulation.cjs, src/scenes/game.js, src/systems/progression.js]
verificado: 2026-10-31
---
# G017 · El VM del servidor sustituye funciones de `P`

- **Síntoma:** un efecto añadido en `P.Game.finish`, `P.Systems.levelup` o en
  `P.Game.update` funciona en solitario pero nunca en cooperativo.
- **Causa:** el constructor de `Simulation` reemplaza (no envuelve):
  - `P.Game.finish` (`backend/simulation.cjs:22`): solo marca `result='win'`.
  - `P.Systems.levelup` (`backend/simulation.cjs:23`): abre la elección compartida de
    `Activities`.
  - `P.Chunks.centers`, `P.Minibosses.partySize`, `P.Court.players` (`:21`).
  - `P.Encounters.win` (`backend/activities.cjs:4`): marca `returning`; `returnFromArena` comparte `P.Encounters.leave` con la victoria individual.
- Y `Simulation.tick` (`:28-62`) reimplementa el bucle: no llama a `P.Game.update`, así
  que sus 13 envoltorios no corren en el servidor. Los ticks de dominios se llaman a mano
  (`:34-47`).
- **Cómo evitarla:** si la mecánica debe existir en cooperativo, añádela también en
  `backend/simulation.cjs` o en `backend/activities.cjs`. Cambios en `backend/` requieren
  revisión del propietario.
- **Cómo detectarla:** `grep -n "P\.[A-Z][a-zA-Z]*\.[a-z][a-zA-Z]*=" backend/*.cjs`.
- Más: [[arquitectura/cooperativo-autoritativo]], [[arquitectura/envoltorios]].
