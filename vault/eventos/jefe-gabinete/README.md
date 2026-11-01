---
tipo: evento
id: cabinet
archivos: [src/systems/encounters.js, src/systems/cabinet-boss.js, tests/cabinet-boss.test.cjs, tests/boss-projectile-contracts.test.cjs]
verificado: 2026-10-31
---
# El Gabinete Infinito (`kind:'cabinet'`, `cabinetKit:'gabinete'`)

- Definición: `src/systems/encounters.js:41`. Vida 1400, radio 64, velocidad 35. Daño especial (`wit`).
- Mapa propio: `plaza` (portal 420,260). Bioma al vencer: `distrito-gabinete` (`src/scenes/maps.js:13`). En `navidad` lo sustituye el [[eventos/jefe-grinch/README]].
- Invocación: portal; `CabinetBoss.eligible` exige `cabinetKit==='gabinete'` (`src/systems/cabinet-boss.js:14`).

## Rotación (`startAttack`, `cabinet-boss.js:23`)
Cuatro ranuras en ciclo:
1. Abanico: 9 proyectiles, aviso 0,95 s (`encounters.js:6`).
2. Pleno descontrolado (`congress`): 5 proyectiles físicos, aviso 1,2 s (`encounters.js:7`). Test: `tests/boss-projectile-contracts.test.cjs:18`.
3. Proyecto de ley: 3 zonas con costo, 4 s (`startLaw :25`, leyes en `:4-8`). Movilidad / Fuerza / Recuperación. Efecto 9 s (`applyLaw :26`). Sin elegir: el jefe cura 3 % y aplica la 1.ª.
4. Interpelación (3 tipos en ciclo, `startInterpellation :27`): salir de la marca (2,6 s), tocar 3 expedientes en orden (5 s), mantener una zona 1,5 s (4,5 s). Superar: −3 % vida del jefe; fallar: 22 de daño (`finishChallenge :28`).

## Fases por vida
- Cartera (`portfolio :21`): 75 % transporte (empuja al jugador), 50 % salud (cura al jefe si no ocupas el puesto), 25 % interior.
- ≤50 %: Estado de emergencia (`startDomain :30`): 3 decretos, uno de cada recurso (movilidad / defensa / ataque, `:9-13`).
- ≤25 %: Cuestión de confianza (`startUltimate :33`): Confianza (jefe vulnerable ×1,35 durante 9 s) o Censura (anula cartera, jefe cura 8 %).
- Modificadores: `outgoingMultiplier :38` (daño que recibe el jefe), `incomingMultiplier :39`, `speedMultiplier :37`.

## Cooperativo
- Sin lógica propia de coop: usa `P.state.player`, que el servidor fija al objetivo del jefe (`src/systems/progression.js:21`; `backend/simulation.cjs:49`). Las zonas se eligen con ese jugador (`choose :18`). Sin verificar con dos jugadores en la arena.
- Test de portal por mapa (incluye plaza): `tests/cooperative.test.cjs:19`.

## Tests
`tests/cabinet-boss.test.cjs:5,7,9,11`; `tests/boss-projectile-contracts.test.cjs:8,18`.
- Recompensa: la estándar de portal; ver [[eventos/portales-y-encuentros/README]].
