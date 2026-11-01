---
tipo: sistema
id: ia-enemigos
archivos: [src/systems/progression.js, src/systems/minion-tactics.js, src/systems/minibosses.js, src/data/enemy-contract.js, tests/enemy-steering.test.cjs, tests/minion-tactics.test.cjs]
verificado: 2026-10-31
---
# IA de enemigos

Persecución, separación, antiatascos, ataques con telegrafiado y minijefes. Vocabulario de la skill `game-ai`: FSM con estados explícitos, steering suave, A* con heurística admisible. Relacionado: [[sistemas/oleadas-dificultad/README]], [[sistemas/terreno-navegacion/README]], [[sistemas/minions/README]], [[sistemas/combate/README]].

## Movimiento de minions (`P.Systems`, `src/systems/progression.js`)
- `P.Systems.move(dt)` `:4` mueve al jugador y luego llama `stepEnemy` por enemigo (`beginTick`/`endTick` `:10-11`).
- `stepEnemy` `:20` y `stepBody` `:21`: un único cuerpo por enemigo, compartido por cliente (un jugador) y servidor (jugadores vivos; `use(p)` fija el jugador activo). Devuelve `true` si el objetivo murió.
- Orden en `stepBody`: `SideralDomain.holdBoss`, `Ultimate.flockStep`, objetivo, `MapEvents.moveEnemy`, aturdimiento Makanaky, y bifurca por tipo: miniboss (`Minibosses.move`/`contact`), `mapBoss` (`Encounters.bossMove`), resto.
- Histéresis de objetivo: `target(e,players)` `:7` conserva `e.targetSlot` salvo que muera o falte, o que otro jugador esté a menos del 75 % de la distancia.
- Separación: rejilla de 64 px por tick (`sepKey` `:17`, `separate` `:18`); solo minions normales (`separable` `:16` excluye boss, mapBoss, miniboss, dinos de extinción).
- Atasco: `unstick` `:15` (`stuck` WeakMap `:14`). Si en ~0,5 s avanza menos del 20 % de lo esperado, se desliza de lado ~0,6 s; el lado sale de `minionId` y de un sondeo de espacio libre.
- Ocupados (`tactic/rangedAim/burst/charge`): `busyEnemies` `:19` usa el conjunto del tick; evita filtrar todos los enemigos.
- Disparo a distancia: `P.Systems.ranged` `:35`; patrón de jefe `bossPattern` `:22`.

## Ataques de minion (`P.MinionTactics`, `src/systems/minion-tactics.js:3`)
- Líneas de tiempo deterministas compartidas por solo y servidor (`:2`). `definitions` (`:4-14`): 10 identidades (punch, shovel, sweep, police, architect, firefighter, chef, astronaut, mummy, elf) con `windup`, `recovery`, `range`, `damage`.
- API: `key(e)` `:16`, `profile` `:17`, `limits` `:19`, `busy` `:20`, `plan` `:28`, `tick` `:40`, `motion` `:53`, `shield` `:58`, `advance` `:59`, `path` `:70`, `draw` `:75`. `contactAllowed(e)` `:56`: sin daño de contacto mientras hay `tactic`.
- Telegrafiado: todo ataque tiene `windup` visible y `recovery`; los límites por etapa vienen de `P.Difficulty.limits` (ver oleadas).

## Minijefes (`P.Minibosses`, `src/systems/minibosses.js:3`)
- `catalog` (`:4-8`): `makanaky`, `campo` (El Fiscalizador), `plaza` (La Paloma Brava), `machu` (El Huaco Renegado). `choose(map)` `:10`: en plaza alterna con Makanaky por `miniPlazaTurn`.
- Aparición: `interval()` `:11` = 60-90 s (240-360 s en caos); `tick` `:19` avisa (`miniWarning`) y crea; no aparece con jefe, encuentro o evento.
- Navegación: A* en cuadrícula local de 37x37 celdas de 40 px, máx. 900 expansiones (`planRoute` `:48-57`, `navigate` `:58`).
- Fases: entrada (`mini-entry`), furia al 50 % de vida (`beginFury`, `move` `:76`), ataques por `attacks` del catálogo.
- `recordDamage(amount)` `:175`; `spawnPolicy()` `:173` baja cap/intervalo mientras uno vive.
- `P.Minibosses.hurt` es el camino de daño de minijefes (llamado desde `Entities.hurt`, `actors.js:22`).

## Contrato de enemigos (`P.EnemyContract`, `src/data/enemy-contract.js:3`)
- `version:2`; `limits` por categoría (minion 1 ataque; dinosaur 1+1 habilidad de rol; miniboss 3 ataques, 2 fases, 1 ulti; boss 4 ataques, 2 pasivas, 2 fases, 1 ulti, 1 dominio) (`:5-10`).
- `category`, `stats`, `role`, `weakAgainst`, `describe`, `valid` (`:11-21`). Sirve al códice y a `P.Stats.validate`; no mueve enemigos.

## Estado y reinicio
- Por enemigo: `targetSlot`, `tactic`, `rangedAim`, `burst`, `charge`, `attackProfile`, `minionId`. Globales: `Systems.busySet/sepGrid` (solo dentro de un tick), `Minibosses.reset()` `:12` (`miniNext`, `miniVisits`...).

## Envoltorios
- `P.MinionTactics.motion/tick`: `chamelin-kit.js:68-69`. `P.Systems.move`: `cirilo-kit.js:60`, `cristorata-kit.js:52`. `P.Systems.ranged`: `chamelin-kit.js:70`. `P.Systems.bossAttack`: `encounters.js:87`. `P.Minibosses.create`: `character-balance.js:23`; `move`: `encounters.js:83`; `hurt`: `sideral-domain.js:103`.

## Cooperativo
- El servidor corre el mismo `stepBody` con la lista de jugadores vivos; la histéresis por `targetSlot` evita saltos de objetivo. El cliente coop no simula enemigos (los recibe por snapshot; ver [[sistemas/cooperativo/README]]).

## Tests
- `tests/enemy-steering.test.cjs` (histéresis, ownerSlot, ocupados, separación, atasco), `minion-tactics.test.cjs`, `miniboss-phase.test.cjs`, `coop-enemy-parity.test.cjs`, `boss-charge-ranges.test.cjs`, `guardian-boss.test.cjs`, `procession-boss.test.cjs`, `holiday-boss.test.cjs` (en `package.json`).

## Qué no romper
- Determinismo: las líneas de tiempo no usan `Math.random` al decidir golpes (paridad solo/servidor).
- Usar `busyEnemies`/`separable` en vez de recorrer `s.enemies` por enemigo (coste cuadrático; ver [[arquitectura/rendimiento]]).
- No tocar `e.speed` fuera de `Difficulty.pace`; el antiatasco compara contra `e.speed*dt*DomainAftermath.slow`.
- Todo ataque nuevo: `windup` visible y hueco de esquiva (tests de geometría en `minion-tactics.test.cjs`).
