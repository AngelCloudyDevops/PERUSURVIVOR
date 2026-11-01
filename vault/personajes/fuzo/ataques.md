---
tipo: personaje
id: fuzo
archivos: [src/data/powers.js, src/data/catalog.js, src/systems/evolutions.js, src/systems/progression.js]
verificado: 2026-10-31
---
# Fuzo · ataques

Volver: [[personajes/fuzo/README]]. Solo existe **1 ataque** y **1 evolución**; los slots 2 y 3 están reservados (`P.CharacterProfiles.weaponSlots`, `src/data/powers.js:51`).

## Ataque 1 · Tarjetazo BCP (`bankCards`)
spread · cooldown 0,75 · alcance 850 · speed 620 · 2 proyectiles · spread 0,13 · pierce 3 · powerScale 0,8 · glifo `BCP`.
- Definición: `src/data/powers.js:67`.
- Daño por tarjeta: 24 × 0,8 = **19,2**.
- powerScale 0,8 viene de `Object.assign(P.Data.attacks.bankCards, …)` (`src/data/powers.js:89`).
- Cada tarjeta atraviesa 3 rivales (`remaining = pierce + primaryPierce`, `src/systems/combat.js:22`).

## Rangos del arma principal
Genéricos para todo el roster sin arsenal (`src/systems/progression.js:77-78`):
- Cada rango 1→5: poder ×1,18, alcance ×1,08, intervalo ×0,94.
- Rangos 3 y 5: +1 proyectil (`spread`/`boomerang`) o poder ×1,15 en otros tipos.
- Evolución: rango 5 y nivel 8 (`src/systems/progression.js:62`); poder ×1,6, alcance ×1,3, intervalo ×0,85, +2 proyectiles, `primaryPierce` +2.

## Evolución · Banca infinita
- Perfil en `src/systems/evolutions.js:18`: count 5, spread 0,11, speed 900, pierce 8 (texto: «atraviesan diez», el total con `primaryPierce`), `extra:chain` (hasta 3 rivales a ≤220 u del objetivo, 45 % del daño, `evolutions.js:37`), `damageScale` 0,58 (`evolutions.js:54`).
- `P.Evolutions.attack` mezcla `{...ataque base, ...perfil}` (`src/systems/evolutions.js:28`).
- Medido con `Simulation` aplicando solo `evolve:primary` (sin rangos previos): 5 tarjetas de 17,82 de daño, cada una con `remaining` 10 (8 del perfil + 2 de `primaryPierce`, `progression.js:78`), poder ×1,6, alcance ×1,3, cadencia 0,637 s.
- Con los 4 rangos previos el daño y la cadencia son mayores; las fórmulas de arriba se multiplican.
