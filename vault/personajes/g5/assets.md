---
tipo: personaje
id: g5
archivos: [public/assets/walks, public/assets/attacks, public/assets/characters/powers-atlas-v1.webp, src/rendering/walk-art.js]
verificado: 2026-10-31
---
# La G5 · assets

| Archivo | Cargado por |
|---|---|
| `public/assets/walks/g5-walk-v2.webp` | `P.WalkArt.url` (`src/rendering/walk-art.js:32`) |
| `public/assets/attacks/g5-attack-v1.webp` | `attack-g5`; **no** está en `directionalIds` (`walk-art.js:16`), así que usa `assets/attacks/` y no `assets/aim/` |
| `public/assets/characters/powers-atlas-v1.webp`, fila 8 | atlas `powers` (`src/rendering/sprites.js:4`; `spriteRow:8` en `powers.js:77`) |
| `public/assets/companions/companions-extra-v1.webp`, fila `g5` | `src/rendering/companion-art.js:6` |
- También existe `g5-walk-v1.*` (png y webp); `walk-art.js:32` no lo pide (sin verificar otros usos).
- Sin carta de arte completo en `public/assets/cards/`.
- Pose de patada: `tests/progressive-combat.test.cjs:8`.
