---
tipo: personaje
id: cristorata
archivos: [src/data/catalog.js, src/data/powers.js, src/data/attributes.js, src/systems/cristorata-kit.js, src/systems/dragon-ultimate.js, src/systems/evolutions.js, src/systems/ability-cards.js, src/systems/causa-combo.js]
verificado: 2026-10-31
---
# Cristorata
Kit **9/9**: único del grupo A completo. Verificado en ejecución con `P.CharacterContract.describe` (`src/data/character-contract.js:10-12`; auditoría en `src/data/powers.js:51-52`): `implemented 9, total 9, missing []`.

## Identidad
| Dato | Valor | Fuente |
|---|---|---|
| Nombre / categoría | Cristorata / «Streamer · parodia» (sin versión, no está en `versions`) | `src/data/catalog.js:5`, `src/systems/character-skins.js:6-11` |
| Índice en `P.Data.characters` | 0 (tras sacar a `zein` como jefe) | `src/data/catalog.js:32` |
| Rol / secundario | Hostigador / Tirador | `src/data/powers.js:13` |
| Raza, alcance, daño, dificultad | Humano, Medio, Físico, Intermedia | `src/data/powers.js:13` |
| Etiquetas | Movilidad, Retorno, Perforación | `src/data/powers.js:13` |
| Texto de rol | «Hostigador móvil · Ida y vuelta perforante · Poca vida; depende del retorno» | `src/data/powers.js:49` |

## Estadísticas efectivas
- `hp 95`, `speed 205`, `power 18`.
- Catálogo trae `power:16` (`src/data/catalog.js:5`); el parche lo sube a **18** (`src/data/powers.js:82`).
- `src/systems/character-balance.js` no cambia estas cifras; solo guarda `defaults` y aplica `overrides` de admin sobre `rate` y `reach` (`character-balance.js:11,23`).
- Atlas `base` (`causas-atlas-v1.webp`), `spriteRow:1` (`catalog.js:5`, `src/rendering/sprites.js:4`).

## Atributo y canal
- Atributo **Técnica**, canal **Físico**, ATQ físico 100 / especial 85, DEF física 95 / especial 105 (`src/data/attributes.js:5,7`).

## Rareza de colección
- **C · Común** (`src/systems/gacha.js:4`). Desbloqueado de inicio (`src/systems/meta-progress.js:21`; servidor `backend/accounts.cjs:78`).

## Estado del kit
| Pieza | Estado | Dónde |
|---|---|---|
| Ataque 1 `clip` | implementado | `src/data/catalog.js:15` |
| Ataque 2 `cristoDash` | implementado | `src/systems/cristorata-kit.js:6` |
| Ataque 3 `cristoClaw` | implementado | `src/systems/cristorata-kit.js:6` |
| 3 evoluciones | implementadas | `src/systems/cristorata-kit.js:7`, `src/systems/evolutions.js:7` |
| Pasiva «De ida y de vuelta» | implementada | `src/systems/cristorata-kit.js:40` |
| Q «Invocación de dragón» | implementada | `src/systems/dragon-ultimate.js`, `src/systems/ability-cards.js:16` |
| R «El Coliseo del Dragón» | implementada | `src/systems/cristorata-kit.js:33-34,41` |

## Archivos que lo implementan
- Datos: `src/data/{catalog,powers,attributes,character-contract}.js`.
- Kit: `src/systems/cristorata-kit.js` (arsenal, pasiva, R, parches), `src/rendering/cristorata-kit-art.js`.
- Q: `src/systems/dragon-ultimate.js`, `src/rendering/dragon-art.js`, `src/rendering/dragon-epic.js`.
- Integración: `src/systems/{evolutions,progression,ultimate,causa-combo,ability-cards,character-balance,gacha,meta-progress}.js`, `src/ui/{attack-hud,lobby,skill-preview,balance-preview}.js`, `src/network/cooperative.js`, `src/rendering/{world,walk-art,companion-art}.js`, `src/development/test-bench.js`, `src/core/runtime.js`.
- Servidor: `backend/simulation.cjs:22,31,41,60`, `backend/accounts.cjs:78`.

Notas: [[personajes/cristorata/ataques]] · [[personajes/cristorata/poderes]] · [[personajes/cristorata/assets]] · [[personajes/cristorata/tests]] · [[personajes/cristorata/gotchas]].
Sistemas: [[sistemas/evoluciones/README]] · [[sistemas/ulti/README]] · [[sistemas/dominios/README]] · [[sistemas/pasivas/README]] · [[sistemas/cooperativo/README]].
