---
tipo: personaje
id: axelbenba
archivos: [src/rendering/walk-art.js, src/rendering/sprites.js, src/rendering/companion-art.js, src/data/muzzle-anchors.js]
verificado: 2026-10-31
---
# Axel Benba · assets

Volver: [[personajes/axelbenba/README]]. Todo bajo `public/assets/`.

| Uso | Archivo | Lo carga |
|---|---|---|
| Atlas de menú (fila 6, 7 filas) | `characters/streamers-atlas-v1.webp` (+ `streamers-atlas.json`) | `src/rendering/sprites.js:4` |
| Caminar (6 poses) | `walks/axelbenba-walk-v2.webp` | `src/rendering/walk-art.js:32` |
| Apuntar/atacar direccional | `aim/axelbenba-aim-v1.webp` | `walk-art.js:16,32` (`directionalIds`) |
| Compañero en coop | `companions/companions-streamers-v1.webp` (fila `axelbenba`) | `src/rendering/companion-art.js:5`, `dragon-epic.js:33` |

## Sin uso en el código
- `attacks/axelbenba-attack-v1.*`: `attack-axelbenba` carga el archivo de `aim/` porque el id es direccional (`walk-art.js:32`).
- Sin carta de personaje, de ulti ni de dominio: no está en `src/ui/reference-menus.js:36` ni en `ability-cards.js`.
- Proyectil (:)): se dibuja por código en `P.PowerFX` (`src/rendering/power-effects.js`), sin archivo propio (sin verificar el detalle por glifo).
- No tiene anclas en `src/data/muzzle-anchors.js:3` (solo kingteka, cerdito, najasor, sustento, charles, cevichero).
