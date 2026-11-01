---
tipo: gotcha
id: G029
archivos: [src/systems/map-events.js, src/systems/minibosses.js, src/systems/dynamic-zones.js, src/systems/explosive-barrels.js]
verificado: 2026-10-31
---
# G029 · Un evento de mapa activo pausa minijefes, zonas y barriles

- **Síntoma:** durante un minievento (o su aviso) no aparecen minijefes, zonas dinámicas ni barriles.
- **Causa:** `P.Minibosses.tick` (`src/systems/minibosses.js:19`), `P.DynamicZones` (`src/systems/dynamic-zones.js:14`) y `P.ExplosiveBarrels` (`src/systems/explosive-barrels.js:11`) salen si `P.MapEvents.active()` es verdadero.
- **Cómo evitarla:** al añadir un evento, decide si respeta esa pausa y consulta `P.MapEvents.active()` igual que ellos.
- **Cómo detectarla:** `grep -rn "MapEvents?.active()" src`.
- Más: [[eventos/minieventos-supervivencia/README]].
