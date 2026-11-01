---
tipo: personaje
id: alberto
archivos: [src/data/catalog.js, src/data/powers.js, src/data/attributes.js, src/systems/evolutions.js, src/systems/court-ultimate.js, src/systems/ability-cards.js, src/systems/combat.js]
verificado: 2026-10-31
---
# Alberto Fujimori (alberto)
Kit **3/9**: ataque 1, evolución 1 y Q. Verificado en ejecución con `P.CharacterContract.describe` (`src/data/character-contract.js:10-12`).
Faltan: ataques 2 y 3, evoluciones 2 y 3, pasiva y dominio R.

## Identidad
| Dato | Valor | Fuente |
|---|---|---|
| Nombre efectivo | «Alberto Fujimori · ¡Soy Inocente!» | `src/data/catalog.js:9`, `src/systems/character-skins.js:9,21` |
| Categoría | Presidente · parodia | `catalog.js:9` |
| Índice | 4 en `P.Data.characters` | `catalog.js:32` |
| Rol / secundario | Guardián / Controlador | `src/data/powers.js:17` |
| Raza, alcance, daño, dificultad | Humano, Corto, Especial, Intermedia | `powers.js:17` |
| Etiquetas | Área, Resistencia, Control | `powers.js:17` |
| Texto de rol | «Defensa orbital · Bandas que cubren el entorno · Necesita acercarse; cobertura discontinua» | `powers.js:49` |

## Estadísticas efectivas
- `hp 120`, `speed 175`, `power 28`. El catálogo trae 110 de vida y 24 de poder (`src/data/catalog.js:9`); el parche los sube (`src/data/powers.js:82`).
- Ataque `orbit`: `cooldown 0.42` (catálogo 0,45; parche `powers.js:85`), `range 100`.
- Atlas `base`, `spriteRow:5` (`catalog.js:9`, `src/rendering/sprites.js:4`).

## Atributo y canal
- **Ingenio**, canal **Especial**, ATQ físico 85 / especial 100, DEF física 105 / especial 105 (`src/data/attributes.js:5,7`).

## Rareza
- **SSR · Ultra raro** (`legendary`) (`src/systems/gacha.js:4`). Se desbloquea por gacha.

## Estado del kit
| Pieza | Estado | Dónde |
|---|---|---|
| Ataque 1 `orbit` «Banda presidencial» | implementado | `catalog.js:21` |
| Ataques 2 y 3 | por definir | `src/data/powers.js:51` |
| Evolución 1 «Órbita presidencial» | implementada | `src/systems/evolutions.js:11` |
| Evoluciones 2 y 3 | por definir | `character-contract.js:11` |
| Pasiva | por definir | `src/systems/passives.js:4-7` |
| Q «Tribunal del Pueblo» | implementada | `src/systems/court-ultimate.js`, `ability-cards.js:15` |
| R | por definir | `AbilityCards.definition('alberto','domain')` es `null` |

## Archivos que lo implementan
- Datos: `src/data/{catalog,powers,attributes}.js`.
- Q: `src/systems/court-ultimate.js`, `src/rendering/court-art.js`, `src/scenes/practice.js` (práctica con jefe de entrenamiento).
- Ataque: `src/systems/combat.js:15,33` (bandas), `src/systems/evolutions.js:11,31`.
- Otros: `src/systems/{ability-cards,causa-combo,ultimate,character-skins,gacha}.js`, `src/rendering/{walk-art,companion-art,dragon-epic}.js`, `src/entities/actors.js` (dibujo, `:32-33`), `src/development/test-bench.js`.
- **No es** el jefe «Alberto Fujimori · El Expediente Final» (`src/systems/fujimori-boss.js:2-4`), que es un enemigo aparte.

Notas: [[personajes/alberto/ataques]] · [[personajes/alberto/poderes]] · [[personajes/alberto/assets]] · [[personajes/alberto/tests]] · [[personajes/alberto/gotchas]].
Ver [[sistemas/ulti/README]] · [[sistemas/combate/README]].
