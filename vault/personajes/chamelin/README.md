---
tipo: personaje
id: chamelin
archivos: [src/data/powers.js, src/systems/chamelin-kit.js, src/systems/chamelin.js, src/systems/chamelin-arena.js, src/rendering/chamelin-art.js, src/rendering/chamelin-bathroom.js, src/rendering/chamelin-fluency.js, src/rendering/chamelin-kit-art.js, src/data/attributes.js, src/systems/gacha.js, tests/chamelin-kit.test.cjs, tests/chamelin.test.cjs]
verificado: 2026-10-31
---
# Chamelín · Trovo

Controlador de zonas UR (charcos de daño continuo y ralentización). Kit **9/9**. Notas: [[personajes/chamelin/ataques]], [[personajes/chamelin/poderes]], [[personajes/chamelin/assets]], [[personajes/chamelin/tests]], [[personajes/chamelin/gotchas]].

## Identidad
- Nombre efectivo `Chamelín · Trovo`: se define como `Chamelín Trovo` (`src/data/powers.js:106`) y `P.CharacterSkins.init` lo reescribe con `baseName · title` (`src/systems/character-skins.js:15,21`). Categoría `Streamer · parodia`, `look:'chullo'`, color `#5097cf`, atlas `chamelin` fila 0.
- Posición 19 en `P.Data.characters` (medido ejecutando `backend/simulation.cjs`; los tests usan 19: `tests/character-balance.test.cjs:12`).
- Rol `controller` + secundario `specialist`, especie `human`, alcance `medium`, daño `special`, tags `area`, `dot`, `control`, `fixed`, dificultad `advanced` (`src/data/powers.js:33`). Sin parche posterior de identidad.
- Texto de rol «Control de zonas UR» (`powers.js:107`).

## Estadísticas efectivas
| hp | speed | power | cadencia (Retaguardia) |
|---|---|---|---|
| 125 | 185 | 28 | 0,8 s |
- `src/data/powers.js:106`; sin parches posteriores. Cadencia en `powers.js:105`.
- `src/systems/character-balance.js:12` incluye a `chamelin` en `attackReach`. Los overrides de admin sobre hp, power y velocidad se prueban en `tests/character-balance.test.cjs:9-19`.
- Combate: ATQ físico 85, ATQ especial 100, DEF física 105, DEF especial 100 (`src/data/attributes.js:5`: `['wit','special',105,100]`).

## Colección, atributo y canal
- Rareza `UR · Supremo` (`src/systems/gacha.js:4`, tier `ultra`, crecimiento ×1,12 en `gacha.js:5`). No está entre los desbloqueados de inicio (`src/systems/meta-progress.js:21`).
- Atributo `Ingenio`, canal `special`.
- Ver [[sistemas/atributos/README]] y [[sistemas/gacha-meta/README]].

## Estado del kit: 9/9
Medido con `P.CharacterContract.describe` (`src/data/character-contract.js:10`): `implemented 9, total 9, complete true`.
| Pieza | Dónde |
|---|---|
| 3 ataques | `weaponKits.chamelin` (`chamelin-kit.js:48`); perfiles `chamelin-kit.js:5-6` y `powers.js:105` |
| 3 evoluciones | `chamelin-kit.js:7` y `evolutions.js:4` |
| Pasiva «Presión acumulada» | `chamelin-kit.js:49` |
| Q «¡SE TAPÓ TODO!» | `chamelin-kit.js:42-43`; carta `chamelin-kit.js:50` |
| R «Baño de Trovo» | `src/systems/chamelin.js`; carta `ability-cards.js:23`; nombre `character-contract.js:7` |

Ver [[sistemas/ulti/README]], [[sistemas/dominios/README]], [[sistemas/pasivas/README]], [[sistemas/evoluciones/README]].

## Archivos que lo implementan
`grep -rln "'chamelin'" src` (19 archivos):
- Datos: `src/data/powers.js`, `character-contract.js`
- Sistemas: `src/systems/chamelin-kit.js`, `chamelin.js`, `character-balance.js`, `character-skins.js`, `evolutions.js`, `gacha.js`, `progression.js`
- Render: `src/rendering/chamelin-art.js`, `chamelin-bathroom.js`, `dragon-epic.js`, `walk-art.js`
- UI y otros: `src/ui/admin-balance.js`, `attack-hud.js`, `balance-preview.js`, `lobby.js`, `skill-preview.js`, `src/development/test-bench.js`
- No salen en ese grep pero son suyos: `src/systems/chamelin-arena.js`, `src/rendering/chamelin-fluency.js`, `src/rendering/chamelin-kit-art.js`.
