---
tipo: personaje
id: cirilo
archivos: [src/data/catalog.js, src/data/powers.js, src/systems/cirilo-ur.js, src/systems/cirilo-kit.js, src/systems/cirilo-arena.js, src/rendering/cirilo-kit-art.js]
verificado: 2026-10-31
---
# CiriloTV

Kit completo: **9/9** (`P.CharacterContract.describe`, `src/data/character-contract.js:11`, comprobado con `Simulation`).
Notas: [[personajes/cirilo/ataques]] · [[personajes/cirilo/poderes]] · [[personajes/cirilo/assets]] · [[personajes/cirilo/tests]] · [[personajes/cirilo/gotchas]]

## Identidad
| Campo | Valor | Fuente |
|---|---|---|
| Nombre | CiriloTV | `src/data/catalog.js:33` |
| Categoría | `Streamer UR · parodia` (el catálogo decía `Streamer · parodia`) | `src/systems/cirilo-ur.js:80` |
| Rol / secundario | Especialista / Controlador | `src/data/powers.js:23` |
| Raza / alcance / daño | Humano / medio / híbrido | `src/data/powers.js:23` |
| Dificultad | Avanzada | `src/data/powers.js:23` |
| Etiquetas | dot, control, evolution, risk | `src/data/powers.js:23` |
| Especialidad | UR de riesgo progresivo | `src/data/powers.js:49` |

## Estadísticas efectivas
- **`hp 135`, `speed 165`, `power 24`**, ataque `ciriloVomit`: `Object.assign` en `src/systems/cirilo-ur.js:80`. Sustituyen a `hp 120 / speed 175 / power 22 / attack micro` de `src/data/catalog.js:33`.
- `atlas:'streamers'`, `spriteRow:3` (`src/data/catalog.js:33`); no lo toca `src/data/powers.js:72-73`.
- Atributo **Ingenio**, canal **físico**: ATQ fís. 100, ATQ esp. 85, DEF fís. 100, DEF esp. 100 (`src/data/attributes.js:5,7`).
- Recibe **+10 % de daño** (`src/systems/cirilo-ur.js:85`).
- En partida cambian: nivel 10 → alcance ×1,25; nivel 20 → velocidad ×1,25 (`src/systems/cirilo-ur.js:13,16`). La forma demonio multiplica el poder ×1,5 (`:18`).
- El panel de admin puede sobrescribir hp/power/speed (`src/systems/character-balance.js:23`).

## Rareza de colección
- **UR · Supremo** (`ultra`): `src/systems/gacha.js:4`. Crecimiento ×1,12 (`:5`).
- Ataque, dominio y HUD exigen `ultra` (`CiriloUR.eligible`, `src/systems/cirilo-ur.js:3`). Arsenal, Q y pasiva solo exigen el id (`src/systems/cirilo-kit.js:19`).

## Estado del kit
| Pieza | Estado | Dónde |
|---|---|---|
| Ataque 1 Vómito tóxico | implementado | `src/systems/cirilo-kit.js:6`, `cirilo-ur.js:14` |
| Ataque 2 Taxi de Cirilo | implementado | `src/systems/cirilo-kit.js:6,27` |
| Ataque 3 Eco maldito | implementado | `src/systems/cirilo-kit.js:6,40` |
| Evoluciones: Glucosa Maldita, Carrera de ida y vuelta, Maldad contagiosa | implementadas | `src/systems/cirilo-kit.js:7`, `evolutions.js:17` |
| Pasiva Persistencia maldita | implementada | `src/systems/cirilo-kit.js:51` |
| Q ¡FULL MALDAD! | implementada | `src/systems/cirilo-kit.js:44-52` |
| R Audiencia del Demonio | implementada | `src/systems/cirilo-ur.js:19`, `ability-cards.js:22` |

## Archivos que lo implementan
- Datos: `src/data/catalog.js`, `powers.js` (identidad, rol), `attributes.js`, `character-contract.js`.
- Sistemas: `src/systems/cirilo-ur.js` (forma, resurrección, R), `cirilo-kit.js` (arsenal, Q, pasiva), `cirilo-arena.js` (tribunal), `evolutions.js`, `progression.js`, `gacha.js`, `character-balance.js`, `ability-cards.js`, `weapon-input.js`.
- Render: `src/rendering/cirilo-kit-art.js`, `walk-art.js`, `companion-art.js`, `dragon-epic.js`.
- UI y práctica: `src/ui/attack-hud.js`, `lobby.js`, `reference-menus.js`, `skill-preview.js`, `balance-preview.js`, `src/development/test-bench.js`.
- Servidor: `backend/simulation.cjs:37,39,47`.

Sistemas relacionados: [[sistemas/evoluciones/README]] · [[sistemas/ulti/README]] · [[sistemas/dominios/README]] · [[sistemas/pasivas/README]] · [[sistemas/atributos/README]] · [[sistemas/gacha-meta/README]]
