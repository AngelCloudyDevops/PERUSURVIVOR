---
tipo: gotcha
id: G015
archivos: [src/scenes/game.js, backend/simulation.cjs, src/systems/kingteka-domain.js, src/systems/sideral-kit.js]
verificado: 2026-10-31
---
# G015 · Mismo código en tres contextos: solitario, cliente coop y servidor

- **Síntoma:** una mecánica se aplica dos veces en cooperativo (cliente y servidor), o
  nunca, o el cliente modifica estado que el siguiente snapshot pisa.
- **Causa:** cada módulo corre en:
  1. Solitario: `P.Coop.active` falso, `P.Combat.server` falso.
  2. Cliente cooperativo: `P.Coop.active` verdadero. `Game.update` delega en
     `P.Coop.tick` y no simula (`src/scenes/game.js:4`).
  3. VM del servidor: `P.Combat.server=true` (`backend/simulation.cjs:19`); no se llama
     `Game.update` sino `Simulation.tick`.
- Patrones del código:
  - `if(!P.Coop?.active) …tick(dt)`: solo solitario (p. ej. `kingteka-domain.js:72`).
  - `if(… && (!P.Coop?.active || P.Combat.server))`: solitario o servidor, nunca el
    cliente coop (p. ej. `sideral-kit.js:92`).
- **Cómo evitarla:** decide en qué contexto corre la lógica. Si la simulación del servidor
  debe hacerla, añade la llamada en `backend/simulation.cjs` (`tick`).
- **Cómo detectarla:** `tests/coop-enemy-parity.test.cjs`, `tests/cooperative.test.cjs` y
  prueba manual con dos jugadores.
- Más: [[arquitectura/cooperativo-autoritativo]].
