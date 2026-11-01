---
tipo: sistema
id: minions
archivos: [src/systems/minion-evolution.js, src/systems/minion-professions.js, src/systems/causa-combo.js, src/systems/minion-tactics.js]
verificado: 2026-10-31
---
# Minions: evolución, profesiones y combo de causa

Variantes de minions normales por tiempo de partida, y las tarjetas de combo del jugador. Ataques y movimiento: [[sistemas/ia-enemigos/README]]. Etapas: [[sistemas/oleadas-dificultad/README]]. Ulti: [[sistemas/ulti/README]].

## Evolución de minions (`P.MinionEvolution`, `src/systems/minion-evolution.js:3`)
- «Rangos de nacimiento»: se conservan los seis fotogramas y la forma de colisión (`:2`).
- `eligible(e)` `:9`: no boss/mapBoss/miniboss/mimic y `design` entero 0-5.
- `profiles` `:4-8`: rango 0 neutro; rango 1 (hp x1,35, velocidad x1,06, contacto x1,15, daño x1,2, cooldown x.92); rango 2 (hp x1,85, x1,12, x1,3, x1,45, x.82).
- `choose(time,roll)` `:11`: 0 antes de 125 s; 35 % rango 1 a 125-170 s; 50 % a 170-215; 20 % rango 2 + 45 % rango 1 a 215-255; desde 255 s 40 % rango 2 + 40 % rango 1.
- `apply(e)` `:12`: fija `e.evolution` una vez (0 en `devRun` sin `balanceTest` o en encuentros), escala `hp/max/speed` y llama `P.MinionProfessions.assign`.
- `attack(e,base)` `:13`: perfil de ataque ajustado por rango (daño, cadencia, abanico máx. 5). Arte: `themed`, `paint`, `attackFX` `:14-26`.
- Se invoca desde `P.Entities.enemy` (`src/entities/actors.js:18`) y `P.Difficulty.attack` (`src/data/difficulty.js:21`).

## Profesiones (`P.MinionProfessions`, `src/systems/minion-professions.js:3`)
- «Las variantes sustituyen un spawn, nunca añaden enemigos ni saltan la etapa de nacimiento» (`:2`).
- `catalog` `:4-11`: astronaut (diseño 0, desde 30 s), firefighter (1, 45 s), chef (2, 65 s), mummy (3, 110 s, solo `halloween`), police (5, 215 s), architect (0, 90 s, a distancia), elf (4, 170 s, solo `navidad`).
- `choose(e,map,time,roll)` `:14`: probabilidad .35 (.6 si hay variantes de mapa) filtrando por diseño, tiempo y mapa.
- `assign(e)` `:15`: guarda `e.profession`; sube defensa x1,12 / x1,28 según rango (`:15`).
- `attack`, `cast` `:16-17` (crea `s.danger` respetando `Difficulty.limits(e).danger`), `cue`, `effect`, `glyph`, `feedback`, `sound` `:18-22`. `definition(e)` `:13`.
- `P.MinionTactics.key(e)` usa `e.profession` si existe (`minion-tactics.js:16`).

## Combo de causa (`P.CausaCombo`, `src/systems/causa-combo.js:3`)
- «Tres tarjetas serializables por jugador»: `caos`, `aguante`, `hazana` (`:2,4`). La carga sigue siendo compatible con las ultis existentes (`sync` `:10` fija `u.charge=100` cuando las tres están llenas).
- Habilitado solo para `kingteka`, `alberto` y los que definen `P.AnimalUltimate` (cuy, paloma) (`enabled`, `:5`). No corre en práctica/`devRun` (`training` `:8`).
- Estado en `s.ultimate.combo` (`fresh` `:6`: `caos, aguante, hazana, combat, credits, pressure, bossPressure`); `ensure` `:7`; `consume` `:14` lo reinicia al usar la ulti.
- `gain(source)` `:11` (crédito .75 por muerte), `hit(e,source)` `:12` (presión), `tick(dt)` `:13`.

## Estado y reinicio
- Minions: `e.evolution`, `e.evolutionApplied`, `e.profession`; fijados al crear el enemigo y nunca recalculados. Combo: `s.ultimate.combo`, recreado por `Ultimate.reset` (envuelto en `causa-combo.js:19`).

## Envoltorios
- `causa-combo.js:18-25`: `P.Ultimate.reset/gain/tick/activate/hud`, `P.Court.activate`, `P.AnimalUltimate.activate`, `P.Entities.hurt`. `P.CausaCombo.enabled` envuelto en `dragon-ultimate.js:35`.

## Cooperativo
- `CausaCombo.tick` solo corre donde se simula: en coop sale si `P.Coop.active && !P.Combat.server` (`causa-combo.js:13`). Rango y profesión se eligen al nacer en el servidor y viajan en el snapshot.

## Tests
- `tests/minion-evolution.test.cjs`, `minion-professions.test.cjs`, `minion-tactics.test.cjs`, `minion-combo-art.test.cjs`, `minion-audio.test.cjs`, `causa-combo.test.cjs` (en `package.json`).

## Qué no romper
- No usar `Math.random` fuera de `choose(...,roll)` al nacer: los tests inyectan `roll`.
- No cambiar `design` ni `profession` tras nacer (afectan sprite, ataque, defensa).
- Una profesión nueva requiere definición en `MinionTactics.definitions` (`minion-tactics.js:4-14`) y arte.
- Las ultis nuevas con carga por combo deben consumir con `P.CausaCombo.consume()` (`causa-combo.js:24`).
