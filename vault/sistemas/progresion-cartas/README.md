---
tipo: sistema
id: progresion-cartas
archivos: [src/systems/progression.js, src/systems/ability-cards.js, src/ui/loot-choices.js, src/data/catalog.js, src/data/powers.js]
verificado: 2026-10-31
---
# Progresión y cartas

Subida de nivel con 3 cartas, rangos 1-5, evolución, pactos y las tarjetas de habilidad del HUD (Q y R).
Ver [[sistemas/evoluciones/README]], [[sistemas/ulti/README]], [[sistemas/dominios/README]], [[sistemas/cofres-mercader/README]].

## Subida de nivel (`P.Progression`, `src/systems/progression.js:52`)
- `Progression.levelup()` (`:86`): descuenta `s.xp`, sube `s.level`, `s.need=round(need*1.22+1)`, pone `mode='upgrade'` y muestra `options(p)`.
- `options(p)` (`:58`): reúne `primary/pulse/cards/orbit` (máx. 3 habilidades distintas sin contar `stat:`), `combo:direct`, `combo:press`, mejoras `stat:*`, pactos y la carta de arsenal del personaje. Elige 3 con pesos por rareza (common 1, rare .62, epic .34, legendary .18).
- Cada 4 niveles entra un pacto (`sacrifice:power`; en nivel múltiplo de 8, `sacrifice:tempo`) (`:70`).
- `apply(p,id)` (`:76`): rango +1; `primary` da x1.18 daño, x1.08 alcance, rate x.94 (evolución x1.6/x1.3/x.85). Rangos 3 y 5: proyectil extra.
- Evolución: rango 5 y `s.level>=8` (`:64`). Ver [[sistemas/evoluciones/README]].
- `rarity(o,p)` `:55`, `comparison(p,id)` `:56`, `enrich` `:57`.
- Bloqueos: `blocksUpgrade()` `:85`, `domainActive()` `:84`, `cinematicOnly()` `:81`. No se gasta XP mientras un dominio o ulti ocupa la pantalla.
- `Progression.tick(dt)` `:89`: pulse, tarjetas y escudo orbital automáticos (daño `special`).

## Mejoras de estadística (`P.Data.upgrades`)
- Base en `src/data/catalog.js:24-31`: `power`, `rate`, `health`, `speed`, `magnet`, `range`. `src/data/powers.js:79` añade `projectiles`. Total efectivo: 7 (cada una hasta rango 5).
- Cada `apply` muta el jugador. Id de carta: `stat:<id>`.

## Tarjetas de habilidad (`P.AbilityCards`, `src/systems/ability-cards.js:2`)
- `frames` (`:3`) y `entries` (`:12`): una entrada por ulti/dominio por personaje; los kits añaden las suyas (`chamelin-kit.js:50`, `cirilo-kit.js:52`, `cristorata-kit.js:41`, `marciano-kit.js:57-58`).
- API: `frame` `:25`, `definition(id,kind)` `:26`, `charge` `:27`, `hud()` `:40`. Se llama desde un envoltorio de `P.UI.hud` (`:53`).
- Tecla R: botón `#domain-ability`, habilitado con carga >= 100.

## Resumen de elección
- `P.LootChoices` (`src/ui/loot-choices.js:3`): texto de efectos de recompensas (`effect`, `changes`, `model`, `show`). No decide reglas; las de adquisición están en `Loot`/`DotaItems`. `P.LootChoices.effect` se envuelve en `dota-actives.js:73`.

## Estado y reinicio
- `p.powerRanks`, `p.evolved`, `p.powerTimers`, `p.combos` se crean con `Progression.init(p)` (`:53`); `P.Entities.player` envuelto en `passives.js:65`.
- `s.level/xp/need` en `src/core/runtime.js:3`, reiniciados en `P.Game.start`.

## Envoltorios
- `P.Progression.options`: `marciano-kit.js:82`. `cinematicOnly/blocksUpgrade`: `chamelin-arena.js:37`.
- `P.Systems.collect` (XP/gemas): `pickup-feedback.js:7`.

## Cooperativo
- El servidor sustituye `P.Systems.levelup` (`backend/simulation.cjs:23`) por `activities.levelup` (`backend/activities.cjs:54`): una elección pendiente a la vez, con tiempo límite de 15 s (ver [[sistemas/cooperativo/README]]).

## Tests
- `tests/power-progression.test.cjs`, `cinematic-upgrades.test.cjs`, `chest-cards.test.cjs`, `card-gallery.test.cjs`, `coop-choice-timeout.test.cjs`, `progressive-combat.test.cjs` (en `package.json`).

## Qué no romper
- `P.Systems` vive en `progression.js` y también contiene movimiento y disparo enemigo (`move` `:4`, `ranged` `:35`).
- Pactos y arsenales no ocupan una cuarta carta: siempre 3.
- Añadir mejora: empujar a `P.Data.upgrades` con `apply`; `stat:` se limita a 5 rangos.
