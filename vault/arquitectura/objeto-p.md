---
tipo: arquitectura
id: objeto-p
archivos: [src/data/catalog.js, src/data/powers.js, src/core/runtime.js, scripts/modules.cjs]
verificado: 2026-10-31
---
# El objeto global `P`

## Cómo nace
- `src/data/catalog.js:2` hace `window.P={Data:{…}}`. Es el módulo 1 de `scripts/modules.cjs`.
- Al nacer, `P.Data` trae `characters` (8 iniciales), `attacks`, `arena` y `upgrades`
  (`src/data/catalog.js:3-31`).
- `src/data/catalog.js:32`: `P.Data.boss={...P.Data.characters.shift(),…}`. El primer
  personaje (`zein`) sale del roster y se convierte en el jefe. Ver
  [[gotchas/G013-indices-roster]].
- `src/data/catalog.js:33` y `src/data/powers.js:106,109` añaden el resto con `push`.
  Roster final: 21 personajes, índice 0 = `cristorata`, índice 20 = `marciano`
  (comprobado cargando el motor con `backend/simulation.cjs`).
- Cada script posterior cuelga su namespace: `P.Combat={…}`, `P.UI={…}`…
- Con los 169 módulos cargados, `P` tiene 180 claves (medido en el VM del servidor).

## Utilidades y estado en `src/core/runtime.js`
- `P.$` (`src/core/runtime.js:2`): atajo de `document.querySelector`.
- `P.state` (`src/core/runtime.js:3`): estado de la partida; nace con `mode:'menu'`.
- `P.AssetPolicy` (`:4`), `P.Core` (`:13`, canvas, teclado, ratón), `P.Save` (`:34`).

## Dónde nace cada namespace principal
Posición = índice 1-based en `scripts/modules.cjs`.

| Namespace | Pos. | Archivo:línea |
|---|---|---|
| `P.Data` | 1 | `src/data/catalog.js:2` |
| `P.CharacterProfiles` | 2 | `src/data/powers.js:3` |
| `P.Attributes` | 4 | `src/data/attributes.js:3` |
| `P.Stats` | 5 | `src/data/stats.js:3` |
| `P.Difficulty` | 9 | `src/data/difficulty.js:3` |
| `P.state`, `P.Core`, `P.Save` | 10 | `src/core/runtime.js:3,13,34` |
| `P.Audio` | 11 | `src/systems/audio.js:3` |
| `P.Sprites` | 15 | `src/rendering/sprites.js:2` |
| `P.FX` | 27 | `src/rendering/effects.js:2` |
| `P.Meta` | 28 | `src/systems/meta-progress.js:2` |
| `P.Gacha` | 30 | `src/systems/gacha.js:2` |
| `P.Entities` | 31 | `src/entities/actors.js:14` |
| `P.Combat` | 32 | `src/systems/combat.js:2` |
| `P.Evolutions` | 33 | `src/systems/evolutions.js:3` |
| `P.Systems`, `P.Progression` | 34 | `src/systems/progression.js:2,52` |
| `P.Maps` | 36 | `src/scenes/maps.js:2` |
| `P.Minibosses` | 42 | `src/systems/minibosses.js:3` |
| `P.Encounters` | 51 | `src/systems/encounters.js:3` |
| `P.Chunks` | 57 | `src/systems/chunks.js:3` |
| `P.Terrain` | 61 | `src/systems/terrain.js:2` |
| `P.Loot` | 63 | `src/systems/loot.js:2` |
| `P.DotaItems` | 64 | `src/systems/dota-items.js:3` |
| `P.Market` | 72 | `src/systems/market.js:2` |
| `P.World` | 78 | `src/rendering/world.js:2` |
| `P.Juice` | 79 | `src/rendering/juice.js:3` |
| `P.HurtFx` | 80 | `src/rendering/hurt-vignette.js:3` |
| `P.Lobby` | 83 | `src/ui/lobby.js:2` |
| `P.UI` | 84 | `src/ui/screens.js:2` |
| `P.Lab` | 85 | `src/development/lab.js:2` |
| `P.Ultimate` | 86 | `src/systems/ultimate.js:2` |
| `P.RunMode`, `P.ChaosDirector` | 90 | `src/systems/run-mode.js:4,22` |
| `P.MapEvents` | 91 | `src/systems/map-events.js:3` |
| `P.Coop` | 93 | `src/network/cooperative.js:2` |
| `P.Performance` | 94 | `src/development/performance.js:2` |
| `P.Game` | 96 | `src/scenes/game.js:2` |
| `P.TestBench` | 114 | `src/development/test-bench.js:3` |
| `P.Account` | 117 | `src/network/account.js:2` |
| `P.Domain` | 121 | `src/systems/domain.js:3` |
| `P.CharacterBalance` | 146 | `src/systems/character-balance.js:3` |
| `P.Passives` | 154 | `src/systems/passives.js:3` |

## Reglas
- Un namespace solo existe **después** de su módulo. Usar `P.Game` en un archivo de la
  posición < 96 en tiempo de carga falla; dentro de funciones llamadas luego, no.
- Por eso muchos usan `P.Coop?.active` o `P.MapEvents?.tick`: el `?.` tolera módulos
  ausentes (tests que cargan un solo archivo, VM).
- Los valores de `P.Data` se sobrescriben después: ver [[gotchas/G012-object-assign-sobrescribe]].
- Funciones envueltas: [[arquitectura/envoltorios]]. Orden: [[arquitectura/orden-modulos]].
