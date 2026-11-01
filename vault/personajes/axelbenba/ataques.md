---
tipo: personaje
id: axelbenba
archivos: [src/data/powers.js, src/data/catalog.js, src/systems/evolutions.js, src/systems/progression.js]
verificado: 2026-10-31
---
# Axel Benba · ataques

Volver: [[personajes/axelbenba/README]]. Solo existe **1 ataque** y **1 evolución**; los slots 2 y 3 están reservados (`P.CharacterProfiles.weaponSlots`, `src/data/powers.js:51`).

## Ataque 1 · Clip relámpago (`axelClip`)
spread · cooldown 0,7 · alcance 700 · 3 proyectiles (por defecto de `spread`) · spread 0,18 (por defecto) · powerScale 0,8 · glifo `:)`.
- Definición: `src/data/catalog.js:35`.
- Daño por clip: 21 × 0,8 = **16,8**.
- Es una copia de `emotes` (`src/data/catalog.js:35`, `{...P.Data.attacks.emotes, name:"Clip relámpago"}`) con `powerScale` 0,8 (`src/data/powers.js:87`). No define `count`: sale 3 por la regla de `spread` (`src/systems/combat.js:21`).
- No tiene anclas de boca de arma (`src/data/muzzle-anchors.js:3`); dispara desde el cuerpo.

## Rangos del arma principal
Genéricos para todo el roster sin arsenal (`src/systems/progression.js:77-78`):
- Cada rango 1→5: poder ×1,18, alcance ×1,08, intervalo ×0,94.
- Rangos 3 y 5: +1 proyectil (`spread`/`boomerang`) o poder ×1,15 en otros tipos.
- Evolución: rango 5 y nivel 8 (`src/systems/progression.js:62`); poder ×1,6, alcance ×1,3, intervalo ×0,85, +2 proyectiles, `primaryPierce` +2.

## Evolución · Tormenta relámpago
- Perfil en `src/systems/evolutions.js:20`: count 2, spread 0,35, speed 540, `homing` (busca al rival vivo más cercano en pantalla, `combat.js:46`), pierce 3, forma `lightning`; sin `damageScale` propio.
- `P.Evolutions.attack` mezcla `{...ataque base, ...perfil}` (`src/systems/evolutions.js:28`).
- Medido con `Simulation` aplicando solo `evolve:primary` (sin rangos previos): 2 clips de 26,88 de daño, `remaining` 5 (3 + 2 de `primaryPierce`), poder ×1,6, alcance ×1,3, cadencia 0,595 s.
- Con los 4 rangos previos el daño y la cadencia son mayores; las fórmulas de arriba se multiplican.
