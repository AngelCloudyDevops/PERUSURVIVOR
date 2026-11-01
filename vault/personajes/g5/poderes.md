---
tipo: personaje
id: g5
archivos: [src/data/character-contract.js, src/systems/ultimate.js, tests/gameplay.test.cjs]
verificado: 2026-10-31
---
# La G5 · poderes

**No tiene pasiva, Q ni R** (`src/data/character-contract.js:10`).
- Q: `P.Ultimate.activate` base solo acepta `kingteka` (`src/systems/ultimate.js:13`). Con G5 y carga 100 devuelve `false` (`tests/gameplay.test.cjs:178`).
- Sin entrada en `P.Passives.definitions` ni `P.AbilityCards.entries`.
- Sin lógica propia de cooperativo ni de movimiento reducido; ver [[sistemas/cooperativo/README]] y [[sistemas/movimiento-reducido/README]].
- Aparece como compañero en dominios ajenos (`src/rendering/companion-art.js:6`, `src/rendering/dragon-epic.js:33`).
