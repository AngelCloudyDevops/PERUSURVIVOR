---
tipo: personaje
id: chamelin
archivos: [src/systems/chamelin-kit.js, src/systems/chamelin.js, src/systems/ability-cards.js, backend/simulation.cjs]
verificado: 2026-10-31
---
# Chamelín · poderes

Cada poder tiene su propia carga: Q usa `ultimate.chamelinCharge`; R usa `ultimate.charge`.

## Pasiva · Presión acumulada (`src/systems/chamelin-kit.js:49`)
- Gana una carga por daño **real** de charcos (`source.trovo` o `source.trovoPool`), máximo una por segundo, hasta 3 (`chamelin-kit.js:25,61`). No carga dentro de dominios.
- Con 3 cargas, el siguiente ataque personal válido las consume y gana área: charcos de la técnica 1 con radio ×1,3 (`chamelin-kit.js:57,58`); Pegote salpica a 45 u; Pegote/Pichi radio ×1,3 (`chamelin-kit.js:32`).
- No cura, no da invulnerabilidad y no carga Q ni R. La muerte la reinicia (`chamelin-kit.js:44`).

## Q · ¡SE TAPÓ TODO! (`chamelin-kit.js:42-43`, carta `chamelin-kit.js:50`)
- Activación: tecla Q con `chamelinCharge` 100, fuera de dominio (`chamelin-kit.js:42`).
- Carga por baja: normal 5, pesado 8, minijefe 20, jefe 30 (`chamelin-kit.js:41`); no carga con daño de Q.
- Duración 2 s; 3 ondas a 0,2, 0,8 y 1,4 s (`chamelin-kit.js:18,42,44`).
- Cada onda: radio `min(270, 190 × alcance)`, daño `0,8 × poder × escala`, ×1,25 si el rival está mojado, empuje 12 (0 a jefes) (`chamelin-kit.js:43`). La cobertura bloquea la onda.
- Escala fijada al activar: ×(1 + 0,14 × (mayor rango − 1)), ×1,15 si hay alguna evolución (`chamelin-kit.js:42`). Puede caminar; sin invulnerabilidad.
- Se cancela si muere o entra un dominio (`chamelin-kit.js:44`).

## R · Baño de Trovo (`src/systems/chamelin.js`, carta `ability-cards.js:23`)
- Activación con `ultimate.charge` 100 (`chamelin.js:10`). Carga `100/35` por baja = 35 bajas (`chamelin.js:31`); no carga durante el propio dominio.
- Tiempos: entrada 2,6 s (2,8 dinámica), combate 8 s, salida 0,8 s (`chamelin.js:3`).
- Pulso cada 0,5 s: `0,3 × poder` a rivales en el carril del barrido; los moja 1,1 s (`chamelin.js:17,20`). Un rival mojado tiene −20 % de defensas (según la carta) y velocidad ×0,75 (`chamelin.js:15`).
- Mordisco final (`chamelin.js:19`): normal muere; minijefe recibe `base × 3`; jefe `base × 1,9`.
- Al activar, las cadencias de todos los Chamelín se fijan a la de la técnica 1 y se restauran al terminar (`chamelin-kit.js:64-65`).
- Presentación `dynamic`/`cinematic` según `localStorage` `perusurvivor-option-domain-dynamic` (`chamelin.js:6`).

## Cooperativo
- Q: el cliente delega; solo el servidor ejecuta `P.ChamelinKit.activate` (`chamelin-kit.js:63`). Test: `tests/chamelin-kit.test.cjs:21`.
- R: `P.Chamelin.activate` llama a `P.Coop.requestDomain` en el cliente (`chamelin.js:10`; `src/network/cooperative.js:17`). El servidor lo elige por `input.domain` (`backend/simulation.cjs:41`) y lo avanza en `simulation.cjs:36`.
- Chamelín puede ser el segundo jugador y conserva su daño (`tests/chamelin.test.cjs:25`).

## Movimiento reducido
`P.Ambient.reduced` consulta `P.Motion.reduced()` (`src/rendering/ambient.js:5`). Lo respetan `chamelin-art.js:10`, `chamelin-bathroom.js:7,8,13,14,23`, `chamelin-fluency.js` (gotas, remate, fragmentos) y `chamelin-kit-art.js:10`. Test: `tests/chamelin.test.cjs:21,31`.

Ver [[sistemas/ulti/README]], [[sistemas/dominios/README]], [[sistemas/pasivas/README]], [[sistemas/cooperativo/README]], [[sistemas/movimiento-reducido/README]].
