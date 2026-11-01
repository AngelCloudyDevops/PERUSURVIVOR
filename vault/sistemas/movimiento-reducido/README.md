---
tipo: sistema
id: movimiento-reducido
archivos: [src/rendering/ambient.js, src/ui/reference-menus.js, tests/reduced-motion-feedback.test.cjs]
verificado: 2026-10-31
---
# Movimiento reducido (`P.Motion`)

Preferencia de accesibilidad que atenúa sacudidas, parpadeos y animaciones. Consumidores: [[sistemas/juice/README]], [[sistemas/hurtfx/README]], [[sistemas/evoluciones/README]], [[sistemas/mapas/README]].

## Fuente de verdad (`src/rendering/ambient.js:3`)
- `P.Motion.reduced()` es verdadero si coincide `matchMedia('(prefers-reduced-motion: reduce)')`, **o** `document.body` tiene la clase `ref-reduced-motion`; sin documento, lee `localStorage['perusurvivor-option-reduced-motion']==='true'`.
- `P.Ambient.reduced` es un objeto con getter `matches` que llama a `P.Motion.reduced()` (`ambient.js:5`). Dos formas válidas de consultarlo: `P.Motion.reduced()` y `P.Ambient.reduced.matches`.
- Opción del jugador: clave `reduced-motion` en `restoreOptions` (`src/ui/reference-menus.js:127`), que aplica la clase al cuerpo.
- `P.Ambient.clock()` devuelve 0 si está reducido (`ambient.js:7`): detiene animaciones ambientales.

## Quién lo respeta (muestra)
- `src/rendering/juice.js:6,12,19`, `hurt-vignette.js:8`, `player-feedback.js:10`, `src/systems/evolutions.js:38`, `gacha.js:52` (salta la animación de tirada), y además domain-art, domain-finale, chamelin-art, chosicano-art, portal-fx, ultimate-comic, dragon-art, fujimori-boss-art, walk-art, ultimate.js, kingteka-domain, sideral-domain, cirilo-ur, court-ultimate, minion-evolution. Lista exacta: `grep -rn "Motion" src`.
- Patrón: `reduced=!!(P.Motion?P.Motion.reduced():globalThis.matchMedia?.('(prefers-reduced-motion: reduce)').matches)`. El `P.Motion?` permite cargar módulos aislados en tests.

## Estado y reinicio
- Sin estado en `P.state`. Se lee al vuelo cada frame; el cambio aplica en caliente.

## Envoltorios
- Ninguno. CSS: `@media(prefers-reduced-motion:reduce)` en `src/ui/styles.css` (p. ej. `.loot-reveal`, línea 22).

## Cooperativo
- Preferencia local de cada cliente; el servidor no la usa (no dibuja, `P.Combat.server`).

## Tests
- `tests/reduced-motion-feedback.test.cjs` (los orígenes de la preferencia), `juice.test.cjs`, `walk-art.test.cjs`, `domain-camera.test.cjs` (en `package.json`).

## Qué no romper
- No usar solo `matchMedia`: ignoraría la opción del juego. Usar `P.Motion.reduced()`.
- No cachear el booleano: debe poder cambiar en caliente.
- Todo efecto nuevo (shake, parpadeo, zoom) necesita rama reducida y un caso en `reduced-motion-feedback.test.cjs`.
