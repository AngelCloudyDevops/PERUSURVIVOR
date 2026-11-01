---
tipo: sistema
id: pasivas
archivos: [src/systems/passives.js, src/systems/combat.js, src/systems/kingteka-arsenal.js]
verificado: 2026-10-31
---
# Pasivas de personaje (`P.Passives`)

Registro autoritativo de una pasiva por personaje. «El estado vive en el jugador y viaja en snapshots cooperativos» (`src/systems/passives.js:2`). Índice de poderes: `vault/poderes/` (otra zona). Relacionado: [[sistemas/combate/README]], [[sistemas/progresion-cartas/README]].

## Quién tiene pasiva (`definitions`, `passives.js:4-7`)
- Base: `kingteka` («Instinto de expedición»: cambiar de arma cura 2,5 % y +12 % al siguiente ataque; ventana 4 s, recuperación 7 s) y `makanaky` («Racha de la Realeza»: GA hasta x10, golpe Real x1,35 puño / x1,6 cabezazo).
- Añadidas por kits con `Passives.definitions.<id>=`: chamelin (`chamelin-kit.js:49`), cirilo (`cirilo-kit.js:51`), cristorata (`cristorata-kit.js:40`), marciano (`marciano-kit.js:56`), sideral (`sideral-kit.js:84`).
- Cuy, Paloma, Alan y el resto no tienen pasiva en el registro (`definition(actor)` devuelve `null`, `:8`).

## API pública
- `definition(actor)` `:8`, `eligible(actor,attack)` `:9` (solo Makanaky con `royalEcho` melee), `state(actor,create)` `:10`, `expire(actor)` `:16`, `tick(actor)` `:22`.
- Ganchos de combate: `beforeCast(p,a)` `:32` (devuelve multiplicadores `damage`), `afterCast(p,a,hits,passive)` `:38`, `impact(actor,attack,target,cast)` `:45`, `cooldownMultiplier(p)` `:46`.
- `weaponSwitch` `:23` (Kingteka al cambiar arma, llamado desde `src/systems/kingteka-arsenal.js:24`).
- UI: `rows(id)` `:47` (tabla del códice), `aura(ctx,actor)` `:52`, `hud()` `:53` (`#passive-hud`), `install()` `:65`.
- Llamadas desde `P.Combat`: `tick`/`cooldownMultiplier` (`combat.js:43`), `beforeCast` (`:17`), `afterCast` (`:24,30,31`), `impact` (`:30`).

## Estado y reinicio
- Kingteka y Makanaky: `actor.passive` se crea con `P.Passives.state(actor)`; `install()` envuelve `P.Entities.player` para crearla al instanciar el jugador (`passives.js:65`). Kingteka: `{weapon,primed,readyUntil,cooldownUntil,adaptedSerial}`; Makanaky: `{stacks,expires,royalSerial}`. Los kits guardan la suya en su propio campo (p. ej. `p.sideralPassive`, `sideral-kit.js:95`). Se pierde con el jugador al reiniciar partida.
- Miniboss como jugador (`actor.miniboss`) no tiene pasiva (`state` devuelve `null`).

## Envoltorios
- Los kits sustituyen `P.Passives.state` y `rows` para su personaje: chamelin-kit:72-73, cirilo-kit:68-69, cristorata-kit:57-58, marciano-kit:80-81, sideral-kit:95-96. `dota-equipment.js:72` envuelve `cooldownMultiplier`. `P.Entities.player` envuelto en `passives.js:65` y `P.UI.hud` para `Passives.hud()`.

## Cooperativo
- Corre en la VM del servidor porque combate la invoca; el estado (`p.passive` o el campo del kit) se serializa con el jugador en el snapshot. Los relojes usan `P.state.elapsed` (`now()` `:15`), no `Date.now`.

## Tests
- `tests/makanaky-kit.test.cjs`, `kingteka-arsenal.test.cjs`, `chamelin-kit.test.cjs`, `cirilo-kit.test.cjs`, `cristorata-kit.test.cjs`, `sideral-kit.test.cjs`, `marciano-kit.test.cjs`, `dota-equipment.test.cjs` (en `package.json`).

## Qué no romper
- Cada kit que envuelve `state`/`rows` debe delegar al anterior cuando el id no es suyo.
- `beforeCast` devuelve objeto vacío si no hay pasiva: `combat.js:17` espera `passive.damage||1`.
- Estado serializable: nada de funciones ni referencias a enemigos en `actor.passive`.
