---
tipo: arquitectura
id: cuentas-guardado
archivos: [backend/accounts.cjs, backend/save-checks.cjs, backend/admin.cjs, server.cjs, src/systems/meta-progress.js, src/network/account.js, src/core/runtime.js, tests/save-validation.test.cjs, tests/meta-migrations.test.cjs, tests/account-sync.test.cjs]
verificado: 2026-10-31
---
# Cuentas y guardado

Sistema de juego: [[sistemas/cuentas/README]]. Meta-progreso: [[sistemas/gacha-meta/README]].

## Guardado local (`src/systems/meta-progress.js`)
- Clave `causas-progress-v1` (`src/systems/meta-progress.js:2`) en `localStorage`.
- Versión actual `CURRENT:5` (`:6`).
- `MIGRATE` (`:10-19`): cada paso `MIGRATE[v]` lleva un guardado crudo de v a v+1.
  - 1→2 solo cambia la versión (`:12`).
  - 2→3 deduce la colección y descarta campos de gacha viejos (`:13-14`).
  - 3→4 suma copias de estrellas por tiradas repetidas; alias `cerdito`→`kingteka` (`:15-16`).
  - 4→5 retira la skin `cerdito-vtuber` regalada (`:17-18`).
- `migrate(raw)` (`:20`) rechaza versiones fuera de 1..`CURRENT` y aplica pasos en bucle.
- `normalize()` valida solo el formato actual y acota valores (p. ej. `earned` ≤ 1e8, `:24`).
- Copia de respaldo: antes de escribir guarda el valor anterior en `<clave>-bak`
  (`:29`); si el principal no se puede leer, `read()` usa `-bak` y avisa (`:25-26`).
- Escrituras serializadas con `navigator.locks` si existe (`:28`).
- Récord aparte: `P.Save` en `causas-best` (`src/core/runtime.js:34`).

## Backend de cuentas (`backend/accounts.cjs`)
- Solo se activa con `ACCOUNTS_DB` (`server.cjs:4`, `backend/cooperative.cjs:8`).
- `node:sqlite` `DatabaseSync` (`backend/accounts.cjs:7-9`), WAL, archivo con permisos 0600.
- Tablas: `users`, `sessions`, `saves`, `user_roles`, `user_entitlements`,
  `admin_actions`, `inbox_state` (`:10-16`); `character_balance`, `balance_actions`
  (`backend/balance.cjs:3,5`); `friendships`, `game_invites` (`backend/friends.cjs:4,5`).
- Contraseñas con `scrypt` (`:3`). Cookie `HttpOnly; SameSite=Strict` (`:21`).
- Rutas `/api/register`, `/api/login`, `/api/logout`, `/api/recover`, `/api/account`,
  `/api/save`, `/api/friends`, `/api/gifts`, `/api/inbox`, `/api/admin/*`, `/api/balance`.
- Cuerpo máximo 128 KiB → 413 (`:27`).

## Validación de guardados en el servidor
- `PUT /api/save` (`backend/accounts.cjs:70-74`):
  1. Sobre `version` **4** (`:71`), `revision` entera, `best` 0..1e8; si no → 400.
  2. Normaliza `progress` con las reglas del propio juego: `admin.rules()` arranca una
     `Simulation('campo',[0,1])` y usa `P.Meta.normalize` (`backend/admin.cjs:5`, `accounts.cjs:73`).
  3. Transacción `BEGIN IMMEDIATE`; si la revisión cambió → 409 (`:74`).
  4. `checks.check()` (`backend/save-checks.cjs:12-31`); si devuelve motivo → **422**.
- Reglas de verosimilitud (`backend/save-checks.cjs`):
  - `MAX_RUN=1170` monedas por partida, `MIN_RUN_MS=15000` (`:4`); `COST=60` por tirada (`:5`).
  - `earned` no baja; sube como mucho según partidas nuevas y tiempo transcurrido (`:21-23`).
  - `wallet` ≤ anterior + ganado + reembolsos (`:24-25`).
  - Personajes nuevos ≤ tiradas nuevas, salvo concesión de admin (`:26-27`).
  - Skins nuevas solo por concesión (`:28-29`).
  - Admin no se valida (`:13`). Sin guardado previo: recorta en vez de rechazar (`:15-19`).
- Tests: `tests/save-validation.test.cjs`, `tests/meta-migrations.test.cjs`.

## Cliente (`src/network/account.js`)
- Pendiente local en `<clave>-pending` (`src/network/account.js:10-11`).
- 4xx distinto de 408/409/429 → **no reintenta**, avisa «Guardado rechazado por el
  servidor» y conserva copia local y pendiente (`:12`, commit 445e7c9).
- Otros errores: reintenta con espera 2 s, 5 s, 15 s, 30 s (`:12`).
- Test: `tests/account-sync.test.cjs`.

## Reglas
- Dos versiones distintas: sobre de red `version:4` y `progress.version` = `Meta.CURRENT` (5).
  Ver [[gotchas/G019-versiones-guardado]].
- Cambio de formato → paso nuevo en `MIGRATE`, subir `CURRENT`, y test de migración.
- Tocar `backend/` o cuentas requiere revisión del propietario.
