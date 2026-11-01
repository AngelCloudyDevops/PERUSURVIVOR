---
tipo: evento
id: procession
archivos: [src/systems/encounters.js, src/systems/procession-boss.js, tests/procession-boss.test.cjs]
verificado: 2026-10-31
---
# La Procesión de Medianoche (`kind:'stone'`, `processionKit:'medianoche'`)

- Definición: `src/systems/encounters.js:43`. Vida 1450, radio 70, velocidad 42. Daño especial (`wit`).
- Mapa propio: `halloween` (portal 420,180). Sustituye al Guardián en el sorteo cuando se juega `halloween` (`encounters.js:47`). Bioma al vencer: `santuario-niebla` (mismo `kind:'stone'`, `src/scenes/maps.js:14`).
- Invocación: portal; `ProcessionBoss.eligible` (`src/systems/procession-boss.js:4`).

## Ritos (`start`, `procession-boss.js:8`, ciclo de 4)
1. Campanas invertidas (`bells :9`): pulsos cada 0,75 s alternando cerca (<155) y lejos (>155); 9 de daño por pulso fallado (`tick :16`). Al terminar lanza el anillo de 12 proyectiles (`finish :15`).
2. Faroles del duelo (`lanterns :10`): encender 3 en 4,5 s.
3. Paso de ánimas (`lanes :11`): 3 carriles, uno seguro, 2,5 s.
4. Ofrenda marcada (`offering :12`): salir del círculo de 95 en 2 s.

## Pasivas y fases
- Deuda de vela: sin llama activa el jefe recibe ×0,7 (`outgoingMultiplier :18`). Acierto da llama 7 s y −2,5 % de vida del jefe; fallo: 22 de daño y `failures++` (`finish :15`).
- Cortejo interminable: cada fallo acelera el reloj de ataque hasta ×1,4 (`move :17`).
- ≤50 %: Plaza sin amanecer, 3 altares en 7 s; fallo cura 6 % (`domain :13`).
- ≤25 %: Último responso, repetir secuencia de 3 en 6 s (`ultimate :14`).

## Cooperativo
- Sin lógica de coop propia; usa el jugador objetivo (`src/systems/progression.js:21`). Sin verificar con dos jugadores.
- Portal coop en `halloween`: `tests/cooperative.test.cjs:19`.

## Tests
`tests/procession-boss.test.cjs:4,5,6,7`.
- Recompensa: la estándar de portal; ver [[eventos/portales-y-encuentros/README]].
