---
tipo: personaje
id: alberto
archivos: [src/systems/court-ultimate.js, src/rendering/court-art.js, src/systems/causa-combo.js, backend/simulation.cjs]
verificado: 2026-10-31
---
# Alberto · poderes
- **Pasiva:** no existe. **R / dominio:** no existe.

## Q · Tribunal del Pueblo (`P.Court`)
- Carta: `src/systems/ability-cards.js:15`. Tecla Q.
- Constantes (`src/systems/court-ultimate.js:3`): `duration 4.7`, `entry 1.3`, `radius 340`, escudo 3 s, veredicto 5 s.
- **Carga:** Combo del Causa; `alberto` está en `CausaCombo.enabled` (`src/systems/causa-combo.js:5`; fórmulas `:10,13`). Durante el tribunal no acumula (`court-ultimate.js:40`).
- **Activar** (`:10`): carga 100, modo `play`, vivo, sin otro tribunal, sin derrota de encuentro y fuera de la ulti del buitre. Pone carga 0, crea `s.court` (centro, aliado, testigos ≤18 del radio). El juego se congela en solitario (`:43`).
- **Resolución** (`tick`, `:11`) al llegar a 4,7 s:
  - Enemigos normales a ≤340 u: ejecución (`fixedDamage`) (`:8,11`).
  - Jefes, mapjefes y minijefes: pierden `min(8 % vida máx., 200, hp−1)`, quedan en veredicto 5 s y reciben **+20 % de daño** (`:11,49`).
  - Todos los jugadores vivos: `inv ≥ 1,2 s` y escudo de 3 s que bloquea los golpes (`:11,49`).
- HUD `Q · TRIBUNAL NN %` / `TRIBUNAL · EN CURSO` (`:41`).

## Cooperativo
- El servidor corre el tribunal en el VM: `Court.players()` devuelve todos los jugadores (`backend/simulation.cjs:21`) y, con `s.court`, solo avanza `P.Court.tick` y se congela el resto (`simulation.cjs:37`).
- El aliado participa: el resultado lo decide el servidor (`tests/court-ultimate.test.cjs:4,10`). En cliente cooperativo, `P.Ultimate.activate` delega en la petición de red (`court-ultimate.js:39`) y el reloj del tribunal avanza localmente sin resolver (`:43`).
- Estado en `P.state.court` (global) y `courtShieldUntil` / `courtVerdictUntil` en actores.

## Movimiento reducido
- Solo visual: `P.Motion.reduced()` se pasa a `CourtArt.entry` (`court-ultimate.js:44`, `src/rendering/court-art.js:21`) y a brillo, ráfaga y vulnerabilidad (`court-ultimate.js:32,36`). Mecánica intacta.
- Test: `tests/court-ultimate.test.cjs:31` (vulnerabilidad animada) y pruebas de dibujo. Ver [[sistemas/movimiento-reducido/README]].

Ver [[sistemas/ulti/README]] · [[personajes/alberto/README]].
