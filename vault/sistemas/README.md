---
tipo: indice
id: sistemas
archivos: [src/systems/, src/data/, src/rendering/, src/network/]
verificado: 2026-10-31
---
# Sistemas de juego

Un sistema por carpeta. Cada `README` incluye: qué hace, API pública con `archivo:línea`, estado y reinicio, envoltorios, cooperativo, tests y «qué no romper». Convenciones: [[CONVENCIONES]]. Envoltorios en general: [[arquitectura/envoltorios]].

| Sistema | Archivos principales | Nota |
|---|---|---|
| Combate | `combat.js`, `actors.js`, `stats.js` | [[sistemas/combate/README]] |
| Atributos | `attributes.js`, `stats.js` | [[sistemas/atributos/README]] |
| Oleadas y dificultad | `difficulty.js`, `run-mode.js`, `progression.js` | [[sistemas/oleadas-dificultad/README]] |
| Progresión y cartas | `progression.js`, `ability-cards.js`, `loot-choices.js` | [[sistemas/progresion-cartas/README]] |
| Evoluciones | `evolutions.js` | [[sistemas/evoluciones/README]] |
| Pasivas | `passives.js` | [[sistemas/pasivas/README]] |
| Ultis (Q) | `ultimate.js` y ultis por personaje | [[sistemas/ulti/README]] |
| Dominios (R) | `domain*.js`, `runtime.js` | [[sistemas/dominios/README]] |
| Objetos Dota | `dota-items.js`, `dota-equipment.js`, `dota-actives.js` | [[sistemas/objetos-dota/README]] |
| Gacha y meta | `gacha.js`, `meta-progress.js`, `supplies.js` | [[sistemas/gacha-meta/README]] |
| Cofres y mercader | `loot.js`, `market.js` | [[sistemas/cofres-mercader/README]] |
| IA de enemigos | `minion-tactics.js`, `minibosses.js`, `enemy-contract.js` | [[sistemas/ia-enemigos/README]] |
| Minions | `minion-evolution.js`, `minion-professions.js`, `causa-combo.js` | [[sistemas/minions/README]] |
| Terreno y navegación | `terrain.js`, `chunks.js` | [[sistemas/terreno-navegacion/README]] |
| Mapas y ambiente | `maps.js`, `day-night.js`, `weather.js` | [[sistemas/mapas/README]] |
| Juice | `juice.js` | [[sistemas/juice/README]] |
| Daño al jugador (HurtFx) | `hurt-vignette.js`, `player-feedback.js` | [[sistemas/hurtfx/README]] |
| Movimiento reducido | `ambient.js` (`P.Motion`) | [[sistemas/movimiento-reducido/README]] |
| Audio | `audio.js`, `minion-audio.js`, `background-music.js`, `soundscape.js` | [[sistemas/audio/README]] |
| Cooperativo (cliente) | `src/network/cooperative.js` y auxiliares | [[sistemas/cooperativo/README]] |
| Cuentas | `account.js`, `friends.js`, `live-gifts.js`, `inbox.js` | [[sistemas/cuentas/README]] |

## Datos transversales (verificados)
- Todo daño a enemigos pasa por `P.Entities.hurt` (`src/entities/actors.js:22`); todo daño al jugador, por `P.PlayerFeedback.hit` (`src/rendering/player-feedback.js:6`).
- `P.Systems` (movimiento enemigo, spawn, subida de nivel) vive en `src/systems/progression.js:2`, no en un archivo propio.
- El global de suministros es `P.Supply`, no `P.Supplies` (`src/systems/supplies.js:2`).
- Blink no es el único objeto activable: hay 13 objetos con activo en la tabla `definitions` más la familia Blink (`src/systems/dota-actives.js:5-18`).
- Cooperativo: el cliente no simula; el servidor corre todos los scripts del juego en `node:vm` (`backend/simulation.cjs:6-19`).
- Tests fuera de `package.json`: `boss-health`, `cabinet-boss`, `character-variants` (`tests/`).
