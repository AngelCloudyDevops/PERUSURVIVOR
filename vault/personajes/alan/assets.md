---
tipo: personaje
id: alan
archivos: [src/rendering/walk-art.js, src/rendering/sprites.js, src/rendering/companion-art.js]
verificado: 2026-10-31
---
# Alan · assets
| Recurso | Ruta | Lo carga |
|---|---|---|
| Atlas base, fila 4 | `public/assets/characters/causas-atlas-v1.webp` | `src/rendering/sprites.js:4` |
| Caminata | `public/assets/walks/alan-walk-v2.webp` (`-v1` existe, no se pide) | `src/rendering/walk-art.js:32` |
| Ataque | `public/assets/attacks/alan-attack-v1.webp` | `walk-art.js:32` |
| Puntería direccional | `public/assets/aim/alan-aim-v1.webp` | `walk-art.js:16` |
| Compañero | `public/assets/companions/companions-classic-v1.webp` (fila `alan`) | `src/rendering/companion-art.js:4` |
- **Sin cartas** (ni de personaje ni de Q): no hay `alan-*` en `public/assets/cards/` ni entrada en `reference-menus.js:36`.
- Dibujo de respaldo por código (`look:'alan'`, `src/entities/actors.js:32`).
- Evolución: dibujo procedural, forma `echo` (`src/systems/evolutions.js:10,38`).

Volver a [[personajes/alan/README]].
