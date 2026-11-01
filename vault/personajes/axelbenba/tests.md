---
tipo: personaje
id: axelbenba
archivos: [tests/gameplay.test.cjs, tests/evolutions.test.cjs, tests/roster-balance.test.cjs, package.json]
verificado: 2026-10-31
---
# Axel Benba · tests

Volver: [[personajes/axelbenba/README]]. No hay test propio (`tests/axelbenba*.test.cjs` no existe). Los que lo nombran:

| Archivo | Qué comprueba |
|---|---|
| `tests/evolutions.test.cjs:5` | el proyectil evolucionado cambia de rumbo hacia un rival (`use('axelbenba')`) |
| `tests/evolutions.test.cjs:4` | recorre todo el roster (evolución, forma y nombre únicos) |
| `tests/roster-balance.test.cjs:3` | mejora de jefe en el informe |
| `tests/domain.test.cjs:76` | fila `axelbenba` del atlas de compañeros |

## Registro en `package.json`
- Todos están en el script `test` (`package.json:13`). Los únicos 4 sin registrar son `boss-health`, `cabinet-boss`, `character-variants` y `performance-fixture`; ninguno cubre a Axel Benba.
- `tests/roster-balance.test.cjs` y `tests/trio-balance.test.cjs` leen JSON de `docs/balance/datos/` (el informe sigue en **18** personajes, no 21).
