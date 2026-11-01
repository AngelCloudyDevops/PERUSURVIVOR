---
tipo: evento
id: minibosses
archivos: [src/systems/minibosses.js, src/systems/miniboss-relics.js, src/scenes/maps.js, backend/activities.cjs, tests/miniboss-phase.test.cjs, tests/miniboss-relics.test.cjs, tests/shotgun-miniboss-balance.test.cjs]
verificado: 2026-10-31
---
# Minijefes

`P.Minibosses` (`src/systems/minibosses.js:3`). Aparecen en el mundo abierto, sin portal. Catálogo (`minibosses.js:4-8`):

| Clave | Nombre | Vida base | Radio | Vel. | Ataques base | Nota |
|---|---|---|---|---|---|---|
| `campo` | [[eventos/minijefes/fiscalizador]] | 460 | 31 | 68 | charge, cones, citations | físico |
| `plaza` | [[eventos/minijefes/paloma-brava]] | 420 | 29 | 82 | feathers, peck, droppings | físico |
| `machu` | [[eventos/minijefes/huaco-renegado]] | 540 | 35 | 55 | quake, shards, stelae | especial |
| `makanaky` | [[eventos/minijefes/makanaky]] | 480 | 30 | 72 | shout, flash | solo plaza |

Reliquias del botín: [[eventos/minijefes/reliquias]].

## Cuál sale y cuándo
- Elección: `choose(map)` (`minibosses.js:10`): `miniboss` del mapa (`src/scenes/maps.js:8-9,12-16`) o el propio mapa; si es `plaza`, alterna con Makanaky en cada aparición (`miniPlazaTurn`).
- Intervalo: rápida 60-90 s, Caos 240-360 s (`interval`, `:11`); `reset` fija el primero (`:12`).
- Aviso: desde `miniNext-2` (máx. 2 s) con mensaje y punto marcado a 220-260 de distancia (`tick`, `:19`; `point :16`). Un solo minijefe vivo a la vez (`:19`).
- No corre en pruebas de práctica (`devRun` sin `balanceTest`), con jefe final, en encuentro ni con `MapEvents.active()` (`:19`). Ver [[eventos/extincion/README]].
- Entrada: 1,3 s (campo) o 1,5 s (resto), intocable (`beginEntry :20`; `hurt :88` ignora `mini-entry`).
- Tras su derrota: `miniNext = max(miniNext, mapTime+3)` (`:88`).
- Mientras hay minijefe: tope de enemigos al 85 %, intervalo ×1,45 y los spawns no caen a menos de 260 de él (`spawnPolicy :173`, `spawnSafe :174`).

## Vida y visitas
- `healthProfile` (`:17`): `hp = base × (1 + clamp((mapTime−45)/75, 0, 2.6)) × (1 + .65 × (jugadores−1))`, jugadores máx. 2. Se fija al nacer.
- `tier = min(2, visitas previas a ese minijefe)` (`create`, `:18`): velocidad +5 % por nivel, +5 monedas de botín por nivel y variación de proyectiles.
- Barras de vida: 2 (`src/entities/actors.js:3`).
- Tests: escala `tests/shotgun-miniboss-balance.test.cjs:8`; visitas `tests/miniboss-phase.test.cjs:116`.

## Fase II y contraataque
- Al ≤50 % de vida: `beginFury` (0,95 s) (`move :76`, `beginFury :28`). Cada 4.º ataque pasa a ser el especial (`nextAttack :75`): clausura, bandada o derrumbe.
- Tras cada ataque hay recuperación `mini-recover`: el primer golpe cuenta como contraataque y el daño se multiplica por `recoveryBonus` (1,35 por defecto) (`hurt :88`).
- Tarjeta/HUD y flecha de dirección: `minibosses.js:177-203`. Tests: `tests/miniboss-phase.test.cjs:15,20,31,91,120`.

## Derrota y botín (`hurt`, `minibosses.js:88`)
- `s.kills++`, informe (`report :176`: +5 por ventana de contraataque con máx. 3, +10 si no recibiste daño), reliquia (`Relics.drop`), gema XP 12, moneda `20+5·tier` y 35 % de llave rara.
- Cofre exclusivo legendario sin llave (`miniboss-relics.js:5`).
- Test: `tests/miniboss-phase.test.cjs:110`.

## Cooperativo
- El servidor usa `partySize = jugadores` (`backend/simulation.cjs:21`) para la escala de vida.
- Calendario y aviso viven en el servidor y viajan en el snapshot (`miniWarning`, `miniReport`; `src/network/cooperative.js:50`). Test: `tests/cooperative.test.cjs:83`.
- Premio: cada jugador decide por separado entre accesorio o 50 monedas (`backend/activities.cjs:87`; `tests/miniboss-relics.test.cjs:17`).
- El minijefe persigue al objetivo de `Systems.target` (`src/systems/progression.js:21`). Salto de fase II con autoridad coop: `tests/miniboss-phase.test.cjs:15`.

## Otros tests
`tests/miniboss-phase.test.cjs:38,124,134,148,154,176` (cobertura, navegación, Makanaky); `tests/boss-charge-ranges.test.cjs:11`.
