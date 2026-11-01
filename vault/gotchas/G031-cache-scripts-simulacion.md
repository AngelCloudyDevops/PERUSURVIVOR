---
tipo: gotcha
id: G031
archivos: [backend/simulation.cjs]
verificado: 2026-10-31
---
# G031 · La simulación cachea scripts compilados por raíz

- **Síntoma:** un test que cambia un archivo de `src/` en disco y crea otra `Simulation` en el mismo proceso sigue viendo el código viejo.
- **Causa:** `engineScripts` guarda los `vm.Script` por `root` y descarta el más viejo al pasar de 4 (`backend/simulation.cjs:13`).
- **Cómo evitarla:** para probar código modificado usa otra raíz (copia temporal) o un proceso nuevo.
- **Cómo detectarla:** `grep -n "engineScripts" backend/simulation.cjs`.
- Más: [[arquitectura/cooperativo-autoritativo]].
