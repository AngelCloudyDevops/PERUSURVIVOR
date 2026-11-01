---
tipo: personaje
id: alberto
archivos: [src/data/catalog.js, src/data/powers.js, src/systems/combat.js, src/systems/evolutions.js, src/systems/progression.js]
verificado: 2026-10-31
---
# Alberto · ataques
Solo existe un ataque (slots 2 y 3 `reserved`, `src/data/powers.js:51`).

## 1. Banda presidencial (`orbit`)
- `kind orbit`, `range 100`, `cooldown 0.42` (`src/data/catalog.js:21`; parche `src/data/powers.js:85`). Daño por contacto = `power` 28, sin `powerScale` (`src/systems/combat.js:33`).
- **3 bandas** giran a 2,8 rad/s a `100·reach` del jugador (`combat.js:15`).
- No es un daño continuo: cada lanzamiento (cada 0,42 s) evalúa las posiciones actuales de las bandas y golpea a quien esté a < `e.r+24` de alguna (`combat.js:33`). También daña terreno y barriles.
- Solo se lanza si hay un objetivo a ≤ `range·reach + 24` (`combat.js:17`).

## Evolución «Órbita presidencial» (`evolutions.js:11`)
- `extra:'center'`, sin `damageScale`. Pasa a **6 bandas** si `p.id==='alberto' && p.evolved.primary` (`combat.js:15`).
- Extra: onda en el jugador, radio 110, 40 % del daño (`evolutions.js:31`).

## Progresión del ataque principal
- Rangos 1→5: +18 % daño, +8 % alcance, intervalo ×0,94; rangos 3 y 5: +15 % daño de área (`orbit` no es proyectil) (`src/systems/progression.js:78`).
- Evolución: rango 5, nivel ≥ 8; daño ×1,6, alcance ×1,3, intervalo ×0,85 (`progression.js:62,78`).
- «Banda» como apoyo (`powerRanks.orbit`, `progression.js:87`) es una carta genérica distinta, no este ataque.

Volver a [[personajes/alberto/README]] · [[sistemas/combate/README]] · [[sistemas/evoluciones/README]].
