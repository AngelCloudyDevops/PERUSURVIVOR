---
tipo: sistema
id: cofres-mercader
archivos: [src/systems/loot.js, src/systems/market.js, backend/activities.cjs, tests/chest-cards.test.cjs, tests/market.test.cjs]
verificado: 2026-10-31
---
# Cofres, llaves y mercader

Cofres por chunk con llaves, guardianes de llave, mimics y el vendedor ambulante. Los objetos vienen de [[sistemas/objetos-dota/README]]; terreno y chunks en [[sistemas/terreno-navegacion/README]].

## Cofres y llaves (`P.Loot`, `src/systems/loot.js:2`)
- Rarezas: common, rare, legendary (`rarities`, `:4`). `chooseRarity(roll,distance)` `:17`: legendary si roll >= .98 y distancia >= 1800; rare si >= .72.
- Generación determinista por semilla: `roll(x,y,salt)` usa `P.Chunks.hash` (`:16`). `candidate(rx,ry)` `:19` coloca cofres en celdas de 768 px (60 % de celdas con cofre salvo la de inicio); `safe(x,y)` evita props, fuente y portal (`:18`).
- Llaves: `keyType`, `canOpen(chest)` `:26` (exige llave si el cofre es rare/legendary y no hay `MapEvents.chestsSealed`).
- Guardianes de llave: `spawnKeepers()` `:28` crea un enemigo pesado con `keyTier` (rare cada 40 s, legendary cada 90 s, desde 30/90 s); al morir `enemyDrop` `:29` suelta la llave.
- Recompensa: `rewardOptions(p,chest,slot)` `:43` (3 opciones; usa `DotaItems.chestOptions`, monedas, recuperar, provisiones), `applyReward` `:44`, `chooseChest(chest,index)` `:45`. `crate(o)` `:22` caja rota suelta botín.
- `collect(g)` `:23` recoge gemas, monedas y llaves.

## Mercader (`P.Market`, `src/systems/market.js:2`)
- Aparece desde `nextAt=45` s de `mapTime`, dura 45 s (`until`), reaparece cada 90 s; `visit%3===0` es «El Hueco» (secreto) (`tick` `:11`, `stock` `:8`).
- Normal: emoliente 20, dos objetos base Dota 35, llave rara 40. Secreto: llave legendaria 100 y hasta 3 equipos raros+ (70/120/180).
- `buy(id)` `:14` exige cercanía (`near()`, 110 px), stock y monedas. `info`, `offerDetails` `:16`, `purchaseOffer` `:27`.
- `defeated(e)` `:46`: un mimic derrotado deja un cofre de recompensa; `wake(chest)` despierta mimics (`impostor`).
- No aparece en encuentros ni tras el jefe (`available` `:9`).

## Estado y reinicio
- `Loot.reset()` `:14` (cofres, semilla, `coins=0`, `keys`, `nextKeeper`) y `Loot.relocate()` `:15` (al cambiar de arena). `Market.reset()` `:6`. Ambos se llaman en `P.Game.start` (`src/scenes/game.js:3`).
- `P.state.coins`, `P.state.keys`, `Loot.chests`, `Market.merchant`.

## Envoltorios (sobre `P.Loot`)
- `miniboss-relics.js:18-23`: `reveal`, `icon`, `drawEquipment`, `equip`, `drawChest`, `Combat.cast`.
- `dota-equipment.js:68,71`: `Loot.damage`, `Loot.collect` (bonus de monedas).
- `sideral-domain.js:88-90`: `Loot.active`, `drawChest`, `canOpen`. `cirilo-arena.js:83-84`: `Loot.active`, `Market.available`.

## Cooperativo
- Las compras y aperturas pasan por el servidor: `market-buy` (`backend/activities.cjs:15`); apertura con llave en `:45-47` (despierta mimic, descuenta llave); los cofres de los jugadores se unen (`:42`); el cofre del jefe en `:36`. El cliente no decide el premio.
- `Loot.roll` depende de `Loot.seed`: servidor y cliente deben compartir semilla.

## Tests
- `tests/chest-cards.test.cjs`, `chest-equipment.test.cjs`, `market.test.cjs`, `merchant-menu.test.cjs`, `object-menu.test.cjs`, `cooperative.test.cjs` (en `package.json`).

## Qué no romper
- No usar `Math.random` para posiciones de cofres: rompe la determinación por chunk y la paridad cliente/servidor.
- `Market.stock` itera familias Dota: añadir una familia común cambia la rotación (`visit-1)%bases.length`).
- Las opciones del mercader se validan en `buy` (precio finito, stock `left`, `canBuy`).
