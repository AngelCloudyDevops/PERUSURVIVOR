---
tipo: personaje
id: shaka
archivos: [tests/gameplay.test.cjs, tests/evolutions.test.cjs, tests/roster-balance.test.cjs, package.json]
verificado: 2026-10-31
---
# Shakadoto · tests

Volver: [[personajes/shaka/README]]. No hay test propio (`tests/shaka*.test.cjs` no existe). Los que lo nombran:

| Archivo | Qué comprueba |
|---|---|
| `tests/gameplay.test.cjs:143` | lanza 2 proyectiles `BANANA` |
| `tests/roster-balance.test.cjs:3-4` | mejora inicial del jefe y medición de la escena `line` (`:4`) contra `docs/balance/datos/roster-audit.json` |
| `tests/gacha.test.cjs:8,11` | migraciones y lotes que lo usan como ejemplo de colección |
| `tests/domain.test.cjs:76` | fila `shaka` del atlas de compañeros |
| `tests/evolutions.test.cjs:4` | recorre todo el roster: requisitos, forma y nombre únicos de la evolución |

## Registro en `package.json`
- Todos están en el script `test` (`package.json:13`). Los únicos 4 sin registrar son `boss-health`, `cabinet-boss`, `character-variants` y `performance-fixture`; ninguno cubre a Shakadoto.
- `tests/roster-balance.test.cjs` y `tests/trio-balance.test.cjs` leen JSON de `docs/balance/datos/` (el informe sigue en **18** personajes, no 21).
