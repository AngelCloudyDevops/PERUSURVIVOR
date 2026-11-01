---
tipo: personaje
id: shaka
archivos: [src/data/catalog.js, src/data/powers.js, src/systems/evolutions.js, src/systems/gacha.js, src/data/attributes.js]
verificado: 2026-10-31
---
# Shakadoto

Kit: **2/9** (1 ataque + 1 evolución implementados). `P.CharacterContract.describe` (`src/data/character-contract.js:11`), comprobado con `Simulation`.
Notas: [[personajes/shaka/ataques]] · [[personajes/shaka/poderes]] · [[personajes/shaka/assets]] · [[personajes/shaka/tests]] · [[personajes/shaka/gotchas]]

## Identidad
| Campo | Valor | Fuente |
|---|---|---|
| Nombre | Shakadoto | `src/data/catalog.js:33` |
| Categoría | Streamer · parodia | `src/data/catalog.js:33` |
| Rol / secundario | Controlador / Hostigador | `src/data/powers.js:21` |
| Raza / alcance / daño | Humano / medio / físico | `src/data/powers.js:21` |
| Dificultad | Intermedia | `src/data/powers.js:21` |
| Etiquetas | returning, area, control | `src/data/powers.js:21` |
| Especialidad | Control de pasillos. Fuerte: «Dos bumeranes y buena vida.» Débil: «Lento; necesita alinear el retorno.» | `src/data/powers.js:49` |

## Estadísticas efectivas
- `hp 140`, `speed 160`, `power 35` (`src/data/catalog.js:33`). Ningún parche posterior las toca (`src/data/powers.js:82` solo parchea cristorata, alberto, g5).
- Ataque inicial `bananas` (Plátanos de vuelta); `atlas:'powers'`, `spriteRow:5` (`src/data/powers.js:72-73`; el catálogo decía atlas `streamers` fila 1).
- Atributo **Fuerza**, canal **físico**: ATQ fís. 100, ATQ esp. 85, DEF fís. 110, DEF esp. 90 (`src/data/attributes.js:5,7`; el canal contrario siempre vale 85).
- El panel de admin puede sobrescribir hp/power/speed en ejecución (`src/systems/character-balance.js:23`).

## Rareza de colección
- **SR · Súper raro (`epic`)**, 9 % de probabilidad; crecimiento ×1,06 (`src/systems/gacha.js:4,5`).

## Estado del kit
| Pieza | Estado | Dónde |
|---|---|---|
| Ataque 1 Plátanos de vuelta | implementado | `src/data/powers.js:66` |
| Ataque 2 y 3 | **faltan** (reservados, «por definir») | `src/data/powers.js:51` (`weaponSlots` sin `weaponKits`) |
| Evolución 1 Tornado bananero | implementada | `src/systems/evolutions.js:15` |
| Evolución 2 y 3 | **faltan** | `src/data/character-contract.js:12` |
| Pasiva | **falta** | `src/systems/passives.js:5` (solo kingteka y makanaky; cirilo se añade en `cirilo-kit.js:51`) |
| Q (ulti) | **falta** | `src/systems/ability-cards.js:13-23` |
| R (dominio) | **falta** | `src/systems/ability-cards.js:13-23` |

Faltan: ataques 2 y 3, evoluciones 2 y 3, pasiva, Q y R. Los puestos vacíos se muestran como «PRÓXIMAMENTE» (`src/systems/ultimate.js:26`, `src/systems/ability-cards.js:50`).

## Archivos que lo implementan
Casi todo es datos genéricos; no hay archivo propio de sistema.
- `src/data/catalog.js` (:33 personaje), `src/data/powers.js`, `src/data/attributes.js`, `src/systems/evolutions.js`, `src/systems/gacha.js`.
- Render: `src/rendering/walk-art.js`, `companion-art.js`, `dragon-epic.js`.
- No aparece en `backend/`: el servidor usa los datos del cliente vía `Simulation`.

Sistemas relacionados: [[sistemas/evoluciones/README]] · [[sistemas/atributos/README]] · [[sistemas/gacha-meta/README]] · [[sistemas/combate/README]]
