---
tipo: gotcha
id: G014
archivos: [scripts/modules.cjs, src/systems/chosicano-domain.js, src/systems/court-ultimate.js, src/systems/domain.js, src/scenes/practice.js, src/systems/dota-equipment.js]
verificado: 2026-10-31
---
# G014 · El orden de los envoltorios decide si tu código corre

- **Síntoma:** añades lógica en un envoltorio de `Game.update`, `World.render` o
  `Entities.hurt` y no se ejecuta en ciertos estados (dominio, práctica, tribunal),
  o se ejecuta dos veces.
- **Causa:** `Entities.hurt`, `Game.update`, `Game.start`, `Ultimate.activate`,
  `World.render`, `UI.hud` y `Combat.cast` tienen de 11 a 17 envoltorios. El último
  cargado es el más externo. Algunas capas **no llaman** a la anterior:
  - `src/scenes/practice.js:13`: en práctica, `Game.update` no llama al resto.
  - `src/systems/domain.js:62`: en el dominio de Makanaky sustituye el tick.
  - `src/systems/chosicano-domain.js:27` y `src/systems/court-ultimate.js:44`:
    dibujan su escena sin la base de `World.render`.
  - Varias ultis devuelven sin llamar a la `activate` base.
  - Las capas que filtran el daño (congelados, `moonAirborne`) cortan antes que
    `stat-runtime.js:10` y `dota-equipment.js:67`.
- **Cómo evitarla:** consulta la tabla de [[arquitectura/envoltorios]]. Pon tu archivo en
  `scripts/modules.cjs` donde la capa tenga sentido; si debe correr siempre, ponlo
  después de las capas que cortan.
- **Cómo detectarla:** `grep -rn "P.Game.update=" src` y cruzar con el orden de módulos.
  Probar en solitario, práctica, dominio y cooperativo.
