---
tipo: personaje
id: charles
archivos: [tests/gameplay.test.cjs, tests/evolutions.test.cjs, tests/roster-balance.test.cjs, package.json]
verificado: 2026-10-31
---
# Charles · tests

Volver: [[personajes/charles/README]]. No hay test propio (`tests/charles*.test.cjs` no existe). Los que lo nombran:

| Archivo | Qué comprueba |
|---|---|
| `tests/gameplay.test.cjs:148` | la nube existe a los 0,4 s, daña dentro y no fuera; se limpia al entrar a la arena |
| `tests/evolutions.test.cjs:5` | evolución con campo persistente (`use('charles')`) |
| `tests/roster-balance.test.cjs:3-5` | jefe evolucionado medido contra el informe (`:4`) y escala de evolución (`:5`) |
| `tests/muzzle.test.cjs:6` | bala y fogonazo comparten la punta en 8 sentidos |
| `tests/save-validation.test.cjs:32-33` | tirada que desbloquea `charles` |
| `tests/domain.test.cjs:76` | fila `charles` del atlas de compañeros |

## Registro en `package.json`
- Todos están en el script `test` (`package.json:13`). Los únicos 4 sin registrar son `boss-health`, `cabinet-boss`, `character-variants` y `performance-fixture`; ninguno cubre a Charles.
- `tests/roster-balance.test.cjs` y `tests/trio-balance.test.cjs` leen JSON de `docs/balance/datos/` (el informe sigue en **18** personajes, no 21).
