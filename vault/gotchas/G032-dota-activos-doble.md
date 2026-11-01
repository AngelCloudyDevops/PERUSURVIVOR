---
tipo: gotcha
id: G032
archivos: [src/systems/dota-items.js, src/systems/dota-actives.js]
verificado: 2026-10-31
---
# G032 · `hasActive`/`activate` de objetos Dota existen dos veces

- **Síntoma:** editar `P.DotaItems.hasActive` o `activate` en `dota-items.js` no cambia nada.
- **Causa:** `src/systems/dota-items.js:44-45` define versiones solo para Blink; `src/systems/dota-actives.js:27` las reemplaza por la versión general (Blink más 13 activables).
- **Cómo evitarla:** edita solo `src/systems/dota-actives.js`.
- **Cómo detectarla:** `grep -n "hasActive" src/systems/dota-*.js`.
- Más: [[sistemas/objetos-dota/README]].
