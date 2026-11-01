---
tipo: personaje
id: charles
archivos: [src/data/powers.js, src/data/catalog.js, src/systems/evolutions.js, src/systems/progression.js]
verificado: 2026-10-31
---
# Charles · ataques

Volver: [[personajes/charles/README]]. Solo existe **1 ataque** y **1 evolución**; los slots 2 y 3 están reservados (`P.CharacterProfiles.weaponSlots`, `src/data/powers.js:51`).

## Ataque 1 · Bebé de juguete lanzador (`diaper`)
spread · cooldown 1,2 · alcance 600 · speed 320 · 1 proyectil · powerScale 0,8 · glifo `DIAPER` · `cloud:true`.
- Definición: `src/data/powers.js:65`.
- Daño por pañal: 33 × 0,8 = **26,4**.
- powerScale 0,8 viene de `Object.assign(P.Data.attacks.diaper, …)` (`src/data/powers.js:90`).
- Al impactar deja un campo de radio 85, 2,5 s, con `power × 0,25` por pulso cada 0,4 s (`src/systems/combat.js:37,54`). Daño especial.
- Tiene anclas de boca de arma para el glifo `DIAPER` (`src/data/muzzle-anchors.js:3`).

## Rangos del arma principal
Genéricos para todo el roster sin arsenal (`src/systems/progression.js:77-78`):
- Cada rango 1→5: poder ×1,18, alcance ×1,08, intervalo ×0,94.
- Rangos 3 y 5: +1 proyectil (`spread`/`boomerang`) o poder ×1,15 en otros tipos.
- Evolución: rango 5 y nivel 8 (`src/systems/progression.js:62`); poder ×1,6, alcance ×1,3, intervalo ×0,85, +2 proyectiles, `primaryPierce` +2.

## Evolución · Lluvia de pañales
- Perfil en `src/systems/evolutions.js:19`: count 3, spread 0,35, `cloud`, `extra:cloud` (campo extra de radio 95, 4 s junto al objetivo, `evolutions.js:36`), `damageScale` 0,55 (`evolutions.js:54`).
- `P.Evolutions.attack` mezcla `{...ataque base, ...perfil}` (`src/systems/evolutions.js:28`).
- Medido con `Simulation` aplicando solo `evolve:primary` (sin rangos previos): 3 pañales de 23,23 de daño, poder ×1,6, alcance ×1,3, cadencia 1,02 s.
- Con los 4 rangos previos el daño y la cadencia son mayores; las fórmulas de arriba se multiplican.
