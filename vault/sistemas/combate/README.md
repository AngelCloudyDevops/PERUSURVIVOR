---
tipo: sistema
id: combate
archivos: [src/systems/combat.js, src/entities/actors.js, src/data/stats.js, src/systems/stat-runtime.js, src/data/attributes.js]
verificado: 2026-10-31
---
# Combate

Disparo automático del jugador, balas, daño a enemigos y estadísticas de combate.
Ver también [[sistemas/atributos/README]], [[sistemas/pasivas/README]], [[sistemas/ia-enemigos/README]].

## Qué hace
- `P.Combat.tick(dt)` corre cada frame: baja `s.fire`, llama `cast()` y mueve `s.shots`, `s.fields`, `s.danger` (`src/systems/combat.js:43`).
- `P.Combat.cast()` elige objetivo y crea disparos según `a.kind`: `spread`/`boomerang`, `nova`/`cone`/`melee`, `orbit` (`src/systems/combat.js:17`).
- Objetivo: `target(p,candidates,range)` (`:9`), respeta el blanco fijado `p.lockedTarget` (`locked`, `:8`) y solo enemigos en pantalla (`onScreen`, `:5`; `view`, `:4`).
- `pickTarget(clientX,clientY,rect)` fija un blanco con clic (`:10`); `drawLock` dibuja el aro (`:11`).
- `hitDamage(shot,e)` aplica caída por distancia y memoria de perdigones por enemigo (`:14`).

## API pública
- `P.Combat.cast` `:17`, `tick` `:43`, `impact(shot)` `:37`, `launch(shot)` `:39`, `target` `:9`, `view` `:4`, `onScreen` `:5`.
- `P.Entities.hurt(e,damage,push=0,source=null)` `src/entities/actors.js:22`. Todo daño a enemigos pasa por aquí.
- `P.Entities.damageFx` `:21`; `P.Entities.chargingArmor` `:16` (resistencia `chargeResistance=.4`, `:15`).
- `P.Stats.*` (`src/data/stats.js`): `init`, `normalize`, `critical`, `regen`, `lifeSteal`, `step`, `validate`, `statusDuration`.
- `P.Attributes.outgoing/incoming/multiplier/source/owner` (`src/data/attributes.js:10-16`).

## Cadena de `hurt` (orden real, `actors.js:22`)
1. `P.MapEvents.damageMultiplier(source)` y, si es miniboss, delega a `P.Minibosses.hurt`.
2. `P.Attributes.outgoing` (ataque/defensa/penetración/ventaja de atributo), luego `P.MapEvents.modifyDamage`.
3. `P.Ultimate.multiplier(e)`, resistencia de carga, `P.MinionTactics.shield`, `P.TestBench.immortal`, `P.BossHealth.damage`.
4. Resta `e.hp`; si muere: `kills++`, `P.Ultimate.gain`, `P.Loot.enemyDrop`, `P.Market.defeated`, gema de fama (`P.Difficulty.fame`), y cierre de jefes de mapa (`Vulture.defeat`, `FujimoriBoss.defeat`, `ChosicanoCombat.defeat`, `Encounters.win`, `Game.finish(true)`).
- `fixedDamage` en `source` salta el multiplicador de atributos (`attributes.js:15`).

## Estado y reinicio
- `P.state.shots/fields/danger/effects/enemies` nacen en `src/core/runtime.js:3` y se vacían en `P.Game.start` (`src/scenes/game.js:3`).
- Estadísticas viven en `entity.combatStats` (`Stats.defaults`, `stats.js:5`; límites en `limits`).
- `lockedTarget` y `aimView` están en el jugador; `Combat.server` lo pone el servidor (`backend/simulation.cjs:19`).

## Envoltorios
- `P.Combat.cast`: chamelin-kit:57, chamelin:25, cirilo-kit:58, cirilo-ur:84, cristorata-kit:48, dota-equipment:66, makanaky-ultimate:31, marciano-kit:74, miniboss-relics:23, sideral-domain:82, sideral-kit:89 (todos `src/systems/`).
- `P.Combat.tick`: chamelin-kit:60, chamelin:27, character-balance:23, cirilo-kit:59, cristorata-kit:49, marciano-kit:75, miniboss-relics:24, sideral-kit:90.
- `P.Combat.impact`: chamelin-kit:59, chamelin:26. `P.Combat.view`: chamelin-arena:52.
- `P.Combat.inArc/onScreen/segmentHit`: vulture-moon:187-189.
- `P.Entities.hurt`: stat-runtime:10 (aplica robo de vida), dota-equipment:67, causa-combo:25, chamelin-kit:61, cirilo-kit:62, cirilo-ur:86, court-ultimate:49, cristorata-kit:50, map-events:298, sideral-domain:72/103, vulture-moon:186, `src/scenes/practice.js:15`.
- `P.Game.update` envuelto en `src/systems/stat-runtime.js:5` para `P.Stats.step` (regeneración).

## Cooperativo
- Corre en la VM del servidor con `P.Combat.server=true` (`backend/simulation.cjs:19`). Con `server`, la vista de puntería sale de `p.aimView` validada por `sanitizeView` (`combat.js:3-4`: hw/hh 80-600/500).
- `owner(source)` busca jugador por `ownerId`+`ownerSlot` (`attributes.js:12`); `lifeSteal` exige mismo `ownerId` y `ownerSlot` que el jugador local (`stats.js:22`).

## Tests
- `tests/combat-balance.test.cjs`, `progressive-combat.test.cjs`, `combat-feedback.test.cjs`, `directional-aim.test.cjs`, `stats.test.cjs`, `stats-step-cache.test.cjs`, `attributes.test.cjs`, `muzzle.test.cjs`, `wave-pressure.test.cjs`: todos en `package.json`.

## Qué no romper
- Añadir un envoltorio de `hurt`/`cast` exige conservar `source.ownerId/ownerSlot` (`Attributes.source`).
- El orden de módulos decide el envoltorio exterior: `stat-runtime` va tras `actors`.
- Los tiros aprovechan `indexEnemies/nearSegment` (cuadrícula 128 px, `combat.js:40-41`): no iterar `s.enemies` completo por tiro.
- Cambiar daño base: el valor efectivo está en `character-balance.js` y `powers.js`, no solo en `catalog.js`.
