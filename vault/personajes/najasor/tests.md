---
tipo: personaje
id: najasor
archivos: [tests/gameplay.test.cjs, tests/evolutions.test.cjs, tests/roster-balance.test.cjs, package.json]
verificado: 2026-10-31
---
# Najasor · tests

Volver: [[personajes/najasor/README]]. No hay test propio (`tests/najasor*.test.cjs` no existe). Los que lo nombran:

| Archivo | Qué comprueba |
|---|---|
| `tests/gameplay.test.cjs:143-144` | lanza 3 proyectiles `FISH` y el texto `CPEZ` por disparo |
| `tests/muzzle.test.cjs:6` | bala y fogonazo comparten la punta en 8 sentidos |
| `tests/evolutions.test.cjs:4` | recorre todo el roster (evolución, forma y nombre únicos) |
| `tests/roster-balance.test.cjs:3,5` | mejora de jefe en el informe y escala de evolución con `najasor` (`:5`) |
| `tests/meta-migrations.test.cjs:16` | migración v1 conserva `najasor` desbloqueado |
| `tests/save-validation.test.cjs:31,41,64` | tiradas de gacha que lo obtienen |
| `tests/domain.test.cjs:76` | fila `najasor` del atlas de compañeros |

## Registro en `package.json`
- Todos están en el script `test` (`package.json:13`). Los únicos 4 sin registrar son `boss-health`, `cabinet-boss`, `character-variants` y `performance-fixture`; ninguno cubre a Najasor.
- `tests/roster-balance.test.cjs` y `tests/trio-balance.test.cjs` leen JSON de `docs/balance/datos/` (el informe sigue en **18** personajes, no 21).
