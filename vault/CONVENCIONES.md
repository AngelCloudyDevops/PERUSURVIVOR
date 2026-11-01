# Convenciones del vault

Base de conocimiento para agentes de IA. Notas cortas, enlazadas y verificables.
**El código manda**: si una nota contradice a `src/`, `backend/` o `tests/`, la nota
está mal y se corrige en el mismo cambio.

## Reglas de escritura
- Español. Frases cortas. Una idea por viñeta.
- Cada número, nombre de función o regla cita `ruta/archivo.js:línea` (ruta desde la
  raíz del repositorio). Si un dato no se pudo verificar, se marca `(sin verificar)`.
- Nada de prosa de diseño ni historia: qué hace el código, dónde vive y qué no romper.
- Notas de menos de ~150 líneas. Si crece, se parte en notas enlazadas.

## Enlaces
- Estilo Obsidian, con la ruta desde `vault/` y sin `.md`:
  `[[personajes/cuy/README]]`, `[[sistemas/combate/README]]`, `[[gotchas/G003-r-tres-sitios]]`.
- Texto alternativo: `[[sistemas/juice/README|P.Juice]]`.
- Todo enlace debe apuntar a una nota existente. Un enlace roto es un error.

## Frontmatter
```yaml
---
tipo: personaje | evento | sistema | arquitectura | gotcha | indice
id: <id del código cuando exista>
archivos: [src/..., tests/...]
verificado: 2026-10-31
---
```

## Estructura
| Carpeta | Contenido |
|---|---|
| `arquitectura/` | `P`, orden de módulos, envoltorios, escenas, build, cooperativo, cuentas y guardado, rendimiento |
| `personajes/<id>/` | `README`, `ataques`, `poderes`, `assets`, `tests`, `gotchas` (si aplica) |
| `eventos/<id>/` | Un evento de mapa o encuentro por carpeta, con `README` |
| `sistemas/<id>/` | Un sistema por carpeta, con `README` |
| `poderes/` | Índice de pasivas, Q, R y cartas especiales |
| `gotchas/` | `Gnnn-slug.md`, una trampa por archivo |

### IDs de carpetas fijos
- Personajes (21, id del código): `cristorata`, `cuy`, `paloma`, `alan`, `alberto`,
  `keiko`, `ollanta`, `kingteka`, `shaka`, `najasor`, `cirilo`, `fuzo`, `charles`,
  `axelbenba`, `sustento`, `cevichero`, `g5`, `makanaky`, `sideral`, `chamelin`, `marciano`.
- Sistemas: `combate`, `oleadas-dificultad`, `progresion-cartas`, `evoluciones`,
  `objetos-dota`, `gacha-meta`, `cofres-mercader`, `juice`, `hurtfx`,
  `movimiento-reducido`, `ia-enemigos`, `terreno-navegacion`, `audio`, `cooperativo`,
  `cuentas`, `ulti`, `dominios`, `pasivas`, `atributos`, `minions`, `mapas`.
- Arquitectura: `objeto-p`, `orden-modulos`, `envoltorios`, `escenas`, `build`,
  `cooperativo-autoritativo`, `cuentas-guardado`, `rendimiento`.
- Eventos: los define `eventos/README.md`.
