---
tipo: gotcha
id: cirilo
archivos: [src/data/catalog.js, src/systems/cirilo-ur.js, src/systems/cirilo-kit.js, scripts/modules.cjs]
verificado: 2026-10-31
---
# CiriloTV · trampas

Volver: [[personajes/cirilo/README]] · índice general: [[gotchas/README]]

1. **El catálogo miente.** `src/data/catalog.js:33` dice `hp 120 / speed 175 / power 22 / attack micro`. El valor real lo fija `Object.assign` en `src/systems/cirilo-ur.js:80` (`135 / 165 / 24 / ciriloVomit`, categoría `Streamer UR · parodia`). Editar el catálogo no cambia nada. `P.Data.attacks.micro` (`catalog.js:35`, cooldown 0,95) ya no se usa en combate.
2. **Dos módulos, dos criterios de elegibilidad.** `CiriloUR.eligible` exige rareza `ultra` (`src/systems/cirilo-ur.js:3`); `CiriloKit.eligible` solo el id (`src/systems/cirilo-kit.js:19`). Si Cirilo sale de `ultra` en `src/systems/gacha.js:4`, `CiriloUR.attack` devuelve `null` y `CiriloArsenal.attackFor` lo usa como base del vómito (`cirilo-kit.js:10`), así que el ataque inicial fallaría (sin verificar en ejecución).
3. **Orden de wrappers.** `cirilo-ur.js` (`scripts/modules.cjs:436`) se carga antes que `cirilo-kit.js` (`:448`). Ambos envuelven `P.Ultimate.gain/activate/hud`, `P.Evolutions.attack`, `P.PlayerFeedback.hit` y `P.Entities.hurt`. El `activate` de `cirilo-ur.js:93` devuelve `false` para Cirilo y el de `cirilo-kit.js:64` lo redirige a `activateQ`. Reordenar los módulos deja la Q muerta o el dominio sin cargar.
4. **Dos barras de carga.** R usa `ultimate.charge` (+4 por baja, `cirilo-ur.js:94`); Q usa `ultimate.ciriloCharge` (+5/8/20/30, `cirilo-kit.js:43`). `P.Ultimate.gain` del kit llama primero al de `cirilo-ur.js` (`cirilo-kit.js:63`), por eso cada baja carga las dos. No unificar los campos.
5. **Daño recibido encadenado.** `cirilo-ur.js:85` multiplica ×1,1 y `cirilo-kit.js:61` multiplica ×0,6 si está en el taxi, en ese orden. Cambiar una constante sin la otra rompe `tests/cirilo-kit.test.cjs:12`.
6. **Estadísticas mutadas en partida.** Etapa 1 hace `reach ×1,25`, etapa 2 `speed ×1,25` (`cirilo-ur.js:16`), demonio `power ×1,5` (`:18`), el dominio `speed ×1,5` (`:21`). `end()` restaura el `power` guardado (`returnPower`) y divide `speed` entre 1,5 (`:22`). No reasignar `p.power` durante el dominio: se pisa al terminar.
7. **Q fijada al activar.** `p.ciriloQPower` se calcula una vez (`cirilo-kit.js:44`); subir rangos con la Q activa no la altera (`tests/cirilo-kit.test.cjs:26`).
8. **Presentación del dominio fuera del servidor.** `CiriloUR.presentation()` lee `localStorage` (`cirilo-ur.js:4`); el servidor (`node:vm`) no lo tiene, por eso coop pasa `input.domainPresentation` (`backend/simulation.cjs:41`). Cualquier opción nueva del dominio necesita el mismo viaje.
