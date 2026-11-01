---
tipo: personaje
id: sustento
archivos: [src/data/character-contract.js, src/systems/passives.js, src/systems/ability-cards.js, src/systems/ultimate.js]
verificado: 2026-10-31
---
# Sustento · poderes

**No tiene pasiva, Q ni R.** El contrato lo marca como «por definir» (`src/data/character-contract.js:10`).
- Pasiva: no hay entrada en `P.Passives.definitions` (`src/systems/passives.js`).
- Q: no hay carta en `P.AbilityCards.entries`; `P.Ultimate.activate` base solo acepta `kingteka` (`src/systems/ultimate.js:13`). Prueba: `tests/gameplay.test.cjs:178` (con G5 y carga 100 devuelve `false`).
- R: no hay dominio.
- Movimiento reducido y cooperativo: no hay lógica propia. El ataque se simula igual que el de cualquier causa básica ([[sistemas/cooperativo/README]], [[sistemas/movimiento-reducido/README]]).
- Sí participa como compañero animado en dominios de otros personajes (`src/rendering/companion-art.js:6`, `src/rendering/dragon-epic.js:33`).
