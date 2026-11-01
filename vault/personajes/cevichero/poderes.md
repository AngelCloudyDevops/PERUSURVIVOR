---
tipo: personaje
id: cevichero
archivos: [src/data/character-contract.js, src/systems/passives.js, src/systems/ability-cards.js, src/systems/ultimate.js]
verificado: 2026-10-31
---
# Cevichero · poderes

**No tiene pasiva, Q ni R** (`src/data/character-contract.js:10` los marca «por definir»).
- Sin entrada en `P.Passives.definitions` ni `P.AbilityCards.entries`.
- La Q base solo acepta `kingteka` (`src/systems/ultimate.js:13`).
- Sin lógica propia de cooperativo ni de movimiento reducido; ver [[sistemas/cooperativo/README]] y [[sistemas/movimiento-reducido/README]].
- Aparece como compañero en dominios ajenos (`src/rendering/companion-art.js:6`, `src/rendering/dragon-epic.js:33`).
