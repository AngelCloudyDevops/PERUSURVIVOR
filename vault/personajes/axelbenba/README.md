---
tipo: personaje
id: axelbenba
archivos: [src/data/catalog.js, src/data/powers.js, src/systems/evolutions.js, src/systems/gacha.js, src/data/attributes.js]
verificado: 2026-10-31
---
# Axel Benba

Kit: **2/9** (1 ataque + 1 evolución implementados). `P.CharacterContract.describe` (`src/data/character-contract.js:11`), comprobado con `Simulation`.
Notas: [[personajes/axelbenba/ataques]] · [[personajes/axelbenba/poderes]] · [[personajes/axelbenba/assets]] · [[personajes/axelbenba/tests]]

## Identidad
| Campo | Valor | Fuente |
|---|---|---|
| Nombre | Axel Benba | `src/data/catalog.js:33` |
| Categoría | Streamer · parodia | `src/data/catalog.js:33` |
| Rol / secundario | Tirador / Hostigador | `src/data/powers.js:26` |
| Raza / alcance / daño | Humano / largo / especial | `src/data/powers.js:26` |
| Dificultad | Fácil | `src/data/powers.js:26` |
| Etiquetas | mobility, burst | `src/data/powers.js:26` |
| Especialidad | Tirador de abanico. Fuerte: «Tres proyectiles y buena movilidad.» Débil: «Poca vida; dispersa impactos.» | `src/data/powers.js:49` |

## Estadísticas efectivas
- `hp 100`, `speed 200`, `power 21` (`src/data/catalog.js:33`). Ningún parche posterior las toca (`src/data/powers.js:82` solo parchea cristorata, alberto, g5).
- Ataque inicial `axelClip` (Clip relámpago); `atlas:'streamers'`, `spriteRow:6` (`src/data/catalog.js:33`); `src/data/powers.js:72-73` no lo cambia.
- Atributo **Técnica**, canal **especial**: ATQ fís. 85, ATQ esp. 100, DEF fís. 95, DEF esp. 100 (`src/data/attributes.js:5,7`; el canal contrario siempre vale 85).
- El panel de admin puede sobrescribir hp/power/speed en ejecución (`src/systems/character-balance.js:23`).

## Rareza de colección
- **C · Común (`common`)**, 60 % de probabilidad; crecimiento ×1 (`src/systems/gacha.js:4,5`).

## Estado del kit
| Pieza | Estado | Dónde |
|---|---|---|
| Ataque 1 Clip relámpago | implementado | `src/data/catalog.js:35` |
| Ataque 2 y 3 | **faltan** (reservados, «por definir») | `src/data/powers.js:51` (`weaponSlots` sin `weaponKits`) |
| Evolución 1 Tormenta relámpago | implementada | `src/systems/evolutions.js:20` |
| Evolución 2 y 3 | **faltan** | `src/data/character-contract.js:12` |
| Pasiva | **falta** | `src/systems/passives.js:5` (solo kingteka y makanaky; cirilo se añade en `cirilo-kit.js:51`) |
| Q (ulti) | **falta** | `src/systems/ability-cards.js:13-23` |
| R (dominio) | **falta** | `src/systems/ability-cards.js:13-23` |

Faltan: ataques 2 y 3, evoluciones 2 y 3, pasiva, Q y R. Los puestos vacíos se muestran como «PRÓXIMAMENTE» (`src/systems/ultimate.js:26`, `src/systems/ability-cards.js:50`).

## Archivos que lo implementan
Casi todo es datos genéricos; no hay archivo propio de sistema.
- `src/data/catalog.js` (:33 personaje, :35 ataque), `src/data/powers.js`, `src/data/attributes.js`, `src/systems/evolutions.js`, `src/systems/gacha.js`.
- Render: `src/rendering/walk-art.js`, `companion-art.js`, `dragon-epic.js`.
- No aparece en `backend/`: el servidor usa los datos del cliente vía `Simulation`.

Sistemas relacionados: [[sistemas/evoluciones/README]] · [[sistemas/atributos/README]] · [[sistemas/gacha-meta/README]] · [[sistemas/combate/README]]
