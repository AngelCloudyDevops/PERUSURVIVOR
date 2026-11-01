---
tipo: personaje
id: cristorata
archivos: [tests/cristorata-kit.test.cjs, tests/dragon-ultimate.test.cjs, package.json]
verificado: 2026-10-31
---
# Cristorata · tests
Todos los de la tabla están registrados en el script `test` de `package.json:13` (comprobado con grep).

| Test | Cubre |
|---|---|
| `tests/cristorata-kit.test.cjs` (13 pruebas) | contrato 9/9, derrape, estela, garra, pasiva, R, Q intacta, cooperativo (líneas 7-20) |
| `tests/dragon-ultimate.test.cjs` | Q: variantes, 8 s, cooperativo, arte, movimiento reducido |
| `tests/causa-combo.test.cjs:5` | carga de Q en 55–60 s (el dragón entra por `enabled`) |
| `tests/evolutions.test.cjs` | perfiles de evolución (8 menciones) |
| `tests/walk-art.test.cjs`, `tests/directional-aim.test.cjs` | arte de caminata y puntería |
| `tests/gacha.test.cjs`, `meta-progress*.test.cjs`, `save-validation.test.cjs`, `lobby.test.cjs`, `cooperative.test.cjs` | colección, guardado, sala (menciones sueltas) |
- `tests/fixtures/meta-saves.cjs` es fixture, no test.
- Los tests usan `new Simulation('campo',[0,...])`: el 0 es el **índice** de Cristorata (`tests/cristorata-kit.test.cjs:3`).
