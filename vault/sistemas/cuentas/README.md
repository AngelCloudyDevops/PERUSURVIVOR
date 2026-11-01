---
tipo: sistema
id: cuentas
archivos: [src/network/account.js, src/network/friends.js, src/network/live-gifts.js, src/ui/inbox.js, tests/accounts.test.cjs, tests/account-sync.test.cjs, tests/friends.test.cjs, tests/live-gifts.test.cjs]
verificado: 2026-10-31
---
# Cuentas, amigos, regalos en vivo y buzón (lado cliente)

Cuentas opcionales con sincronización del progreso al servidor, lista de amigos, regalos del administrador y buzón. Guardado y servidor: [[arquitectura/cuentas-guardado]]. Progreso local: [[sistemas/gacha-meta/README]]. Salas: [[sistemas/cooperativo/README]].

## `P.Account` (`src/network/account.js:3`)
- Estado: `user`, `revision`, `ready`, `conflict`, `tail` (cola de promesas que serializa operaciones), `switching`.
- `api(route,method,body)` `:3`: `fetch('/api/'+route)` con cookie, `X-Account-Id` y timeout de 15 s. Rutas usadas en `src/network/` y `inbox.js`: `account`, `logout`, `save` (GET/PUT), `friends`, `friends/request|respond|invite|invite/decline|join`, `gifts?after=`, `inbox`, `inbox/read`.
- Modo invitado: `guest()` `:5` usa la clave local de invitado (`guestKey`). Con sesión, la clave de progreso es `causas-progress-account-<id>` (`connect` `:10`).
- Sincronización: `queue()` `:12` marca `<clave>-pending` en `localStorage` y hace `PUT save {revision,data,giftSync:1}`; `reconcile` `:11` resuelve pendientes tras reconexión (`resend`/`same`/conflicto); `download` `:9`; `importGuest` `:14` solo si la cuenta está vacía (`revision===0`); `snapshot()` `:6` = `{version:4,progress,best}`.
- Conflicto: si `conflict` es verdadero, `queue` no sube nada (evita pisar la copia del servidor).
- Solo se inicializa en navegador: `if(typeof Image!=='undefined')P.Account.init()` (`:30`).

## `P.Friends` (`src/network/friends.js:2`)
- Amistad bilateral: agregar por usuario, ambos aceptan; luego invitación a sala por botón. Se pinta en `#coop-panel` (`init` `:7`).
- `accountChanged` `:8`: si cambia el dueño y hay sesión coop, ejecuta `P.Coop.leave(false)`.

## `P.LiveGifts` (`src/network/live-gifts.js:2`)
- `fold(data,grants)` `:3` aplica regalos (`coins`, `character`, `skin`) al progreso crudo; salta los de `id <= adminCursor`. Topes: monedas 10 000 000.
- `pull()` `:5` descarga por `gifts?after=<cursor>` encolado en `P.Account.tail`; `start()` `:7` abre `EventSource('/api/events?account=')` (evento `gifts`) con sondeo de respaldo; `close()` `:8` incrementa `epoch` para descartar respuestas viejas.
- `apply(grants,owner,baseline)` usa `P.Meta.lock` (`src/systems/meta-progress.js:28`, `navigator.locks`) para evitar carreras entre pestañas.

## Buzón (`P.Inbox`, `src/ui/inbox.js`)
- Lista, insignia de no leídos (`updateBadge` `:6`), `label(item)` `:4` (monedas, personaje, skin), solo visible con sesión (`access` `:5`).

## Estado y reinicio
- Sesión: cookie del servidor + `user` en memoria. Pendientes y claves en `localStorage`. `logout()` `:13` vuelve a la clave de invitado y llama `refresh()` (recarga Meta, HUD, Gacha, perfil).

## Envoltorios (todos en `account.js:26-30`)
- `P.Meta.hud` (muestra «Cuenta: usuario»), `P.Meta.transaction` (llama `queue()` al confirmar), `P.Save.write`, `P.Game.start` (bloquea si `switching`). `live-gifts.js:9` envuelve `P.Account.connect`, `logout`, `guest`. `friends.js:7` envuelve `P.Account.refresh`.

## Cooperativo
- Las cuentas no son obligatorias: un invitado entra con código (`guest:!P.Account?.user` al conectar, `cooperative.js:27`). Al cambiar de cuenta se cierra la sala (`accountChanged`).

## Tests
- `tests/accounts.test.cjs`, `account-sync.test.cjs`, `friends.test.cjs`, `live-gifts.test.cjs`, `save-validation.test.cjs`, `server.test.cjs` (en `package.json`).

## Qué no romper
- Serializar siempre con `P.Account.tail`; escribir el progreso solo vía `P.Meta.transaction`.
- `conflict` y `<clave>-pending`: nunca borrarlos sin reconciliar.
- No cambiar `snapshot().version` sin migración del servidor (`backend/accounts.cjs:73`, `normalize`).
- Evitar `P.Game.start` mientras `switching` (la cuenta aún carga).
