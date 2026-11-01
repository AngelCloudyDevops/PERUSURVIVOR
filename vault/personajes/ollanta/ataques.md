---
tipo: personaje
id: ollanta
archivos: [src/data/catalog.js, src/systems/combat.js, src/systems/evolutions.js, src/systems/progression.js]
verificado: 2026-10-31
---
# Ollanta · ataques
Solo existe un ataque (slots 2 y 3 `reserved`, `src/data/powers.js:51`).

## 1. Voz de mando (`megaphone`)
- `kind cone`, `range 250`, `cooldown 0.9` (`src/data/catalog.js:20`). Sin `arc`: 1,3 rad por defecto (≈74°) (`src/systems/combat.js:27`).
- Daño por impacto = `power` 30, sin `powerScale`. Empuje por defecto 10 (`combat.js:30`).
- Golpea a todo enemigo en el cono con cobertura libre; también terreno y barriles (`combat.js:26-30`).
- Se lanza solo si hay un objetivo a ≤ `range·reach` (`combat.js:17`).

## Evolución «Marcha del comando» (`evolutions.js:13`)
- Perfil: `arc 0.85`, `range 360`, `push 65`, `extra:'flanks'`, `damageScale 0.8` (`evolutions.js:13,54`). El golpe principal también sale ×0,8 (`{...base,...perfil}`, `evolutions.js:28`).
- Extra: dos ondas laterales a ±0,95 rad, a 105 u del jugador, radio 90, 50 % del daño, empuje 35 (`evolutions.js:33`).

## Progresión del ataque principal
- Rangos 1→5: +18 % daño, +8 % alcance, intervalo ×0,94; rangos 3 y 5: +15 % daño (el cono no es proyectil) (`src/systems/progression.js:78`).
- Evolución: rango 5, nivel ≥ 8; daño ×1,6, alcance ×1,3, intervalo ×0,85 (`progression.js:62,78`).

Volver a [[personajes/ollanta/README]] · [[sistemas/combate/README]].
