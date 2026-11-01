---
tipo: gotcha
id: G004
archivos: [src/systems/progression.js, src/systems/evolutions.js, src/systems/character-balance.js, src/systems/gacha.js, src/systems/passives.js, src/ui/attack-hud.js, src/ui/balance-preview.js, src/ui/skill-preview.js, src/systems/meta-progress.js]
verificado: 2026-10-31
---
# G004 · Listas de IDs de personajes copiadas en muchos archivos

- **Síntoma:** un personaje o kit nuevo funciona a medias: tiene arsenal pero el HUD de
  ataques, la vista previa, el balance o las cartas lo tratan como personaje genérico.
- **Causa:** no hay una lista central de «personajes con kit». Literales de hoy:
  - Lista de 6 `['kingteka','makanaky','sideral','cirilo','chamelin','cristorata']`:
    `src/systems/progression.js:60`, `src/systems/evolutions.js:51`,
    `src/systems/character-balance.js:12,23`, `src/ui/attack-hud.js:9`,
    `src/ui/balance-preview.js:4`, `src/ui/skill-preview.js:4`.
  - Lista de 7 (añade `marciano`): `src/systems/progression.js:71,88`.
  - Gacha por rareza: `src/systems/gacha.js:4` (3 listas).
  - Otras: `src/systems/passives.js:65` (`kingteka`,`makanaky`),
    `src/systems/causa-combo.js:5`, `src/rendering/walk-art.js:10-11`,
    `src/systems/meta-progress.js:21,24` (desbloqueo inicial), `src/rendering/dragon-epic.js:33`,
    `src/rendering/companion-art.js:5`, `src/development/test-bench.js:127`.
  - `src/core/runtime.js` hoy no tiene lista literal de personajes: despacha R por
    `eligible()` de cada kit ([[gotchas/G003-r-tres-sitios]]).
  - `marciano` no está en las listas de 6 (sin verificar si es intencional).
- **Cómo evitarla:** al añadir personaje o kit:
  `grep -rn "'kingteka','makanaky'" src` y `grep -rn "'cristorata'\]" src`; revisa cada una.
- **Cómo detectarla:** `tests/roster-balance.test.cjs`, `tests/character-balance.test.cjs`
  y el test del kit; comprobar HUD de ataques y vista previa jugando.
