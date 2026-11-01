---
tipo: evento
id: combi
archivos: [src/systems/encounters.js, src/systems/chosicano-combat.js, src/systems/chosicano-domain.js, src/rendering/chosicano-art.js, src/rendering/chosicano-road.js, tests/chosicano.test.cjs]
verificado: 2026-10-31
---
# El Chosicano · Última Parada (`kind:'combi'`)

- Definición: `src/systems/encounters.js:40` (`catalog.campo`). Vida 1250, radio 74, velocidad 48. Daño físico (`force`). Test de cifras: `tests/chosicano.test.cjs:4`.
- Mapa propio: `campo` (portal 440,180). Bioma al vencer: `ruta-chosicano` (`src/scenes/maps.js:12`). Puede salir en cualquier mapa público (sorteo, ver [[eventos/portales-y-encuentros/README]]).
- Invocación: cruzar el portal; espera `P.ChosicanoArt.load` (`encounters.js:56`).

## Ataques (`src/systems/chosicano-combat.js`)
- Ciclo `['checkpoint','charge','horn','tickets']` por `attackT` (`chosicano-combat.js:24`).
  - Control de paradero (`checkpoint`): 3 marcas fijas, aviso 1,3 s, impacto 16 (`:15-16`).
  - Embestida (`charge`): velocidad 530 (`:3`), recorrido avisado igual al real (`chargePath :4`). Choca con cobertura: frena y queda 1,1 s expuesto (`brake :17`).
  - Bocinazo (`horn`): onda en arco 0,55π, radio 245, daño 14 (`fireHorn :13`).
  - Boletos (`tickets`): 5 proyectiles, daño 11 (`fireTickets :11`).
- Ulti «Hora punta» al ≤25 % de vida, una vez: bocinazo + boletos + embestida (`:19`).
- Derrota: 3 s de animación, limpia peligros y llama `P.Encounters.win` (`defeatTick :8`).

## Expansión: Persecución lateral (`src/systems/chosicano-domain.js`)
- Se inicia al ≤50 % de vida, una vez (`tryStart`, `chosicano-domain.js:10`). Escena de carrera: entrada 4,8 s, 3 pasadas de 5 s, salida 1,2 s (`:3`).
- Obstáculos: conos (salto), carteles (deslizar), barreras (salto alto) (`:4`). Fallo: daño 18, tropiezo 0,65 s (`tick`, `:13-28`). Salto con Espacio, deslizar con flecha abajo (`:8`).
- Bloquea ulti/dominio de personajes mientras dura (`:30`).

## Cooperativo
- Soportado: el servidor llama `ChosicanoDomain.tryStart()` y `tick(dt,inputs)` por jugador (`backend/simulation.cjs:34`). Cada corredor tiene su estado (`runnerX`, `:6`).
- No se puede forzar en coop ni fuera de desarrollo (`tryStart(force)`, `:10`). Test: `tests/chosicano.test.cjs:33,39`.
- Portal coop: `tests/cooperative.test.cjs:19`.

## Tests
`tests/chosicano.test.cjs` (líneas 4-41: frenazo, bocinazo, boletos, paradero, hora punta, derrota, persecución). `tests/boss-charge-ranges.test.cjs:26`.
- Recompensa: la estándar de portal; ver [[eventos/portales-y-encuentros/README]].
