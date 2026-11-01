---
tipo: evento
id: fujimori
archivos: [src/systems/fujimori-boss.js, src/systems/fujimori-contract.js, src/systems/fujimori-archives.js, src/rendering/fujimori-boss-art.js, tests/fujimori-contract.test.cjs]
verificado: 2026-10-31
---
# Alberto Fujimori · El Expediente Final (`kind:'fujimori'`)

- Definición: `P.FujimoriBoss.definition`, `src/systems/fujimori-boss.js:4`. Vida 1600, radio 43, velocidad 48. Daño especial (`wit`).
- Sin mapa propio: 5.º elemento de `portalPool` (`src/systems/encounters.js:47`). Bioma al vencer: `archivo-final` (`src/scenes/maps.js:16`).
- Invocación: portal; espera `FujimoriBossArt.load` (`encounters.js:56`). El movimiento se engancha en `fujimori-boss.js:27`.

## Ataques base (`fujimori-boss.js:6-15`, ciclo `['archives','papers','stamp']`)
- Papeles (`papers`): 5 abanico (7 en furia), paso .21, velocidad 190, daño 12 (`paperPlan :5`, `fire :13-15`).
- Sello (`stamp`): zona en la posición del jugador, radio 85 (105 en furia), daño 18 (`fire :13`).
- Archivos (`archives`): 3 archivadores caen en línea (vertical en furia), 1,1 s de aviso; sólidos, 7 s de vida, daño 16 al caer (`fujimori-archives.js:5-6`).
- Furia al ≤50 %: más papeles, sello mayor, ciclos más cortos (`fujimori-boss.js:6,9`).

## Contrato (`src/systems/fujimori-contract.js`, envuelve `move` en `:16`)
- Cadena de custodia: cada 4.º ataque, 1,35 s de aviso; golpea 18 si estás en la marca y sin cobertura. Acierto del jefe: `caseStacks+1` (máx. 4); cadena rota: −1 (`chain :6`, `resolveChain :7`).
- Caso reabierto: cada stack acorta la recuperación hasta 32 % (`recover :5`).
- ≤50 %: Archivo de la Nación: 4 expedientes, rescatar los 2 públicos en 6 s; tocar uno reservado falla (`domain :8`, `tickDomain :11`).
- ≤25 % (tras la expansión): Sentencia final: 3 rondas de 1,5 s, hay que estar detrás de cobertura en cada una (`ultimate :9`, `tickUltimate :12`).
- Acierto de prueba: −4 % de vida del jefe; fallo: 20 de daño y +1 stack (`finish :10`).

## Cooperativo
- Sin lógica de coop propia (usa el jugador objetivo, `src/systems/progression.js:21`). Sin verificar con dos jugadores.
- Portal coop con Fujimori: `tests/boss-charge-ranges.test.cjs:53`.

## Tests
`tests/fujimori-contract.test.cjs:3,4,5,6`; `tests/boss-projectile-contracts.test.cjs:33`.
- Recompensa: la estándar de portal; ver [[eventos/portales-y-encuentros/README]].
