---
tipo: evento
id: extinction
archivos: [src/systems/map-events.js, backend/activities.cjs, backend/simulation.cjs, tests/map-events.test.cjs]
verificado: 2026-10-31
---
# Extinción (evento mundial)

`P.MapEvents` con `event.world=true` y `event.extinction=true` (`src/systems/map-events.js:32-37`). Un meteorito cae, llegan dinosaurios, se enfrenta al Tirano y se puede entrar a una mazmorra por una reliquia. Fases en [[eventos/extincion/fases]]; dinosaurios en [[eventos/extincion/dinosaurios]].

## Disparadores
- `reset` decide al empezar (`map-events.js:23`, llamado desde `src/scenes/game.js:3`):
  - Caos: `worldPlanned = roll < worldChance (.65)`; momento `worldAt = 420 + floor(roll×661)` s, es decir entre 420 y 1080 s (`map-events.js:4,23`).
  - Rápida: solo si hay 2+ jugadores vivos al reiniciar; `worldAt = 105` s. En solitario nunca.
- `tick` lo arranca cuando `mapTime >= worldAt` y no está `blocked()` ni hay `miniWarning` (`map-events.js:205`). `blocked()` (`:30`) lo frena con encuentro, jefe final, portal abierto o aviso de portal, mercader disponible, estación activa o minijefe vivo.
- Punto de impacto: 14 intentos a 420-558 del jugador ancla (elegido por hash entre vivos), lejos del portal (>560) (`startWorld :32-37`).
- Repetición: tras `completeEvent`, si lleva menos de 3 victorias y quedan 420 s, reprograma a `mapTime + 360..540` s (`map-events.js:160`). Un fallo (`failEvent :161`) no lo repite.
- `tier = min(3, 1 + extinctionClears)` (`:37`): escala vida de dinosaurios, fragmentos y jefes.
- Si el evento está activo se pausan minijefes, zonas dinámicas y barriles (`src/systems/minibosses.js:19`, `src/systems/dynamic-zones.js:14`, `src/systems/explosive-barrels.js:11`).

## Resumen de recompensas
- Tirano: `75 × multiplicador` monedas + 15 si quedaban ≥90 s (`defeated`, `map-events.js:146`).
- Mazmorra: Triceratops Fósil 100 monedas + reliquia de equipo (`:147`); extra `100×(mult−1)` al elegir reliquia (`applyRelic :163`).
- Reliquias (`applyRelic :163`, `tickRelic :151`, `damageMultiplier :149`, `speedMultiplier :150`):
  - Corazón fósil: +35 vida máxima y regeneración 0,8/s.
  - Colmillo del depredador: tras cada baja, 5 s de +25 % daño y +18 % velocidad.
  - Fragmento celeste: cada 4,5 s un meteorito (70 % de tu poder, radio 72) sobre el blanco más cercano a ≤520.

## Cooperativo
- El servidor lo corre en `MapEvents.tick` (`backend/simulation.cjs:38`); durante la cinemática todos quedan invulnerables y quietos.
- Ancla: jugador vivo elegido por hash. Escalas por grupo: dinosaurios +40 % por jugador extra, fragmentos +40 %, Tirano +60 %, Fósil +50 % (`extinctionBalance`, `map-events.js:5`).
- Decisiones del portal, salas y reliquia son actividades `pending` de a dos (`backend/activities.cjs:55-64`, `choose :65`):
  - Portal: entran solo si los dos eligen entrar (`:68`); si uno rechaza, el equipo continúa.
  - Sala: manda la elección del jugador 0 (`:72`). Reliquia: manda la del jugador 0 (`:76`) y la reciben ambos.
  - Plazo 15 s; si alguien no responde, el servidor elige (portal: rechazar) (`autoPick :102`).
- Esquiva (`Espacio`): el servidor autoriza y mueve solo al que la pidió (`src/network/cooperative.js:18`; test `tests/map-events.test.cjs:60`).
- El cliente no ofrece diálogos en servidor (`P.Combat.server`) (`map-events.js:152,157,162`).
- Tests: `tests/map-events.test.cjs:60,64,96,102,111,115` (coop), `:88` (balance), `:121` (65 %).

## Tests
`tests/map-events.test.cjs` líneas 12 (impacto), 24-72 (dinosaurios y tormenta), 76 (Tirano), 82 y 142 (Fósil), 126 (reliquia real), 137 (tiempo agotado), 146 (laboratorio).
