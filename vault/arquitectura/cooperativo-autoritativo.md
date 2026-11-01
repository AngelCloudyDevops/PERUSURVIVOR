---
tipo: arquitectura
id: cooperativo-autoritativo
archivos: [backend/simulation.cjs, backend/cooperative.cjs, backend/state-wire.cjs, backend/activities.cjs, src/network/cooperative.js, tests/live/cooperative.cjs, tests/snapshot-slim.test.cjs, tests/coop-choice-timeout.test.cjs]
verificado: 2026-10-31
---
# Cooperativo autoritativo

Dos jugadores por sala. El servidor simula; el cliente envía intenciones y dibuja.
Sistema de juego: [[sistemas/cooperativo/README]].

## Un `node:vm` por sala (`backend/simulation.cjs`)
- `loadEngine` crea un contexto con stubs (`backend/simulation.cjs:7-10`):
  `document` falso (elementos con `classList`, `getContext` → Proxy que no dibuja),
  `localStorage` con `getItem` que devuelve `undefined`, `requestAnimationFrame` vacío,
  `innerWidth:1280`, `innerHeight:720`, `window=context`.
- **`Math` es el del host** (`:9`): cambiar `Math.random` afecta a todas las salas.
- Ejecuta los 169 módulos en orden (`:12-14`), con `timeout:1000` por script. Cachea los
  `vm.Script` compilados por raíz, máximo 4 raíces (`:13`).
- Si existe `js/data.js` (servidor publicado) usa `backend/modules.json` y `dist/js/`;
  si no, `scripts/modules.cjs` y `src/` (`:11-12`).
- Constructor (`:18-24`): `P.Combat.server=true`, `Game.start()`, crea un jugador por
  personaje, fija `P.Combat.party`, y **sustituye** `P.Game.finish` y `P.Systems.levelup`
  (`:22-23`). Ver [[gotchas/G017-simulacion-sustituye-funciones]].
- `tick(dt,inputs)` (`:28-62`): no llama a `Game.update`. Para cada jugador hace
  `use(p)` → `P.state.player=p` y mueve, dispara y recoge por turnos.

## Ritmo
- `setInterval(tick,40)` (`backend/cooperative.cjs:64`) y `room.sim.tick(.04,inputs)`
  (`:20`): **25 ticks/s**, dt fijo 0,04 s.
- Solo simula si ambos miembros están conectados (`backend/cooperative.cjs:20`).
- El `pong` informa `snapshotMs:40` (`:40`).

## Protocolo 3
- `PROTOCOL=3` (`backend/cooperative.cjs:4`); el cliente envía `protocol:3`
  (`src/network/cooperative.js:21,27,44`). Distinto → error «Actualiza la página» (`:49`).
- Snapshot adelgazado (`backend/state-wire.cjs`, commit cf90177):
  - Enemigos: omite claves de simulación `ENEMY_SIM` (`balance*`, `waveRole`,
    `evolutionApplied`, `progressive`, `threatStage`, `targetSlot`) (`:17`).
  - Omite valores por defecto `boss:false`, `heavy:false`, `profession:null`,
    `evolution:0`, `ultiFlash:0` (`:18`).
  - Omite `combatStats` si el cliente lo regenera idéntico con `Attributes.init` (`:20-29`).
  - Disparos: quita `combatStats`, `hits`, `hitSlots`, trayectoria y datos Dota (`:33`);
    campos y peligros: `combatStats`, `hits`, `hitSlots` (`:35`).
  - Redondea `x`/`y` a centésimas si |x| o |y| > 1 (`:5-14`).
- Envío: un estado en vuelo por conexión; se descarta si la cola supera 64 KiB
  (`backend/state-wire.cjs:40-43`).
- Test: `tests/snapshot-slim.test.cjs:87` exige que el snapshot pese < 55 % del original.

## Elecciones de equipo con plazo de 15 s (commit e824100)
- `this.choiceTimeout=15` (`backend/activities.cjs:4`).
- `arm()` (`:101`) arma `pending.left` al entrar en fase `choice`.
- Cada tick resta `dt` (`:109`); al llegar a 0, `autoPick()` (`:102`) elige por quien no
  respondió la opción segura de cada tipo.
- Usa reloj de simulación: se congela si la sala no simula (reconexión).
- Test: `tests/coop-choice-timeout.test.cjs`.

## Límites de salas
- `maxRooms` 6 por defecto (`backend/cooperative.cjs:5`); el servidor aislado usa
  `MAX_ROOMS` o 20 (`:69`).
- `maxRoomsPerIp` = `MAX_ROOMS_PER_IP` o **2** (`:5`); se comprueba al crear (`:56`).
- IP real: `backend/client-ip.cjs` acepta `X-Real-IP` solo desde proxies de confianza.
- `tests/live/cooperative.cjs:109` abre 3 mapas en paralelo salvo con `COOP_FULL_RUN=1`
  (un solo mapa, `:8`). Ver [[gotchas/G011-salas-por-ip]].

## Validación de intenciones (`backend/cooperative.cjs`)
- `maxPayload:2048` por mensaje (`:10`).
- `input` (`:41`): `x`,`y` finitos y |·| ≤ 1; `weapon` entero 0–3; `lockTarget` ≤ 80
  caracteres; `domainPresentation` en lista blanca.
- `create`/`join` (`:53-57`): personaje entero en rango y desbloqueado; mapa en
  `campo|plaza|machu|halloween|navidad`.
- `activity` y `team` (`:42-43`): el servidor decide si la acción es válida.
- El cliente nunca envía daño, monedas ni desbloqueos.

## Cliente (`src/network/cooperative.js`)
- `P.Game.update` delega en `P.Coop.tick` cuando `P.Coop.active` (`src/scenes/game.js:4`).
- Cada snapshot **reemplaza** `P.state.player` (`src/network/cooperative.js:51`):
  [[gotchas/G010-player-reemplazado-snapshot]].
