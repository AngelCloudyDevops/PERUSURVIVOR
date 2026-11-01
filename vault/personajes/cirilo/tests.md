---
tipo: personaje
id: cirilo
archivos: [tests/cirilo-kit.test.cjs, tests/cirilo-ur.test.cjs, scripts/cirilo-balance-audit.cjs, package.json]
verificado: 2026-10-31
---
# CiriloTV · tests

Volver: [[personajes/cirilo/README]]. Usan `Simulation` de `backend/simulation.cjs`.

## Específicos (registrados en `package.json:13`)
| Archivo | Qué cubre |
|---|---|
| `tests/cirilo-kit.test.cjs` (16 tests, `:8-26`) | contrato 9/9 (`:8`), taxi ida/vuelta y paredes (`:9-12`), tres evoluciones (`:13`), Eco y marcas (`:14,22`), Q de tres abanicos (`:15,26`), resurrección con taxi y Q (`:16,19`), cooperativo (`:17`), etapa 20 en el servidor (`:20`) |
| `tests/cirilo-ur.test.cjs` (≈40 tests) | frases (`:6`), deterioros y resurrección (`:8`), martillazo cada 3 s (`:10,18`), tribunal y atlas (`:12-16`), vuelo (`:30-40`), cartas R (`:42-44`), cooperativo (`:50-52`), presentación dinámica de 3,2 s (`:54-63`), móvil (`:65`) |

## Otros que lo nombran
`tests/build.test.cjs`, `card-gallery.test.cjs` (orden de cartas), `domain.test.cjs`, `evolutions.test.cjs`, `gacha.test.cjs`, `lab-equipment.test.cjs`, `lobby.test.cjs`, `player-feedback.test.cjs`, `roster-balance.test.cjs`. Todos están en el script `test`.

## Registro
- Ningún test de Cirilo queda fuera de `package.json`. Los 4 sin registrar del repo son `boss-health`, `cabinet-boss`, `character-variants` y `performance-fixture`, y ninguno es de Cirilo.
- `scripts/cirilo-balance-audit.cjs` es una auditoría offline (no está en `test`); sus resultados viven en `docs/balance/datos/cirilo-balance-*.json` con huellas SHA-256 de `cirilo-ur.js` y `cirilo-arena.js`. Editar esos archivos deja las huellas del doc desactualizadas (no rompe `npm test`).
