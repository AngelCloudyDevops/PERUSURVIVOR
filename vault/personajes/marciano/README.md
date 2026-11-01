---
tipo: personaje
id: marciano
archivos: [src/data/powers.js, src/systems/marciano-kit.js, src/rendering/marciano-kit-art.js, src/data/attributes.js, src/systems/gacha.js, tests/marciano-kit.test.cjs]
verificado: 2026-10-31
---
# Marciano de SJL · El Polvito

Controlador de operativo UR (polvo especial, cajas físicas y reflector). Kit **9/9**. Notas: [[personajes/marciano/ataques]], [[personajes/marciano/poderes]], [[personajes/marciano/assets]], [[personajes/marciano/tests]], [[personajes/marciano/gotchas]].

## Identidad
- Nombre `Marciano de SJL · El Polvito` (`src/data/powers.js:109`; `baseName` + título y `period:'2021'` en `src/systems/character-skins.js:16`), categoría `Meme · parodia`, `look:'alien'`, color `#9dff38`. **Sin atlas ni `spriteRow`**.
- Posición 20 (la última) en `P.Data.characters`: se añade al final a propósito para no mover los índices de salas y repeticiones guardadas (comentario en `powers.js:108`). Medido ejecutando `backend/simulation.cjs`.
- Rol `controller` + secundario `shooter`, especie `creature`, alcance `long`, dificultad `easy` (`src/data/powers.js:30`).
- Daño y tags **parcheados**: de `special` y `area, control, dot` a `hybrid` y `arsenal, control, area, dot, evolution` (`src/systems/marciano-kit.js:54`).
- Texto de rol «Controlador de operativo» (`marciano-kit.js:55`).

## Estadísticas efectivas
| hp | speed | power | cadencia (Polvito) |
|---|---|---|---|
| 115 | 188 | 23 | 0,88 s |
- `src/data/powers.js:109`; sin parches posteriores. Cadencia en `powers.js:70`.
- Con la escolta de la pasiva la velocidad sube ×1,15 durante 3 s (`marciano-kit.js:30`).
- Combate: ATQ físico 85, ATQ especial 100, DEF física 100, DEF especial 105 (`src/data/attributes.js:5`: `['wit','special',100,105]`).
- `src/systems/character-balance.js:12` **no** lista a `marciano` en `attackReach`: el alcance por técnica no es ajustable por admin.

## Colección, atributo y canal
- Rareza `UR · Supremo` (`src/systems/gacha.js:4`, tier `ultra`, crecimiento ×1,12 en `gacha.js:5`). No está entre los desbloqueados de inicio (`src/systems/meta-progress.js:21`).
- Atributo `Ingenio`, canal `special`.
- Ver [[sistemas/atributos/README]] y [[sistemas/gacha-meta/README]].

## Estado del kit: 9/9
Medido con `P.CharacterContract.describe`: `implemented 9, total 9, complete true`. El contrato base no ve las evoluciones del Marciano, así que `marciano-kit.js:62` envuelve `describe` y las marca como implementadas.
| Pieza | Dónde |
|---|---|
| 3 ataques | `weaponKits.marciano` (`marciano-kit.js:53`); perfiles `marciano-kit.js:6-10` |
| 3 evoluciones | `marciano-kit.js:11-15` |
| Pasiva «Expediente fosforescente» | `marciano-kit.js:32-33,56` |
| Q «Treinta intervenidos» | `marciano-kit.js:35-37`; carta `marciano-kit.js:57` |
| R «Disco-Bar Manhattan» | `P.MarcianoDomain` `marciano-kit.js:41-48`; carta `marciano-kit.js:58` |

Ver [[sistemas/ulti/README]], [[sistemas/dominios/README]], [[sistemas/pasivas/README]], [[sistemas/evoluciones/README]].

## Archivos que lo implementan
`grep -rln "'marciano'" src` (12 archivos):
- `src/data/powers.js`, `src/systems/marciano-kit.js`, `character-skins.js`, `gacha.js`, `progression.js`
- `src/rendering/marciano-kit-art.js`, `walk-art.js`, `world.js`, `dragon-epic.js`
- `src/entities/actors.js`, `src/ui/screens.js`, `src/development/equipment-bench.js`
- Además `src/data/attributes.js:5` y `src/systems/evolutions.js:25` (clave sin comillas simples), y el servidor `backend/simulation.cjs:41,45`.
