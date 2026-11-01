---
tipo: gotcha
id: g5
archivos: [src/data/powers.js]
verificado: 2026-10-31
---
# La G5 · trampas

- Sus estadísticas viven en **tres sitios** de `src/data/powers.js`: alta (`:77`, 145/210/42), parche de balance (`:82`, 135/195/36) y cadencia (`:69` → `:103`). El valor efectivo es el último; no copies el de la alta.
- `tests/trio-balance.test.cjs:3` fija `kind`, `range`, `count`, `pierce`, `spread` y `arc` de `g5Kick`, su cadencia 0,68 y el `damageScale` 0,58 de la evolución: cambiarlos rompe esa prueba.
- Ver [[gotchas/README]].
