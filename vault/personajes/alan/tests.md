---
tipo: personaje
id: alan
archivos: [tests/roster-balance.test.cjs, tests/gacha.test.cjs, package.json]
verificado: 2026-10-31
---
# Alan · tests
Todos registrados en el script `test` de `package.json:13` (comprobado con grep). No hay test dedicado.

| Test | Cubre |
|---|---|
| `tests/roster-balance.test.cjs:4` | la auditoría de combate real incluye a `alan` («ataques sin ajuste») |
| `tests/evolutions.test.cjs:4` | perfiles de evolución de todo el roster |
| `tests/gacha.test.cjs` (3), `meta-progress.test.cjs` (2), `meta-migrations.test.cjs`, `save-validation.test.cjs` (3) | colección y guardado |
| `tests/domain.test.cjs`, `tests/miniboss-phase.test.cjs` | menciones sueltas |
- `tests/fixtures/meta-saves.cjs` es fixture, no test.
- Sin cobertura del cono ni de «Eco de la plaza» por id (sin verificar más allá de las menciones).
