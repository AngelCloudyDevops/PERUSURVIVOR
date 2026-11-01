---
tipo: indice
archivos: [scripts/modules.cjs, src/data/catalog.js, scripts/build.cjs, backend/simulation.cjs]
verificado: 2026-10-31
---
# Arquitectura

Cómo está armado el juego por dentro. Una nota por tema; cada dato cita `archivo:línea`.

| Nota | Qué responde |
|---|---|
| [[arquitectura/objeto-p]] | Cómo nace `window.P`, qué namespace crea cada archivo |
| [[arquitectura/orden-modulos]] | `scripts/modules.cjs`: 169 módulos, orden de carga, cómo registrar uno nuevo |
| [[arquitectura/envoltorios]] | Lista completa de envoltorios de las 7 funciones más envueltas |
| [[arquitectura/escenas]] | `P.state.mode`, quién lo cambia, bucle `requestAnimationFrame` |
| [[arquitectura/build]] | `build.cjs`, filtro de assets, `check`, presupuesto de release, scripts npm |
| [[arquitectura/cooperativo-autoritativo]] | VM por sala, 25 ticks/s, protocolo 3, límites de salas, validación de intenciones |
| [[arquitectura/cuentas-guardado]] | Cuentas con `node:sqlite`, validación de guardados, migraciones `MIGRATE`, `-bak` |
| [[arquitectura/rendimiento]] | Benchmarks deterministas, `?profile`, presupuestos que fijan los tests |

## Ideas clave
- JavaScript puro con scripts clásicos; todo cuelga de un único global `P`.
- El orden de `scripts/modules.cjs` lo decide todo: quién define, quién envuelve, qué valor gana.
- El mismo código corre en el navegador y en el `node:vm` del servidor cooperativo.

Trampas transversales: [[gotchas/README]].
