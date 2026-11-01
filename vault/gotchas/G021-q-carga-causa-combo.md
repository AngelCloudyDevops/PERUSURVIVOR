---
tipo: gotcha
id: G021
archivos: [src/systems/causa-combo.js, src/systems/ultimate.js]
verificado: 2026-10-31
---
# G021 · La Q no se carga con `Ultimate.gain`

- **Síntoma:** cambiar la ganancia por baja de `src/systems/ultimate.js` no altera la carga de la Q.
- **Causa:** `src/systems/causa-combo.js:20` reemplaza `P.Ultimate.gain` por `P.CausaCombo.gain(source)`. La carga la fija `P.CausaCombo.sync` (`src/systems/causa-combo.js:10`). Los kits con carga propia (p. ej. `ciriloCharge` de CiriloTV) suman por su lado.
- **Cómo evitarla:** cambia la carga en `P.CausaCombo` o en el kit del personaje, no en `ultimate.js`.
- **Cómo detectarla:** `grep -rn "Ultimate.gain=" src` antes de tocar la carga.
- Más: [[sistemas/ulti/README]], [[arquitectura/envoltorios]].
