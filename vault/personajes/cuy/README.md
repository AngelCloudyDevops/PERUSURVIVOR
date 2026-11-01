---
tipo: personaje
id: cuy
archivos: [src/data/catalog.js, src/data/powers.js, src/data/attributes.js, src/systems/evolutions.js, src/systems/animal-ultimates.js, src/systems/ability-cards.js, src/systems/causa-combo.js]
verificado: 2026-10-31
---
# Cuy Supremo (cuy)
Kit **3/9**: ataque 1, evolución 1 y Q. Verificado en ejecución con `P.CharacterContract.describe` (`src/data/character-contract.js:10-12`).
Faltan: ataques 2 y 3, evoluciones 2 y 3, pasiva y dominio R.

## Identidad
| Dato | Valor | Fuente |
|---|---|---|
| Nombre efectivo | «Cuy Supremo · El Oráculo de la Tómbola» (el catálogo dice «Cuy Supremo»; la versión lo sobrescribe) | `src/data/catalog.js:6`, `src/systems/character-skins.js:6,21` |
| Categoría | Meme original | `catalog.js:6` |
| Índice | 1 en `P.Data.characters` | `catalog.js:32` |
| Rol / secundario | Guardián / Controlador | `src/data/powers.js:14` |
| Raza, alcance, daño, dificultad | Animal, Corto, Especial, Fácil | `powers.js:14` |
| Etiquetas | Área, Control, Resistencia | `powers.js:14` |
| Texto de rol | «Tanque de área · Mucha vida y empuje circular · Lento y de corto alcance» | `powers.js:49` |

## Estadísticas efectivas
- `hp 150`, `speed 155`, `power 34` (`src/data/catalog.js:6`). Ningún parche posterior los cambia (`powers.js:82` solo toca `cristorata`, `alberto`, `g5`).
- Ataque `nova`: `cooldown 1` (catálogo 1,1; parche `powers.js:84`).
- Atlas `base`, `spriteRow:2` (`catalog.js:6`, `src/rendering/sprites.js:4`).

## Atributo y canal
- **Fuerza**, canal **Especial**, ATQ físico 85 / especial 100, DEF física 110 / especial 100 (`src/data/attributes.js:5,7`).

## Rareza
- **C · Común** (`src/systems/gacha.js:4`). Desbloqueado de inicio (`src/systems/meta-progress.js:21`; `backend/accounts.cjs:78`).

## Estado del kit
| Pieza | Estado | Dónde |
|---|---|---|
| Ataque 1 `nova` «¡Habla, causa!» | implementado | `catalog.js:16` |
| Ataques 2 y 3 | por definir | `src/data/powers.js:51` (`weaponSlots`) |
| Evolución 1 «Terremoto del cuy» | implementada | `src/systems/evolutions.js:8` |
| Evoluciones 2 y 3 | por definir | `character-contract.js:11` |
| Pasiva | por definir | `src/systems/passives.js:4-7` (solo hay definiciones de otros ids) |
| Q «Estampida Suprema» | implementada | `src/systems/animal-ultimates.js:3`, `ability-cards.js:17` |
| R | por definir | `AbilityCards.definition('cuy','domain')` es `null` |

## Archivos que lo implementan
- Datos: `src/data/{catalog,powers,attributes}.js`.
- Q: `src/systems/animal-ultimates.js`, `src/rendering/animal-entry.js`, `src/rendering/animal-entry-poses.js`.
- Carga: `src/systems/causa-combo.js:5`.
- Otros: `src/systems/{evolutions,ability-cards,character-skins,gacha,meta-progress,ultimate}.js`, `src/entities/actors.js` (dibujo `look:'cuy'`, `:27`), `src/rendering/{walk-art,companion-art,dragon-epic}.js`, `src/systems/kingteka-domain.js` (reutiliza `cuy`), `backend/accounts.cjs:78`.

Notas: [[personajes/cuy/ataques]] · [[personajes/cuy/poderes]] · [[personajes/cuy/assets]] · [[personajes/cuy/tests]] · [[personajes/cuy/gotchas]].
Ver también [[personajes/paloma/README]] (comparte la Q) y [[sistemas/ulti/README]].
