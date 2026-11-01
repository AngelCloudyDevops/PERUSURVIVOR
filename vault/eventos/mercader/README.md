---
tipo: evento
id: market
archivos: [src/systems/market.js, backend/activities.cjs, tests/market.test.cjs, tests/merchant-menu.test.cjs]
verificado: 2026-10-31
---
# Mercader ambulante y El Hueco (`P.Market`)

Un vendedor aparece cerca durante 45 s. Catálogo y economía: [[sistemas/cofres-mercader/README]]. Aquí solo el comportamiento de evento.

## Cadencia (`src/systems/market.js:11`)
- Primera visita a `mapTime 45` s (`nextAt:45`, `:5`); tras cada llegada `nextAt = mapTime + 90` (`tick :11`).
- Aparece a ~420 del jugador en una posición libre (`Loot.position`, 16 intentos) y permanece 45 s (`until = mapTime+45`, `:11`).
- Cada 3.ª visita es `secret` («El Hueco»); el resto `normal` (`:11`, `name :7`).
- No corre en práctica, durante encuentro, con jefe final ni al llegar a la duración (`tick :11`; `available :9`).
- Pausa minieventos mientras está disponible o la tienda está abierta (`MapEvents.blocked`, `src/systems/map-events.js:30`).
- Sin dependencia del modo: corre en Rápida y en Caos.

## Stock (`stock :8`)
- Normal: `emoliente` 20, dos objetos Dota base 35 cada uno (familias comunes rotando), llave rara 40.
- Secreto: llave legendaria 100 y hasta 3 equipos de rareza ≥ rara a 70/120/180 (según rareza), tomados de las opciones de cofre de todos los jugadores.
- Compra: hay que estar a ≤110 (`near :10`, `buy :14`).

## Cofre impostor (mímico)
- `wake(c)`: un cofre impostor sin purificar despierta un enemigo `mimic` (vida `100 + mapTime×.3`) (`market.js:45`). Al morir deja un cofre de premio sin llave (`defeated :46`).

## Cooperativo
- Compra autoritativa por ID: `action==='market-buy'` (`backend/activities.cjs:15`); stock y saldo compartidos.
- El servidor llama `Market.tick` por tick (`activities.cjs:116`) y expone `merchant` en el snapshot (`:130`). Los impostores los despierta quien pase a <100 (`:126`).
- Tests: `tests/market.test.cjs:3,9,13,18`; `tests/merchant-menu.test.cjs:10`.
