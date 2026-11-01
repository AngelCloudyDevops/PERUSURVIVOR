---
tipo: personaje
id: keiko
archivos: [src/data/catalog.js, src/data/powers.js, src/data/attributes.js, src/systems/evolutions.js, src/systems/combat.js]
verificado: 2026-10-31
---
# Keiko Fujimori (keiko)
Kit **2/9**: solo ataque 1 y evolución 1. Verificado en ejecución con `P.CharacterContract.describe` (`src/data/character-contract.js:10-12`).
Faltan: ataques 2 y 3, evoluciones 2 y 3, pasiva, Q y R.

## Identidad
| Dato | Valor | Fuente |
|---|---|---|
| Nombre efectivo | «Keiko Fujimori · País Rico» | `src/data/catalog.js:10`, `src/systems/character-skins.js:10,21` |
| Categoría | Política · parodia | `catalog.js:10` |
| Índice | 5 en `P.Data.characters` | `catalog.js:32` |
| Rol / secundario | Hostigador / Tirador | `src/data/powers.js:18` |
| Raza, alcance, daño, dificultad | Humano, Medio, Físico, Intermedia | `powers.js:18` |
| Etiquetas | Retorno, Perforación, Ráfaga | `powers.js:18` |
| Texto de rol | «Hostigadora de retorno · Abanico que atraviesa y regresa · Recarga larga; depende del retorno» | `powers.js:49` |

## Estadísticas efectivas
- `hp 110`, `speed 185`, `power 23` (`src/data/catalog.js:10`). Sin parches posteriores.
- Ataque `fan`: `cooldown 1.05`, `range 540` (`catalog.js:19`).
- Atlas `base`, `spriteRow:6` (`catalog.js:10`, `src/rendering/sprites.js:4`).

## Atributo y canal
- **Técnica**, canal **Físico**, ATQ físico 100 / especial 85, DEF física 100 / especial 100 (`src/data/attributes.js:5,7`).

## Rareza
- **SSR · Ultra raro** (`legendary`) (`src/systems/gacha.js:4`); crecimiento ×1,09 (`gacha.js:5`, `tests/gacha.test.cjs`). Se desbloquea por gacha.

## Estado del kit
| Pieza | Estado | Dónde |
|---|---|---|
| Ataque 1 `fan` «Abanico naranja» | implementado | `catalog.js:19` |
| Ataques 2 y 3 | por definir | `src/data/powers.js:51` (`weaponSlots`, sin `weaponKits.keiko`) |
| Evolución 1 «Abanico solar» | implementada | `src/systems/evolutions.js:12` |
| Evoluciones 2 y 3 | por definir | `character-contract.js:11` |
| Pasiva | por definir | `src/systems/passives.js:4-7` |
| Q | por definir | `AbilityCards.definition('keiko','ultimate')` es `null`; HUD «Q · ULTI · PRÓXIMAMENTE» (`src/systems/ultimate.js:26`) |
| R | por definir | `AbilityCards.definition('keiko','domain')` es `null` |

## Archivos que lo implementan
`grep -rln "'keiko'" src` da solo: `src/data/catalog.js`, `src/rendering/{companion-art,dragon-epic,walk-art}.js`, `src/systems/{character-skins,gacha}.js`. Más, sin comillas: `src/data/{powers,attributes}.js`, `src/systems/evolutions.js:12`.

Notas: [[personajes/keiko/ataques]] · [[personajes/keiko/poderes]] · [[personajes/keiko/assets]] · [[personajes/keiko/tests]].
Ver [[sistemas/combate/README]] · [[sistemas/evoluciones/README]].
