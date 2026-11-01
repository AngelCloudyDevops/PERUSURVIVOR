---
tipo: arquitectura
id: orden-modulos
archivos: [scripts/modules.cjs, scripts/check-syntax.cjs, scripts/build.cjs, backend/simulation.cjs]
verificado: 2026-10-31
---
# Orden de módulos (`scripts/modules.cjs`)

## Qué es
- Un array de `{source, output}`: ruta en `src/` y nombre en `dist/js/`.
- **169 módulos** (`node -e "console.log(require('./scripts/modules.cjs').length)"`).
- Es la única fuente del orden de carga. La usan:
  - `scripts/build.cjs:34` (copia cada módulo) y `:44` (añade `<script>` al `index.html`).
  - `scripts/build.cjs:37`: escribe `dist/backend/modules.json` para el servidor publicado.
  - `scripts/check-syntax.cjs:2-4` (`npm run check`).
  - `backend/simulation.cjs:12`: VM cooperativo (usa `modules.json` si existe `js/data.js`).
  - `scripts/benchmark-game.cjs`, `scripts/full-run-audit.cjs:4`, varios tests.

## Reparto por carpeta
No hay bloques por carpeta: el orden **intercala** carpetas según dependencias.

| Carpeta | Módulos |
|---|---|
| `src/systems` | 73 |
| `src/rendering` | 57 |
| `src/ui` | 14 |
| `src/data` | 8 |
| `src/network` | 7 |
| `src/development` | 4 |
| `src/scenes` | 3 |
| `src/core` | 2 |
| `src/entities` | 1 |

## Hitos del orden (posición 1-based)
- 1 `src/data/catalog.js` crea `window.P` → [[arquitectura/objeto-p]].
- 2 `src/data/powers.js`: amplía roster y ataques.
- 10 `src/core/runtime.js`: `P.state`, `P.Core`, entrada.
- 31 `src/entities/actors.js` (`P.Entities`), 32 `src/systems/combat.js` (`P.Combat`).
- 78 `src/rendering/world.js`, 84 `src/ui/screens.js`, 86 `src/systems/ultimate.js`.
- 93 `src/network/cooperative.js`, 96 `src/scenes/game.js` (`P.Game`).
- 97–169: extensiones (dominios, kits, balance, pasivas, equipo Dota) que envuelven
  funciones ya definidas → [[arquitectura/envoltorios]].
- 146 `src/systems/character-balance.js`, 153 `src/systems/stat-runtime.js`,
  154 `src/systems/passives.js`, 165 `src/systems/dota-equipment.js`.
- 169 (último) `src/development/equipment-bench.js`.

## Reglas
- **Archivo nuevo → registrarlo en `scripts/modules.cjs`.** Si no, no llega a `dist/`,
  no se carga en el navegador ni en el VM y `npm run check` no lo revisa.
- Colócalo **después** de todo lo que usa en tiempo de carga y de las funciones que envuelve.
- Envolver más tarde = capa más externa. Mover un archivo cambia qué envoltorio corre primero.
- `src/data/` está ignorado por `.gitignore`: [[gotchas/G001-src-data-ignorado]].

## `npm run check`
- `scripts/check-syntax.cjs:3`: `new vm.Script(...)` por módulo. **Solo compila.**
- No ejecuta nada: no detecta un `P.X` indefinido por orden de carga ni errores de runtime.
  Ver [[gotchas/G018-check-solo-sintaxis]].
- Imprime `Sintaxis correcta: N módulos.` (`scripts/check-syntax.cjs:4`).
