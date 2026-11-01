---
tipo: gotcha
id: G023
archivos: [src/systems/cirilo-ur.js, src/data/catalog.js]
verificado: 2026-10-31
---
# G023 · El catálogo de CiriloTV se sobrescribe

- **Síntoma:** editar a `cirilo` en `src/data/catalog.js:33` (ataque `micro`) no cambia el juego.
- **Causa:** `src/systems/cirilo-ur.js:80` define `P.Data.attacks.ciriloVomit` y reescribe vida, velocidad, poder, ataque y categoría del personaje.
- **Cómo evitarla:** edita `src/systems/cirilo-ur.js`. Regla general en [[gotchas/G012-object-assign-sobrescribe]].
- **Cómo detectarla:** `grep -n "ciriloVomit" src/systems/cirilo-ur.js`.
- Más: [[personajes/cirilo/README]].
