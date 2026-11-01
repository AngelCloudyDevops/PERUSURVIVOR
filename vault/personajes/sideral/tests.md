---
tipo: personaje
id: sideral
archivos: [tests/sideral-kit.test.cjs, tests/sideral-domain.test.cjs, tests/sideral-art.test.cjs, tests/evolutions.test.cjs]
verificado: 2026-10-31
---
# Sideral · tests

Los tres archivos propios y los demás están en el script `test` de `package.json` (corren con `npm test`).

## Propios
- `tests/sideral-kit.test.cjs` (11 pruebas, `:7-27`): catálogo intacto, contrato 9/9 y rareza UR, colazo y onda, huevo (demora, límite de 3), Sangre fría, Q independiente de R, servidor por input, escala de Q y pulsos a 25 y 30 Hz, conversión de proyectiles.
- `tests/sideral-domain.test.cjs` (14 pruebas, `:14-84`): habitación física, choques, cámara, entrada directa, modo dinámico, cierre de 0,95 s, movimiento reducido sin temblor (`:81`), jefes inmóviles, reanimación del compañero.
- `tests/sideral-art.test.cjs` (8 pruebas, `:5-14`): limpieza de celdas, poses de susto, altura constante, seis cartas con WebP válido, Lagarto con ocho poses, marcha al disparar.

## Que lo cubren de paso
- `tests/evolutions.test.cjs:3-4` (cono de miedo, resistencia, evolución), `tests/progressive-combat.test.cjs:28` (cartas por técnica y evolución).
- `tests/gacha.test.cjs:35`, `tests/attributes.test.cjs:6`, `tests/character-balance.test.cjs:34`, `tests/lobby.test.cjs`.
- `tests/cooperative.test.cjs:214` (solicitud de dominio), `tests/cinematic-upgrades.test.cjs:4-8` (XP y HUD durante el dominio), `tests/reduced-motion-feedback.test.cjs:26`.
- `tests/build.test.cjs:120` (seis cartas en el paquete), `tests/friends.test.cjs:24`, `tests/walk-art.test.cjs`, `tests/directional-aim.test.cjs`.
