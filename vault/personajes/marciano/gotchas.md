---
tipo: gotcha
id: marciano
archivos: [src/systems/marciano-kit.js, src/core/runtime.js, src/network/cooperative.js, src/data/powers.js, package.json]
verificado: 2026-10-31
---
# Marciano · trampas

- **Teclas propias.** Las teclas 1/2/3 del arsenal y la R tienen listeners dentro de `marciano-kit.js:65-66`. No están en `src/core/runtime.js:24`, donde sí están los demás arsenales; añadirlo allí duplicaría el cambio.
- **R con listener propio.** El Marciano activa la R en su propio `keyup` (`marciano-kit.js:66`), sin distinguir pulsación breve de mantener para ver la carta. Los demás personajes pasan por el control de toque/mantener de `runtime.js:24-25`, que no incluye al Marciano.
- **Cooperativo: la R del cliente mira otra carga.** `P.Coop.requestDomain` lee `ultimate.charge` para el Marciano (`cooperative.js:17`), pero su R carga en `marcianoDomainCharge` (`marciano-kit.js:35`). El servidor valida la carga correcta (`marciano-kit.js:44`). Impacto real en el cliente: sin verificar.
- **Sin cartas `primary`.** `P.Progression.options` quita `primary` y `evolve:primary` para el Marciano (`marciano-kit.js:82`). Su evolución solo viene de `marciano-arsenal:evolve:*`.
- **El contrato necesita el parche.** `P.CharacterContract.describe` base no ve sus evoluciones; `marciano-kit.js:62` lo reescribe. Si cambias el contrato base, revisa también este envoltorio.
- **Índice 20 fijo.** Se mantiene al final de `P.Data.characters` para no mover índices de salas y repeticiones (`powers.js:108`). No insertes personajes antes.
- **Test en `pretest`.** `tests/marciano-kit.test.cjs` no está en el script `test` (ver [[personajes/marciano/tests]]).
- **Sin alcance por técnica.** No figura en `P.CharacterBalance.attackReach` (`character-balance.js:12`), así que el ajuste de admin de alcance por ataque no le afecta.
- Ver [[gotchas/README]].
