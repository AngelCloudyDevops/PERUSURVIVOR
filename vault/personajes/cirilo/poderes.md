---
tipo: personaje
id: cirilo
archivos: [src/systems/cirilo-kit.js, src/systems/cirilo-ur.js, src/systems/cirilo-arena.js, src/network/cooperative.js, backend/simulation.cjs]
verificado: 2026-10-31
---
# CiriloTV · pasiva, Q y R

Volver: [[personajes/cirilo/README]]. Q = ulti, R = dominio. Pulsar breve activa; mantener ~180 ms enseña la carta (`src/systems/ultimate.js:25`, `src/core/runtime.js:25`).

## Pasiva · Persistencia maldita
Definición `src/systems/cirilo-kit.js:51`; filas del panel `:69`.
- **Riesgo**: +10 % de daño recibido (`src/systems/cirilo-ur.js:85`).
- **Etapas por nivel** (`cirilo-ur.js:13,16`): nivel 10 → alcance ×1,25 y vómito con nube y ralentización; nivel 20 → velocidad ×1,25 y resurrección disponible.
- **Resurrección** (`cirilo-ur.js:17`): una vez por partida, con etapa ≥2 y vida 0. Revive con 40 % de vida, poder ×1,5, 2,5 s de invulnerabilidad y forma demonio permanente. El dominio no la consume.
- Morir o resucitar cancela el taxi (`cirilo-kit.js:61`).

## Q · ¡FULL MALDAD!
Carta `src/systems/cirilo-kit.js:52`. Campo propio `ciriloCharge` (no es el `charge` de R).
- **Carga** (`cirilo-kit.js:43`): +5 por baja normal, +8 pesado, +20 minijefe, +30 jefe. No carga con la Q activa.
- **Activar** (`:44`): 100 %, sin taxi/Q en curso, sin dominio activo. Se puede caminar durante la descarga.
- **Duración** 1,95 s: tres abanicos a 0 / 0,65 / 1,30 s (`qDuration`, `:18`; `tick`, `:46`; `wave`, `:45`).
- **Proyectiles**: 3 por abanico (±0,16 rad), speed 600, alcance 450·reach, daño `power × 1,05 × qPower` (`:45`). Especial. Glifo de fuego si está en forma demonio.
- `qPower` se fija al activar: `(1+0,14·(rango máx−1)) × 1,15` si alguna técnica evolucionó (`:44`).
- No cambia forma, poder, resurrección ni la carga de R (`tests/cirilo-kit.test.cjs:15`).
- Si Cirilo muere, la Q se corta (`cirilo-kit.js:61`).
- Sustituye a `P.Ultimate.activate` solo en el servidor en cooperativo (`cirilo-kit.js:64`).

## R · Audiencia del Demonio
Carta `src/systems/ability-cards.js:22`. Lógica `P.CiriloUR` (`src/systems/cirilo-ur.js`).
- **Elegibilidad**: id `cirilo` y rareza `ultra` (`:3`).
- **Carga**: usa el `charge` genérico, +4 por baja y no sube durante el dominio (`:94`). Requiere 100 %.
- **Bloqueos** (`:19`): dominio propio, `domain`, `sideralDomain` o `court` activos; y `CiriloKit.busy` (taxi o Q; `cirilo-kit.js:66`).
- **Presentación**: `cinematic` entra en 10,2 s; `dynamic` en 3,2 s (`:2,6`). Se elige con `localStorage['perusurvivor-option-domain-dynamic']` (`:4`); en coop viaja `input.domainPresentation` (`backend/simulation.cjs:41`).
- **Duración**: 9 s tras la entrada (`:2`).
- **Martillazo**: primero a 1,45 s y luego cada 3 s; golpea en radio 260 con `power × 0,35` especial (`:21`).
- **Buff** de 3,05 s tras cada martillazo: vómito con alcance ×1,8 y damageScale ×1,5 (`:14,21`). Velocidad ×1,5 tras el primero (`:21`).
- **Forma**: pasa a demonio (poder ×1,5) y al terminar restaura forma, etapa y poder guardados (`:18-19,22`).
- **Vuelo**: durante el combate ignora el contacto físico; los proyectiles sí hieren (`:85`).
- **Tribunal** (`src/systems/cirilo-arena.js`): en `cinematic` coloca a los actores en el pasillo y confina enemigos (`confine`, `:11`; `enter`, `:12`); en `dynamic` no confina.

## Cooperativo
- R: `P.Coop.requestDomain` (`src/network/cooperative.js:17`) y servidor `backend/simulation.cjs:41`; la intro del tribunal se simula en `:37` y el dominio avanza en `:47`.
- Q y taxi: `input.ultimate` y `taxiStep` en el servidor (`backend/simulation.cjs:39,41`).
- Cada jugador conserva su arsenal (`p.ciriloArsenal`, `cirilo-kit.js:8`); tests `cirilo-kit.test.cjs:17` y `cirilo-ur.test.cjs:50-52`.

## Movimiento reducido
`P.Ambient.reduced.matches` delega en `P.Motion.reduced()` (`src/rendering/ambient.js:3,5`).
- R: vuelo y destellos (`src/systems/cirilo-ur.js:35,71`), tribunal y público (`src/systems/cirilo-arena.js:16-24`).
- Arsenal: el taxi pierde temblor y polvo (`src/rendering/cirilo-kit-art.js:3,13`).
- La mecánica no cambia con la preferencia.

Más: [[sistemas/ulti/README]] · [[sistemas/dominios/README]] · [[sistemas/pasivas/README]] · [[sistemas/movimiento-reducido/README]] · [[sistemas/cooperativo/README]]
