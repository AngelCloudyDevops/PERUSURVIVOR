---
tipo: personaje
id: alberto
archivos: [src/systems/combat.js, src/systems/court-ultimate.js, src/systems/causa-combo.js, src/systems/fujimori-boss.js]
verificado: 2026-10-31
---
# Alberto · trampas
- **Las bandas no hacen daño solas.** Solo pegan en el instante del lanzamiento (`combat.js:33`); si no hay objetivo a `range·reach+24`, no se lanza nada (`combat.js:17`).
- **Bandas por id.** El 6 de la evolución está en `combat.js:15` (`p.id==='alberto'&&evolved.primary`), no en el perfil de `evolutions.js:11`.
- **El Tribunal congela la partida.** En solitario `Game.update` solo corre `Court.tick` (`court-ultimate.js:43`); en la sala, `simulation.cjs:37` hace lo mismo. Cualquier temporizador que dependa de `update` se detiene.
- **Dos Fujimori distintos.** El jugable usa `P.Court` (`court-ultimate.js`); el jefe opcional está en `fujimori-boss.js` y tiene su propio contrato (`tests/fujimori-contract.test.cjs`).
- **Ganancia de carga bloqueada** durante `s.court` (`court-ultimate.js:40`) y la carga sale del Combo del Causa, no de `Ultimate.gain` (`causa-combo.js:10,20`).
- **Índice 4** en salas y tests (`catalog.js:32`).
