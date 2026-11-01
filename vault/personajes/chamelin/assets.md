---
tipo: personaje
id: chamelin
archivos: [public/assets/characters, public/assets/cards, src/rendering/chamelin-art.js, src/rendering/chamelin-bathroom.js, src/rendering/chamelin-fluency.js, src/rendering/chamelin-kit-art.js]
verificado: 2026-10-31
---
# Chamelín · assets

No usa atlas ni `P.WalkArt`: `walk-art.js:33-34` lo excluye de la precarga (`['sideral','chamelin']`) y `P.ChamelinArt` envuelve `P.Sprites.draw` y `P.PlayerAttackArt.draw` (`src/rendering/chamelin-art.js:17-18`). `tests/walk-art.test.cjs:7` exige que exista `chamelin-v1.webp`.

| Archivo | Qué es | Cargado por |
|---|---|---|
| `public/assets/characters/chamelin-v1.webp` | Cuerpo, ataque y poses de Trovo | `src/rendering/chamelin-art.js:3`; poses de disparo en `src/rendering/chamelin-kit-art.js:12` |
| `public/assets/characters/chamelin-domain-motion-v1.webp` | Gestos y giro del Baño | `src/rendering/chamelin-bathroom.js:4` |
| `public/assets/cards/chamelin-character-fullart-v1.webp` | Carta de personaje | `src/ui/reference-menus.js:36` |
| `public/assets/cards/chamelin-se-tapo-todo-ultimate-fullart-v1.webp` | Carta de Q | `src/systems/chamelin-kit.js:50` |
| `public/assets/cards/chamelin-domain-fullart-v1.webp` | Carta de R | `src/systems/ability-cards.js:23` |
- No hay cartas de mejora para Pegote, Pichi ni sus evoluciones (no hay rama de Chamelín en `src/ui/screens.js:44`).
- Los efectos (charcos, ondas, salpicaduras) se dibujan por código: `chamelin-kit-art.js:10` (`trovo-kit-splash`, `trovo-kit-wave`) y `chamelin-fluency.js:15-17` (salpicaduras, charcos, cierre).
- Los `.png` y `.prompt.txt` son fuentes; no se cargan.
