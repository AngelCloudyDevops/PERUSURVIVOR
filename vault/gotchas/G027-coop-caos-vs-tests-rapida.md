---
tipo: gotcha
id: G027
archivos: [backend/cooperative.cjs, backend/simulation.cjs]
verificado: 2026-10-31
---
# G027 · El servidor juega en Caos; los tests de `Simulation`, en rápida

- **Síntoma:** un test cooperativo pasa, pero una sala real se comporta distinto (minieventos, portales).
- **Causa:** `Simulation` usa `runMode='quick'` por defecto (`backend/simulation.cjs:18`). Las salas reales arrancan en `chaos` (`backend/cooperative.cjs:47`). Los minieventos solo corren en Caos (`src/systems/map-events.js:206`).
- **Cómo evitarla:** para probar Caos, pasa `'chaos'` como quinto argumento de `new Simulation(...)`.
- **Cómo detectarla:** `grep -n "runMode" backend/simulation.cjs`.
- Más: [[arquitectura/cooperativo-autoritativo]], [[eventos/minieventos-supervivencia/README]].
