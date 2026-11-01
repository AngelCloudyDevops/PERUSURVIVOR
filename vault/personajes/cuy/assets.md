---
tipo: personaje
id: cuy
archivos: [src/rendering/walk-art.js, src/rendering/sprites.js, src/rendering/animal-entry-poses.js, src/ui/reference-menus.js]
verificado: 2026-10-31
---
# Cuy · assets
| Recurso | Ruta | Lo carga |
|---|---|---|
| Atlas base, fila 2 | `public/assets/characters/causas-atlas-v1.webp` | `src/rendering/sprites.js:4` |
| Caminata | `public/assets/walks/cuy-walk-v2.webp` (`-v1` existe, no se pide) | `src/rendering/walk-art.js:32` |
| Ataque | `public/assets/attacks/cuy-attack-v1.webp` | `walk-art.js:32` |
| Entrada de la Q | `public/assets/entries/cuy-natural-v2.webp` | `src/rendering/animal-entry-poses.js:3` |
| Carta de personaje | `public/assets/cards/cuy-character-fullart-v1.webp` | `src/ui/reference-menus.js:36` |
| Carta Q | `public/assets/cards/cuy-stampede-ultimate-fullart-v1.webp` | `src/systems/ability-cards.js:17` |
| Compañero | `public/assets/companions/companions-classic-v1.webp` (fila `cuy`) | `src/rendering/companion-art.js:4` |
- **No hay arte de puntería** (`aim/`): `cuy` no está en `directionalIds` (`walk-art.js:16`).
- Los 12 cuyes de la Q se dibujan con la hoja de caminata `cuy` (`src/systems/animal-ultimates.js:19`); si no está lista usan el atlas base.
- Efecto de la evolución: dibujo procedural, forma `fault` (`src/systems/evolutions.js:8,38`).

Volver a [[personajes/cuy/README]].
