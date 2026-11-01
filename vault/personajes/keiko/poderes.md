---
tipo: personaje
id: keiko
archivos: [src/systems/passives.js, src/systems/ability-cards.js, src/systems/ultimate.js, src/systems/causa-combo.js]
verificado: 2026-10-31
---
# Keiko · poderes
**No tiene pasiva, Q ni R.** Comprobado en ejecución (`P.CharacterContract.describe`): las tres piezas figuran como «por definir».

- Pasiva: `P.Passives.definition(keiko)` es `null` (`src/systems/passives.js:4-8`).
- Q: sin entrada en `P.AbilityCards.entries` (`src/systems/ability-cards.js:14`). `CausaCombo.enabled` no la incluye (`src/systems/causa-combo.js:5`), no hay carga. Botón «Q · ULTI · PRÓXIMAMENTE» (`src/systems/ultimate.js:26`).
- R: sin entrada de dominio ni carga.
- Cooperativo: nada propio. El ataque se simula en el VM del servidor con `Combat.cast` (`backend/simulation.cjs:41`).
- Movimiento reducido: solo afecta al efecto visual de «Abanico solar» (`src/systems/evolutions.js:38`, `P.Ambient.reduced`) y al arte de caminata (`src/rendering/walk-art.js:62-66`, sin verificar el detalle). La mecánica no cambia.

Ver [[sistemas/ulti/README]] · [[sistemas/dominios/README]] · [[sistemas/pasivas/README]] · [[personajes/keiko/README]].
