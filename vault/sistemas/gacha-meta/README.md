---
tipo: sistema
id: gacha-meta
archivos: [src/systems/gacha.js, src/systems/meta-progress.js, src/systems/supplies.js, tests/gacha.test.cjs, tests/meta-progress.test.cjs, tests/meta-migrations.test.cjs, tests/supplies.test.cjs]
verificado: 2026-10-31
---
# Gacha, meta-progreso y suministros

Colección de personajes por tiradas, mejoras permanentes y mochila de partida. Guardado: ver [[arquitectura/cuentas-guardado]]; cuentas en [[sistemas/cuentas/README]].

## Gacha (`P.Gacha`, `src/systems/gacha.js:2`)
- Costo `cost:60` por tirada (`:2`); solo 1 o 10 tiradas (`pull`, `:38`).
- Rarezas (`tiers`, `:4`): `common` C 60 %, `rare` R 27 %, `epic` SR 9 %, `legendary` SSR 3 %, `ultra` UR 1 %. Reembolso por duplicado 15/25/40/60/60.
- Pools: common cristorata, cuy, paloma, axelbenba, cevichero; rare najasor, fuzo, charles, sustento, g5; epic shaka, ollanta, alan; legendary alberto, keiko; ultra kingteka, makanaky, sideral, chamelin, cirilo, marciano (`:4`).
- `choose(data,roll,pick)` (`:37`): umbrales .60/.87/.96/.99; piedad: tras 29 sin legendaria sube a >=SSR, tras 9 sin épica a >=SR (`gacha.legend`, `gacha.epic`).
- Duplicados dan copias para subir estrella hasta rango 5 (`ascend` `:14`, `starInfo` `:15`, `readyToAscend` `:16`); `tierGrowth` escala bonos (`:5`, `growth` `:11`).
- Variantes: `variants:{cerdito:{base:'kingteka'}}` (`:3`); `canonical(id)` `:6`. `owns(id)` `:9`.
- Inicio: `blank()` desbloquea cristorata, cuy, paloma, makanaky, sideral (`meta-progress.js:21`).

## Meta-progreso (`P.Meta`, `src/systems/meta-progress.js:2`)
- Clave `causas-progress-v1` en `localStorage` (`:2`). Versión actual `CURRENT:5` (`:7`).
- Migraciones: `MIGRATE[1..4]` (`:11-19`); `migrate(raw)` encadena versión a versión y lanza si la versión no existe (`:20`); `normalize(raw)` valida solo el formato actual y lanza en datos corruptos (`:22`).
- `read()` usa copia `<clave>-bak` si el principal está dañado (`:26`). `transaction(change)` `:29` es la única forma de escribir.
- Mejoras por personaje (`defs`, `:4`): vitality (+8 vida, costo 40), power (+4 % daño, 50), rate (3 % menos recarga, 55), speed (+3 %, 35), magnet (+12 %, 35); máx. rango 5. `price` `:32`, `refund` 70 % `:34`.
- `applyRun()` `:42` aplica rangos al jugador; no corre en `devRun`, práctica, rendimiento ni cooperativo.
- `reward(kills,seconds,win)` `:43`: `floor(k/5)+floor(t/30)*2+(win?50:0)`, 0 si t<15 s. `finish(win)` `:44` es idempotente por `run.settled`.

## Suministros (`P.Supply`, `src/systems/supplies.js:2`)
- El global se llama `P.Supply`, no `P.Supplies`.
- `items` (`:3-9`): lunch (20), coffee (25), shoes (25), magnet (20), rare_key (30), legend_key (70). Máx. 99 en inventario y 3 preparados (`change`, `:11`).
- `start()` `:13` reclama la mochila con `claim(run)` (idempotente por `run.id`, `supplyClaims` últimos 100). No corre en `devRun`, práctica ni coop.

## Estado y reinicio
- Datos persistentes en `P.Meta.data`; efímero en `P.Meta.run` (`begin()` `:41`). Animación de tirada en `P.Gacha.animation` (se salta con movimiento reducido: `Ambient.reduced`, ver [[sistemas/movimiento-reducido/README]]).

## Envoltorios
- `P.Meta.hud` envuelto en `src/network/account.js:26`. `P.Account.refresh` en `friends.js:7`.

## Cooperativo
- Sin meta-progreso en coop (`applyRun` y `Supply.start` salen con `P.Coop.active`). El servidor valida guardados con `Meta.normalize` (`backend/accounts.cjs:73`, `backend/admin.cjs:6`) y verosimilitud en `backend/save-checks.cjs`.

## Tests
- `gacha`, `meta-progress`, `meta-migrations`, `meta-progress-ids`, `save-validation`, `supplies`, `account-sync`, `lobby` (en `package.json`).
- `tests/character-variants.test.cjs` NO está en `package.json`.

## Qué no romper
- Toda nueva forma de guardado: subir `CURRENT`, añadir `MIGRATE[n]` y test en `meta-migrations`; nunca mutar `raw`.
- Escribir solo con `Meta.transaction` (maneja `busy` y la copia `-bak`).
- Añadir personaje: ponerlo en un pool de `tiers` o no será coleccionable (`collectibleIds`, `:8`).
- Probabilidades y piedad se verifican en `tests/gacha.test.cjs`.
