---
tipo: personaje
id: charles
archivos: [src/data/catalog.js, src/data/powers.js, src/systems/evolutions.js, src/systems/gacha.js, src/data/attributes.js]
verificado: 2026-10-31
---
# Charles

Kit: **2/9** (1 ataque + 1 evolución implementados). `P.CharacterContract.describe` (`src/data/character-contract.js:11`), comprobado con `Simulation`.
Notas: [[personajes/charles/ataques]] · [[personajes/charles/poderes]] · [[personajes/charles/assets]] · [[personajes/charles/tests]] · [[personajes/charles/gotchas]]

## Identidad
| Campo | Valor | Fuente |
|---|---|---|
| Nombre | Charles | `src/data/catalog.js:33` |
| Categoría | Streamer · parodia | `src/data/catalog.js:33` |
| Rol / secundario | Controlador / Tirador | `src/data/powers.js:25` |
| Raza / alcance / daño | Humano / medio / especial | `src/data/powers.js:25` |
| Dificultad | Intermedia | `src/data/powers.js:25` |
| Etiquetas | area, dot, control | `src/data/powers.js:25` |
| Especialidad | Control de zonas. Fuerte: «Nubes que castigan grupos.» Débil: «Recarga larga; los rivales pueden salir de la nube.» | `src/data/powers.js:49` |

## Estadísticas efectivas
- `hp 130`, `speed 165`, `power 33` (`src/data/catalog.js:33`). Ningún parche posterior las toca (`src/data/powers.js:82` solo parchea cristorata, alberto, g5).
- Ataque inicial `diaper` (Bebé de juguete lanzador); `atlas:'powers'`, `spriteRow:4` (`src/data/powers.js:72-73`; el catálogo decía atlas `streamers` fila 5).
- Atributo **Ingenio**, canal **especial**: ATQ fís. 85, ATQ esp. 100, DEF fís. 105, DEF esp. 95 (`src/data/attributes.js:5,7`; el canal contrario siempre vale 85).
- El panel de admin puede sobrescribir hp/power/speed en ejecución (`src/systems/character-balance.js:23`).

## Rareza de colección
- **R · Raro (`rare`)**, 27 % de probabilidad; crecimiento ×1,03 (`src/systems/gacha.js:4,5`).

## Estado del kit
| Pieza | Estado | Dónde |
|---|---|---|
| Ataque 1 Bebé de juguete lanzador | implementado | `src/data/powers.js:65` |
| Ataque 2 y 3 | **faltan** (reservados, «por definir») | `src/data/powers.js:51` (`weaponSlots` sin `weaponKits`) |
| Evolución 1 Lluvia de pañales | implementada | `src/systems/evolutions.js:19` |
| Evolución 2 y 3 | **faltan** | `src/data/character-contract.js:12` |
| Pasiva | **falta** | `src/systems/passives.js:5` (solo kingteka y makanaky; cirilo se añade en `cirilo-kit.js:51`) |
| Q (ulti) | **falta** | `src/systems/ability-cards.js:13-23` |
| R (dominio) | **falta** | `src/systems/ability-cards.js:13-23` |

Faltan: ataques 2 y 3, evoluciones 2 y 3, pasiva, Q y R. Los puestos vacíos se muestran como «PRÓXIMAMENTE» (`src/systems/ultimate.js:26`, `src/systems/ability-cards.js:50`).

## Archivos que lo implementan
Casi todo es datos genéricos; no hay archivo propio de sistema.
- `src/data/catalog.js` (:33 personaje), `src/data/powers.js`, `src/data/attributes.js`, `src/systems/evolutions.js`, `src/systems/gacha.js`.
- Render: `src/rendering/walk-art.js`, `companion-art.js`, `dragon-epic.js`, `src/data/muzzle-anchors.js`.
- No aparece en `backend/`: el servidor usa los datos del cliente vía `Simulation`.

Sistemas relacionados: [[sistemas/evoluciones/README]] · [[sistemas/atributos/README]] · [[sistemas/gacha-meta/README]] · [[sistemas/combate/README]]
