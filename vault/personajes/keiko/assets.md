---
tipo: personaje
id: keiko
archivos: [src/rendering/walk-art.js, src/rendering/sprites.js, src/rendering/companion-art.js, tests/directional-aim.test.cjs]
verificado: 2026-10-31
---
# Keiko · assets
| Recurso | Ruta | Lo carga |
|---|---|---|
| Atlas base, fila 6 | `public/assets/characters/causas-atlas-v1.webp` | `src/rendering/sprites.js:4` |
| Caminata | `public/assets/walks/keiko-walk-v2.webp` (`-v1` existe, no se pide) | `src/rendering/walk-art.js:32` |
| Ataque | `public/assets/attacks/keiko-attack-v1.webp` | `walk-art.js:32` |
| Puntería direccional | `public/assets/aim/keiko-aim-v1.webp` (3 columnas; el resto de láminas tiene 6) | `walk-art.js:16`; `tests/directional-aim.test.cjs:5` |
| Compañero | `public/assets/companions/companions-classic-v1.webp` (fila `keiko`) | `src/rendering/companion-art.js:4` |
- **Sin cartas** (ni de personaje ni de Q): no hay `keiko-*` en `public/assets/cards/` ni entrada en `src/ui/reference-menus.js:36`.
- Evolución: dibujo procedural, forma `fans` (`src/systems/evolutions.js:12,38`).
- `look:'keiko'` en el catálogo, pero `src/entities/actors.js` no tiene rama de dibujo propia para él (sin verificar el respaldo exacto).

Volver a [[personajes/keiko/README]].
