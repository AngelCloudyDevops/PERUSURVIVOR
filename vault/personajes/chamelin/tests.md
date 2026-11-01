---
tipo: personaje
id: chamelin
archivos: [tests/chamelin-kit.test.cjs, tests/chamelin.test.cjs, tests/character-balance.test.cjs, tests/walk-art.test.cjs]
verificado: 2026-10-31
---
# Chamelín · tests

Todos están en el script `test` de `package.json` (corren con `npm test`).

## Propios
- `tests/chamelin-kit.test.cjs` (15 pruebas, `:7-21`): kit 9/9, Pegote 10 % y Pichi 15 % exactos, probabilidades no se multiplican, charcos acotados, Presión (una carga por segundo), Q de tres ondas, Q y R no se consumen entre sí, cooperativo por input, muerte limpia.
- `tests/chamelin.test.cjs` (24 pruebas, `:5-36`): catálogo, charco único, Baño (−20 % defensa, ralentización 25 %), mordida ×3 y ×1,9, modo dinámico, cooperativo, paredes, fluidez, movimiento reducido (`:21,31`), balance de Trovo (impacto 15 %, charco 30 %/s) y charcos (ocho pulsos en cuatro segundos).

## Que lo cubren de paso
- `tests/character-balance.test.cjs:9,12,19,28`: overrides de admin sobre hp, poder y velocidad de `chamelin`.
- `tests/walk-art.test.cjs:7`: existencia de `chamelin-v1.webp`.
- `tests/cooperative.test.cjs:214`, `tests/evolutions.test.cjs:4`, `tests/cinematic-upgrades.test.cjs:5`, `tests/progressive-combat.test.cjs:11`, `tests/directional-aim.test.cjs:5`, `tests/lab-equipment.test.cjs:12`, `tests/lobby.test.cjs`, `tests/build.test.cjs:60`, `tests/cristorata-kit.test.cjs`, `tests/cirilo-ur.test.cjs`.
