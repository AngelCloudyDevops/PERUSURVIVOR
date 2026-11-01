---
tipo: gotcha
id: G013
archivos: [src/data/catalog.js, src/data/powers.js, backend/cooperative.cjs, src/core/runtime.js, scripts/benchmark-game.cjs, tests/live/cooperative.cjs]
verificado: 2026-10-31
---
# G013 · Los índices del roster son históricos: no reordenar ni insertar

- **Síntoma:** tras insertar un personaje en medio de la lista, salas cooperativas,
  repeticiones guardadas, benchmarks o tests eligen otro personaje.
- **Causa:** varias partes identifican al personaje por **índice** en
  `P.Data.characters`, no por id:
  - `P.state.chosen` (`src/core/runtime.js:3`).
  - Protocolo cooperativo: `msg.character` entero (`backend/cooperative.cjs:53`).
  - `scripts/benchmark-game.cjs:13,47` (índice 2 = `paloma`),
    `tests/live/cooperative.cjs:12,91` (índices 7 = `kingteka` y 2).
  - Comentario explícito en `src/data/powers.js:108`: mantener al final evita desplazar
    los índices históricos.
- **Además:** `src/data/catalog.js:32` hace `P.Data.characters.shift()`: el primer
  personaje (`zein`) sale del roster y pasa a ser `P.Data.boss`. Por eso el índice 0
  es `cristorata`, no `zein`. Añadir algo antes de `zein` cambiaría el jefe.
- Roster actual (21): 0 `cristorata` … 7 `kingteka` … 17 `makanaky`, 18 `sideral`,
  19 `chamelin`, 20 `marciano`.
- **Cómo evitarla:** personaje nuevo → siempre `push` al final del último archivo que
  añade personajes. Nunca `unshift`, `splice` ni reordenar.
- **Cómo detectarla:** listar `P.Data.characters.map((c,i)=>i+':'+c.id)` antes y después.
