---
tipo: evento
id: explosive-barrels
archivos: [src/systems/explosive-barrels.js, backend/simulation.cjs, tests/explosive-barrels.test.cjs]
verificado: 2026-10-31
---
# Barriles explosivos (`P.ExplosiveBarrels`)

Barriles de dinamita que se rompen a disparos y dejan fuego. `src/systems/explosive-barrels.js:3`.

## Cadencia
- Primer barril a `mapTime 38` s; luego cada `48-66` s (`nextAt:38`, `interval:[48,66]`, `explosive-barrels.js:4,26`).
- Límite vivos: 3 (2 en ≤760 px) (`cap :9`). Mismas condiciones de pausa que [[eventos/zonas-dinamicas/README]] (`blocked :11`).
- Posición: 280-620 del jugador elegido, sobre terreno libre, a >210 de cualquier jugador, a >170 de otros barriles y lejos de zonas (`safe :12`, `point :13`).
- Corre en Rápida y en Caos.

## Mecánica
- Vida 36, radio 19 (`spawn :14`). Dañan al barril disparos, arcos melé y puntos (`hitShot :18`, `damageArc :20`, `damagePoint :21`).
- Explosión: radio 132 (`blastRadius :4`). Daño: jugadores 8 % de vida máx.; enemigos 45 %, jefes de mapa y final 2,5 %, minijefes 6 % (`detonate :24`).
- Reacción en cadena: otros barriles a <170 detonan 0,28 s después (`:24`).
- Fuego: radio 72, dura 4 s, pulsos de 0,5 s: jugadores 0,4 % por pulso, enemigos 1,5 % (0,4 % a jefes/minijefes) (`burn :25`, `fireDuration :4`). El fuego solapado no acumula (`seen`).
- Un jugador solo puede morir por barril si es el único vivo (`hurtPlayer :22`).

## Cooperativo
- Servidor autoritativo: `ExplosiveBarrels.tick` en `backend/simulation.cjs:38`; snapshot `dynamicBarrels`, `barrelFires`, `barrelBlasts` (`simulation.cjs:63`).
- Tests: `tests/explosive-barrels.test.cjs:10,16,22,28`.
