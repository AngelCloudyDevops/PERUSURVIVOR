---
tipo: personaje
id: alberto
archivos: [tests/court-ultimate.test.cjs, tests/causa-combo.test.cjs, package.json]
verificado: 2026-10-31
---
# Alberto · tests
Todos registrados en el script `test` de `package.json:13` (comprobado con grep).

| Test | Cubre |
|---|---|
| `tests/court-ultimate.test.cjs` | Tribunal individual y cooperativo, entrada y martillazo, aura de veredicto, práctica; también el jefe Fujimori (líneas 33-48) |
| `tests/causa-combo.test.cjs:5,8` | carga de Q y que el Tribunal no se recargue |
| `tests/evolutions.test.cjs` | perfiles de evolución (1 mención) |
| `tests/dragon-ultimate.test.cjs`, `boss-charge-ranges.test.cjs` | menciones sueltas |
| `tests/admin.test.cjs`, `live-gifts.test.cjs`, `lobby.test.cjs`, `gacha.test.cjs`, `meta-progress.test.cjs`, `save-validation.test.cjs`, `roster-balance.test.cjs`, `miniboss-phase.test.cjs`, `gameplay.test.cjs`, `domain.test.cjs` | catálogo, colección, guardado, balance |
- `tests/fujimori-contract.test.cjs` (jefe) corre en `pretest` (`package.json:12`); no prueba al jugable.
- Sin test aislado de `orbit` (3 y 6 bandas) (sin verificar más allá de las menciones).
