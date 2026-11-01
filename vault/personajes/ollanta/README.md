---
tipo: personaje
id: ollanta
archivos: [src/data/catalog.js, src/data/powers.js, src/data/attributes.js, src/systems/evolutions.js, src/systems/combat.js]
verificado: 2026-10-31
---
# Ollanta Humala (ollanta)
Kit **2/9**: solo ataque 1 y evolución 1. Verificado en ejecución con `P.CharacterContract.describe` (`src/data/character-contract.js:10-12`).
Faltan: ataques 2 y 3, evoluciones 2 y 3, pasiva, Q y R.

## Identidad
| Dato | Valor | Fuente |
|---|---|---|
| Nombre efectivo | «Ollanta Humala · Cosito en Campaña» | `src/data/catalog.js:11`, `src/systems/character-skins.js:11,21` |
| Categoría | Presidente · parodia | `catalog.js:11` |
| Índice | 6 en `P.Data.characters` | `catalog.js:32` |
| Rol / secundario | Vanguardia / Guardián | `src/data/powers.js:19` |
| Raza, alcance, daño, dificultad | Humano, Corto, Especial, Fácil | `powers.js:19` |
| Etiquetas | Área, Resistencia, Control | `powers.js:19` |
| Texto de rol | «Vanguardia · Buena vida y cono frontal · Movilidad moderada y alcance corto» | `powers.js:49` |

## Estadísticas efectivas
- `hp 135`, `speed 170`, `power 30` (`src/data/catalog.js:11`). Sin parches posteriores.
- Ataque `megaphone`: `cooldown 0.9`, `range 250` (`catalog.js:20`).
- Atlas `base`, `spriteRow:7` (`catalog.js:11`, `src/rendering/sprites.js:4`).

## Atributo y canal
- **Fuerza**, canal **Especial**, ATQ físico 85 / especial 100, DEF física 110 / especial 95 (`src/data/attributes.js:5,7`).

## Rareza
- **SR · Súper raro** (`epic`) (`src/systems/gacha.js:4`). Se desbloquea por gacha.

## Estado del kit
| Pieza | Estado | Dónde |
|---|---|---|
| Ataque 1 `megaphone` «Voz de mando» | implementado | `catalog.js:20` |
| Ataques 2 y 3 | por definir | `src/data/powers.js:51` (`weaponSlots`, sin `weaponKits.ollanta`) |
| Evolución 1 «Marcha del comando» | implementada | `src/systems/evolutions.js:13` |
| Evoluciones 2 y 3 | por definir | `character-contract.js:11` |
| Pasiva | por definir | `src/systems/passives.js:4-7` |
| Q | por definir | `AbilityCards.definition('ollanta','ultimate')` es `null`; HUD «Q · ULTI · PRÓXIMAMENTE» (`src/systems/ultimate.js:26`) |
| R | por definir | `AbilityCards.definition('ollanta','domain')` es `null` |

## Archivos que lo implementan
`grep -rln "'ollanta'" src` da solo: `src/data/catalog.js`, `src/rendering/{companion-art,dragon-epic,walk-art}.js`, `src/systems/{character-skins,gacha}.js`. Más, sin comillas: `src/data/{powers,attributes}.js`, `src/systems/evolutions.js:13,54`.

Notas: [[personajes/ollanta/ataques]] · [[personajes/ollanta/poderes]] · [[personajes/ollanta/assets]] · [[personajes/ollanta/tests]].
Ver [[sistemas/combate/README]] · [[sistemas/evoluciones/README]].
