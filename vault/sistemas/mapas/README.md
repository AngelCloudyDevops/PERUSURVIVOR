---
tipo: sistema
id: mapas
archivos: [src/scenes/maps.js, src/rendering/day-night.js, src/rendering/weather.js, src/rendering/seasonal-art.js, src/rendering/biome-art.js, src/rendering/ambient.js]
verificado: 2026-10-31
---
# Mapas, biomas, ciclo día/noche, clima y temporadas

Qué mapas hay, cómo se eligen, y la capa visual ambiental. Terreno y chunks: [[sistemas/terreno-navegacion/README]]. Modos y etapas: [[sistemas/oleadas-dificultad/README]]. Movimiento reducido: [[sistemas/movimiento-reducido/README]].

## Catálogo (`P.Maps`, `src/scenes/maps.js:2`)
- Mapas públicos (`catalog`, `:5-9`): `campo` (Campo de Marte), `plaza` (Plaza de Armas, con fuente), `machu` (Machu Picchu), `halloween` (base `campo`, minijefe `campo`) y `navidad` (base `campo`, minijefe `plaza`).
- Biomas de jefe (`biomes`, `:11-17`), solo para administración o encuentros: `ruta-chosicano` (`combi`), `distrito-gabinete` (`cabinet`), `santuario-niebla` (`stone`), `azoteas-lima` (`vulture`), `archivo-final` (`fujimori`). Campos: `surface`, `climate`, `ambience`, `encounterBase`, `eventBase`, `miniboss`.
- `available()` `:20`: catálogo público más biomas si `P.TestBench.isAdmin()`. `ensureAllowed()` `:22` devuelve a `campo` si un biome no está permitido.
- `definition(id)` `:18` busca en catálogo y biomas (índice cacheado); `current()` `:19`.
- `select(id)` `:29` solo en menú y solo mapas públicos (o biome con admin). `transition(kind)` `:23` salta al biome del `bossKind`.
- `load(id)` `:28` carga arte bajo demanda (`images`, `ready`, `pending`). `reset()` `:31` coloca al jugador en `spawn`.
- `collide(p,old)` `:32`, `camera(x,y,w,h)` `:33`, `draw(...)` `:34`: en partida fuera de encuentro delega en `P.Chunks.draw`.
- `P.Maps.selected` se usa como semilla en `P.Chunks.hash` y en muchas decisiones (clima, minijefe, mercader).

## Ciclo día/noche (`P.DayNight`, `src/rendering/day-night.js:2`)
- Partida rápida: `sample(t)` `:4`: DÍA (0-90 s), ATARDECER, ANOCHECER, NOCHE (>270 s) con suavizado (`smooth` `:3`).
- Caos: `chaos(t)` `:14` usa `chaosPhases` (mañana, mediodía, tarde...) por etapa de 300 s, desde `P.state.environmentStart` (`mix` `:13`); `P.RunMode.dayTime` también lo acelera (`run-mode.js:15`).
- `current()` `:15` aplica ajustes por mapa (p. ej. halloween siempre más oscuro); sin efecto en menú, encuentro o `devRun` sin `balanceTest` (`active` `:16`). `ground(ctx,...)` `:17` pinta la iluminación; `hud` `:19`.

## Clima (`P.Weather`, `src/rendering/weather.js:5`)
- Cada 90 s cambia entre `clear`, `garua` y `fog` en orden pseudoaleatorio estable por `P.state.weatherSeed` (`kind` `:6`, `hash` `:5`, `sample` `:8`); evita tres iguales seguidos.
- `current()` `:10`: halloween y navidad tienen bruma/nieve propias; en modo caos hay tormenta desde 1500 s (`storm`). `label` `:11`, `icon` `:12`, `draw` `:13`, `reflections` `:14`, `fog` `:15`.
- La semilla viene de `P.RunMode.begin` (`run-mode.js:9`; 0 en rápida, aleatoria en caos).

## Temporadas y biomas visuales
- `P.SeasonalArt` (`seasonal-art.js:3`): arte de halloween y navidad (`atlases`, siluetas y puntos de interés); envuelve `P.Terrain.draw` (`:45`) y `P.Ambient.bush` (`:47`).
- `P.BiomeArt` (`biome-art.js:2`): `kinds` de props por superficie (terminal, azotea, gabinete, archivo) y `catalogs`.
- `P.Ambient` (`ambient.js:4+`): `active()`, `clock()` (0 si movimiento reducido), `art`, `bush`, `rustle`, `sway`, `pigeon`.
- Eventos de mapa (oleadas especiales, jefes) viven en `src/systems/map-events.js`; se documentan en `vault/eventos/`.

## Estado y reinicio
- `P.Maps.selected`, `images`, `ready`, `pending`; `P.state.environmentStart`, `weatherSeed`, `mapTime`. `P.Maps.reset()` en `P.Game.start`; `P.Terrain.reset()` y `Chunks.reset()` reconstruyen el mundo.

## Envoltorios
- `P.Maps.camera`: `chamelin-arena.js:31`, `cirilo-arena.js:74`, `sideral-domain.js:79`. `P.Maps.current`: `chamelin-arena.js:28`, `sideral-domain.js:80`. `P.Terrain.draw`: `seasonal-art.js:45`.

## Cooperativo
- El servidor recibe el mapa en `Simulation(map,...)` (`backend/simulation.cjs:17-19`) y el cliente lo copia del snapshot (`P.Maps.select(m.map)`, `src/network/cooperative.js:49`). Clima y día/noche son visuales y dependen de `mapTime` y de semillas del snapshot.

## Tests
- `tests/lobby.test.cjs`, `map-events.test.cjs`, `encounter-navigation.test.cjs`, `reduced-motion-feedback.test.cjs`, `gameplay.test.cjs` (en `package.json`).

## Qué no romper
- Añadir mapa: entrada en `catalog` (o `biomes`), arte `assets/maps/<id>-menu-v1.webp`, tablas en `Chunks.get`, clima/ambiente, y prueba en `lobby.test.cjs`. Si usa `base`, la miniatura y el terreno vienen del mapa base (`thumbnail` `:21`).
- Todo efecto ambiental nuevo debe respetar `P.Motion.reduced()`.
- `select` se ignora fuera del menú: usar `P.Maps.selected=...; load(...)` solo para transiciones controladas (`transition`).
