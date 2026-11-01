---
tipo: personaje
id: najasor
archivos: [src/data/powers.js, src/data/catalog.js, src/systems/evolutions.js, src/systems/progression.js]
verificado: 2026-10-31
---
# Najasor · ataques

Volver: [[personajes/najasor/README]]. Solo existe **1 ataque** y **1 evolución**; los slots 2 y 3 están reservados (`P.CharacterProfiles.weaponSlots`, `src/data/powers.js:51`).

## Ataque 1 · ¡CPEZ! (`fishgun`)
spread · cooldown 0,85 · alcance 650 · speed 430 · 3 proyectiles · spread 0,22 · powerScale 0,85 · glifo `FISH` · grito «CPEZ».
- Definición: `src/data/powers.js:63`.
- Daño por pescado: 20 × 0,85 = **17**.
- powerScale 0,85 viene de `Object.assign(P.Data.attacks.fishgun, …)` (`src/data/powers.js:88`).
- Cada disparo muestra el texto `CPEZ` (`a.shout`, `src/systems/combat.js:19`).
- Tiene anclas de boca de arma para el glifo `FISH` (`src/data/muzzle-anchors.js:3`, `src/systems/muzzle.js:3`).

## Rangos del arma principal
Genéricos para todo el roster sin arsenal (`src/systems/progression.js:77-78`):
- Cada rango 1→5: poder ×1,18, alcance ×1,08, intervalo ×0,94.
- Rangos 3 y 5: +1 proyectil (`spread`/`boomerang`) o poder ×1,15 en otros tipos.
- Evolución: rango 5 y nivel 8 (`src/systems/progression.js:62`); poder ×1,6, alcance ×1,3, intervalo ×0,85, +2 proyectiles, `primaryPierce` +2.

## Evolución · Marea CPEZ
- Perfil en `src/systems/evolutions.js:16`: count 7, spread 0,15, zigzag (amplitud 28, frecuencia 12), `extra:splash` (golpe de radio 140 al 50 % junto al objetivo, `evolutions.js:35`), `damageScale` 0,65 (`evolutions.js:54`).
- `P.Evolutions.attack` mezcla `{...ataque base, ...perfil}` (`src/systems/evolutions.js:28`).
- Medido con `Simulation` aplicando solo `evolve:primary` (sin rangos previos): 7 pescados de 17,68 de daño, 3 impactos por proyectil, poder ×1,6, alcance ×1,3, cadencia 0,722 s.
- Con los 4 rangos previos el daño y la cadencia son mayores; las fórmulas de arriba se multiplican.
