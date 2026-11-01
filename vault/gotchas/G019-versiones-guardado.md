---
tipo: gotcha
id: G019
archivos: [backend/accounts.cjs, src/systems/meta-progress.js, src/network/account.js]
verificado: 2026-10-31
---
# G019 · Dos números de versión en el guardado

- **Síntoma:** tras subir la versión del meta-progreso, todos los guardados en la nube
  responden 400 «Guardado inválido»; o al revés, alguien cambia el sobre creyendo que es
  la versión del progreso.
- **Causa:**
  - Sobre de red: `PUT /api/save` exige `b.data.version===4` (`backend/accounts.cjs:71`)
    y guarda `{version:4,progress,best}` (`:73`).
  - Progreso: `progress.version` = `P.Meta.CURRENT` = 5 (`src/systems/meta-progress.js:6`),
    con migraciones `MIGRATE` (`:10-19`).
  - Son independientes: el sobre sigue en 4 aunque el progreso vaya por 5.
- **Cómo evitarla:** cambio de formato del progreso → paso nuevo en `MIGRATE` y subir
  `CURRENT`; no toques el `4` del sobre salvo que cambie su estructura (y entonces
  cliente y servidor a la vez).
- **Cómo detectarla:** `tests/meta-migrations.test.cjs`, `tests/save-validation.test.cjs`,
  `tests/account-sync.test.cjs`.
- Más: [[arquitectura/cuentas-guardado]].
