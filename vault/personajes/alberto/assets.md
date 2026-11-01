---
tipo: personaje
id: alberto
archivos: [src/rendering/walk-art.js, src/rendering/sprites.js, src/rendering/court-art.js, src/systems/ability-cards.js]
verificado: 2026-10-31
---
# Alberto · assets
| Recurso | Ruta | Lo carga |
|---|---|---|
| Atlas base, fila 5 | `public/assets/characters/causas-atlas-v1.webp` | `src/rendering/sprites.js:4` |
| Caminata | `public/assets/walks/alberto-walk-v2.webp` (`-v1` existe, no se pide) | `src/rendering/walk-art.js:32` |
| Ataque | `public/assets/attacks/alberto-attack-v1.webp` | `walk-art.js:32` |
| Carta Q | `public/assets/cards/alberto-tribunal-ultimate-fullart-v1.webp` | `src/systems/ability-cards.js:15` |
| Tribunal: Fujimori articulado | `public/assets/court/fujimori-joints-v2.webp` | `src/rendering/court-art.js:3` |
| Tribunal: juez articulado | `public/assets/court/judge-joints-v2.webp` | `court-art.js:3` |
| Tribunal: público | `public/assets/court/audience-back-v1.webp` | `court-art.js:3` |
| Compañero | `public/assets/companions/companions-classic-v1.webp` (fila `alberto`) | `src/rendering/companion-art.js:4` |
- **Sin carta de personaje** (`reference-menus.js:36` no lista a `alberto`) ni arte de puntería (`directionalIds`, `walk-art.js:16`).
- `court/judge-v1.*` y `court/fujimori-objection-v1.*` existen pero ningún archivo de `src/` los referencia.
- Si no cargó el arte del tribunal, se dibuja el sprite del atlas (`court-art.js:21`).
- Evolución: dibujo procedural, forma `seal` (`src/systems/evolutions.js:11,38`).

Volver a [[personajes/alberto/README]].
