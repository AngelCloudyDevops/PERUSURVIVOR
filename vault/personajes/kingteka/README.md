---
tipo: personaje
id: kingteka
archivos: [src/data/catalog.js, src/data/powers.js, src/systems/kingteka-arsenal.js, src/systems/kingteka-domain.js, src/systems/passives.js, src/systems/ultimate.js]
verificado: 2026-10-31
---
# Kingteka

Kit completo: **9/9** (`P.CharacterContract.describe`, `src/data/character-contract.js:11`, comprobado con `Simulation`).
Notas: [[personajes/kingteka/ataques]] · [[personajes/kingteka/poderes]] · [[personajes/kingteka/assets]] · [[personajes/kingteka/tests]] · [[personajes/kingteka/gotchas]]

## Identidad
| Campo | Valor | Fuente |
|---|---|---|
| Nombre en juego | `Kingteka · Amor a los animales` (se reescribe en `init`) | `src/systems/character-skins.js:12,21` |
| Nombre en catálogo | `Kingteka` | `src/data/catalog.js:33` |
| Categoría | Streamer · parodia | `src/data/catalog.js:33` |
| Rol / secundario | Especialista / Controlador | `src/data/powers.js:20` |
| Raza / alcance / daño | Humano / mixto (`mixed`) / híbrido | `src/data/powers.js:20` |
| Dificultad | Intermedia | `src/data/powers.js:20` |
| Etiquetas | arsenal, burst, control, mobility, healing, fixed | `src/data/powers.js:20` |

## Estadísticas efectivas
- `hp 125`, `speed 175`, `power 28` (`src/data/catalog.js:33`). Ningún parche posterior las toca (`src/data/powers.js:82` solo parchea cristorata, alberto, g5).
- Ataque inicial del catálogo: `shotgun` (`src/data/powers.js:72`, sustituye a `controller`) y `atlas:'powers'`, `spriteRow:0`.
- Atributo **Fuerza**, canal **físico**: ATQ fís. 100, ATQ esp. 85, DEF fís. 105, DEF esp. 95 (`src/data/attributes.js:5,7`).
- En combate el ataque real sale de `P.KingtekaArsenal`, no de `P.Data.attacks.shotgun`: ver [[personajes/kingteka/ataques]].
- Los ajustes de admin (`P.CharacterBalance.overrides`) pueden sustituir hp/power/speed en ejecución (`src/systems/character-balance.js:23`).

## Rareza de colección
- **UR · Supremo** (`ultra`), 1 % de probabilidad: `src/systems/gacha.js:4`. Crecimiento ×1,12 (`src/systems/gacha.js:5`).
- Los docs que dicen «épico» están mal: el código lo pone en `ultra` y R depende de eso (`src/systems/kingteka-domain.js:6`).
- `cerdito` es alias legado de `kingteka` (`src/systems/gacha.js:3`, `src/systems/meta-progress.js:6`).

## Estado del kit
| Pieza | Estado | Dónde |
|---|---|---|
| Ataque 1 Escopeta causa | implementado | `src/systems/kingteka-arsenal.js:9` |
| Ataque 2 Gallinazo | implementado | `src/systems/kingteka-arsenal.js:10` |
| Ataque 3 Golpe de cuerpo | implementado | `src/systems/kingteka-arsenal.js:11` |
| 3 evoluciones (Escopeta Contra, Gallinazo de Expedición, Golpe de Supervivencia) | implementadas | `src/systems/kingteka-arsenal.js:14-16` |
| Pasiva Instinto de expedición | implementada | `src/systems/passives.js:5` |
| Q Gallinazos | implementada | `src/systems/ability-cards.js:13`, `src/systems/ultimate.js:13` |
| R Santuario del Reino Animal | implementada | `src/systems/ability-cards.js:14`, `src/systems/kingteka-domain.js:11` |

## Archivos que lo implementan
- Datos: `src/data/catalog.js`, `src/data/powers.js` (identidad, `weaponKits` en `:37-42`), `src/data/attributes.js`, `src/data/character-contract.js`, `src/data/muzzle-anchors.js`.
- Sistemas: `src/systems/kingteka-arsenal.js`, `kingteka-domain.js`, `passives.js`, `ultimate.js`, `ability-cards.js`, `evolutions.js`, `progression.js`, `weapon-input.js`, `causa-combo.js`, `character-skins.js`, `gacha.js`, `meta-progress.js`.
- Escenas/UI: `src/scenes/practice.js`, `src/development/test-bench.js`, `src/ui/attack-hud.js`, `lobby.js`, `reference-menus.js`, `screens.js`, `skill-preview.js`, `balance-preview.js`.
- Render: `src/rendering/player-attack-art.js`, `player-reaction-art.js`, `ultimate-comic.js`, `walk-art.js`, `world.js`, `companion-art.js`, `dragon-epic.js`.
- Servidor: `backend/simulation.cjs:41,44,63`.

Sistemas relacionados: [[sistemas/evoluciones/README]] · [[sistemas/ulti/README]] · [[sistemas/dominios/README]] · [[sistemas/pasivas/README]] · [[sistemas/atributos/README]] · [[sistemas/gacha-meta/README]]
