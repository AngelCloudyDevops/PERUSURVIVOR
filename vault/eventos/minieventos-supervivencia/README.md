---
tipo: evento
id: map-minievents
archivos: [src/systems/map-events.js, tests/map-events.test.cjs]
verificado: 2026-10-31
---
# Minieventos de Supervivencia

Recoger señales en el suelo antes de que acabe el tiempo. Mismo `P.MapEvents`, sin `world` (`src/systems/map-events.js:180-219`). Distinto de [[eventos/extincion/README]].

## Solo en Caos
- `tick` corta si no es Caos ni `balanceTest`/`TestBench` (`map-events.js:206`). En Partida rápida no hay minieventos.
- Corta también con `devRun` sin balance o `Performance.active` (`:202`).

## Cadencia
- Primer minievento: `nextAt = 165` s de `mapTime`; después `cadence = 165` s tras cada arranque (`map-events.js:4,189`; `reset :23`).
- Reto único «minijuego»: `miniDue = 720` s, una vez por partida (`miniPlayed`, `:208`).
- Solo arranca sin `blocked()` ni `miniWarning` (`:208`). Si no hay punto seguro reintenta en 5 s (`:185`).
- Los portales pausan el reto; el jefe final lo cancela (`:210-211`).
- El tipo no se repite seguido (`lastKind`, `:182`).

## Catálogo (`map-events.js:6-21`)
Los tres tipos de un mapa solo cambian nombre y color; la mecánica es idéntica.
| Mapa | Tipos (`kind`) |
|---|---|
| `campo` (y halloween/navidad) | `meteor` Lluvia de meteoritos, `picnic` Picnic desordenado, `kite` Cometa a la deriva |
| `plaza` | `garua` Garúa, `palomas` Bandada alborotada, `faroles` Faroles encendidos |
| `machu` | `condor` Sombra del cóndor, `wind` Ráfaga de altura, `terrazas` Ecos de las terrazas |
- El mapa se resuelve con `Maps.current().eventBase||id`; los biomas de jefe usan `eventBase:'plaza'` o `'machu'` (`src/scenes/maps.js:12-16`).
- Reto del minuto 12 (`start :187`): `Reto del meteorito` (campo), `Circuito de faroles` (plaza), `Ruta del cóndor` (machu); 5 puntos, 60 s.

## Fases
1. `warning` 7 s con aviso y silbato (`start :188-190`). Punto a 260-356 del jugador, lejos del portal (>180) (`safePoint :31`).
2. `active` (`activate :193-198`): 3 puntos (5 en reto), 45 s (60 en reto).
3. Cada punto se recoge a ≤46 de `P.state.player`: +5 monedas (`tick :216`).
4. Completar todos: +10 monedas extra (+25 en reto) (`:217`). Se acaba el tiempo: conservas lo recogido (`:218`).

## Cooperativo
- Corre en el servidor (`backend/simulation.cjs:38`). La recogida lee `P.state.player` (`map-events.js:215`), que en ese punto es `alive[0]` (`simulation.cjs:38`); no hay recogida por jugador. Sin verificar el efecto en partida real.
- `blocked()` se consulta con `Market.available`, estación activa y minijefes vivos (`map-events.js:30`).

## Tests
`tests/map-events.test.cjs:121` (cadencia y no repetición), `:146` (forzar evento en laboratorio).
