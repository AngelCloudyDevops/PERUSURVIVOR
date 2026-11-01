---
tipo: personaje
id: paloma
archivos: [src/rendering/walk-art.js, src/rendering/sprites.js, src/rendering/animal-entry-poses.js, src/ui/reference-menus.js, src/systems/minibosses.js]
verificado: 2026-10-31
---
# Paloma · assets
| Recurso | Ruta | Lo carga |
|---|---|---|
| Atlas base, fila 3 | `public/assets/characters/causas-atlas-v1.webp` | `src/rendering/sprites.js:4` |
| Caminata | `public/assets/walks/paloma-walk-v2.webp` (`-v1` existe, no se pide) | `src/rendering/walk-art.js:32` |
| Ataque | `public/assets/attacks/paloma-attack-v1.webp` | `walk-art.js:32` |
| Puntería direccional | `public/assets/aim/paloma-aim-v1.webp` | `walk-art.js:16` |
| Entrada y pose de ave de la Q | `public/assets/entries/paloma-natural-v2.webp` | `src/rendering/animal-entry-poses.js:3` |
| Carta de personaje | `public/assets/cards/paloma-character-fullart-v1.webp` | `src/ui/reference-menus.js:36` |
| Carta Q | `public/assets/cards/paloma-bandada-ultimate-fullart-v1.webp` | `src/systems/ability-cards.js:18` |
| Compañero | `public/assets/companions/companions-classic-v1.webp` (fila `paloma`) | `src/rendering/companion-art.js:4` |
- `public/assets/minibosses/paloma-v1.webp` es de **La Paloma Brava**, minijefe enemigo (`src/systems/minibosses.js:7`), no del jugable.
- Las 12 aves de la Q usan los seis cuadros de `paloma-natural-v2` (`src/systems/animal-ultimates.js:12,19`); si no cargó, usan el atlas base.
- Evolución: dibujo procedural, forma `wings` (`src/systems/evolutions.js:9,38`).

Volver a [[personajes/paloma/README]].
