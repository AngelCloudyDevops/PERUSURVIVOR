---
tipo: sistema
id: terreno-navegacion
archivos: [src/systems/terrain.js, src/systems/chunks.js, tests/encounter-navigation.test.cjs, tests/enemy-steering.test.cjs]
verificado: 2026-10-31
---
# Terreno, chunks y navegación

Mundo infinito por sectores deterministas, colisión con props y campo de flujo para rodear obstáculos. Ver [[sistemas/ia-enemigos/README]], [[sistemas/mapas/README]], [[sistemas/cofres-mercader/README]].

## Chunks (`P.Chunks`, `src/systems/chunks.js:3`)
- Sector de 512 px (`size`, `:4`). Contenido determinista: depende del mapa y de coordenadas enteras (`:2`).
- `hash(x,y,salt)` `:5` mezcla con `P.Maps.selected.length` (misma semilla local para todos los clientes). También lo usa `P.Loot.roll`.
- `node`/`segment`/`roadDistance` `:8-13`: red de caminos global con extremos compartidos para continuidad entre sectores.
- `get(cx,cy)` `:24`: genera props en rejilla 5x5 por sector, con tablas por superficie (azotea `rooftop`, `terminal`, `cabinet`, etc.). Zona vacía cerca del origen (|x|<1050, |y|<700). No pone props sobre caminos.
- `sync()` `:31` mantiene `P.Terrain.props` con los sectores cercanos a todos los centros (jugadores) en radio <= 4; no actúa en encuentros.
- `broken` Set: ids de props destruidos (`damage` lo rellena) para que no reaparezcan. `reset()` `:6`.

## Terreno (`P.Terrain`, `src/systems/terrain.js:2`)
- `active()` `:28`: `[]` en menú, `encounter.obstacles` en arenas, o `props`.
- `indexProps()` `:29`: cubetas de 128 px. `hit(x,y,r)` `:30`, `resolve(body,old,r)` `:31` (deslizar contra sólidos y la fuente), `clear(x,y,tx,ty,r)` `:32` (línea libre, paso 12 px), `damage(o,power)` `:33` (destruye cajas: `Loot.crate`, `revision++`, `flow=null`).
- `reset()` `:4`: `revision++`, vacía flow y reconstruye props de la superficie.

## Campo de flujo
- `buildFlow()` `:34`: cuadrícula 40x27 de celdas de 60 px centrada en el jugador; BFS en 4 direcciones desde el jugador; bloqueo con `hit(...,20)`. Caché de 2 entradas (`flowCache`) con clave posición+`revision`+`DomainScenery.collisionKey()`.
- `direction(e,p)` `:37`: devuelve el vector de avance de un enemigo. Si hay línea libre al jugador va recto; si no, usa el flujo y fija un waypoint. Memoria por enemigo `nav` WeakMap, validez .12 s + `minionId%6*.01`, máx. 8 usos y radio 48 px (`:37`). En encuentros va recto.
- Consumidores: `P.Systems.stepBody` (`src/systems/progression.js:21`), `map-events.js:121`.

## Estado y reinicio
- `Terrain.props`, `nav`, `revision`, `flow`, `flowCache`; `Chunks.cache`, `edgeCache`, `broken`, `signature`. Se reinician con `Terrain.reset()`/`Chunks.reset()` al empezar partida o cambiar de mapa (`src/scenes/game.js:3`, `encounters.js:58`).

## Envoltorios
- `P.Terrain.active/hit/resolve/draw`: `chamelin-arena.js:24-26,32`, `cirilo-arena.js:75-77`, `sideral-domain.js:73-76` (sustituyen el terreno por la arena del dominio). `P.Terrain.draw`: `seasonal-art.js:45`.

## Cooperativo
- `sync` usa `this.centers?.()` (todos los jugadores) para que servidor y clientes tengan los mismos props. El cliente coop llama `P.Chunks.sync()` en `src/network/cooperative.js:56`.

## Tests
- `tests/encounter-navigation.test.cjs`, `enemy-steering.test.cjs`, `explosive-barrels.test.cjs`, `dynamic-zones.test.cjs`, `muzzle.test.cjs` (en `package.json`).

## Qué no romper
- No usar `Math.random` en `Chunks.get`: rompe determinismo cliente/servidor.
- Tras cambiar un sólido hay que subir `Terrain.revision` y anular `flow`, o los enemigos siguen la ruta vieja.
- `indexProps` debe rehacerse cuando cambia `props` (`resolve` compara `indexedProps===props`).
- `hit` en encuentros recorre `obstacles` completo: mantener las arenas con pocos obstáculos.
