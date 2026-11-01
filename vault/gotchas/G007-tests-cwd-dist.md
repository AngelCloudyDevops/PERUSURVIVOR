---
tipo: gotcha
id: G007
archivos: [tests/, package.json]
verificado: 2026-10-31
---
# G007 · Tests que dependen del cwd o de `dist/`

- **Síntoma:** `ENOENT: no such file or directory, open 'src/...'` al lanzar un test
  desde otra carpeta; o un test falla porque `dist/` no existe o está viejo.
- **Causa:**
  - 26 archivos de `tests/` leen rutas relativas como `fs.readFileSync('src/...')`
    (p. ej. `tests/frame-budget.test.cjs:4`): dependen del cwd.
  - Varios leen `dist/` (p. ej. `tests/build.test.cjs:108`, `tests/domain.test.cjs:47`,
    `tests/walk-art.test.cjs:8`): necesitan `npm run build` antes. `npm test` lo hace
    vía `pretest`; `node --test` suelto no.
- **Cómo evitarla:** ejecuta siempre desde la raíz del repo. Si el test toca `dist/`,
  corre `npm run build` antes. En tests nuevos usa `path.resolve(__dirname,'..')`.
- **Cómo detectarla:** `grep -lE "readFileSync\('(src|scripts|public|backend)/" tests/*.cjs`
  y `grep -l "dist" tests/*.test.cjs`.
