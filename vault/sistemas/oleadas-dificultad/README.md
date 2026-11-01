---
tipo: sistema
id: oleadas-dificultad
archivos: [src/data/difficulty.js, src/systems/run-mode.js, src/systems/progression.js, src/systems/minibosses.js, src/entities/actors.js, tests/wave-pressure.test.cjs]
verificado: 2026-10-31
---
# Oleadas y dificultad

Qué enemigos aparecen, a qué ritmo, con qué tope. Relacionado: [[sistemas/ia-enemigos/README]], [[sistemas/mapas/README]], [[sistemas/combate/README]].

## Etapas (`P.Difficulty.stages`, `src/data/difficulty.js:4-13`)
- 8 etapas por `at` (segundos de `mapTime`): 0, 8, 30, 65, 110, 170, 215, 255. Cada una fija `types`, `heavy`, `interval`, `cap`, `danger`, `casts`, `tier`, `windup`, `cooldown`.
- `cap` va de 16 a 80; `interval` de .85 a .42 s.
- `index(time)` `:18`, `current()` `:19` (en `devRun` sin `balanceTest` o en encuentro usa la etapa 8).
- `cap()` `:20`: `min(P.Data.arena.enemyCap, stage.cap)`; en caos suma `stageAt()*4` hasta 100. `enemyCap:80` en `src/data/catalog.js:23`.
- `phase(time)` `:15`: ciclo de 30 s; empuje entre 8 y 20 s (factor .72), respiro 1.05.
- `pace(e,time)` `:16`: asigna `waveRole` (`heavy`/`runner`/`line`), velocidad y salud (runner x.85).
- `fame(e)` `:14`: valor de gema por rol. `attack(e)` `:21` y `limits(e)` `:22` escalan ataques de minions por etapa.
- `spawnPoint(p,angle,legacyRadius,boss)` `:17`: punto fuera de la vista de todos los jugadores vivos (en servidor usa `P.Court.players()`).

## Aparición
- `P.Systems.spawn(dt)` en `src/systems/progression.js:3`: baja `s.spawn`, intenta 8 candidatos de `P.Entities.enemy()` (`src/entities/actors.js:18`), respeta `P.Minibosses.spawnPolicy()` (`src/systems/minibosses.js:173`: cap x.85 e intervalo x1.45 con miniboss activo).
- No hay spawn en encuentros, `devRun` sin `balanceTest`, ni con `MapEvents.blocksSpawns`.
- Jefe final: cuando `mapTime >= P.Data.arena.duration` (`progression.js:3`).
- `mapTime` solo avanza fuera de encuentros (`src/scenes/game.js:4`).

## Modos (`P.RunMode`, `src/systems/run-mode.js:4`)
- `quick`: 300 s; `chaos`: 1800 s, 6 etapas de 300 s (`stageAt`, `:13`), 3 ventanas de portal (`portalWindows`, `:16`).
- `P.RunMode.begin(options)` `:9` fija `P.state.runMode`, entorno y semilla de clima.
- `P.ChaosDirector` (`:22`): `reset()` `:24` y `tick()` `:27` añaden un obstáculo por etapa y transición visual.

## Estado y reinicio
- `P.state.mapTime`, `spawn`, `runMode`, `bossSpawned` en `src/core/runtime.js:3`; se reinician en `P.Game.start` (`game.js:3`). `ChaosDirector.reset` limpia `lastStage/props/transition`.

## Envoltorios
- Ninguno sobre `P.Difficulty`/`P.RunMode`. `character-balance.js:23` envuelve `P.Entities.enemy` (stats de enemigos).

## Cooperativo
- El servidor corre `Systems.spawn` en su VM; `spawnPoint` considera a todos los jugadores (`difficulty.js:17`).

## Tests
- `tests/wave-pressure.test.cjs`, `progressive-combat.test.cjs`, `minion-tactics.test.cjs`, `enemy-steering.test.cjs` (en `package.json`).

## Qué no romper
- Cada oleada conserva su perfil de nacimiento (`threatStage`): no recalcular al cambiar etapa.
- `P.Difficulty.limits` se usa en 8 sitios; cambiar `danger/casts` afecta límites de proyectiles.
- Usar `mapTime`, no `elapsed`, para relojes de oleada y portal.
