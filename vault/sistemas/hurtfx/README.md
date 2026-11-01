---
tipo: sistema
id: hurtfx
archivos: [src/rendering/hurt-vignette.js, src/rendering/player-feedback.js, src/rendering/player-reaction-art.js, tests/player-feedback.test.cjs]
verificado: 2026-10-31
---
# Retroalimentación de daño al jugador (`P.HurtFx`, `P.PlayerFeedback`)

Viñeta roja y sonido al perder vida, más la pose corporal de golpe y muerte. Vocabulario `game-feel`: capas de feedback proporcionales. Ver [[sistemas/juice/README]], [[sistemas/movimiento-reducido/README]], [[sistemas/combate/README]].

## `P.HurtFx` (`src/rendering/hurt-vignette.js:3`)
- Detecta la pérdida de vida **en el render** (`observe(p)`, `:7`): compara `p.hp` con `last`; si cae, llama `hurt(amount,max)` `:6`. Así solo y coop se comportan igual (el cliente no ejecuta el camino de golpe).
- `hurt` fija `power = clamp(amount/max*3, .25, 1)` y reproduce `P.Audio.fx('hurt')`.
- `draw(ctx,w,h)` `:8`: gradiente radial rojo de 0,3 s (`duration`), decaimiento cuadrático; con movimiento reducido dura .45 s y alfa lineal.
- Se engancha envolviendo `P.World.render` (`:10`) en `try/catch`.

## `P.PlayerFeedback` (`src/rendering/player-feedback.js:3`)
- `hit(p,amount,source)` `:6` es el camino de daño al jugador: aplica `P.Attributes.incoming`, `P.Loot.damage`, registra `Minibosses.recordDamage`, fija `p.hurtAt/hurtDX/hurtDY`, `p.inv=.7` (invulnerabilidad) y llama `P.DotaItems.hit`. Muerte: `p.deadAt`.
- `pose(p)` `:9`: pose de golpe (`hitDuration:.26`) y de muerte (`deathDuration:.95`); con `P.Ambient.reduced` se reduce a inclinación y desplazamiento mínimos.
- `finish(action)` `:7` y `tick(dt)` `:8` retrasan la pantalla final hasta acabar la animación de muerte. `reset()` `:5`.
- Cosmético: «sin cortes de miembros, cambios de colisión ni daño retrasado» (`:2`).

## Estado y reinicio
- `HurtFx`: `start`, `power`, `last`, `who` (por `p.slot` o `'solo'`; si cambia el jugador se reinicia `last`). `PlayerFeedback`: `pending`, `endAge`; `reset()` al iniciar partida.

## Envoltorios de `P.PlayerFeedback.hit`
- `src/rendering/animal-entry.js:9`, `src/systems/animal-ultimates.js:28`, `chamelin-arena.js:22`, `chamelin-kit.js:71`, `dota-equipment.js:72` (cuenta el daño recibido).

## Cooperativo
- El cliente coop ve `hp` por snapshots, por eso la detección va en render y no en `hit`. Cada snapshot puede crear objetos jugador nuevos; `who` + `last` evitan falsos golpes (commit `2251f59`, «detectar el daño local aunque cada snapshot cree un jugador nuevo»).

## Tests
- `tests/player-feedback.test.cjs`, `reduced-motion-feedback.test.cjs`, `combat-feedback.test.cjs` (en `package.json`).

## Qué no romper
- No mover la detección a `PlayerFeedback.hit`: el cliente coop no la ejecuta.
- Respetar `P.Motion.reduced()`: la viñeta nunca parpadea rápido.
- Todo daño al jugador debe pasar por `PlayerFeedback.hit` (mitigación Dota, atributos, invulnerabilidad).
