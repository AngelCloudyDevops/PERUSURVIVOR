---
tipo: personaje
id: makanaky
archivos: [src/data/powers.js, src/systems/makanaky-arsenal.js, src/systems/makanaky-ultimate.js, src/systems/domain.js, src/systems/passives.js, src/systems/ability-cards.js, src/data/attributes.js, src/systems/gacha.js, tests/makanaky-kit.test.cjs]
verificado: 2026-10-31
---
# Makanaky · La Realeza

Luchador cuerpo a cuerpo UR con kit **9/9**. Existe también como **minijefe** de la plaza (otro actor, mismo id); ver más abajo. Notas: [[personajes/makanaky/ataques]], [[personajes/makanaky/poderes]], [[personajes/makanaky/assets]], [[personajes/makanaky/tests]], [[personajes/makanaky/gotchas]].

## Identidad
- Nombre `Makanaky · La Realeza` (`src/data/powers.js:96`; `baseName` Makanaky + título «La Realeza» en `src/systems/character-skins.js:13`), categoría `Streamer · parodia`, color `#ef92cf`, atlas `makanaky` fila 0.
- Posición 17 en `P.Data.characters` (medido ejecutando `backend/simulation.cjs`; los tests usan 17: `tests/miniboss-phase.test.cjs:184`).
- Rol `vanguard` + secundario `specialist`, especie `human`, alcance `melee`, daño `hybrid`, tags `sustained`, `control`, `evolution`, `mobility`, `durability`, dificultad `advanced` (`src/data/powers.js:31`).
- Texto de rol: «Luchador ofensivo / duelista» (`powers.js:97`).

## Estadísticas efectivas
| hp | speed | power | cadencia (Puño) |
|---|---|---|---|
| 135 | 190 | 30 | 0,6 s |
- `src/data/powers.js:96`; sin parches posteriores. `makanaky` no está en el parche de balance de `powers.js:82`.
- `src/systems/character-balance.js:12` incluye a `makanaky` en `attackReach` (alcance por técnica ajustable por admin en ejecución).
- Estadísticas de combate propias (`src/data/attributes.js:7`): ATQ físico 115, ATQ especial 95, DEF física 110, DEF especial 90, perforación 0,05, resistencia de estado 0,12, regeneración 0,4, crítico 0,08 (×1,5), resistencia crítica 0,05, defensa crítica 0,1, robo de vida 0,03.

## Colección, atributo y canal
- Rareza `UR · Supremo` (`src/systems/gacha.js:4`, tier `ultra`, crecimiento ×1,12 en `gacha.js:5`).
- Desbloqueado de inicio: lista base `unlocked` en `src/systems/meta-progress.js:21` y propiedad gratuita en `backend/accounts.cjs:78`. Test: `tests/gacha.test.cjs:35`.
- Atributo `Fuerza`, canal `physical` (`src/data/attributes.js:5`); ver [[sistemas/atributos/README]] y [[sistemas/gacha-meta/README]].

## Estado del kit: 9/9
Medido con `P.CharacterContract.describe` (`src/data/character-contract.js:10`): `implemented 9, total 9, complete true`.
| Pieza | Dónde |
|---|---|
| 3 ataques | `weaponKits.makanaky` `src/data/powers.js:43-47`; `src/systems/makanaky-arsenal.js:5-7` |
| 3 evoluciones | `makanaky-arsenal.js:10-12` |
| Pasiva «Racha de la Realeza» | `src/systems/passives.js:6` |
| Q «Los Tres de la Realeza» | `src/systems/makanaky-ultimate.js`; carta `ability-cards.js:19` |
| R «La Realeza» (nombre contractual «¡BÓTAME TU GAAAA!») | `src/systems/domain.js`; carta `ability-cards.js:20`; nombre en `character-contract.js:7` |

Ver [[sistemas/ulti/README]], [[sistemas/dominios/README]], [[sistemas/pasivas/README]], [[sistemas/evoluciones/README]].

## No confundir con el minijefe
- El minijefe `makanaky` vive en `src/systems/minibosses.js:5` (mapa `plaza`, hp 480, ataques `shout` y `flash`). Alterna con el jefe base de la plaza vía `P.Minibosses.choose` (`minibosses.js:10`).
- Es otro actor: no usa `P.MakanakyArsenal` ni `P.Passives`. Las funciones del jugable se protegen con `!p.miniboss` (`passives.js:9`, `makanaky-ultimate.js:5`).
- Ver [[sistemas/minions/README]] para minions y minijefes; el evento de plaza no tiene nota enlazada desde aquí.

## Archivos que lo implementan
`grep -rln "'makanaky'" src` (30 archivos):
- Datos: `src/data/powers.js`, `src/data/attributes.js`, `src/data/character-contract.js`
- Sistemas: `src/systems/ability-cards.js`, `character-balance.js`, `character-skins.js`, `combat.js`, `domain.js`, `evolutions.js`, `gacha.js`, `makanaky-arsenal.js`, `makanaky-ultimate.js`, `meta-progress.js`, `minibosses.js`, `passives.js`, `progression.js`
- Render: `src/rendering/domain-art.js`, `dragon-epic.js`, `effects.js`, `makanaky-player-art.js`, `player-attack-art.js`, `player-status.js`, `walk-art.js`
- UI y otros: `src/ui/attack-hud.js`, `balance-preview.js`, `lobby.js`, `reference-menus.js`, `skill-preview.js`, `src/entities/actors.js`, `src/development/test-bench.js`
- No salen en ese grep pero son suyos: `src/rendering/makanaky-boxing.js`, `src/rendering/domain-intro.js`.
