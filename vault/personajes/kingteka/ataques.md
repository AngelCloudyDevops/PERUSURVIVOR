---
tipo: personaje
id: kingteka
archivos: [src/systems/kingteka-arsenal.js, src/data/powers.js, src/systems/evolutions.js, src/systems/weapon-input.js]
verificado: 2026-10-31
---
# Kingteka · ataques

Volver: [[personajes/kingteka/README]]

Tres armas con progreso separado, cambio con **1/2/3** o rueda (`src/core/runtime.js:24`, `src/systems/weapon-input.js:6`). Orden: `shotgun`, `gallinazo`, `golpe` (`src/systems/kingteka-arsenal.js:4`).

## Perfiles efectivos (rango 1)
`P.Evolutions.attack` devuelve primero el arsenal (`src/systems/evolutions.js:28`). Valores de `src/systems/kingteka-arsenal.js:9-11`:

| Arma | Tipo | Cooldown | Alcance | Proyectiles | powerScale / damageScale | Otros | Canal |
|---|---|---|---|---|---|---|---|
| Escopeta causa | spread | 0,92 | 260 | 4 | powerScale 0,62 | speed 780, spread 0,14, falloff near 120 min 0,28 | físico |
| Gallinazo | spread | 1,15 | 520 | 2 | powerScale 0,64 | pierce 2, guiado (`homing`), speed 420 | especial |
| Golpe de cuerpo | melee | 0,78 | 105 | – | damageScale 1,1 | arco 120°, empuje 34 | físico |

Daño por impacto = `power × powerScale × damageScale` (`src/systems/combat.js:22`). Con power 28: escopeta 17,36 por perdigón.

## Rangos (por arma)
- Fórmula (`src/systems/kingteka-arsenal.js:22`): daño ×(1+0,16·(rango−1)), alcance ×(1+0,06·(rango−1)), cooldown ×0,95^(rango−1).
- Escopeta y Gallinazo ganan `floor((rango−1)/2)` proyectiles. Golpe gana +0,06 rad de arco y +4 de empuje por rango.
- Puertas de nivel `[1,4,7,10,13]` (`:7`): rango 1→2 con nivel 4, 2→3 con 7, 3→4 con 10, 4→5 con 13 (`:26`).
- Desbloqueo de armas 2 y 3 (Gallinazo, luego Golpe): la carta solo aparece en niveles pares (`:25`).
- Cambio de arma: mínimo 0,35 s entre cambios y solo entre armas desbloqueadas (`:24`).

## Evoluciones
Requisito: rango 5 de esa arma y nivel 14 (`src/systems/kingteka-arsenal.js:27`). Cada arma evoluciona sola.

| Arma | Evolución | Cambios | Línea |
|---|---|---|---|
| Escopeta | Escopeta Contra | 5 esferas rojas fijas (`fixedCount`), spread 0,17, speed 720, pierce 2, powerScale 0,75 | `src/systems/kingteka-arsenal.js:14` |
| Gallinazo | Gallinazo de Expedición | 3 plumas, pierce 3, speed 520, powerScale 0,72 | `:15` |
| Golpe | Golpe de Supervivencia | rango 150, arco 160°, damageScale 1,32, empuje 58 | `:16` |

- `P.Evolutions.profiles.kingteka` (`src/systems/evolutions.js:14`, 3 disparos, pierce 3) sigue en el código pero no se usa mientras exista la evolución del arsenal (`src/systems/evolutions.js:27`).
- La Kingteka no usa la rama genérica `primary` de [[sistemas/evoluciones/README]]: se excluye en `src/systems/progression.js:60`.
- Efecto extra de evolución: `P.Evolutions.afterCast` ya entiende `arsenal.evolved` (`src/systems/evolutions.js:29`).

## Dónde NO mirar para el combate
`P.Data.attacks.shotgun` (cooldown 0,78, alcance 480, 5 perdigones, powerScale 0,6; `src/data/powers.js:61`) solo alimenta la ficha del lobby (`P.CharacterProfiles.base`, `src/data/powers.js:55`). Ver [[personajes/kingteka/gotchas]].
