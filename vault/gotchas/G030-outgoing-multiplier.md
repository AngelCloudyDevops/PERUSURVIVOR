---
tipo: gotcha
id: G030
archivos: [src/data/attributes.js]
verificado: 2026-10-31
---
# G030 · `outgoingMultiplier` de los jefes modifica el daño que reciben

- **Síntoma:** subir el `outgoingMultiplier` de Gabinete, Guardián o Procesión no hace que peguen más.
- **Causa:** `P.Attributes.outgoing(e, amount, source)` multiplica por `outgoingMultiplier(e)` del objetivo `e` (`src/data/attributes.js:15`): actúa como resistencia del jefe golpeado, pese al nombre.
- **Cómo evitarla:** para el daño que inflige un jefe, busca su ataque en su propio archivo.
- **Cómo detectarla:** `grep -rn "outgoingMultiplier" src`.
- Más: [[sistemas/combate/README]].
