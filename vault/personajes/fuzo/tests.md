---
tipo: personaje
id: fuzo
archivos: [tests/gameplay.test.cjs, tests/evolutions.test.cjs, tests/roster-balance.test.cjs, package.json]
verificado: 2026-10-31
---
# Fuzo · tests

Volver: [[personajes/fuzo/README]]. No hay test propio (`tests/fuzo*.test.cjs` no existe). Los que lo nombran:

| Archivo | Qué comprueba |
|---|---|
| `tests/gameplay.test.cjs:147` | la tarjeta perfora a los 3 primeros de una fila y no al cuarto |
| `tests/trio-balance.test.cjs:3-4` | fija `kind, range, count, pierce, spread` de `bankCards`, su `powerScale` 0,8 y `damageScale` 0,58 de la evolución; medición contra jefe base y evolucionada |
| `tests/gacha.test.cjs:5,6,12,28,29` | crecimiento ×1,03, tirada con `fuzo`, orden de colección |
| `tests/meta-progress.test.cjs:7` | estrellas con crecimiento de rareza |
| `tests/meta-progress-ids.test.cjs:19` | validación de `gachaStars` con `fuzo` |
| `tests/meta-migrations.test.cjs:16` | migraciones |
| `tests/save-validation.test.cjs:31,41,64` | tiradas de gacha |
| `tests/roster-balance.test.cjs:3` | mejora de jefe en el informe |
| `tests/evolutions.test.cjs:4` | recorre todo el roster |
| `tests/domain.test.cjs:76` | fila `fuzo` del atlas de compañeros |

## Registro en `package.json`
- Todos están en el script `test` (`package.json:13`). Los únicos 4 sin registrar son `boss-health`, `cabinet-boss`, `character-variants` y `performance-fixture`; ninguno cubre a Fuzo.
- `tests/roster-balance.test.cjs` y `tests/trio-balance.test.cjs` leen JSON de `docs/balance/datos/` (el informe sigue en **18** personajes, no 21).
