---
tipo: gotcha
id: G028
archivos: [tests/roster-balance.test.cjs, docs/balance/datos/roster-audit.json]
verificado: 2026-10-31
---
# G028 · Tests que validan JSON de auditoría viejos

- **Síntoma:** el test «Balance de los 18» pasa aunque el roster tiene 21 personajes.
- **Causa:** `tests/roster-balance.test.cjs:3` exige 18 entradas en `docs/balance/datos/roster-audit.json`, generado antes de Makanaky, Sideral, Chamelín y Marciano. Otros tests también leen JSON fijos de `docs/balance/datos/`.
- **Cómo evitarla:** si cambias balance, regenera la auditoría con su script (`scripts/*-audit.cjs`) y ajusta el test a la vez. No edites el JSON a mano.
- **Cómo detectarla:** `grep -rn "docs/balance/datos" tests`.
- Más: [[gotchas/G006-tests-manuales]].
