---
tipo: gotcha
id: G020
archivos: [src/scenes/game.js, src/core/runtime.js, src/systems/kingteka-domain.js, src/systems/chamelin.js]
verificado: 2026-10-31
---
# G020 · Clave nueva en `P.state` que sobrevive entre partidas

- **Síntoma:** tras perder o volver al menú, la partida siguiente empieza con un dominio,
  temporizador o charco de la anterior.
- **Causa:** `P.Game.start` (`src/scenes/game.js:3`) hace `Object.assign(P.state,{…})`
  solo con una lista fija de claves. Cualquier otra clave de `P.state` persiste.
- Así se resuelve hoy: cada sistema limpia la suya con un envoltorio de `Game.start`
  (`kingteka-domain.js:73`, `chamelin.js:34`, `domain.js:63`, `cirilo-ur.js:97`,
  `cristorata-kit.js:60`…) o en su propio `reset`.
- **Cómo evitarla:** clave nueva en `P.state` → inicializarla en el `reset()` de su
  sistema o en un envoltorio de `Game.start`. Ver [[arquitectura/envoltorios]].
- **Cómo detectarla:** jugar, activar la mecánica, terminar la partida y empezar otra;
  o un test que llame dos veces a `P.Game.start()` y compare `P.state`.
