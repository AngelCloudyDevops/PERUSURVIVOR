---
tipo: personaje
id: paloma
archivos: [tests/animal-ultimates.test.cjs, tests/causa-combo.test.cjs, package.json]
verificado: 2026-10-31
---
# Paloma · tests
Todos registrados en el script `test` de `package.json:13` (comprobado con grep).

| Test | Cubre |
|---|---|
| `tests/animal-ultimates.test.cjs` (18 menciones) | Q: carga, pulsos, sin coraza, entrada, poses de ave, cooperativo, movimiento reducido |
| `tests/causa-combo.test.cjs:5` | carga en 55–60 s con `paloma` |
| `tests/evolutions.test.cjs:4` | perfiles y efectos de evolución (todos los ids) |
| `tests/gameplay.test.cjs` | 1 mención |
| `tests/gacha.test.cjs`, `meta-progress*.test.cjs`, `meta-migrations.test.cjs`, `roster-balance.test.cjs`, `cinematic-upgrades.test.cjs`, `domain.test.cjs` | colección, guardado, balance |
- `tests/fixtures/meta-saves.cjs` es fixture, no test.
- Sin test dedicado de `feathers` ni de «Corona de plumas» (sin verificar más allá de las menciones).
