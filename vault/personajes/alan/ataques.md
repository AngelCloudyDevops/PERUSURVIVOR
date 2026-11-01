---
tipo: personaje
id: alan
archivos: [src/data/catalog.js, src/systems/combat.js, src/systems/evolutions.js, src/systems/progression.js]
verificado: 2026-10-31
---
# Alan · ataques
Solo existe un ataque (slots 2 y 3 `reserved`, `src/data/powers.js:51`).

## 1. Discurso interminable (`speech`)
- `kind cone`, `range 230`, `cooldown 0.85` (`src/data/catalog.js:18`). Sin `arc`: usa 1,3 rad por defecto (≈74°) (`src/systems/combat.js:27`).
- Daño por impacto = `power` 31, sin `powerScale`. Empuje por defecto 10 (`combat.js:30`).
- Golpea a todo enemigo dentro del cono con cobertura libre; también terreno y barriles (`combat.js:26-30`).
- Se lanza solo si hay un objetivo a ≤ `range·reach` (`combat.js:17`).

## Evolución «Eco de la plaza» (`evolutions.js:10`)
- Perfil: `arc 2.7`, `range 310`, `extra:'rear'`. Sin `damageScale`.
- Extra: golpe detrás del jugador, centro a 150 u opuesto a la puntería, radio 140, 55 % del daño, empuje 15 (`evolutions.js:32`).

## Progresión del ataque principal
- Rangos 1→5: +18 % daño, +8 % alcance, intervalo ×0,94; rangos 3 y 5: +15 % daño (el cono no es proyectil) (`src/systems/progression.js:78`).
- Evolución: rango 5, nivel ≥ 8; daño ×1,6, alcance ×1,3, intervalo ×0,85 (`progression.js:62,78`).

Volver a [[personajes/alan/README]] · [[sistemas/combate/README]].
