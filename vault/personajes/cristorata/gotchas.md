---
tipo: personaje
id: cristorata
archivos: [src/systems/cristorata-kit.js, src/systems/progression.js, src/ui/attack-hud.js, src/systems/character-balance.js]
verificado: 2026-10-31
---
# Cristorata · trampas
- **Lista de ids con arsenal repartida en varios sitios.** Si tocas el arsenal, revisa `progression.js:60,88`, `evolutions.js:51`, `character-balance.js:12`, `attack-hud.js:9` y `backend/simulation.cjs:41`. Si falta uno, el kit se rompe en silencio.
- **Parchea funciones globales.** `cristorata-kit.js:44-61` envuelve `Combat.cast`, `Entities.hurt`, `Ultimate.gain/activate`, `Systems.move`, `Passives.state/rows`, `UI.hud`, `Game.start/finish`. El orden de carga importa (`scripts/modules.cjs`: `cristorata-kit.js` va casi al final).
- **Q y R se anulan entre sí** (`cristorata-kit.js:54-57`) y la Q cancela derrape y estelas (`:55`). Al cambiar una, prueba la otra.
- **Q con cadencia propia.** Al activar el dragón se guarda `cristoReturnRate` y se restaura al terminar (`:35,55`).
- **Carga de Q distinta de la de R.** Q usa `u.charge` vía Combo del Causa; R usa `u.cristorataDomainCharge`. No mezclarlas.
- **Índice 0.** `P.Data.characters[0]` es Cristorata y salas y tests usan índices (`catalog.js:32`).
