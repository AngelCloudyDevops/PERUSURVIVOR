---
tipo: gotcha
id: G022
archivos: [src/systems/kingteka-arsenal.js, src/data/powers.js]
verificado: 2026-10-31
---
# G022 · Kingteka tiene dos escopetas

- **Síntoma:** cambiar `P.Data.attacks.shotgun` no altera el combate de Kingteka.
- **Causa:** el combate usa `P.KingtekaArsenal.profiles.shotgun` (recarga 0,92 s, alcance 260, 4 perdigones, `powerScale` 0,62; `src/systems/kingteka-arsenal.js:9`). `P.Data.attacks.shotgun` (0,78 s, alcance 480, 5 perdigones; `src/data/powers.js:61`) solo alimenta fichas de catálogo.
- **Cómo evitarla:** edita el arsenal. La evolución también está duplicada entre `src/systems/evolutions.js` y `src/systems/kingteka-arsenal.js`.
- **Cómo detectarla:** `tests/gameplay.test.cjs` mide el arsenal real.
- Más: [[personajes/kingteka/README]].
