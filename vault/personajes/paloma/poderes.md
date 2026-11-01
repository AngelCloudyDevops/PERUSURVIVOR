---
tipo: personaje
id: paloma
archivos: [src/systems/animal-ultimates.js, src/systems/causa-combo.js, src/rendering/animal-entry.js, backend/simulation.cjs]
verificado: 2026-10-31
---
# Paloma · poderes
- **Pasiva:** no existe. **R / dominio:** no existe.

## Q · Bandada del Centro
- Carta: `src/systems/ability-cards.js:18`. Tecla Q.
- Parámetros (`src/systems/animal-ultimates.js:3`): duración 6 s, radio 270 u, pulso cada 0,6 s, escala 0,65, 12 palomas.
- **Carga:** Combo del Causa, igual que Cuy (`src/systems/causa-combo.js:5,10,13`; `tests/causa-combo.test.cjs:5`).
- **Activar** (`animal-ultimates.js:6`): carga 100, vivo, modo `play`, sin `court`. Carga a 0 y `u.left=6`.
- **Pulso** (`:8`): `power·0.65` = 11,05, físico, a enemigos a ≤270 u; jefes y minijefes ×0,35 sin empuje; empuje 4 al resto. Remate ×2, radio ×1,15 (`:9`).
- **Sin coraza:** `animalGuardUntil` queda en 0 salvo Cuy (`:6`; `tests/animal-ultimates.test.cjs:5`).
- Entrada de 1,3 s (`src/rendering/animal-entry.js:2,5`). Las palomas se van 1,6 s tras el remate (`animal-ultimates.js:10`).
- HUD `Q · BANDADA NN %` (`:21`).

## Cooperativo
- Igual que Cuy: `input.ultimate` → `P.Ultimate.activate` en el VM, `p.ultimate.animal` por jugador, reloj de simulación (`backend/simulation.cjs:41`; `tests/animal-ultimates.test.cjs:6,17`).

## Movimiento reducido
- Solo visual: `AnimalEntry.motion` (`animal-entry.js:4`), poses de ave y planeo (`animal-ultimates.js:11,14-20`, `src/rendering/animal-entry-poses.js:4-5`). El daño no cambia.
- Tests: `tests/animal-ultimates.test.cjs:8,12,19`. Ver [[sistemas/movimiento-reducido/README]].

Ver [[personajes/cuy/poderes]] · [[sistemas/ulti/README]] · [[personajes/paloma/README]].
