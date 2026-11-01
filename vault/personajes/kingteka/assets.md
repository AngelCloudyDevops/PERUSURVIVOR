---
tipo: personaje
id: kingteka
archivos: [src/rendering/walk-art.js, src/rendering/sprites.js, src/rendering/player-attack-art.js, src/rendering/ultimate-comic.js, src/systems/ability-cards.js]
verificado: 2026-10-31
---
# Kingteka · assets

Volver: [[personajes/kingteka/README]]. Todo bajo `public/assets/`. Los sprites de partida pasan por `P.WalkArt` (`src/rendering/walk-art.js`); la ficha del lobby usa el atlas.

| Uso | Archivo | Lo carga |
|---|---|---|
| Atlas de menú (fila 0) | `characters/powers-atlas-v1.webp` (+ `powers-atlas.json`) | `src/rendering/sprites.js:4`; fila por `src/data/powers.js:72-73` |
| Caminar (6 poses) | `walks/kingteka-walk-v2.webp` | `src/rendering/walk-art.js:32` (`authored` → v2) |
| Apuntar/atacar direccional | `aim/kingteka-aim-v1.webp` | `walk-art.js:16,32` (`directionalIds`) |
| Ataque Gallinazo | `attacks/kingteka-gallinazo-attack-v2.webp` | `walk-art.js:32` (caso especial) |
| Caminar con Gallinazo | `attacks/kingteka-gallinazo-walk-v1.webp` | `walk-art.js:9,32` |
| Ataque Golpe | `attacks/kingteka-golpe-attack-v1.webp` | `walk-art.js:8,32` |
| Reacción (daño/derrota) | `reactions/kingteka-reaction-v1.webp` | `walk-art.js:7`, `src/rendering/player-reaction-art.js:4` |
| Retrato de la Q | `characters/kingteka-ultimate-portrait-v1.webp` | `src/rendering/ultimate-comic.js:11` |
| Gallinazos (bandada de la Q) | `enemies/gallinazos-atlas-v1.webp` (+ `.json`) | `src/systems/ultimate.js:22`; hoja `ulti-bird` en `walk-art.js:4` |
| Compañero en coop | `companions/companions-streamers-v1.webp` (fila `kingteka`) | `src/rendering/companion-art.js:5`, `dragon-epic.js:33` |
| Punta del arma (escopeta) | `src/data/muzzle-anchors.js:3` (claves `kingteka` y `cerdito`) | `src/systems/muzzle.js:3` |

## Cartas
- Personaje: `cards/kingteka-character-fullart-v1.webp` (`src/ui/reference-menus.js:36`).
- Mejoras del arsenal: `cards/kingteka-{shotgun,gallinazo,golpe}-fullart-v1.webp`; la evolución de la escopeta usa `kingteka-contra-fullart-v1.webp` (`src/ui/screens.js:44`).
- Q: `cards/kingteka-gallinazo-ultimate-fullart-v2.webp`; variante Cerdito `cards/cerdito-vtuber-ultimate-fullart-v1.webp` (`src/systems/ability-cards.js:13`).
- R: `cards/kingteka-nature-domain-fullart-v1.webp` (`src/systems/ability-cards.js:14`).

## Skin Cerdito VTuber (`artId:'cerdito'`)
- `src/systems/character-skins.js:19`. Usa sus propios `walks/cerdito-walk-v2.webp`, `aim/cerdito-aim-v1.webp`, `attacks/cerdito-{attack,gallinazo-attack-v2,gallinazo-walk-v1,golpe-attack-v1}` y `atlas:'powers'` fila 1.

## Sin raster
- El Santuario (R) se dibuja con canvas: hojas, espíritus (cóndor, puma, oso, cuy) y suelo en `src/systems/kingteka-domain.js:48-68`.
- `attacks/kingteka-attack-v1.*` y `attacks/kingteka-gallinazo-attack-v1.*` existen pero ningún código los pide: `attack-kingteka` carga el archivo `aim/` y el Gallinazo fuerza el v2 (`walk-art.js:32`). `kingteka-attack-v1` no se publica; `kingteka-gallinazo-attack-v1.webp` y `cerdito-gallinazo-attack-v1.webp` sí: candidatos en [[arquitectura/build]].
- Los `*.prompt.txt` y `kingteka-ultimate-portrait.json` son metadatos de autoría.
