---
tipo: personaje
id: fuzo
archivos: [src/data/catalog.js, src/data/powers.js, src/systems/evolutions.js, src/systems/gacha.js, src/data/attributes.js]
verificado: 2026-10-31
---
# Fuzo

Kit: **2/9** (1 ataque + 1 evolución implementados). `P.CharacterContract.describe` (`src/data/character-contract.js:11`), comprobado con `Simulation`.
Notas: [[personajes/fuzo/ataques]] · [[personajes/fuzo/poderes]] · [[personajes/fuzo/assets]] · [[personajes/fuzo/tests]] · [[personajes/fuzo/gotchas]]

## Identidad
| Campo | Valor | Fuente |
|---|---|---|
| Nombre | Fuzo | `src/data/catalog.js:33` |
| Categoría | Streamer · parodia | `src/data/catalog.js:33` |
| Rol / secundario | Tirador / Controlador | `src/data/powers.js:24` |
| Raza / alcance / daño | Humano / largo / especial | `src/data/powers.js:24` |
| Dificultad | Fácil | `src/data/powers.js:24` |
| Etiquetas | piercing, sustained | `src/data/powers.js:24` |
| Especialidad | Perforador de filas. Fuerte: «Dos tarjetas contra hasta tres rivales cada una.» Débil: «Necesita alinear enemigos.» | `src/data/powers.js:49` |

## Estadísticas efectivas
- `hp 115`, `speed 180`, `power 24` (`src/data/catalog.js:33`). Ningún parche posterior las toca (`src/data/powers.js:82` solo parchea cristorata, alberto, g5).
- Ataque inicial `bankCards` (Tarjetazo BCP); `atlas:'powers'`, `spriteRow:6` (`src/data/powers.js:72-73`; el catálogo decía atlas `streamers` fila 4).
- Atributo **Ingenio**, canal **especial**: ATQ fís. 85, ATQ esp. 100, DEF fís. 95, DEF esp. 105 (`src/data/attributes.js:5,7`; el canal contrario siempre vale 85).
- El panel de admin puede sobrescribir hp/power/speed en ejecución (`src/systems/character-balance.js:23`).

## Rareza de colección
- **R · Raro (`rare`)**, 27 % de probabilidad; crecimiento ×1,03 (`src/systems/gacha.js:4,5`).

## Estado del kit
| Pieza | Estado | Dónde |
|---|---|---|
| Ataque 1 Tarjetazo BCP | implementado | `src/data/powers.js:67` |
| Ataque 2 y 3 | **faltan** (reservados, «por definir») | `src/data/powers.js:51` (`weaponSlots` sin `weaponKits`) |
| Evolución 1 Banca infinita | implementada | `src/systems/evolutions.js:18` |
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
