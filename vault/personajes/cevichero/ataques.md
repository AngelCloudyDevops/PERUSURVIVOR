---
tipo: personaje
id: cevichero
archivos: [src/data/powers.js, src/systems/evolutions.js, src/systems/progression.js]
verificado: 2026-10-31
---
# Cevichero · ataques

Un solo ataque. Ranuras 2 y 3 vacías (`src/data/powers.js:51`).

## 1. Enjambre azul (`roachCast`)
Definición `src/data/powers.js:68`; parche `:92`.
| Campo | Valor efectivo |
|---|---|
| kind | `spread`, 2 proyectiles, separación 0,22 |
| cooldown | 0,62 s |
| range / speed | 680 / 420 |
| zigzag | amplitud 10, frecuencia 12 |
| daño por impacto | 24 × `powerScale` 0,75 = 18 |
- Daño de proyectil: `src/systems/combat.js:22`.
- Con la mejora global «Uno más para el combo» (`projectiles`) suma +1 proyectil (3 en total): `tests/gameplay.test.cjs:150`.

## Evolución · Marea del enjambre
`src/systems/evolutions.js:23`.
- Bumerán de 6 cucarachas en círculo (`radial`), glyph `ROACH`, regresan.
- No figura en la tabla de `damageScale` (`evolutions.js:54`): conserva `powerScale` 0,75 del ataque base.

## Cómo se evoluciona (genérico)
Rango 5 + nivel 8 (`src/systems/progression.js:62`); poder ×1,6, alcance ×1,3, cadencia ×0,85, +2 proyectiles (`progression.js:78`). Ver [[sistemas/evoluciones/README]].
