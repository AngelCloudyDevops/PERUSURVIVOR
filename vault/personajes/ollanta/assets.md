---
tipo: personaje
id: ollanta
archivos: [src/rendering/walk-art.js, src/rendering/sprites.js, src/rendering/companion-art.js]
verificado: 2026-10-31
---
# Ollanta · assets
| Recurso | Ruta | Lo carga |
|---|---|---|
| Atlas base, fila 7 | `public/assets/characters/causas-atlas-v1.webp` | `src/rendering/sprites.js:4` |
| Caminata | `public/assets/walks/ollanta-walk-v2.webp` (`-v1` existe, no se pide) | `src/rendering/walk-art.js:32` |
| Ataque | `public/assets/attacks/ollanta-attack-v1.webp` | `walk-art.js:32` |
| Puntería direccional | `public/assets/aim/ollanta-aim-v1.webp` | `walk-art.js:16` |
| Compañero | `public/assets/companions/companions-classic-v1.webp` (fila `ollanta`) | `src/rendering/companion-art.js:4` |
- **Sin cartas** (ni de personaje ni de Q): no hay `ollanta-*` en `public/assets/cards/` ni entrada en `src/ui/reference-menus.js:36`.
- Evolución: dibujo procedural, forma `chevrons` (`src/systems/evolutions.js:13,38`).

Volver a [[personajes/ollanta/README]].
