---
tipo: evento
id: holiday
archivos: [src/systems/encounters.js, src/systems/holiday-boss.js, tests/holiday-boss.test.cjs]
verificado: 2026-10-31
---
# El Grinch del Cercado (`kind:'cabinet'`, `holidayKit:'cercado'`)

- Definición: `src/systems/encounters.js:44`. Vida 1450, radio 66, velocidad 38. Daño especial (`wit`).
- Mapa propio: `navidad` (portal 420,220). Sustituye al Gabinete en el sorteo en `navidad` (`encounters.js:47`). Bioma al vencer: `distrito-gabinete` (mismo `kind:'cabinet'`, `src/scenes/maps.js:13`).
- Invocación: portal; `HolidayBoss.eligible` (`src/systems/holiday-boss.js:4`). `bossMove` lo deriva tras Cabinet/Guardian/Procesión (`encounters.js:65`).

## Robos (`start`, `holiday-boss.js:10`, ciclo de 4)
1. Regalos (`gifts :11`): 3 (4 si <50 %) puntos, uno robado; rescatar los demás en 4,5 s.
2. Trineo (`sleigh :12`): 3 carriles, uno sin huellas; 2,4 s.
3. Carbón (`coal :13`): salir de la marca y llegar a la nieve en 3 s.
4. Guirnalda (`lights :14`): tocar luces en orden indicado (3 o 4) en 5 s.

## Pasivas y fases
- Lista negra: cada fallo `failures++` acelera el reloj hasta ×1,45 (`move :20`).
- Espíritu robado: acierto −3 % vida del jefe; fallo +3,5 % de vida al jefe y 22 de daño (`finish :17`).
- ≤50 %: Cercado sin Navidad, 4 esquinas en 7 s (`domain :15`).
- ≤25 %: Noche del gran robo, recordar 3·1·4·2 en 6 s (`ultimate :16`).

## Cooperativo
- Sin lógica de coop propia; usa el jugador objetivo. Primera acción en coop: `holiday-gifts` (`tests/cooperative.test.cjs:19`, rama `navidad`).

## Tests
`tests/holiday-boss.test.cjs:4,5,6,7`.
- Recompensa: la estándar de portal; ver [[eventos/portales-y-encuentros/README]].
