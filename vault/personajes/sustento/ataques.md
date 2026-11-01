---
tipo: personaje
id: sustento
archivos: [src/data/powers.js, src/systems/evolutions.js, src/systems/progression.js]
verificado: 2026-10-31
---
# Sustento · ataques

Un solo ataque (`P.CharacterProfiles.weaponSlots` crea un slot desde `c.attack`, `src/data/powers.js:51`). Ranuras 2 y 3 vacías.

## 1. Rifle de cucarachas (`roachRifle`)
Definición `src/data/powers.js:64`; parche `:91`.
| Campo | Valor efectivo |
|---|---|
| kind | `spread`, 1 proyectil, zigzag |
| cooldown | 0,22 s (era 0,18) |
| range / speed | 750 / 580 |
| zigzag | amplitud 18, frecuencia 17 |
| daño por impacto | `power` 12 × 1 (sin `powerScale`) = 12 |
- Daño real de proyectil: `power*powerScale*damageScale` (`src/systems/combat.js:22`).

## Evolución · Infestación veloz
`src/systems/evolutions.js:22`, escala en `:54`.
- 3 cucarachas, `spread` 0,1, perforan 4, zigzag amplitud 35 y frecuencia 22.
- `damageScale` **0,6** (`evolutions.js:54`) → 7,2 por cucaracha.
- Extra `swarm`: campo de enjambre junto al objetivo (radio 95, 2,5 s, potencia `daño*.18`) (`evolutions.js:35`).

## Cómo se evoluciona (genérico)
- Rangos del arma principal: cada rango ×1,18 de poder, ×1,08 de alcance, cadencia ×0,94; rangos 3 y 5 dan +1 proyectil (`src/systems/progression.js:61`, `:78`).
- Evolución: requiere rango 5 + nivel 8 (`progression.js:62`); aplica poder ×1,6, alcance ×1,3, cadencia ×0,85, +2 proyectiles y `primaryPierce=2` (`progression.js:78`).
- Ver [[sistemas/evoluciones/README]] y [[sistemas/progresion-cartas/README]].
