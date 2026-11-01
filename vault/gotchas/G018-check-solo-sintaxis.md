---
tipo: gotcha
id: G018
archivos: [scripts/check-syntax.cjs, check.cjs]
verificado: 2026-10-31
---
# G018 · `npm run check` solo compila: no prueba el orden de carga

- **Síntoma:** `npm run check` dice «Sintaxis correcta» pero el juego muestra pantalla
  negra con `TypeError: Cannot read properties of undefined` al cargar.
- **Causa:** `scripts/check-syntax.cjs:3` crea `new vm.Script(...)` por módulo y no lo
  ejecuta. No detecta usar `P.X` antes de que su módulo cargue, ni un archivo sin
  registrar en `scripts/modules.cjs`.
- Ojo: `check.cjs` (raíz) es otra cosa: build + 3 tests (`check.cjs:2-4`).
- **Cómo evitarla:** después de `npm run check`, corre un test que cargue el motor
  completo (`node --test tests/cooperative.test.cjs` o `tests/gameplay.test.cjs`) y abre
  el juego (`npm start`).
- **Cómo detectarla:** consola del navegador al cargar; o
  `node -e "new (require('./backend/simulation.cjs').Simulation)('campo',[0,1])"`.
- Más: [[arquitectura/orden-modulos]].
