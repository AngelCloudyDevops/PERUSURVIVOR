---
tipo: gotcha
id: charles
archivos: [tests/roster-balance.test.cjs, docs/balance/datos/roster-audit.json, src/data/powers.js]
verificado: 2026-10-31
---
# Charles · trampas

Volver: [[personajes/charles/README]] · índice general: [[gotchas/README]]

1. **Balance fijado en un JSON de `docs/`.** `tests/roster-balance.test.cjs:4` mide `charles` en combate real y exige igualdad con `docs/balance/datos/roster-audit.json`. Cambiar hp, power, `powerScale` o el perfil de evolución de Charles rompe el test hasta regenerar el informe.
2. **El número de `powerScale` está en tres sitios.** Definición en `src/data/powers.js:65`, parche en `:90` (manda) y `damageScale` de la evolución en `src/systems/evolutions.js:54`. Editar solo el primero no tiene efecto.
3. **No existen Q ni R.** Los botones muestran «PRÓXIMAMENTE»; no cablear nada nuevo sin añadir la entrada en `src/systems/ability-cards.js` ([[personajes/charles/poderes]]).
