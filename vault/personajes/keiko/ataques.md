---
tipo: personaje
id: keiko
archivos: [src/data/catalog.js, src/systems/combat.js, src/systems/evolutions.js, src/systems/progression.js]
verificado: 2026-10-31
---
# Keiko · ataques
Solo existe un ataque (slots 2 y 3 `reserved`, `src/data/powers.js:51`).

## 1. Abanico naranja (`fan`)
- `kind boomerang`, `range 540`, `cooldown 1.05` (`src/data/catalog.js:19`). Sin `count`: 1 abanico, 23 de daño por impacto (`src/systems/combat.js:22`).
- Velocidad 470, vida 1,3·reach, giro a 0,55·reach, regreso a 530 (`combat.js:22,45`). Al girar se vacían los impactos, así que el retorno vuelve a golpear (`combat.js:45`). Sin límite de objetivos (`remaining=Infinity`).
- El texto del ataque dice «atraviesa enemigos y regresa» (`catalog.js:19`); el alcance nominal no garantiza recorrerlo entero (`src/data/powers.js:57`, nota).

## Evolución «Abanico solar» (`evolutions.js:12`)
- Perfil: `count 4`, `radial:true`, `extra:'vortex'`. Sin `damageScale`.
- Cuatro abanicos salen en cruz desde la puntería (`combat.js:22`).
- Extra: remolino en el objetivo, radio 95, daño por pulso `power·0.18`, dura 2,5 s (`evolutions.js:35`). Bloqueado si hay ulti activa.

## Progresión del ataque principal
- Rangos 1→5: +18 % daño, +8 % alcance, intervalo ×0,94; **+1 abanico** en los rangos 3 y 5 (`src/systems/progression.js:78`).
- Evolución: rango 5, nivel ≥ 8; daño ×1,6, alcance ×1,3, intervalo ×0,85, +2 proyectiles (`progression.js:62,78`).

Volver a [[personajes/keiko/README]] · [[sistemas/combate/README]].
