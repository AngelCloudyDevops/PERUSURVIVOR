---
tipo: gotcha
id: G006
archivos: [package.json, tests/]
verificado: 2026-10-31
---
# G006 · Las listas de tests de `package.json` son manuales

- **Síntoma:** un test nuevo pasa en local con `node --test tests/x.test.cjs`, pero
  `npm test` nunca lo ejecuta y una regresión llega a `staging`.
- **Causa:** `scripts.test` (93 archivos) y `scripts.pretest` (7) listan cada archivo a
  mano. No hay glob.
- **Hoy no corren** (103 archivos `tests/*.test.cjs`, 100 listados):
  `tests/boss-health.test.cjs`, `tests/cabinet-boss.test.cjs`,
  `tests/character-variants.test.cjs`.
- Fuera de `*.test.cjs` y nunca en `npm test`: `tests/live/cooperative.cjs` (contra
  producción), `tests/manual/*`, `tests/deployment/*.py`.
- **Cómo evitarla:** test nuevo → añadirlo a `scripts.test` de `package.json`.
- **Cómo detectarla:** script de una línea que compare `fs.readdirSync('tests')`
  (archivos `.test.cjs`) con el texto de `scripts.test` + `scripts.pretest`.
  Ejemplo en Node:
  `const s=p.scripts.test+p.scripts.pretest; files.filter(f=>!s.includes('tests/'+f))`.
