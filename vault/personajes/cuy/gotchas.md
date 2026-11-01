---
tipo: personaje
id: cuy
archivos: [src/systems/animal-ultimates.js, src/systems/causa-combo.js, src/systems/ultimate.js, src/systems/character-skins.js]
verificado: 2026-10-31
---
# Cuy · trampas
- **`Ultimate.gain` no carga la Q.** `causa-combo.js:20` lo reemplaza y solo acumula créditos; la carga sale de `CausaCombo.sync` (`:10`). El `+5` de `ultimate.js:12` ya no se usa para este personaje.
- **Un parche compartido con Paloma.** `defs` y el envoltorio de `P.Ultimate.activate/tick/hud` sirven a ambos (`animal-ultimates.js:3,23-27`). Cambiar uno afecta al otro; la coraza va aparte por `id==='cuy'` (`:28`).
- **Nombre mutado.** `character-skins.js:21` reescribe `c.name`; no busques al personaje por el nombre del catálogo.
- **Índice 1.** Salas y tests usan índices de `P.Data.characters`, no ids (`catalog.js:32`).
