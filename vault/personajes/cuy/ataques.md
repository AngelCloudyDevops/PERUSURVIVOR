---
tipo: personaje
id: cuy
archivos: [src/data/catalog.js, src/data/powers.js, src/systems/combat.js, src/systems/evolutions.js, src/systems/progression.js]
verificado: 2026-10-31
---
# Cuy · ataques
Solo existe un ataque (los otros dos slots son `reserved`, `src/data/powers.js:51`).

## 1. ¡Habla, causa! (`nova`)
- `kind nova`: onda circular completa (arco 2π). `range 145`, `cooldown 1` (`src/data/catalog.js:16`; parche `src/data/powers.js:84`).
- Daño por impacto = `power` 34, sin `powerScale` (`src/systems/combat.js:30`). Empuje por defecto 28 (`combat.js:30`).
- Golpea a todo enemigo dentro del radio con cobertura libre, y también a terreno y barriles (`combat.js:26-30`).
- Se lanza solo si hay un objetivo a ≤ `range·reach` (`combat.js:17`).

## Evolución «Terremoto del cuy» (`evolutions.js:8`)
- Perfil: `range 210`, `push 50`, `extra:'ground'`, `damageScale 0.8` (`evolutions.js:8,54`).
- Combina `{...nova, ...perfil}` (`evolutions.js:28`), así que el golpe base también usa ×0,8.
- Extra tras cada lanzamiento: campo en los pies del jugador, radio 130, daño por pulso `power·0.8·0.18`, dura 2,5 s (`evolutions.js:35`). Bloqueado si hay ulti activa (`comboBlocked`).
- La onda visual está acotada a 330 u (`evolutions.js:29`).

## Progresión del ataque principal
- Rango 1→5, cada uno: +18 % daño, +8 % alcance, intervalo ×0,94; en rangos 3 y 5 un `nova` (no proyectil) gana +15 % daño (`src/systems/progression.js:78`).
- Evolucionar: rango 5 y nivel ≥ 8; daño ×1,6, alcance ×1,3, intervalo ×0,85 (`progression.js:62,78`).
- Pulso, tarjetas y banda son apoyos genéricos, no ataques del personaje (`progression.js:60`).

Volver a [[personajes/cuy/README]] · [[sistemas/combate/README]] · [[sistemas/evoluciones/README]].
