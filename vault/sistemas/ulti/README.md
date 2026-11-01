---
tipo: sistema
id: ulti
archivos: [src/systems/ultimate.js, src/systems/animal-ultimates.js, src/systems/court-ultimate.js, src/systems/dragon-ultimate.js, src/systems/makanaky-ultimate.js, src/systems/ability-cards.js]
verificado: 2026-10-31
---
# Ultis (tecla Q)

Una habilidad máxima por personaje, cargada con muertes. Cada ulti reutiliza el mismo punto de entrada y lo envuelve. Dominios (tecla R): [[sistemas/dominios/README]]. Tarjetas HUD: [[sistemas/progresion-cartas/README]]. Personajes: [[personajes/kingteka/README]], [[personajes/cuy/README]], [[personajes/paloma/README]], [[personajes/alberto/README]], [[personajes/cristorata/README]], [[personajes/makanaky/README]], [[personajes/chamelin/README]], [[personajes/cirilo/README]], [[personajes/sideral/README]], [[personajes/marciano/README]].

## Base (`P.Ultimate`, `src/systems/ultimate.js:2`)
- La base es la ulti de **Kingteka** (Gallinazos): `activate()` `:13` exige `player.id==='kingteka'`, carga 100, dura 8 s. Convierte minions normales en gallinazos (`flockStep` `:11`), `multiplier(e)` x2 normales / x1,2 jefes (`:8`).
- `reset()` `:3` crea `P.state.ultimate = {charge, domainCharge, left, paper, age, particles, trails, ...}`.
- `gain()` `:12` suma 5 de carga por muerte (solo si no está activa). `tick(dt)` `:14`, `hud()` `:26`, `draw` `:28`.
- Botón `#ultimate` y tecla Q: `init()` `:25`. Q corta activa al soltar (`keyup`, si la carga >= 100); Q mantenida 180 ms muestra la carta sin activar. Click del botón llama `this.activate()`.

## Ultis por personaje (cada una envuelve `P.Ultimate.activate/gain/tick/hud`)
- Kingteka: Gallinazos, `ultimate.js`.
- Cuy y Paloma: `P.AnimalUltimate`, `defs` (estampida 5 s, bandada 6 s), `src/systems/animal-ultimates.js:3-5`; envuelve `Ultimate` en `:24-26`.
- Alberto: Tribunal del Pueblo, `P.Court` (`src/systems/court-ultimate.js:3`; envoltorios `:39-41`).
- Cristorata: dragón (Jade/Brasa/Trueno + secreto 5 %), `P.DragonUltimate` (`dragon-ultimate.js:3-5`, envoltorios `:36-38`).
- Makanaky: «Los Tres de la Realeza», 4 s, Q independiente del dominio (`makanaky-ultimate.js:3-5`, `:28-31`).
- Chamelin «¡SE TAPÓ TODO!» (`chamelin-kit.js:62-66`), Cirilo «¡FULL MALDAD!» (`cirilo-kit.js:63-67`), Sideral «Despertar del Lagarto» (`sideral-kit.js:91-93`), Marciano «Intervenidos» (`marciano-kit.js:76-78`).
- Tarjetas: `P.AbilityCards.entries` con `kind:'ultimate'` (`src/systems/ability-cards.js:12-23` y kits).
- Combo de equipo `P.CausaCombo` envuelve `reset/gain/tick/activate/hud` (`src/systems/causa-combo.js:19-24`).

## API común
- `P.Ultimate.activate()`, `gain()`, `tick(dt)`, `hud()`, `reset()`, `active()`, `shake()` (`ultimate.js:19`).
- Cada ulti: `eligible(p)` o `definition(p)`, `activate()`, estado en `s.ultimate`.

## Estado y reinicio
- `P.state.ultimate` (por jugador en coop: `p.ultimate`); `P.Ultimate.reset()` se llama en `P.Game.start` y en `backend/simulation.cjs:20` por jugador.
- `u.charge`, `u.left` (tiempo restante), `u.domainCharge` (compartido con el dominio).

## Envoltorios
- `P.Ultimate.activate` está envuelta ~16 veces: rendering/ultimate-comic:30, animal-ultimates:24, causa-combo:22, chamelin-kit:63, chamelin:30, cirilo-kit:64, cirilo-ur:93, court-ultimate:39, cristorata-kit:54, domain:59, dragon-ultimate:36, kingteka-domain:77, makanaky-ultimate:28, marciano-kit:77, sideral-domain:65, sideral-kit:92. El orden de módulos decide quién responde primero.

## Cooperativo
- El cliente envía `ultimate:true` en `input` (`src/network/cooperative.js:87`); el servidor activa con el jugador activo (`Simulation.use(p)` copia `p.ultimate` a `s.ultimate`, `backend/simulation.cjs:26-27`) y `P.Coop.canAct()`.
- Las ultis con escena (Tribunal, dragón) mantienen estado autoritativo por jugador (`P.Court.players()`); el arte nunca elige objetivos ni daña.

## Tests
- `tests/animal-ultimates.test.cjs`, `court-ultimate.test.cjs`, `dragon-ultimate.test.cjs`, `makanaky-kit.test.cjs`, `chamelin-kit.test.cjs`, `cirilo-kit.test.cjs`, `sideral-kit.test.cjs`, `marciano-kit.test.cjs`, `causa-combo.test.cjs`, `ultimate-comic.test.cjs`, `vulture-ultimate.test.cjs` (en `package.json`).

## Qué no romper
- Una ulti nueva debe llamar al `activate` anterior si no es suya; si no, rompe a los demás personajes.
- Solo `kingteka` activa la base (`ultimate.js:13`).
- `Progression.blocksUpgrade` retrasa subidas de nivel mientras corre una escena de ulti (`progression.js:85`).
- `P.Ultimate.multiplier(e)` entra en `Entities.hurt` (`actors.js:22`): afecta a todo el daño.
