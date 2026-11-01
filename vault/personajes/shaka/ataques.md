---
tipo: personaje
id: shaka
archivos: [src/data/powers.js, src/data/catalog.js, src/systems/evolutions.js, src/systems/progression.js]
verificado: 2026-10-31
---
# Shakadoto · ataques

Volver: [[personajes/shaka/README]]. Solo existe **1 ataque** y **1 evolución**; los slots 2 y 3 están reservados (`P.CharacterProfiles.weaponSlots`, `src/data/powers.js:51`).

## Ataque 1 · Plátanos de vuelta (`bananas`)
boomerang · cooldown 0,95 · alcance 550 · 2 proyectiles · spread 0,2 · powerScale 0,5 · glifo `BANANA`.
- Definición: `src/data/powers.js:66`.
- Daño por plátano: 35 × 0,5 = **17,5**.
- Cooldown 0,85 → 0,95 y powerScale 0,5 vienen del parche `Object.assign(P.Data.attacks.bananas, …)` (`src/data/powers.js:86`); el original era 0,85 (`:66`).
- Bumerán: vuelve a golpear, sin límite de rivales por trayecto (`remaining: Infinity`, `src/systems/combat.js:22`); gira a los 0,55·reach s y vive 1,3·reach s.

## Rangos del arma principal
Genéricos para todo el roster sin arsenal (`src/systems/progression.js:77-78`):
- Cada rango 1→5: poder ×1,18, alcance ×1,08, intervalo ×0,94.
- Rangos 3 y 5: +1 proyectil (`spread`/`boomerang`) o poder ×1,15 en otros tipos.
- Evolución: rango 5 y nivel 8 (`src/systems/progression.js:62`); poder ×1,6, alcance ×1,3, intervalo ×0,85, +2 proyectiles, `primaryPierce` +2.

## Evolución · Tornado bananero
- Perfil en `src/systems/evolutions.js:15`: count 5, `radial` (abanico de 360°), `extra:center` (golpe central radio 110 al 40 %, `evolutions.js:31`), forma `spiral`, `damageScale` 0,85 (`evolutions.js:54`).
- `P.Evolutions.attack` mezcla `{...ataque base, ...perfil}` (`src/systems/evolutions.js:28`).
- Medido con `Simulation` aplicando solo `evolve:primary` (sin rangos previos): 5 plátanos de 23,8 de daño, poder ×1,6, alcance ×1,3, cadencia 0,807 s.
- Con los 4 rangos previos el daño y la cadencia son mayores; las fórmulas de arriba se multiplican.
