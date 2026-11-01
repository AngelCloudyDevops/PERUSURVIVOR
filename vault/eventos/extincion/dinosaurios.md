---
tipo: evento
id: extinction-dinosaurios
archivos: [src/systems/map-events.js, tests/map-events.test.cjs]
verificado: 2026-10-31
---
# Extinción: dinosaurios y roles

Padre: [[eventos/extincion/README]]. Catálogo: `dinosaurCatalog` (`src/systems/map-events.js:54-61`), perfiles de combate: `dinosaurProfile` (`:65-72`), roles: `role :53`. Hay una «wiki» de la lista en `wikiEntries :62`.

| Clave | Nombre | Vida | Vel. | Radio | Rol | Habilidades |
|---|---|---|---|---|---|---|
| `raptor` | Velociraptor | 82 | 88 | 18 | daño | salto depredador; furia creciente hasta nivel 3 (`rageLevel :92`) |
| `ankylosaur` | Anquilosaurio | 175 | 45 | 29 | tanque | guardia frontal ×0,48 de daño (×1,3 por la espalda), protege aliados (`incomingMultiplier :138`) |
| `pterosaur` | Pterosaurio | 68 | 94 | 20 | apoyo | picada aérea, rescata aliados, acelera manada |
| `dilophosaur` | Dilofosaurio | 88 | 70 | 21 | debilitador | escupitajo con trayectoria fija y nube tóxica (`tickPoisonClouds :179`) |
| `parasaur` | Parasaurio | 105 | 61 | 23 | sanador | cura en pulso; reanima una vez a un caído con 38 % de vida (`defeated :143`) |
| `triceratops` | Triceratops | 122 | 55 | 25 | rompefilas | embestida con franja de espinas; solo en mazmorra |

- Vida y velocidad efectivas: `hp × (1+(tier−1)×.12 [+ (sala−1)×.08 en mazmorra]) × (1+.4×(jugadores−1))`; velocidad `× (1+(tier−1)×.035)` (`spawnDinosaur :77`).
- En la fase de fragmentos solo se generan `raptor` y `pterosaur` aleatorios (las oleadas fijan su plan); la mazmorra usa los cinco con triceratops (`:76`).
- Esquiva: `Espacio` durante la ventana de una embestida pesada (triceratops y jefes), dash lateral con 4 s de recarga; no se ofrece contra raptores (`dodgePrompt :95`, `tryDodge :97`; tests `tests/map-events.test.cjs:52,56`).
- Franja de embestida: avisa sin castigar; las púas ralentizan solo durante la carga (`chargeLane :93`, `applyChargeLane :99`; test `:48`).
- Movimiento y formación: `moveEnemy :102`, `formationPoint :89`, `threatenedAlly :90`; el raptor reparte objetivos entre jugadores (`targetFor :123`).
- El servidor ejecuta habilidades de rol y no la IA genérica: `MapEvents.moveEnemy` intercepta en `stepBody` (`src/systems/progression.js:21`; test `tests/map-events.test.cjs:64`).

## Tests
`tests/map-events.test.cjs:24,30,34,40,44,48,52,56,68`.
