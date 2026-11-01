---
tipo: evento
id: elzeein
archivos: [src/data/catalog.js, src/entities/actors.js, src/systems/progression.js, src/systems/encounters.js, tests/boss-projectile-contracts.test.cjs, tests/coop-enemy-parity.test.cjs]
verificado: 2026-10-31
---
# ElZeein, jefe final

## Identidad
- `P.Data.boss = {...P.Data.characters.shift(), name:"ElZeein"}` (`src/data/catalog.js:32`). Sale del personaje `zein` (`catalog.js:4`) y se quita de la lista jugable.
- Atributos iniciales: `src/data/attributes.js:20`, `src/data/stats.js:27`.

## Cómo aparece
- Al cumplirse `mapTime >= P.Data.arena.duration` (300 s rápida, 1800 s Caos) y sin `bossSpawned`: `bossSpawned=true`, cierra el portal y mete `P.Entities.enemy(true)` (`src/systems/progression.js:3`).
- Los minieventos, zonas, barriles y mercader se cancelan o bloquean al aparecer: `bossSpawned` en `blocked()` (`src/systems/map-events.js:30`, `src/systems/dynamic-zones.js:14`, `src/systems/explosive-barrels.js:11`, `src/systems/market.js:9`).
- Laboratorio: `src/development/lab.js:11`.

## Estadísticas
- Vida `1800`, radio `40`, velocidad `65`, `boss:true`, sin `design` (`src/entities/actors.js:18`).
- Barras de vida: 4 (`boss`), 3 para jefes de mapa, 2 para minijefes (`src/entities/actors.js:3`).
- Un golpe rompe como máximo una barra (+25 % de arrastre) y la transición reduce el daño (`tests/boss-health.test.cjs:11,13`).

## Ataque (único patrón)
- `bossAttack`: fija `bossAim`, espera `bossWindup=.7` s, lanza 5 proyectiles `spread` (paso `.18`, velocidad 170, vida 6) y vuelve a esperar `attackT=2.7` s (`src/systems/progression.js:22-23`).
- Se llama desde `stepBody` para todo `e.boss` (`progression.js:21`). Daño especial.
- Evento rápido de fase al 50 %: tecla `E` abre `quickEvent` (esquiva perfecta, `src/systems/encounters.js:34-35`, `src/core/runtime.js:24`).
- Test: `tests/boss-projectile-contracts.test.cjs:45` (fija objetivo, avisa, luego dispara 5).

## Victoria
- Al morir `e.boss` se llama `P.Game.finish(true)` (`src/entities/actors.js:22`); pantalla «Derrotaste a ElZeein» (`src/scenes/game.js:5`).

## Cooperativo
- Mismo `stepEnemy`/`bossAttack` en el servidor (`backend/simulation.cjs:49`). Test: `tests/coop-enemy-parity.test.cjs:6` (avisa antes de la ráfaga y dispara el evento de fase).

Ver [[eventos/modos-de-partida/README]] y [[sistemas/oleadas-dificultad/README]].
