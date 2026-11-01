---
tipo: personaje
id: marciano
archivos: [src/systems/marciano-kit.js, src/data/powers.js, src/systems/evolutions.js, src/systems/combat.js]
verificado: 2026-10-31
---
# Marciano · ataques

`P.MarcianoArsenal` (`src/systems/marciano-kit.js:3`). Teclas 1/2/3 con un listener propio (`marciano-kit.js:65`); **no** pasa por `src/core/runtime.js:24`. Cambio con 0,3 s de enfriamiento (`marciano-kit.js:21`).

| # | Técnica | Tipo | cd (s) | alcance | daño (rango 1) | Efecto | Línea |
|---|---|---|---|---|---|---|---|
| 1 | Polvito cósmico (`cosmicDust`) | especial, 3 motas, abanico 0,2 | 0,88 | 590 (vel. 500) | 23 × 0,72 = 16,56 por mota | — | `powers.js:70`; `marciano-kit.js:7` |
| 2 | Caja decomisada (`confiscatedBox`) | físico, bumerán, perfora 2 | 1,35 | 430 (vel. 390) | 23 × 1,15 = 26,45 | rebota hacia el Marciano | `marciano-kit.js:8` |
| 3 | Reflector del operativo (`policeSpotlight`) | especial, cono 1,12 rad | 1,55 | 285 | 23 × 0,82 = 18,86 | ralentiza 30 % durante 2,2 s; rompe el chaleco 2,5 s | `marciano-kit.js:9,74` |
- Daño de proyectil: `power × powerScale × damageScale` (`src/systems/combat.js:22`); el cono usa solo `damageScale` (`combat.js:30`).
- La ralentización real es el factor 0,7 de `P.DomainAftermath.slow` (`marciano-kit.js:83`); el campo `slow:.82` del perfil del reflector no lo usa ese código.

## Evoluciones (`marciano-kit.js:11-15`)
- Nube fosforescente (polvo): 5 motas, abanico 0,16, perforan 2, dejan una nube de 4 s junto al objetivo. Hereda `P.Evolutions.profiles.marciano` (`evolutions.js:25`, `extra:'cloud'` en `evolutions.js:35`).
- Carga a la comisaría (caja): 2 cajas, perforan 4, ×1,35 (31,05), alcance 485.
- Toque de queda (reflector): alcance 350, arco 1,5, ×1,02 (23,46), ralentización 3,2 s, chaleco roto 4 s.
- Menú de evolución propio en `marciano-kit.js:87`.

## Progresión de cada técnica
- Desbloqueo: Caja en nivel 2, Reflector en nivel 4 (`marciano-kit.js:22`).
- Rangos 2 a 5 en niveles 6, 8, 10, 12 (`gates`, `marciano-kit.js:4`). Cada rango: +14 % daño, +5 % alcance, cadencia ×0,96 (`marciano-kit.js:18`).
- Evolución: rango 5 y nivel 14 por técnica (`marciano-kit.js:22`). El polvo también evoluciona con `p.evolved.primary` (`marciano-kit.js:18`).
- Las cartas genéricas `primary` y `evolve:primary` se filtran para el Marciano y se rellenan con «Respiro del causa» (+25 % de vida) (`marciano-kit.js:82`).
- La pasiva añade una «intervención» tras tres actas: ver [[personajes/marciano/poderes]].
- Ver [[sistemas/combate/README]] y [[sistemas/evoluciones/README]].
