---
tipo: personaje
id: cuy
archivos: [tests/animal-ultimates.test.cjs, tests/causa-combo.test.cjs, package.json]
verificado: 2026-10-31
---
# Cuy · tests
Todos registrados en el script `test` de `package.json:13` (comprobado con grep).

| Test | Cubre |
|---|---|
| `tests/animal-ultimates.test.cjs` (31 menciones) | Q: carga, pulsos, radio, remate, coraza −50 %, entrada, poses, cooperativo, movimiento reducido |
| `tests/causa-combo.test.cjs:5` | carga en 55–60 s con `cuy` |
| `tests/evolutions.test.cjs:4` | perfiles y efectos de evolución (todos los ids) |
| `tests/roster-balance.test.cjs`, `tests/cinematic-upgrades.test.cjs` | balance y mejoras |
| `tests/gacha.test.cjs`, `meta-progress*.test.cjs`, `meta-migrations.test.cjs`, `miniboss-phase.test.cjs` | colección, guardado |
| `tests/kingteka-arsenal.test.cjs`, `kingteka-domain.test.cjs`, `domain.test.cjs`, `cooperative.test.cjs` | menciones sueltas (`cuy` como segundo jugador o espíritu) |
- `tests/fixtures/meta-saves.cjs` es fixture, no test.
- Sin test dedicado de la evolución del cuy ni del `nova` aislado (sin verificar más allá de las menciones).
