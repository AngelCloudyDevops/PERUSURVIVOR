---
tipo: personaje
id: g5
archivos: [src/data/powers.js, src/systems/evolutions.js, src/systems/combat.js, src/systems/progression.js]
verificado: 2026-10-31
---
# La G5 · ataques

Un solo ataque. Ranuras 2 y 3 vacías (`src/data/powers.js:51`).

## 1. Patada G5 · 145° (`g5Kick`)
Definición `src/data/powers.js:69`; parche de cadencia `:103`.
| Campo | Valor efectivo |
|---|---|
| kind | `melee`, arco 145° (2,53 rad) |
| range | 118 |
| cooldown | 0,68 s (era 0,62) |
| push | 32 |
| daño | `power` 36 × 1 = 36, a todos los del arco |
- Golpe melee: `src/systems/combat.js:30` (usa `damageScale`, ignora `powerScale`).
- Sin objetivo dentro del alcance el ataque no se lanza (`tests/gameplay.test.cjs:142`).
- «Uno más para el combo» sube el poder ×1,12 en lugar de dar proyectil (`powers.js:79`; `tests/gameplay.test.cjs:151`).

## Evolución · Huracán G5
`src/systems/evolutions.js:24`; escala en `:54`.
- Rango 155, arco 145°, empuje 55, `damageScale` **0,58**.
- Extra `kicks`: dos barridos laterales a ±0,95 rad, radio 90, 0,5× daño (`evolutions.js:33`).

## Cómo se evoluciona (genérico)
Rango 5 + nivel 8 (`src/systems/progression.js:62`); poder ×1,6, alcance ×1,3, cadencia ×0,85 (`progression.js:78`). Ver [[sistemas/evoluciones/README]].
