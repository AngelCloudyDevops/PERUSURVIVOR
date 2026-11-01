---
tipo: personaje
id: sustento
archivos: [public/assets/walks, public/assets/aim, public/assets/characters/powers-atlas-v1.webp, src/rendering/walk-art.js, src/rendering/sprites.js]
verificado: 2026-10-31
---
# Sustento · assets

| Archivo | Cargado por |
|---|---|
| `public/assets/walks/sustento-walk-v2.webp` | `P.WalkArt.url`: personajes autorados cargan `-walk-v2` (`src/rendering/walk-art.js:32`) |
| `public/assets/aim/sustento-aim-v1.webp` | `P.WalkArt.url` para `attack-sustento`; está en `directionalIds` (`walk-art.js:16`) |
| `public/assets/characters/powers-atlas-v1.webp`, fila 3 | `P.Sprites` atlas `powers` (`src/rendering/sprites.js:4`; `spriteRow:3` en `powers.js:75`) |
| `public/assets/companions/companions-extra-v1.webp`, fila `sustento` | `P.CompanionArt` (`src/rendering/companion-art.js:6`) |
- Existen también `sustento-walk-v1.*` y `sustento-attack-v1.*` (png y webp). Como `sustento` es direccional y autorado, `walk-art.js:32` no los pide (sin verificar uso en otros módulos).
- No hay carta de arte completo en `public/assets/cards/`.
- Orden de dibujo: `P.WalkArt` primero si hay marcha; si no, la fila del atlas (`sprites.js:14`).
