---
tipo: sistema
id: juice
archivos: [src/rendering/juice.js, src/rendering/world.js, tests/juice.test.cjs]
verificado: 2026-10-31
---
# Juice (`P.Juice`)

Sacudida de pantalla por modelo de trauma y destello de derrota de jefe. Solo visual. Vocabulario de la skill `game-feel`. Hermanos: [[sistemas/hurtfx/README]], [[sistemas/movimiento-reducido/README]].

## Qué hace
- Trauma 0..1: `add(amount)` suma y recorta a 1 (`src/rendering/juice.js:7`). Decae `decay:1.3`/s en `step` (`:8`).
- Desplazamiento = ruido suave de senos x `trauma^2` x `max:14` px x `scale` (`noise` `:10`, `own` `:12`). Sin ruido aleatorio.
- `offset(zoom,extra,now)` `:14` suma fuentes extra, recorta el total a `clampTotal:18` px y divide por el zoom.
- `observe()` `:17` detecta, desde el estado de render, la muerte de `mapBoss`, `miniboss` o `boss` (una vez por actor, `seen` Map) y llama `defeat` `:18` (trauma .8 jefes, .45 miniboss, 30 chispas, destello blanco).
- `overlay(ctx,w,h)` `:19` dibuja el destello (pico .32 jefe, .18 miniboss).
- Reloj en tiempo real (`performance.now`), no el `dt` de simulación: funciona igual en solo, anfitrión y cliente coop.

## API pública
- `P.Juice.add`, `offset`, `observe`, `defeat`, `overlay`, `reset`, `reduced()` (`:6`), `own`.
- Único consumidor de `offset`: `P.World.render` (`src/rendering/world.js:33`) con extras `P.Ultimate.shake()`, `P.FujimoriBoss.stampShake()` y `P.VultureMoon.impactShake()`.

## Estado y reinicio
- `trauma`, `clock`, `phase`, `seen`, `flash` viven en el propio objeto (no en `P.state`). `reset()` `:20` existe, pero ningún otro archivo de `src/` lo llama; `seen` se limpia solo cuando los actores salen de la lista.

## Envoltorios
- `P.World.render` envuelto al final de `juice.js` (`:22`) para `observe()` y `overlay()`, dentro de `try/catch`. Otros envoltorios de `World.render` (portal-fx, hurt-vignette, ultimate-comic...): el orden de carga decide el apilado.

## Cooperativo
- `observe()` sale si `P.Combat.server` (la VM del servidor no dibuja). En cliente coop usa el mismo código de render.

## Tests
- `tests/juice.test.cjs` (en `package.json`): trauma acotado, 0 con movimiento reducido, suma de fuentes, derrota única, decaimiento de ulti.

## Vocabulario game-feel aplicado
- Hay: shake por trauma, flash de derrota, partículas. No hay hit-stop ni squash/stretch global en este módulo (grep de `hitstop` sin resultados en `src/`).
- Regla de la skill: juice transitorio y proporcional a la importancia (miniboss .45 < jefe .8).

## Qué no romper
- Nunca tocar la simulación desde `Juice` (solo `P.state.effects` y canvas).
- El total siempre pasa por `offset`; no sumar shakes a mano en `world.js`.
- Con movimiento reducido: `own()` devuelve 0 (`:12`) y el destello se atenúa (`:19`).
