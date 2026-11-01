---
tipo: personaje
id: najasor
archivos: [src/rendering/walk-art.js, src/rendering/sprites.js, src/rendering/companion-art.js, src/data/muzzle-anchors.js]
verificado: 2026-10-31
---
# Najasor · assets

Volver: [[personajes/najasor/README]]. Todo bajo `public/assets/`.

| Uso | Archivo | Lo carga |
|---|---|---|
| Atlas de menú (fila 2, 9 filas) | `characters/powers-atlas-v1.webp` (+ `powers-atlas.json`) | `src/rendering/sprites.js:4`; fila por `src/data/powers.js:72-73` |
| Caminar (6 poses) | `walks/najasor-walk-v2.webp` | `src/rendering/walk-art.js:32` |
| Apuntar/atacar direccional | `aim/najasor-aim-v1.webp` | `walk-art.js:16,32` (`directionalIds`) |
| Compañero en coop | `companions/companions-streamers-v1.webp` (fila `najasor`) | `src/rendering/companion-art.js:5`, `dragon-epic.js:33` |
| Punta del arma (FISH) | `src/data/muzzle-anchors.js:3` (clave `najasor`) | `src/systems/muzzle.js:3` |

## Sin uso en el código
- `attacks/najasor-attack-v1.*`: `attack-najasor` carga el archivo de `aim/` porque el id es direccional (`walk-art.js:32`).
- La fila 2 del atlas `streamers` pertenece a este personaje en el catálogo original, pero `src/data/powers.js:72-73` lo mueve al atlas `powers`; esa fila ya no se usa para el sprite del menú.
- Sin carta de personaje, de ulti ni de dominio: no está en `src/ui/reference-menus.js:36` ni en `ability-cards.js`.
- Proyectil (FISH): se dibuja por código en `P.PowerFX` (`src/rendering/power-effects.js`), sin archivo propio (sin verificar el detalle por glifo).
