---
tipo: evento
id: stone
archivos: [src/systems/encounters.js, src/systems/guardian-boss.js, tests/guardian-boss.test.cjs, tests/boss-projectile-contracts.test.cjs]
verificado: 2026-10-31
---
# El Guardián de la Niebla (`kind:'stone'`, `guardianKit:'niebla'`)

- Definición: `src/systems/encounters.js:42`. Vida 1500, radio 70, velocidad 40. Daño especial (`technique`).
- Mapa propio: `machu` (portal 300,180). Bioma al vencer: `santuario-niebla` (`src/scenes/maps.js:14`). En `halloween` lo sustituye la [[eventos/jefe-procesion/README]] (mismo `kind`).
- Invocación: portal; `GuardianBoss.eligible` exige `kind==='stone'` y `guardianKit==='niebla'` (`src/systems/guardian-boss.js:4`).

## Patrón (`start`, `guardian-boss.js:9`, 4 ranuras en ciclo)
1. Anillo radial: 12 proyectiles, aviso 1 s (`encounters.js:7-9` `stone`).
2. Refugios (`refuges :10`): 3 círculos, uno verdadero; 3 s. Acierto: −2,5 % vida del jefe; fallo: 22 de daño (`resolve :16`).
3. Terrazas (`terraces :11`): 4 bandas, una segura; 2,5 s.
4. Eco del camino (`echo :12`): graba tu ruta 1,5 s y la repite 2 s; tocarla 7 de daño (`tickSpecial :17`).

## Pasivas y fases
- Velo quebrado: el jefe recibe ×0,65 si estás a más de 270 de él (`outgoingMultiplier :19`; se aplica en `src/data/attributes.js:15`).
- Memoria de piedra: 3,5 s en el mismo cuadrante marca el suelo; 16 de daño tras 0,8 s (`memory :15`).
- ≤50 %: Ciudad Perdida, 3 hitos en 7 s; fallo cura 6 % (`domain :13`, `tickSpecial :17`).
- ≤25 % (tras la expansión): Juicio del Apu, hallar el eco verdadero entre 3 en 4 s (`ultimate :14`).
- Orden de disparo: `move :18`.

## Cooperativo
- Sin lógica de coop propia: usa `P.state.player` (objetivo del jefe, `src/systems/progression.js:21`). `memory` y las pruebas miden solo a ese jugador. Sin verificar con dos jugadores.
- Portal coop en `machu`: `tests/cooperative.test.cjs:19`.

## Tests
`tests/guardian-boss.test.cjs:5,7,9,11`; `tests/boss-projectile-contracts.test.cjs:8`.
- Recompensa: la estándar de portal; ver [[eventos/portales-y-encuentros/README]].
