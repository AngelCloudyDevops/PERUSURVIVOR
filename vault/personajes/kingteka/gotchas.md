---
tipo: gotcha
id: kingteka
archivos: [src/data/powers.js, src/systems/kingteka-arsenal.js, src/systems/gacha.js, src/systems/kingteka-domain.js]
verificado: 2026-10-31
---
# Kingteka · trampas

Volver: [[personajes/kingteka/README]] · índice general: [[gotchas/README]]

1. **Dos escopetas.** `P.Data.attacks.shotgun` (0,78 s, alcance 480, 5 perdigones, powerScale 0,6; `src/data/powers.js:61`) solo sirve para la ficha del lobby y para el valor inicial de `p.rate` antes de `Progression.init`. El combate usa `KingtekaArsenal.profiles.shotgun` (0,92 s, 260, 4, 0,62; `src/systems/kingteka-arsenal.js:9`) vía `P.Evolutions.attack` (`src/systems/evolutions.js:28`). Cambiar el primero no altera el combate; la ficha y el combate pueden divergir.
2. **Evolución duplicada.** `P.Evolutions.profiles.kingteka` (`src/systems/evolutions.js:14`) y `KingtekaArsenal.evolutions.shotgun` (`src/systems/kingteka-arsenal.js:14`) describen «Escopeta Contra» con números distintos. Manda el segundo.
3. **R depende de la rareza.** `KingtekaDomain.eligible` exige `Gacha.tier==='ultra'` (`src/systems/kingteka-domain.js:6`). Mover a Kingteka de `ultra` en `src/systems/gacha.js:4` elimina R en solo, en coop y en el HUD sin error visible. La Q no depende de eso.
4. **Q es global.** `P.Ultimate.multiplier` (`src/systems/ultimate.js:8`) multiplica el daño recibido por cualquier rival mientras exista un Kingteka con Q activa (`owner`, `:7`), también el de aliados en coop.
5. **El dominio solo avanza en el servidor en coop.** El cliente no llama `tick` si `P.Coop.active` (`src/systems/kingteka-domain.js:72`); el servidor lo hace en `backend/simulation.cjs:44`. Cualquier estado nuevo del dominio debe ir en el snapshot (`backend/simulation.cjs:63`).
6. **`cerdito` no es un personaje.** Es alias legado de `kingteka` (`src/systems/gacha.js:3`, `src/systems/meta-progress.js:6`) y a la vez `artId` de una skin (`src/systems/character-skins.js:19`). No crear entradas con `id:'cerdito'` en el catálogo.
7. **Orden de wrappers.** `kingteka-domain.js` envuelve `P.Ultimate.activate` (`:77`) y `P.UI.hud` (`:76`); se carga antes que `kingteka-arsenal.js` (`scripts/modules.cjs:354` vs `:361`). Reordenar módulos cambia qué `activate` ve cada wrapper.
8. **Test sin registrar.** `tests/character-variants.test.cjs` no está en `package.json`; ver [[personajes/kingteka/tests]].
