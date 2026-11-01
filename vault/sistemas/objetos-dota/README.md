---
tipo: sistema
id: objetos-dota
archivos: [src/systems/dota-items.js, src/systems/dota-equipment.js, src/systems/dota-actives.js, src/core/runtime.js, backend/activities.cjs]
verificado: 2026-10-31
---
# Objetos estilo Dota

Inventario de hasta 4 objetos por partida, con ramas de evolución y varios activables. Ver [[sistemas/cofres-mercader/README]] y [[sistemas/combate/README]].

## Estructura (tres archivos que se apilan)
- `dota-items.js`: `P.DotaItems.families` con 5 familias base: `boots`, `stick`, `ring`, `blade`, `blink` (`src/systems/dota-items.js:6-25`). `capacity:4` (`:4`).
- `dota-equipment.js`: `Object.assign(D.families,...)` añade familias de equipo (cadencia, defensa física, máscara, capa, jabalina, Midas) y sus eventos (`src/systems/dota-equipment.js:6-25`).
- `dota-actives.js`: tabla `definitions` (`src/systems/dota-actives.js:5-18`) que convierte objetos en activables, fija `cooldown`, `activeText` y descripción (`:20-23`).

## Activables: Blink NO es el único
- Con activo: `blink` y sus ramas (swift, arcane-blink, overwhelming) más `phase`, `travel`, `stick`, `wand`, `blade-mail`, `satanic`, `mask-madness`, `glimmer-cape`, `pipe-insight`, `black-king-bar`, `hand-midas`, `abyssal-blade`, `mjollnir` (`dota-actives.js:5-18`).
- `E` usa el objeto seleccionado: `runtime.js:24` llama `P.DotaItems.activate()` si `hasActive()`. `F` cambia la selección (`dota-actives.js:90`, solo con más de un activable).
- `dota-items.js:44-45` define `hasActive`/`activate` solo para Blink; `dota-actives.js:26-36` los redefine (`Object.assign(D,{...})`) para todos. El valor efectivo es el de `dota-actives.js`.

## API pública
- `P.DotaItems.options(p,source)` `dota-items.js:33`; `chestOptions(p,tier)` `:37`; `canAcquire(p,id)` `:38`; `apply(p,id)` `:40`; `data(id)` `:42`; `familyFor(id)` `:31`; `current(p,family)` `:32`.
- `tick(dt,regenStats)` `:46`; `criticalDamage(damage,source,target)` `:47`; `hit(p,source,damage)` `:43` (cargas de Magic Stick); `hud` `:48`; `applyMods` `:39`.
- Equipo: `equipped`, `runtime`, `owner(source)`, `mitigate`, `received`, `damageEvent`, `coinBonus`, `equipmentTick` (`dota-equipment.js:35-61`). `owner(source)` delega en `P.Attributes.owner` (`:37`).
- Activos: `activeItems`, `selected`, `cycle`, `activeCooldown`, `travelBlocked`, `activate(aim,requested)` (`dota-actives.js:26-36`).

## Estado y reinicio
- En el jugador: `p.dotaItems`, `p.dotaMods`, `p.dotaCooldowns`, `p.dotaCharges`, `p.dotaRuntime`, `p.dotaHaste`, `p.dotaCast`. Nacen al adquirir (`apply`); se pierden con un jugador nuevo en `P.Game.start`.

## Envoltorios
- En `dota-equipment.js:62-76`: `P.Attributes.source`, `P.Combat.cast` (cuenta `dotaCast`), `P.Entities.hurt` (llama `damageEvent`), `P.Loot.damage`, `P.PlayerFeedback.hit`, `D.tick`, `P.Loot.collect` (bonus de monedas), `P.Passives.cooldownMultiplier`, `D.options`, `P.FX.effect`, `P.PlayerStatus.states`.
- En `dota-actives.js:69-91`: `D.mitigate`, `D.received`, `D.equipmentTick`, `D.hud`, `P.PlayerStatus.states`.
- `P.DotaItems.options` además se oculta en nivel (`source==='level'`) cuando hay cooperativo (`dota-items.js:33`): en coop solo salen de cofres y mercader.

## Cooperativo
- «Intenciones manuales compartidas por cliente y servidor; nunca acepta destinos ni premios del cliente» (`dota-actives.js:2`).
- Cliente envía `{type:'activity',action:'dota-active',...}`; el servidor valida punto finito y distancia en `backend/activities.cjs:16`. `P.DotaItems.tick(dt,false)` corre en `backend/simulation.cjs:39` (sin regen duplicada).

## Tests
- `tests/dota-items.test.cjs`, `dota-equipment.test.cjs`, `dota-actives.test.cjs`, `blink-cursor.test.cjs`, `chest-equipment.test.cjs`, `chest-cards.test.cjs`, `lab-equipment.test.cjs`, `merchant-menu.test.cjs`: todos en `package.json`.

## Qué no romper
- Orden de carga: `dota-items` < `dota-equipment` < `dota-actives`; los dos últimos envuelven funciones del primero.
- Daño de objetos secundarios debe llevar `dotaSecondary` o `fixedDamage` para no reactivarse (`dota-equipment.js:49`).
- `criticalDamage` solo aplica a `weaponAttack` (`dota-items.js:47`).
- Al añadir activo: entrada en `definitions` y atender `travelBlocked` en dominios/encuentros.
