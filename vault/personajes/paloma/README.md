---
tipo: personaje
id: paloma
archivos: [src/data/catalog.js, src/data/powers.js, src/data/attributes.js, src/systems/evolutions.js, src/systems/animal-ultimates.js, src/systems/ability-cards.js, src/systems/combat.js]
verificado: 2026-10-31
---
# Paloma del Centro (paloma)
Kit **3/9**: ataque 1, evolución 1 y Q. Verificado en ejecución con `P.CharacterContract.describe` (`src/data/character-contract.js:10-12`).
Faltan: ataques 2 y 3, evoluciones 2 y 3, pasiva y dominio R.

## Identidad
| Dato | Valor | Fuente |
|---|---|---|
| Nombre efectivo | «Paloma del Centro · El Almuerzo del Pueblo» | `src/data/catalog.js:7`, `src/systems/character-skins.js:7,21` |
| Categoría | Meme original | `catalog.js:7` |
| Índice | 2 en `P.Data.characters` | `catalog.js:32` |
| Rol / secundario | Tirador / Hostigador | `src/data/powers.js:15` |
| Raza, alcance, daño, dificultad | Animal, Largo, Físico, Intermedia | `powers.js:15` |
| Etiquetas | Movilidad, Área | `powers.js:15` |
| Texto de rol | «Exploradora · Gran movilidad y abanico amplio · Muy poca vida; dispersa impactos» | `powers.js:49` |

## Estadísticas efectivas
- `hp 85`, `speed 225`, `power 17` (`src/data/catalog.js:7`). Sin parches posteriores.
- Ataque `feathers`: `cooldown 0.8`, `range 650` (`catalog.js:17`); 5 plumas por defecto (`src/systems/combat.js:22`).
- Atlas `base`, `spriteRow:3` (`catalog.js:7`, `src/rendering/sprites.js:4`).

## Atributo y canal
- **Técnica**, canal **Físico**, ATQ físico 100 / especial 85, DEF física 90 / especial 100 (`src/data/attributes.js:5,7`).

## Rareza
- **C · Común** (`src/systems/gacha.js:4`). Desbloqueada de inicio (`src/systems/meta-progress.js:21`; `backend/accounts.cjs:78`).

## Estado del kit
| Pieza | Estado | Dónde |
|---|---|---|
| Ataque 1 `feathers` «Ráfaga de la plaza» | implementado | `catalog.js:17` |
| Ataques 2 y 3 | por definir | `src/data/powers.js:51` |
| Evolución 1 «Corona de plumas» | implementada | `src/systems/evolutions.js:9` |
| Evoluciones 2 y 3 | por definir | `character-contract.js:11` |
| Pasiva | por definir | `src/systems/passives.js:4-7` |
| Q «Bandada del Centro» | implementada | `src/systems/animal-ultimates.js:3`, `ability-cards.js:18` |
| R | por definir | `AbilityCards.definition('paloma','domain')` es `null` |

## Archivos que lo implementan
- Datos: `src/data/{catalog,powers,attributes}.js`.
- Q: `src/systems/animal-ultimates.js`, `src/rendering/animal-entry.js`, `src/rendering/animal-entry-poses.js`.
- Otros: `src/systems/{evolutions,ability-cards,causa-combo,character-skins,gacha,meta-progress,minibosses}.js`, `src/rendering/{walk-art,companion-art,dragon-epic}.js`, `backend/accounts.cjs:78`.
- `minibosses.js:7` usa el id `paloma` para «La Paloma Brava» (enemigo, no el jugable).

Notas: [[personajes/paloma/ataques]] · [[personajes/paloma/poderes]] · [[personajes/paloma/assets]] · [[personajes/paloma/tests]] · [[personajes/paloma/gotchas]].
Ver también [[personajes/cuy/README]] (comparte la Q) y [[sistemas/ulti/README]].
