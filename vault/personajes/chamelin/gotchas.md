---
tipo: gotcha
id: chamelin
archivos: [src/systems/chamelin-kit.js, src/systems/chamelin.js, src/data/powers.js, src/systems/character-skins.js]
verificado: 2026-10-31
---
# Chamelín · trampas

- **Dos sistemas de charcos.** Los de la técnica 1 viven en `P.state.trovoPools` (global, máximo 48, `chamelin.js:12`). Los de Pichi viven en `p.chamelinPools` (por jugador, máximo 24, `chamelin-kit.js:35`). Cada uno tiene su propio daño, pulso y limpieza.
- **El nombre mostrado no es el de `powers.js`.** `Chamelín Trovo` (`powers.js:106`) se reescribe como `Chamelín · Trovo` por `P.CharacterSkins.init` (`character-skins.js:15,21`).
- **`damageScale` solo se muestra en la ficha de Chamelín.** `P.CharacterProfiles.base` multiplica por `damageScale` únicamente si `c.id==='chamelin'` (`powers.js:55`); el combate sí lo aplica a todos (`combat.js:22`).
- **Dentro del Baño de Trovo el kit se apaga.** El arma se fuerza a `trovoShot` (`chamelin-kit.js:12`), la cadencia se reescribe y se restaura en `P.Chamelin.end` (`chamelin-kit.js:64-65`). Sin esa restauración la cadencia queda mal tras el dominio.
- **La presión solo carga con fuentes marcadas.** Hace falta `source.trovo===true` o `source.trovoPool` (`chamelin-kit.js:61`). Un daño nuevo sin esa marca no suma.
- **Dos `eligible` distintos.** `P.Chamelin.eligible` no excluye minijefes (`chamelin.js:5`); `P.ChamelinKit.eligible` sí (`chamelin-kit.js:19`).
- **Dos cargas.** Q usa `chamelinCharge`, R usa `ultimate.charge` (`chamelin.js:31`, `chamelin-kit.js:41`). El cooperativo lee `charge` para R (`src/network/cooperative.js:17`).
- Ver [[gotchas/README]].
