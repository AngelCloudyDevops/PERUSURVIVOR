---
tipo: gotcha
id: G010
archivos: [src/network/cooperative.js, src/rendering/hurt-vignette.js, backend/simulation.cjs]
verificado: 2026-10-31
---
# G010 · En cooperativo `P.state.player` se reemplaza en cada snapshot

- **Síntoma:** en cooperativo un efecto local que «recuerda» al jugador (viñeta de daño,
  sonido, contador) nunca se dispara o se reinicia en cada tick. En solitario funciona.
- **Causa:** el cliente asigna `s.player=m.players[this.session.slot]`
  (`src/network/cooperative.js:51`) con el objeto recién parseado de cada snapshot.
  Comparar por referencia (`p!==this.who`) siempre da «jugador nuevo».
- En el servidor pasa algo parecido: `Simulation.use(p)` cambia `P.state.player` por
  turnos dentro de un mismo tick (`backend/simulation.cjs:26`).
- **Caso real:** commit 2251f59. `P.HurtFx.observe` comparaba por referencia; ahora
  identifica por `p.slot??'solo'` (`src/rendering/hurt-vignette.js`).
- **Cómo evitarla:** identifica al jugador por `slot` (o `slot`+`id`), nunca por referencia.
  No guardes estado propio en el objeto jugador del cliente cooperativo: se pierde.
- **Cómo detectarla:** probar con dos jugadores (anfitrión e invitado).
  `tests/reduced-motion-feedback.test.cjs` cubre el caso de HurtFx.
- Más: [[arquitectura/cooperativo-autoritativo]], [[sistemas/hurtfx/README]].
