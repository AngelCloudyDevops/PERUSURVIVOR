---
tipo: personaje
id: alan
archivos: [src/data/catalog.js, src/data/powers.js, src/data/attributes.js, src/systems/evolutions.js, src/systems/combat.js]
verificado: 2026-10-31
---
# Alan García (alan)
Kit **2/9**: solo ataque 1 y evolución 1. Verificado en ejecución con `P.CharacterContract.describe` (`src/data/character-contract.js:10-12`).
Faltan: ataques 2 y 3, evoluciones 2 y 3, pasiva, Q y R.

## Identidad
| Dato | Valor | Fuente |
|---|---|---|
| Nombre efectivo | «Alan García · Los Balconazos» | `src/data/catalog.js:8`, `src/systems/character-skins.js:8,21` |
| Categoría | Presidente · parodia | `catalog.js:8` |
| Índice | 3 en `P.Data.characters` | `catalog.js:32` |
| Rol / secundario | Controlador / Vanguardia | `src/data/powers.js:16` |
| Raza, alcance, daño, dificultad | Humano, Corto, Especial, Intermedia | `powers.js:16` |
| Etiquetas | Área, Control, Ráfaga | `powers.js:16` |
| Texto de rol | «Control frontal · Cono contra grupos · Lento y dependiente de la orientación» | `powers.js:49` |

## Estadísticas efectivas
- `hp 130`, `speed 160`, `power 31` (`src/data/catalog.js:8`). Sin parches posteriores.
- Ataque `speech`: `cooldown 0.85`, `range 230` (`catalog.js:18`).
- Atlas `base`, `spriteRow:4` (`catalog.js:8`, `src/rendering/sprites.js:4`).

## Atributo y canal
- **Ingenio**, canal **Especial**, ATQ físico 85 / especial 100, DEF física 100 / especial 110 (`src/data/attributes.js:5,7`).

## Rareza
- **SR · Súper raro** (`epic`) (`src/systems/gacha.js:4`). Se desbloquea por gacha.

## Estado del kit
| Pieza | Estado | Dónde |
|---|---|---|
| Ataque 1 `speech` «Discurso interminable» | implementado | `catalog.js:18` |
| Ataques 2 y 3 | por definir | `src/data/powers.js:51` (`weaponSlots`, sin `weaponKits.alan`) |
| Evolución 1 «Eco de la plaza» | implementada | `src/systems/evolutions.js:10` |
| Evoluciones 2 y 3 | por definir | `character-contract.js:11` |
| Pasiva | por definir | `src/systems/passives.js:4-7` |
| Q | por definir | `AbilityCards.definition('alan','ultimate')` es `null`; el HUD muestra «Q · ULTI · PRÓXIMAMENTE» (`src/systems/ultimate.js:26`) |
| R | por definir | `AbilityCards.definition('alan','domain')` es `null` |

## Archivos que lo implementan
`grep -rln "'alan'" src` da solo: `src/data/catalog.js`, `src/entities/actors.js` (dibujo, `:32`), `src/rendering/{companion-art,dragon-epic,walk-art}.js`, `src/systems/{character-skins,gacha}.js`. Más, sin comillas: `src/data/{powers,attributes}.js`, `src/systems/evolutions.js:10`.

Notas: [[personajes/alan/ataques]] · [[personajes/alan/poderes]] · [[personajes/alan/assets]] · [[personajes/alan/tests]].
Ver [[sistemas/combate/README]] · [[sistemas/evoluciones/README]].
