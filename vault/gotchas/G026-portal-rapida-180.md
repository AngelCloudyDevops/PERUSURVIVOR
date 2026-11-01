---
tipo: gotcha
id: G026
archivos: [src/systems/run-mode.js, src/systems/encounters.js]
verificado: 2026-10-31
---
# G026 · `Encounters.unlock` no abre el portal

- **Síntoma:** cambiar `P.Encounters.unlock` (180) no mueve la apertura del portal.
- **Causa:** solo lo lee el laboratorio (`src/development/lab.js:12`). La Partida rápida usa 180 escrito en `P.RunMode.portalWindow` (`src/systems/run-mode.js:17`); Caos usa `portalWindows()`.
- **Cómo evitarla:** cambia los tiempos en `src/systems/run-mode.js`.
- **Cómo detectarla:** `grep -rn "Encounters.unlock" src`.
- Más: [[eventos/portales-y-encuentros/README]], [[eventos/modos-de-partida/README]].
