---
tipo: personaje
id: makanaky
archivos: [tests/makanaky-kit.test.cjs, tests/domain.test.cjs, tests/miniboss-phase.test.cjs, tests/stats.test.cjs]
verificado: 2026-10-31
---
# Makanaky · tests

Todos estos archivos están en el script `test` de `package.json` (corren con `npm test`).

## Propios
- `tests/makanaky-kit.test.cjs` (11 pruebas, `:6-26`): tres técnicas (área, objetivo único, GAA), rango 5 y evolución por técnica, Q de 4 s sin consumir R, carta de Q distribuible, jefe con reducción, animaciones y alturas, señales visuales de racha, Golpe Real y remate.
- `tests/domain.test.cjs` (13 menciones): dominio de Makanaky (carga, golpes, jefes, presentación).

## Que lo cubren de paso
- `tests/miniboss-phase.test.cjs:177-188`: minijefe `makanaky` y jugable con índice 17.
- `tests/stats.test.cjs:44,50,55`: estadísticas, `royalEcho` y filas de pasiva.
- `tests/attributes.test.cjs:6,9`, `tests/character-balance.test.cjs:34`: catálogo y contrato 9/9.
- `tests/evolutions.test.cjs:4,7`, `tests/gacha.test.cjs:35` (UR gratuito), `tests/lobby.test.cjs:117`.
- `tests/cooperative.test.cjs:214`: solicitud de dominio sin mutar en cliente.
- `tests/progressive-combat.test.cjs:11,32`: láminas de ataque y animación de seis cuadros.
- `tests/build.test.cjs:348`: empaquetado del arte del minijefe.
- Otros con 1 mención: `card-gallery`, `cirilo-kit`, `cirilo-ur`, `coop-enemy-parity`, `directional-aim`, `dota-actives`, `dota-equipment`, `lab-equipment`, `meta-progress`.
