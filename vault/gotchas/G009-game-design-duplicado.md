---
tipo: gotcha
id: G009
archivos: [docs/diseno/GAME_DESIGN.md]
verificado: 2026-10-31
---
# G009 · `GAME_DESIGN.md` tenía un bloque duplicado que divergía

- **Síntoma:** dos secciones con el mismo título dicen cosas distintas; un agente copia
  la versión vieja.
- **Causa:** en el commit e824100, `docs/GAME_DESIGN.md` (1583 líneas) repite secciones:
  p. ej. «Cuentas opcionales» en las líneas 668 y 1056, «Atributos físicos y especiales»
  en 729 y 1117 (`git show HEAD:docs/GAME_DESIGN.md`).
- **Estado:** resuelto en el commit 03bbe724: se movió a `docs/diseno/GAME_DESIGN.md`
  y se quitó la segunda copia (líneas 1019-1406 del original). La trampa sigue viva: una
  regla puede quedar repetida en dos secciones o en otro documento de `docs/`.
- **Cómo evitarla:** ante dos versiones de una regla, manda el código. No copies números
  de `docs/` sin verificarlos.
- **Cómo detectarla:**
  `grep "^## " docs/diseno/GAME_DESIGN.md | sort | uniq -d` (debe salir vacío).
