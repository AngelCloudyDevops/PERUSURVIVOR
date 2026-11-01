---
tipo: gotcha
id: G001
archivos: [.gitignore, src/data/]
verificado: 2026-10-31
---
# G001 · `.gitignore` con `data/` ignora `src/data/`

- **Síntoma:** creas `src/data/nuevo.js`, lo registras y funciona en local, pero no
  aparece en `git status` ni llega al commit. En CI o en otra máquina el build falla
  porque el archivo no existe.
- **Causa:** `.gitignore:13` tiene `data/` (pensado para la base SQLite). El patrón sin
  `/` inicial coincide con cualquier carpeta `data/`, también `src/data/`.
- **Dónde:** `.gitignore:13`.
- **Cómo evitarla:** `git add -f src/data/<archivo>.js`. Los archivos ya versionados de
  `src/data/` no se ven afectados.
- **Cómo detectarla:** `git check-ignore -v src/data/<archivo>.js` → imprime
  `.gitignore:13:data/`.
- Relacionado: [[arquitectura/orden-modulos]].
