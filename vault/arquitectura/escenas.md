---
tipo: arquitectura
id: escenas
archivos: [src/core/runtime.js, src/scenes/game.js, src/ui/screens.js, src/systems/progression.js, src/systems/loot.js, src/systems/map-events.js, backend/simulation.cjs]
verificado: 2026-10-31
---
# Escenas: `P.state.mode` y bucle principal

No hay clases de escena: la escena es el texto de `P.state.mode`.
Nace como `'menu'` en `src/core/runtime.js:3`.

## Modos y quién los pone
| Modo | Quién lo asigna (archivo:línea) |
|---|---|
| `menu` | `src/ui/screens.js:67` (`P.UI.menu`) |
| `play` | `src/scenes/game.js:3` (`Game.start`, vía `Object.assign`), y al volver de cualquier pausa: `screens.js:66`, `progression.js:86`, `loot.js:36,41,47`, `encounters.js:55,56,64`, `market.js:43`, `map-events.js:155-163`, `supplies.js:13`, `minibosses.js:220`, `miniboss-relics.js:27`, `vulture-boss.js:13`, `portal-fx.js:16`, `cooperative.js:51` |
| `pause` | `src/ui/screens.js:66` |
| `upgrade` | `src/systems/progression.js:86` (subida de nivel) |
| `skills` | `src/systems/evolutions.js:45` (menú de habilidades) |
| `loot-opening` | `src/systems/loot.js:39` (animación de cofre) |
| `item` | `src/systems/loot.js:46`, `src/systems/miniboss-relics.js:6` |
| `shop` | `src/systems/market.js:15` |
| `portal` | `src/systems/encounters.js:55`, `src/rendering/portal-fx.js:16`, `src/development/lab.js:12` |
| `reward` | `src/systems/encounters.js:59` |
| `mini-loading` | `src/systems/minibosses.js:220` |
| `supplies-loading`, `supplies-error` | `src/systems/supplies.js:13` |
| `extinction-portal`, `extinction-room`, `extinction-reward` | `src/systems/map-events.js:153,157,162` |
| `end` | `src/scenes/game.js:5` (`Game.finish`); también `lab.js:18`, `performance.js:16`, `test-bench.js:142` |

## `P.Game.update` (`src/scenes/game.js:4`)
1. `P.PlayerFeedback.tick(dt)`.
2. Si `P.Coop?.active` → `P.Coop.tick(dt)` y **sale**: el cliente cooperativo no simula.
3. `loot-opening` → `P.Loot.advance(dt)` y sale. Cualquier otro modo distinto de `play` → sale.
4. En `play`: meta, suministros, intro del Gallinazo, derrota de jefe, ulti, chunks,
   director de caos, encuentros, eventos de mapa, zonas, barriles, `P.Systems.spawn`.
5. Tras `spawn`, `move`/intro y `Combat.tick` vuelve a comprobar `s.mode!=='play'`
   (4 comprobaciones en la línea): un paso puede abrir mejoras, cofre o portal a mitad de tick.
6. `P.UI.hudFrame()` al final.
- Los envoltorios (13) se ejecutan alrededor: [[arquitectura/envoltorios]].

## Bucle `requestAnimationFrame` (`src/scenes/game.js:8`, `boot`)
- `dt=Math.min((time-last)/1000,.04)`: **dt variable limitado a 0,04 s** (verificado).
- Orden por fotograma: `P.UI.loading` → `this.update(dt)` → `syncCinematicHud` →
  `P.Audio.tick()` → si la pestaña está oculta no dibuja → `shouldPaint` →
  `P.CoopMotion.draw(…P.World.render…)` → HUD animado, lobby, gacha, `Performance.frame`.
- `shouldPaint` (`src/scenes/game.js:7`): en `menu` dibuja a ~30 fps; en otros modos siempre.
- Tras el primer fotograma programa `loadSecondary` (`src/scenes/game.js:6`): arte diferido.

## En el servidor
- `backend/simulation.cjs` no usa `Game.update`: tiene su propio `tick(dt,inputs)`
  (`backend/simulation.cjs:28`) y fuerza `s.mode='play'` (`:33`, `:38`).
- Pausas compartidas (mejoras, cofres, portales) pasan por `backend/activities.cjs`.
- Ver [[arquitectura/cooperativo-autoritativo]].

## Reglas
- Un modo nuevo debe salir del tick: `Game.update` solo avanza en `play` y `loot-opening`.
- Si abres una pausa a mitad de tick, el resto del tick se corta por las comprobaciones de 5.
- Clave nueva en `P.state` → inicializarla en el `reset` de su sistema o en un envoltorio
  de `Game.start`: [[gotchas/G020-estado-nuevo-reset]].
