---
tipo: evento
id: exploration
archivos: [src/systems/exploration.js, backend/activities.cjs, tests/cooperative.test.cjs]
verificado: 2026-10-31
---
# Estación del emoliente (`P.Exploration`)

Defender el puesto 20 s para curarte y ganar monedas. Solo en `campo` (`src/systems/exploration.js:4-5`).

## Cómo funciona
- `reset` busca el primer punto libre entre `[850,400]`, `[850,250]`, `[1000,400]`, `[850,550]` (`exploration.js:4`). Se invoca en `Game.start` (`src/scenes/game.js:3`) y al cambiar de bioma (`src/systems/encounters.js:58`).
- Disponible si hay estación, mapa `campo`, sin encuentro y fuera de pruebas (`available :5`). No hay estación en halloween, navidad, plaza ni machu.
- Iniciar: acercarse a <150 y pulsar el botón `#event-start` (`start :7`, `near :6`, `hud :9`). Solo en fase `idle` y sin jefe final.
- `active`: permanecer a ≤200 del puesto; fuera de ahí el progreso vuelve a 0 (`tick :8`). Cada 4 s sale un enemigo a 290 del puesto si hay cupo (`:8`).
- Al llegar a 20 s: cura `35 %` de la vida máxima, +25 monedas (`:8`). El mensaje dice «+35% de vida máxima» pero el código solo cura (no sube el máximo).
- Un jefe final interrumpe el evento (`tick :8`).
- Bloquea minieventos y otros sistemas: `P.Exploration?.station?.phase==='active'` en `MapEvents.blocked()` (`src/systems/map-events.js:30`).

## Cooperativo
- Acción `event` del servidor: arranca si alguien está cerca (`backend/activities.cjs:22-25`), aviso «Defiendan el emoliente juntos».
- El defensor es quien esté a ≤200 (o el primero vivo) (`activities.cjs:118-121`); al terminar el otro jugador recibe también la curación del 35 % (`:122`). Las +25 monedas son del fondo común.
- Snapshot: `station` (`activities.cjs:130`).
- Test: `tests/cooperative.test.cjs:48` (cualquiera inicia, defensa alternada, curación de ambos).
