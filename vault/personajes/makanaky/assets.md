---
tipo: personaje
id: makanaky
archivos: [public/assets/characters, public/assets/attacks, public/assets/cards, src/rendering/makanaky-player-art.js, src/rendering/makanaky-boxing.js, src/rendering/domain-art.js, src/rendering/domain-intro.js, src/rendering/walk-art.js]
verificado: 2026-10-31
---
# Makanaky · assets

Su atlas declarado es `makanaky` (`src/data/powers.js:96`), pero `P.Sprites` solo define `powers`, `base` y `streamers` (`src/rendering/sprites.js:4`). Se dibuja siempre por `P.WalkArt` (`sprites.js:14`).

| Archivo | Qué es | Cargado por |
|---|---|---|
| `public/assets/characters/makanaky-motion-v2.webp` | 12 poses: 6 pasos y 6 cuadros de puñetazo | `P.WalkArt.url` para `makanaky` y `attack-makanaky` (`src/rendering/walk-art.js:32`); recortado por `src/rendering/makanaky-player-art.js:3-12` |
| `public/assets/attacks/makanaky-headbutt-attack-v1.webp` | Cabezazo | `makanaky-player-art.js:3` |
| `public/assets/attacks/makanaky-gaaaa-attack-v1.webp` | GAA | `makanaky-player-art.js:3` |
| `public/assets/characters/makanaky-boxing-rig-v1.webp` (+ `.json`) | Boxeo del dominio | `src/rendering/makanaky-boxing.js:5` |
| `public/assets/characters/makanaky-domain-back-v2.webp`, `makanaky-domain-portrait-v1.webp` | Espalda y retrato en R | `src/rendering/domain-art.js:3` |
| `public/assets/characters/makanaky-domain-activation-v1.webp` | Intro de R | `src/rendering/domain-intro.js:17` |
| `public/assets/cards/makanaky-character-fullart-v1.webp` | Carta de personaje | `src/ui/reference-menus.js:36` |
| `public/assets/cards/makanaky-los-tres-ultimate-fullart-v1.webp` | Carta de Q | `src/systems/ability-cards.js:19` |
| `public/assets/cards/makanaky-domain-fullart-v1.webp` | Carta de R | `src/systems/ability-cards.js:20` |
- Las técnicas 2 y 3 y sus evoluciones no tienen carta de mejora propia (no hay rama de Makanaky en `src/ui/screens.js:44`).
- `makanaky-domain-back-v1.*` y los `.png` equivalentes: sin referencia directa en `src/` (sin verificar uso externo).
- Los `.prompt.txt` son documentación de generación; no se cargan.
- **Minijefe, otro arte**: `public/assets/minibosses/makanaky-v1.webp` (`src/systems/minibosses.js:5`, `asset:'makanaky'`; empaquetado: `tests/build.test.cjs:348`).
