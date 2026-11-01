---
tipo: sistema
id: cooperativo
archivos: [src/network/cooperative.js, src/network/coop-motion.js, src/network/coop-assist.js, src/network/coop-extras.js, tests/cooperative.test.cjs, tests/coop-choice-timeout.test.cjs]
verificado: 2026-10-31
---
# Cooperativo (lado cliente)

Cliente de sala por WebSocket. El servidor es autoritativo: simula en una VM y envía snapshots. El servidor se documenta en [[arquitectura/cooperativo-autoritativo]]. Guardado y cuentas: [[sistemas/cuentas/README]].

## Modelo
- El cliente **no simula** en coop: manda entrada (`input`) y pinta el snapshot `state` que recibe (`P.Coop.receive`, `src/network/cooperative.js:46`). `P.Game.update` hace `P.Coop.tick(dt)` y sale (`src/scenes/game.js:4`).
- Protocolo 3: el cliente envía `protocol:3` al abrir (`connect`, `:24-27`) y el servidor lo exige (`backend/cooperative.cjs:4,49`). Subir la versión en ambos lados a la vez.
- Se fuerza `P.RunMode.selected='chaos'` al crear/unirse (`:25`) y se bloquea si el personaje no está desbloqueado en Gacha. El servidor repite la comprobación con `accounts.owns` (`backend/cooperative.cjs:34`): gratuitos = `Meta.blank().unlocked`, luego `progress.unlocked` del guardado y concesiones admin (`backend/accounts.cjs:78`).

## `P.Coop` (`cooperative.js:2`)
- Estado: `active`, `session` (`code`, `token`, `slot`, `guest`), `ws`, `peers`, `paused`, `reconnecting`, `activityPending`, `queuedState`, `net` (rtt, tickMs, bytes).
- `connect(type,invite)` `:24` (type `create`/`join`/`resume`), `open(message)` `:29`, `send(message)` `:23` (solo si `readyState===1`).
- `receive(m)` `:46`: copia al `P.state` local jugadores, enemigos, tiros, cofres, portal, mercader, `broken`; en el primer snapshot llama `P.Game.start()` con `initializing=true`.
- `tick(dt)` `:87`: aplica el último `queuedState`; envía `ping` cada 2 s; cierra el socket si no hay paquetes en 6 s; envía `input` cada 50 ms o al cambiar (`lockTarget`, ulti, dominio, esquiva, arma).
- `canAct()` `:16`, `requestDomain()` `:17`, `requestDodge()` `:18`, `cancelIntent()` `:15`.
- Reconexión: `persistSession` `:19` guarda en `sessionStorage['causas-coop-session-v1']` (expira a 45 s); `restoreSaved` `:21`; ventana de 30 s con `reconnectDeadline` (`onclose`, `:41`).
- Elecciones del equipo: `showReward(pending)` `:69`, `countdown(pending)` `:64` (muestra el tiempo restante de `pending.left`); el límite de 15 s lo fija el servidor (`backend/activities.cjs:4,101`).
- `pause()` `:92`, `leave(menu)` `:93`, `backToRoom()` `:63`.

## Mensajes cliente a servidor (`send({type:...})`)
- `input`, `ping`, `activity` (acciones: `market-buy`, `dota-active`, aperturas de cofre, recompensas...), `ready`, `start`, `configure`, `team`, `return`, `leave`.

## Módulos auxiliares
- `P.CoopMotion` (`coop-motion.js:2`): interpola poses entre snapshots (intervalo medido, `accept` `:5`, `sample` `:6`, `draw` `:7` envuelve el render y restaura posiciones). Reinicia al cambiar de escena o si `elapsed` retrocede.
- `P.CoopAssist` (`coop-assist.js`): combo del equipo (tecla `G`), evento a dúo, estado de rescate, conexión (`eventUI`, `rescueState`, `connection`).
- `P.CoopExtras` (`coop-extras.js`): señales de ping (`here`, `danger`, `help`, `chest`), panel `T`.

## Estado y reinicio
- `P.CoopMotion.reset()` y `backToRoom`/`leave` limpian sesión, cola e intención. Todo `P.state` se sobrescribe por snapshot (lista de claves en `receive`, `:52`).

## Envoltorios
- Ninguno sobre `P.Coop`. Los demás módulos consultan `P.Coop?.active` (decenas de usos) para saltarse lógica local (meta-progreso, suministros, nivel de Dota, practica).

## Cooperativo (servidor)
- El código de simulación corre con `P.Combat.server=true` en `backend/simulation.cjs:19`. Cualquier módulo nuevo debe funcionar con el DOM falso de `loadEngine` (`backend/simulation.cjs:6-15`) y con todos los scripts cargados.

## Tests
- `tests/cooperative.test.cjs`, `coop-choice-timeout.test.cjs`, `coop-enemy-parity.test.cjs`, `snapshot-slim.test.cjs`, `state-wire-equivalence.test.cjs`, `server.test.cjs` (en `package.json`).

## Qué no romper
- Cambiar el formato del snapshot: actualizar `backend/state-wire.cjs`, la lista de claves de `receive` y los tests de equivalencia (`state-wire-equivalence`).
- Detecciones locales (viñeta de daño, Juice) van en render, no en rutas de golpe que el cliente no ejecuta (ver [[sistemas/hurtfx/README]]).
- `send` descarta mensajes sin socket abierto: no asumir entrega.
- No usar `Math.random` ni `Date.now` en simulación compartida (paridad cliente/servidor).
