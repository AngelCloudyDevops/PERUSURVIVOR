---
tipo: personaje
id: sideral
archivos: [src/data/powers.js, src/systems/sideral-kit.js, src/systems/sideral-domain.js, src/rendering/sideral-art.js, src/rendering/sideral-lagarto.js, src/data/attributes.js, src/systems/gacha.js, tests/sideral-kit.test.cjs]
verificado: 2026-10-31
---
# Sideral · Espantaminions

Controlador UR (cono de miedo, colazo, huevos y forma Lagarto). Kit **9/9**. Notas: [[personajes/sideral/ataques]], [[personajes/sideral/poderes]], [[personajes/sideral/assets]], [[personajes/sideral/tests]], [[personajes/sideral/gotchas]].

## Identidad
- Nombre `Sideral · Espantaminions` (`src/data/powers.js:99`; `baseName` Sideral + título «Espantaminions» en `src/systems/character-skins.js:14`), categoría `Streamer · parodia`, color `#ff465f`, atlas `sideral` fila 0.
- Posición 18 en `P.Data.characters` (medido ejecutando `backend/simulation.cjs`).
- Rol `controller` + secundario `specialist`, especie `human`, alcance `medium`, dificultad `advanced` (`src/data/powers.js:32`).
- Daño y tags **parcheados**: de `special` y `control, area, risk` a `hybrid` y `arsenal, control, area, summon, risk` (`src/systems/sideral-kit.js:80`).
- Texto de rol «Controlador del Lagarto» (`sideral-kit.js:81`, sobrescribe `powers.js:100`).

## Estadísticas efectivas
| hp | speed | power | cadencia (Mirada) |
|---|---|---|---|
| 120 | 195 | 27 | 1,35 s |
- `src/data/powers.js:99`; sin parches posteriores de hp, speed o power.
- Cadencia: `P.Data.attacks.sideralFear` (`powers.js:98`) y `P.SideralArsenal.profiles.sideralFear` (`sideral-kit.js:7`).
- `src/systems/character-balance.js:12` incluye a `sideral` en `attackReach` (alcance por técnica ajustable en ejecución por admin).
- Combate: ATQ físico 95, ATQ especial 105, DEF física 100, DEF especial 105 (`src/data/attributes.js:7` fija 95/105 para sideral).

## Colección, atributo y canal
- Rareza `UR · Supremo` (`src/systems/gacha.js:4`, tier `ultra`, crecimiento ×1,12 en `gacha.js:5`).
- Desbloqueado de inicio en la lista base `src/systems/meta-progress.js:21`. El servidor usa esa misma lista para la propiedad en cooperativo: `owns` lee `admin.rules().Meta.blank().unlocked` (`backend/accounts.cjs:78`; test «Propiedad cooperativa» en `tests/accounts.test.cjs`). Un guardado antiguo sin `sideral` en `unlocked` no lo gana en el cliente (`P.Gacha.owns`, `src/systems/gacha.js:9`). Test: `tests/gacha.test.cjs:35`.
- Atributo `Ingenio`, canal `special` (`src/data/attributes.js:5`: `['wit','special',100,105]`).
- Ver [[sistemas/atributos/README]] y [[sistemas/gacha-meta/README]].

## Estado del kit: 9/9
Medido con `P.CharacterContract.describe` (`src/data/character-contract.js:10`): `implemented 9, total 9, complete true`.
| Pieza | Dónde |
|---|---|
| 3 ataques | `P.CharacterProfiles.weaponKits.sideral` (`sideral-kit.js:79`); perfiles `sideral-kit.js:7-9` |
| 3 evoluciones | `sideral-kit.js:12-14` |
| Pasiva «Sangre fría» | `sideral-kit.js:84` |
| Q «Despertar del Lagarto» | `sideral-kit.js:69-70`; carta `sideral-kit.js:83` |
| R «Vacío Sideral» | `src/systems/sideral-domain.js`; carta `ability-cards.js:21` |
- La R se llama «Vacío Sideral» en la carta, pero `character-contract.js:7` guarda «Habitación del Lagarto». El contrato usa el título de la carta (`character-contract.js:9`), así que ese nombre queda sin uso.

Ver [[sistemas/ulti/README]], [[sistemas/dominios/README]], [[sistemas/pasivas/README]], [[sistemas/evoluciones/README]].

## Archivos que lo implementan
`grep -rln "'sideral'" src` (23 archivos):
- Datos: `src/data/powers.js`, `attributes.js`, `character-contract.js`
- Sistemas: `src/systems/ability-cards.js`, `character-balance.js`, `character-skins.js`, `evolutions.js`, `gacha.js`, `meta-progress.js`, `progression.js`, `sideral-domain.js`, `sideral-kit.js`
- Render: `src/rendering/dragon-epic.js`, `sideral-art.js`, `walk-art.js`
- UI y otros: `src/ui/attack-hud.js`, `balance-preview.js`, `lobby.js`, `reference-menus.js`, `screens.js`, `skill-preview.js`, `src/network/cooperative.js`, `src/development/test-bench.js`
- No salen en ese grep pero son suyos: `src/rendering/sideral-lagarto.js`.
