@AGENTS.md

# Claude Code en PERUSURVIVOR

«Causas del Caos»: survivor de navegador. Lo común (ramas, worktrees, documentación,
pruebas antes de subir) está en `AGENTS.md` y `CONTRIBUTING.md`; aquí va cómo trabajar
sin romper nada. Ante una contradicción entre docs y código, **manda el código**.

## ⚠ Antes de cualquier cambio: consulta la documentación
Obligatorio para todo agente, antes de editar código, tests, assets o configuración:
1. Lee `vault/00-MOC.md` (mapa del vault y convenciones en `vault/CONVENCIONES.md`).
2. Lee la carpeta afectada: `vault/personajes/<id>/`, `vault/eventos/<id>/`,
   `vault/sistemas/<id>/` o `vault/arquitectura/`. Si tocas una función de `P` con
   envoltorios, `vault/arquitectura/envoltorios.md`.
3. Repasa `vault/gotchas/README.md` y abre las trampas que apliquen.
4. Las notas citan `archivo:línea`: verifica en el código cada dato antes de usarlo.

**Regla de cierre:** el mismo cambio que toca el código actualiza las notas del vault que
dejó falsas (números, archivos, envoltorios, tests) y añade una `vault/gotchas/Gnnn-*.md`
si descubriste una trampa. La tabla «Cuándo actualizar cada nota» de `vault/00-MOC.md`
dice cuál. Un cambio que deja una nota falsa está incompleto. `docs/` (índice en
`docs/README.md`) es documentación para humanos: actualízala según el paso 5.

## Stack: JavaScript puro, sin frameworks
- **Cliente:** HTML + Canvas 2D + scripts clásicos. Sin React, Next.js, Phaser, Vite,
  bundler, TypeScript ni ESM. No propongas migrar ni añadir dependencias de cliente.
- **Servidor:** Node ≥ 20, CommonJS (`.cjs`), única dependencia `ws`, base de datos con
  `node:sqlite`. Tests con `node:test` + `node:assert`.
- Antes de añadir cualquier dependencia, pregunta: lo normal es la API del navegador o
  la librería estándar de Node.

## Flujo de trabajo

### 1. Arrancar
- `git status`: conserva cambios ajenos. Rama propia desde `origin/staging`
  (infraestructura de publicación: desde `origin/main`). Nunca trabajes en `staging`/`main`.
- Clasifica la tarea con la tabla de abajo y carga sus skills antes de leer código.

### 2. Entender antes de tocar
- Busca dónde vive con grep; los archivos son densos, lee solo el fragmento relevante.
- Si la tarea toca una función de `P`, lista **todos** sus envoltorios
  (`grep -rn "P.Combat.cast=" src`) y su posición en `scripts/modules.cjs`.
- Revisa las **Trampas conocidas** que apliquen y los tests existentes del tema
  (`ls tests | grep <tema>`).
- Define el criterio de éxito verificable (un test, un número medido, algo visible).

### 3. Implementar
- Cambio mínimo, al estilo del archivo; no reformatees lo que no cambias.
- Archivo nuevo → registrarlo en `scripts/modules.cjs`. Clave nueva en `P.state` → se
  inicializa en el `reset()` de su sistema.
- Gameplay = cooperativo: el código corre también en el VM del servidor.

### 4. Verificar
1. `npm run check` (sintaxis de todos los módulos).
2. Tests del tema: `node --test tests/<archivo>.test.cjs` (desde la raíz).
3. Test nuevo → añadirlo al script `test` de `package.json` o no correrá nunca.
4. Cambio visual o de sensación → probar jugando (`npm start`, http://127.0.0.1:4173).
5. Antes de subir: `npm test` completo.
Reporta lo que corriste y su resultado; si algo no se pudo verificar, dilo.

### 5. Cerrar
- Regla de juego nueva → `docs/diseno/GAME_DESIGN.md`; arquitectura → `docs/arquitectura/ARCHITECTURE.md`;
  trampa nueva → `vault/gotchas/` (y aquí si es grave); notas del vault afectadas según
  la regla de cierre; siempre `CHANGELOG.md`.
- Commits en español, Conventional Commits. PR solo a `staging`, y solo si se pide.

## Qué cargar según la tarea
Las skills viven en `.claude/skills/` (local, fuera de git). Las de juego traen ejemplos
en Godot/Unity: **usa la idea, escríbela en JavaScript puro y Canvas 2D**.

| Tarea | Skills | Además |
|---|---|---|
| Cualquier código | `ponytail` + `karpathy-guidelines` | Siempre, junto a las de abajo |
| FPS bajos, tirones, muchos enemigos | `performance-optimization` | Medir antes y después: `?profile` en la URL o `node scripts/benchmark-performance.cjs` |
| Golpes, muertes, botín, cámara, «que se sienta mejor» | `game-feel` | Respetar movimiento reducido; vibración y flashes con opción de bajarlos |
| Minions, jefes, minijefes, pathfinding | `game-ai` | Ver `minion-tactics.js`, `minibosses.js`, `terrain.js` (flow field) |
| Guardado, meta-progreso, cuentas | `save-systems` | Toca `backend/`: necesita revisión del propietario |
| Balance de personajes u oleadas | — | Auditorías `scripts/*-audit.cjs` → JSON en `docs/balance/datos/`; comparar antes/después |
| Menús, lobby, HUD (DOM) | `impeccable` (solo si se pide) | No aplica al dibujo en canvas |
| Prompts de arte | `prompt-master` | `public/assets/**/*.prompt.txt`, `docs/arte/prompts/*-prompts.json` |
| Assets | — | Siempre WebP (`scripts/optimize-assets.py`); presupuesto con `npm run release:budget` |

## Cómo está armado el cliente
- `src/data/catalog.js` crea `window.P`; cada script cuelga un namespace (`P.Combat`,
  `P.Systems`, `P.UI`…) en el orden de `scripts/modules.cjs`. `build.cjs` copia cada
  módulo a `dist/js/` sin empaquetar. **Nunca edites `dist/`.**
- **Extensión por envoltorio:** `const prev=P.Game.update; P.Game.update=function(dt){…}`.
  `Entities.hurt`, `Game.update`, `Game.start`, `Ultimate.activate`, `World.render`,
  `UI.hud` y `Combat.cast` tienen más de 10 envoltorios: el orden de carga decide el efecto.
- Escenas = `P.state.mode` (`menu`, `play`, `upgrade`, `loot-opening`, `end`); tras cada
  paso de `update` se vuelve a comprobar `s.mode!=='play'`.
- Bucle: un `requestAnimationFrame` con `dt` variable limitado a 0,04 s.
- Texto del juego en **español**, escrito directo en el código (no hay i18n).

## Cooperativo y backend
- Servidor autoritativo: `backend/simulation.cjs` ejecuta los scripts del cliente en un
  `node:vm` por sala, a 25 ticks/s. Código que use `document`, `window` o el canvas debe
  tolerar los stubs del VM.
- El cliente solo envía intenciones; nunca le des autoridad sobre daño, monedas ni
  desbloqueos.
- `backend/`, cuentas, cooperativo, base de datos, `ops/` y `.github/workflows/`
  requieren revisión del propietario.

## Comandos
| Para | Comando |
|---|---|
| Sintaxis | `npm run check` |
| Compilar `dist/` | `npm run build` |
| Jugar en local | `npm start` → http://127.0.0.1:4173 (preview `perusurvivor`) |
| Toda la suite | `npm test` (antes corre `pretest`: build + tests de `pretest`) |
| Un test | `node --test tests/<archivo>.test.cjs` |
| Cooperativo standalone | `npm run coop` |
| Presupuesto de release | `npm run release:budget` (≤ 1000 archivos, ≤ 80 MiB) |

## Trampas conocidas
- `src/development/` (laboratorio, test bench, performance) **se publica en
  producción**; solo lo oculta el cliente. No pongas ahí nada secreto.
- `build.cjs` decide qué assets publicar buscando strings en los renderers
  (`walk-art.js`, `court-art.js`, `boss-art.js`, `chosicano-art.js`, `map-art.js`):
  renombrar un asset o `directionalIds` puede romper el build o dejar fuera imágenes.
- Las listas de IDs de personajes con kit están copiadas en `progression.js`, `evolutions.js`,
  `character-balance.js`, `gacha.js`, `passives.js`, `attack-hud.js`, `balance-preview.js`,
  `skill-preview.js`, `meta-progress.js` y otros. Al añadir un personaje o kit, búscalas
  todas (`vault/gotchas/G004-listas-ids-personajes.md`).
- La tecla R (dominios) se despacha en tres sitios de `src/core/runtime.js` (click,
  keydown, keyup) y Marciano tiene su propio keyup en `marciano-kit.js` (`G003`).
- En las fuentes de daño, `source.owner` casi nunca existe: el dueño va en
  `source.ownerId`/`ownerSlot` (ver `owner(source)` en `dota-equipment.js`).
- Las listas de tests de `package.json` son manuales: `boss-health`, `cabinet-boss` y
  `character-variants` hoy no corren.
- Los tests leen rutas relativas (`src/...`): ejecútalos siempre desde la raíz.
- El patrón `data/` de `.gitignore` (pensado para SQLite) también ignora `src/data/`: un
  archivo nuevo ahí necesita `git add -f`.
- Rendimiento: medir con `node scripts/benchmark-game.cjs` antes y después; los contadores
  son deterministas, así que un cambio que no debe alterar el juego deja los conteos idénticos.
- Muchos valores de `src/data/` se sobrescriben después con `Object.assign` en archivos
  posteriores (`powers.js`, `cirilo-ur.js`, kits): el valor efectivo es el último en orden
  de carga (`G012`, `G022`, `G023`).
- Salas y repeticiones usan el índice del personaje: uno nuevo va siempre al final (`G013`).
- En cooperativo `P.state.player` se reemplaza en cada snapshot (`G010`); el servidor juega
  en Caos y `new Simulation()` en rápida (`G027`).
- Lista completa y verificada: `vault/gotchas/README.md` (33 trampas).
