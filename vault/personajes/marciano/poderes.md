---
tipo: personaje
id: marciano
archivos: [src/systems/marciano-kit.js, src/rendering/marciano-kit-art.js, backend/simulation.cjs, src/network/cooperative.js]
verificado: 2026-10-31
---
# Marciano · poderes

Cada poder tiene su carga, pero ambas suben a la vez por baja: Q usa `ultimate.marcianoCharge` y R usa `ultimate.marcianoDomainCharge`.

## Pasiva · Expediente fosforescente (`src/systems/marciano-kit.js:32-33,56`)
- Cada descarga válida suma progreso: una por lanzamiento, separadas al menos 0,3 s (`recordCast`, `marciano-kit.js:32`). Con 10 de progreso gana un **acta**; máximo 3.
- Al ganar un acta hay 10 % de «escolta»: +15 % de velocidad 3 s, con recuperación de 10 s (`marciano-kit.js:30,32`).
- Con 3 actas, el siguiente ataque con objetivo hace «¡INTERVENIDO!» y las consume: área de 105 u (210 u con el reflector), daño `poder × 0,65` (caja) o `× 0,5`, empuje 12; el reflector además rompe chalecos 4 s (`marciano-kit.js:33,74`).
- Filas de la ficha en `P.Passives.rows` (`marciano-kit.js:81`).

## Q · Treinta intervenidos (`marciano-kit.js:35-37`, carta `marciano-kit.js:57`)
- Activación: tecla Q con `marcianoCharge` 100, fuera de dominio (`marciano-kit.js:36`).
- Carga por baja: normal 5, pesado 10, minijefe 20, jefe 35; no carga mientras Q está activa (`marciano-kit.js:35`).
- Duración 5,4 s (`marciano-kit.js:27`). Un barrido cada 0,52 s: hasta 3 rivales, los más cercanos a ≤520 u, `0,48 × poder` especial, empuje 5, ralentización 0,7 durante 1 s (`marciano-kit.js:37`).
- Tope de 30 impactos en total. No inmoviliza al Marciano (`tests/marciano-kit.test.cjs:10`). Bloquea el ataque automático mientras dura (`marciano-kit.js:74`).

## R · Disco-Bar Manhattan (`P.MarcianoDomain`, `marciano-kit.js:41-48`, carta `marciano-kit.js:58`)
- Activación: tecla R al soltar (listener `keyup` propio, `marciano-kit.js:66`), con `marcianoDomainCharge` 100, fuera de otros dominios y de Q (`marciano-kit.js:44`). No exige tier UR explícito: usa `P.MarcianoKit.eligible` (`marciano-kit.js:42`).
- Duración 10 s, radio 440 u centrado donde se activó (`marciano-kit.js:41,44`). El combate no se corta.
- Cada minion **normal** (no jefe, minijefe ni mimic) dentro del radio se vuelve policía: velocidad ×0,65, DEF física ×1,6, DEF especial ×0,8 (`marciano-kit.js:46`). Si el reflector le rompió el chaleco, su DEF física baja a ×0,85 (`marciano-kit.js:48`).
- Al terminar restaura velocidad y defensas (`marciano-kit.js:47`).

## Cooperativo
- Q: el cliente delega; solo el servidor ejecuta `P.MarcianoKit.activate` (`marciano-kit.js:77`).
- R: el servidor la activa por `input.domain` (`backend/simulation.cjs:41`) y la avanza en `simulation.cjs:45`; en el cliente `P.MarcianoDomain.activate` llama a `P.Coop.requestDomain` (`marciano-kit.js:44`), que mira `ultimate.charge` y no `marcianoDomainCharge` (`src/network/cooperative.js:17`).
- Cambio de arsenal por `input.weapon` (`backend/simulation.cjs:41`). Test: `tests/marciano-kit.test.cjs:14`.
- `P.Combat.tick` solo avanza el dominio fuera del servidor (`marciano-kit.js:75`).

## Movimiento reducido
Sin ramas propias: el aro del dominio (`marciano-kit-art.js:7`) y la escolta (`marciano-kit-art.js:5`) se animan con `Math.sin` y `lineDashOffset` sin consultar `P.Motion` (comprobado: ningún `reduced` en `marciano-kit-art.js` ni `marciano-kit.js`).

Ver [[sistemas/ulti/README]], [[sistemas/dominios/README]], [[sistemas/pasivas/README]], [[sistemas/cooperativo/README]], [[sistemas/movimiento-reducido/README]].
