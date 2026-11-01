---
tipo: personaje
id: sustento
archivos: [tests/gameplay.test.cjs, tests/muzzle.test.cjs, tests/miniboss-phase.test.cjs]
verificado: 2026-10-31
---
# Sustento · tests

Sin archivo propio. Todos estos están registrados en el script `test` de `package.json`, así que corren.
- `tests/gameplay.test.cjs:143-145`: 1 proyectil `ROACH` por disparo y zigzag real.
- `tests/muzzle.test.cjs:6`: bala y fogonazo comparten la punta en 8 sentidos.
- `tests/miniboss-phase.test.cjs:142` y `:149`: interacción con minijefes.
- `tests/save-validation.test.cjs:32`: tirada de colección que incluye a `sustento`.
- `tests/domain.test.cjs:76`: compañeros del dominio incluyen su fila de atlas.
- `tests/roster-balance.test.cjs:3`: lee `docs/balance/datos/roster-audit.json` (18 personajes); no valida el roster vivo de 21.
