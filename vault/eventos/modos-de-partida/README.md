---
tipo: evento
id: run-mode
archivos: [src/systems/run-mode.js, src/systems/encounters.js, src/systems/progression.js, src/scenes/game.js, tests/gameplay.test.cjs]
verificado: 2026-10-31
---
# Modos de partida: Rápida y Supervivencia del Caos

`P.RunMode` (`src/systems/run-mode.js:4`). El reloj siempre es `s.mapTime`: pausa, portales y cinemáticas no lo adelantan (`run-mode.js:2`).

## Modos (`run-mode.js:6`)
| Id | Nombre | Duración | Portales |
|---|---|---|---|
| `quick` | Partida rápida | 300 s | 1, abierto de 180 s al final |
| `chaos` | Supervivencia del Caos | 1800 s | 3 ventanas |

- `begin()` fija `P.Data.arena.duration` (`run-mode.js:9`). `P.Data.arena` base: `duration:300` (`src/data/catalog.js:23`).
- Al cumplirse `mapTime >= duration` aparece el jefe final: [[eventos/jefe-final-elzeein/README]].
- Defecto: `selected:'quick'` (`run-mode.js:5`). Cooperativo: siempre `'chaos'` ([[eventos/README]]).

## Ventanas de portal (`run-mode.js:16-19`)
- Caos: `[360,540]`, `[780,1020]`, `[1260,1500]` más un desfase por mapa: `plaza +35`, `machu +70`, `halloween +105`, `navidad +140` (`campo` y biomas: 0).
- Aviso 10 s antes de abrir (`portalWarning`, `run-mode.js:18`).
- Rápida: `portalWindow` devuelve 0 si `time>=180` (`run-mode.js:17`); `nextPortal` da 180 antes de ese tiempo (`:19`).
- `P.Encounters.unlock:180` (`src/systems/encounters.js:4`) NO gobierna la rápida: solo lo lee el laboratorio (`src/development/lab.js:12`).
- Detalle del portal: [[eventos/portales-y-encuentros/README]].

## Etapas (solo Caos) (`run-mode.js:12-14`)
`stageAt = min(5, floor(mapTime/300))`. Nombres: Calma sospechosa, Primer desorden, El mapa responde, Crisis nacional, Caos desatado, Preludio de ElZeein.
- En rápida `stageAt` es siempre 0 (`run-mode.js:13`).
- `dayTime` en Caos = `mapTime/6` (`run-mode.js:15`).
- `environmentStart` y `weatherSeed` se sortean solo en Caos (`run-mode.js:9`).

## `P.ChaosDirector` (`run-mode.js:22-31`)
- Cada etapa nueva (>0) agrega un obstáculo destructible `chaos-branch` (campo/navidad), `chaos-barricade` (plaza) o `chaos-rubble` (resto), con `hp:90+stage*20` (`run-mode.js:25-26`).
- Transición visual 2,2 s y aviso `ETAPA n` (`run-mode.js:27`).
- `bossVictory()` al reclamar el premio de un jefe de portal: transición 1,8 s (`run-mode.js:28`).
- Se reinicia en `Game.start` y en cada cambio de bioma (`src/scenes/game.js:3`, `src/systems/encounters.js:59`, `leave`).

## Qué corre según el modo
| Sistema | Rápida | Caos |
|---|---|---|
| [[eventos/minieventos-supervivencia/README]] | no (`map-events.js:206`) | sí |
| [[eventos/extincion/README]] | solo si hay 2+ jugadores, a los 105 s (`map-events.js:23`) | 65 %, entre 420 y 1080 s |
| [[eventos/minijefes/README]] | cada 60-90 s | cada 240-360 s (`minibosses.js:11`) |
| [[eventos/portales-y-encuentros/README]] | 1 portal | 3 portales + cambio de bioma |

## Tests
- `tests/gameplay.test.cjs:254` (Caos, `duration=1800`, ventana 780, jefes sorteados).
- `tests/map-events.test.cjs:121` (probabilidad del impacto y minieventos).
- `tests/full-run-audit.test.cjs:3`.
