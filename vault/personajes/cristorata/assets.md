---
tipo: personaje
id: cristorata
archivos: [src/rendering/walk-art.js, src/rendering/sprites.js, src/rendering/dragon-art.js, src/rendering/dragon-epic.js, src/ui/reference-menus.js]
verificado: 2026-10-31
---
# Cristorata · assets
| Recurso | Ruta | Lo carga |
|---|---|---|
| Atlas base, fila 1 | `public/assets/characters/causas-atlas-v1.webp` | `src/rendering/sprites.js:4` |
| Caminata | `public/assets/walks/cristorata-walk-v2.webp` (`-v1` png/webp existen, no se piden) | `src/rendering/walk-art.js:32` (autorado → `v2`) |
| Ataque | `public/assets/attacks/cristorata-attack-v1.webp` | `walk-art.js:32` |
| Puntería direccional | `public/assets/aim/cristorata-aim-v1.webp` | `walk-art.js:16` (está en `directionalIds`) |
| Carta de personaje | `public/assets/cards/cristorata-character-fullart-v1.webp` | `src/ui/reference-menus.js:36`; también arte de la carta R (`cristorata-kit.js:41`) |
| Carta Q | `public/assets/cards/cristorata-dragon-ultimate-fullart-v1.webp` | `src/systems/ability-cards.js:16` |
| Dragón (atlas + json) | `public/assets/characters/cristorata-dragon-v1.webp` y `.json` | `src/rendering/dragon-art.js:14` |
| Dragón secreto | `public/assets/characters/cristorata-secret-v1.webp` y `.json` | `dragon-art.js:3` |
| Reacción en la sala del dragón | `public/assets/characters/cristorata-reaction-v3.webp` y `.json` | `src/rendering/dragon-epic.js:15` (`reaction-v2` existe, sin referencia en `src/`) |
| Compañero | `public/assets/companions/companions-classic-v1.webp` (fila `cristorata`) | `src/rendering/companion-art.js:4` |
- Derrape, estela y garra no tienen imagen: son efectos procedurales (`src/rendering/cristorata-kit-art.js:3-10`, efecto `cristo-claw`).
- Los `.png` son fuentes; el juego pide `.webp`.

Volver a [[personajes/cristorata/README]].
