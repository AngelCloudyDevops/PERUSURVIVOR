---
tipo: personaje
id: cuy
archivos: [src/systems/animal-ultimates.js, src/systems/causa-combo.js, src/rendering/animal-entry.js, backend/simulation.cjs]
verificado: 2026-10-31
---
# Cuy · poderes
- **Pasiva:** no existe. **R / dominio:** no existe.

## Q · Estampida Suprema
- Carta: `src/systems/ability-cards.js:17`. Tecla Q (pulsar activa; mantener enseña la carta).
- Parámetros (`src/systems/animal-ultimates.js:3`): duración 5 s, radio 200 u, pulso cada 0,5 s, escala 0,8, 12 cuyes.
- **Carga:** Combo del Causa (3 cartas Caos/Aguante/Hazaña), no por bajas. `CausaCombo.enabled` incluye a quien tenga definición animal (`src/systems/causa-combo.js:5`). Fórmulas en `causa-combo.js:10,13`; ~55–60 s de combate (`tests/causa-combo.test.cjs:5`).
- **Activar** (`animal-ultimates.js:6`): carga 100, modo `play`, vivo, sin `court`. Pone la carga en 0, `u.left=5`, planea objetivos y activa la coraza.
- **Pulso** (`:8`): daño `power·0.8` = 27,2, canal físico, a enemigos a ≤200 u; jefes y minijefes ×0,35 y sin empuje; empuje 12 al resto. Al terminar, remate ×2 y radio ×1,15 (`:9`).
- **Coraza:** −50 % de daño recibido durante los 5 s (`animalGuardUntil`, `:6,28`). Es solo de Cuy; Paloma no la tiene.
- **Entrada** de 1,3 s con la carta (`src/rendering/animal-entry.js:2`); `protected()` evita daño en ese tramo (`animal-entry.js:5`). Los cuyes se retiran 1,6 s sin daño extra (`animal-ultimates.js:10`).
- HUD: `Q · ESTAMPIDA NN %` (`animal-ultimates.js:21`), texto activo en `src/systems/ultimate.js:26`.

## Cooperativo
- El servidor simula `p.ultimate.animal` por jugador; `P.Ultimate.activate` llega por `input.ultimate` (`backend/simulation.cjs:41`). En el VM no hay `P.Coop`, así que corre `AnimalUltimate.activate` (`animal-ultimates.js:24`).
- Estado en `p.ultimate` (`charge`, `left`, `animal`), serializado en snapshot (test `tests/animal-ultimates.test.cjs:6`). Reloj de simulación `P.state.elapsed`, no tiempo real (`:5` del test).
- Cliente: con `P.Coop.active` delega en la petición de red (`animal-ultimates.js:24`).

## Movimiento reducido
- Solo visual: `AnimalEntry.motion(…, reduced)` (`animal-entry.js:4`), trayectorias y poses (`animal-ultimates.js:11,14-20`), reacción del enemigo (`:37`). Daño y tiempos no cambian.
- Tests: `tests/animal-ultimates.test.cjs:8,12,19`. Ver [[sistemas/movimiento-reducido/README]].

Ver [[personajes/paloma/poderes]] · [[sistemas/ulti/README]] · [[personajes/cuy/README]].
