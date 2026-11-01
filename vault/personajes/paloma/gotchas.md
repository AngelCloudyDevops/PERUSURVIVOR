---
tipo: personaje
id: paloma
archivos: [src/systems/combat.js, src/data/powers.js, src/systems/minibosses.js, src/systems/animal-ultimates.js]
verificado: 2026-10-31
---
# Paloma · trampas
- **5 plumas por id, no por dato.** `combat.js:22` y `src/data/powers.js:55` (`base()`) comparan `attack==='feathers'`. Si renombras el ataque o le pones `count`, la vista de balance y el combate pueden divergir.
- **No confundir con el minijefe.** «La Paloma Brava» (`minibosses.js:7`) usa `asset:'paloma'` y ataques `feathers/peck/droppings`; tiene arte y reglas propias.
- **Q compartida con Cuy.** Mismos envoltorios de `P.Ultimate.*` (`animal-ultimates.js:23-27`); la coraza del 50 % no aplica a Paloma (`:28`).
- **La carga no viene de `Ultimate.gain`** sino del Combo del Causa (`causa-combo.js:10,20`).
- **Índice 2** en salas y tests (`catalog.js:32`).
