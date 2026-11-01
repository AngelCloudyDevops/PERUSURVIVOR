---
tipo: arquitectura
id: rendimiento
archivos: [scripts/benchmark-game.cjs, scripts/benchmark-performance.cjs, scripts/benchmark-rendering.cjs, src/development/performance.js, src/scenes/game.js, src/ui/screens.js, tests/frame-budget.test.cjs, tests/performance-fixture.cjs, tests/snapshot-slim.test.cjs, backend/state-wire.cjs]
verificado: 2026-10-31
---
# Rendimiento

Regla: medir antes y después. Un cambio que no debe alterar el juego deja los
contadores de `benchmark-game` idénticos.

## `scripts/benchmark-game.cjs` (lógica, sin dibujo)
- Uso: `node scripts/benchmark-game.cjs [solo-80|solo-160|coop-160|all] [--detail] [--json f] [--ticks N] [--character N] [--map id] [--rate s]` (`:6-13`).
- Escenarios (`:43`): `solo-80` (1 jugador, 80 enemigos), `solo-160`, `coop-160` (2 jugadores).
- Por defecto 1500 ticks de 0,04 s = 60 s de juego; personaje índice 2 (`paloma`);
  mapa `campo` (`:11-13`, `:47`).
- Corre `backend/simulation.cjs` con `scripts/modules.cjs` y `src/` (no `dist/`) (`:15-16`).
- **Determinista:** sustituye `Math.random` por `mulberry32(20240607)` antes de cada
  `Simulation` (`:19`, `:55`, `:61`). Los ms dependen de la máquina; los conteos no.
- Fase A: medición limpia de `sim.tick`. Fase B: 300 ticks con contadores de llamadas
  (`Terrain.direction/hit/clear`, `Entities.hurt`, `Maps.definition/current`) y tiempo de
  `snapshot()` y `encodeState()` (`:32-37`).
- `--detail` envuelve funciones de `P`: sus ms **no** son comparables con la pasada limpia (`:8-9`).

## `scripts/benchmark-performance.cjs` (microbenchmarks)
- Combate: 80 minions / 400 proyectiles, paso de 40 ms, 140 iteraciones (40 de
  calentamiento); mediana en ms y `segmentHit` por tick. Usa `tests/performance-fixture.cjs`.
- Decoración: 200 fotogramas de `P.Ambient.items` en el mismo sector.
- Argumentos opcionales: archivos «antes» para comparar.

## `scripts/benchmark-rendering.cjs`
- Opcional; necesita `@napi-rs/canvas`, que no es dependencia del proyecto (`:1-2`).

## `?profile` en la URL
- `src/development/performance.js:9`: `profiling` = `URLSearchParams(location.search).has('profile')`.
- `instrument()` (`:5`) envuelve en runtime `P.Game.update` («Lógica»), `P.World.render`
  («Dibujo»), `P.UI.hud` («Interfaz»), `P.TestBench.hud`, `P.World.draw`, `P.Terrain.draw`…
- Sin `?profile` no envuelve nada (`tests/frame-budget.test.cjs:25`).
- Panel FPS: opción guardada en `perusurvivor-option-fps` (`:9`).

## Presupuestos fijados en código y tests
| Qué | Valor | Dónde |
|---|---|---|
| dt máximo por fotograma | 0,04 s | `src/scenes/game.js:8` |
| Repintado en `menu` | ~30 fps (30 de 120 fotogramas) | `src/scenes/game.js:7`, `tests/frame-budget.test.cjs:5` |
| Repintado en otros modos | todos los fotogramas | `tests/frame-budget.test.cjs:6` |
| `UI.hudFrame` | como mucho cada 50 ms (17–20 de 120 fotogramas) | `src/ui/screens.js:68`, `tests/frame-budget.test.cjs:20,29` |
| Caché de espíritus de Kingteka | 24 entradas | `tests/frame-budget.test.cjs:33` |
| Snapshot cooperativo | < 55 % del tamaño sin adelgazar | `tests/snapshot-slim.test.cjs:87` |
| Cola de estado por conexión | 64 KiB | `backend/state-wire.cjs:40` |
| Cola de otros mensajes | 512 KiB | `backend/state-wire.cjs:43` |
| Ticks del servidor | 25/s (40 ms) | `backend/cooperative.cjs:64` |
| Carga diferida | 1 tarea por lote si el equipo es limitado, si no 3 | `src/core/runtime.js:11` |
- Commit cf90177 cita 263 KB → 95 KB por tick; es una medición del commit, no un test.

## Reglas
- No uses `Date.now`/`performance.now` para decidir lógica: rompe el determinismo.
- Envoltorios extra en funciones calientes (`Entities.hurt`, `Combat.cast`) cuestan en
  cada golpe: [[arquitectura/envoltorios]].
