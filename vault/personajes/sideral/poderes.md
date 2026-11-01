---
tipo: personaje
id: sideral
archivos: [src/systems/sideral-kit.js, src/systems/sideral-domain.js, src/systems/ability-cards.js, src/network/cooperative.js, backend/simulation.cjs]
verificado: 2026-10-31
---
# Sideral · poderes

Cada poder tiene su propia carga: Q usa `ultimate.sideralCharge`; R usa `ultimate.charge`. Ambas suben a la vez con cada baja.

## Pasiva · Sangre fría (`src/systems/sideral-kit.js:84`)
- Cerca de un rival vivo (≤300 u), cada 2 s gana una escama; máximo 3 (`sideral-kit.js:70`). Sin rival cerca el progreso vuelve a 0. No progresa durante Q ni dominios.
- Recibir daño resta una escama y reinicia el progreso (`sideral-kit.js:94`).
- Con 3 escamas la siguiente técnica sale preparada y las consume (`sideral-kit.js:36,39`):
  - Mirada: alcanza un rival extra hasta 70 u más allá.
  - Colazo: arco ×1,3.
  - Huevo: abre en 0,25 s en lugar de 0,8 s.
- Filas de la ficha en `P.Passives.rows` (`sideral-kit.js:86`).

## Q · Despertar del Lagarto (`sideral-kit.js:69-70`, carta `sideral-kit.js:83`)
- Activación: tecla Q con `sideralCharge` 100, fuera de dominio y de cinemática (`sideral-kit.js:69`).
- Carga por baja: normal 5, pesado 10, minijefe 20, jefe 35 (`sideral-kit.js:68`).
- Duración 6 s (`sideral-kit.js:27`). Reemplaza el ataque automático por un aliento especial: pulso cada 0,24 s, cono de 310 u × alcance y 0,48 rad, 0,36× de poder por pulso, giro máximo 2,4 rad/s.
- Escala fijada al activar: ×(1 + 0,14 × (mayor rango − 1)), ×1,15 si hay alguna evolución (`sideral-kit.js:67`).
- Se puede mover y girar; no da invulnerabilidad ni curación. Bloquea el ataque automático mientras dura (`sideral-kit.js:36`).

## R · Vacío Sideral (`src/systems/sideral-domain.js`, carta `ability-cards.js:21`)
- Activación con `charge` 100; se bloquea si ya hay dominio, tribunal o cinemática (`sideral-domain.js:10`). Solo `tier ultra` (`sideral-domain.js:4`).
- Carga: `100/35` por baja, es decir 35 bajas (`sideral-domain.js:66`, `chargeKills`).
- Tiempos: entrada 5,6 s en cinemática o 2,6 s en dinámico; activo 8 s; salida 0,95 s o 1,35 s (`sideral-domain.js:2,27`).
- Onda de miedo cada 1,15 s más una final (`sideral-domain.js:25,27`). La habitación mide 1100×760 (`sideral-domain.js:3`).
- Chocar contra una pared estando asustado quita 8 % de la vida máxima, máximo 3 veces por rival, con 0,55 s entre choques (`sideral-domain.js:26`).
- Jefes y minijefes quedan inmóviles e inmunes al miedo en el modo cinemático (`sideral-domain.js:20-21`, `frozen`/`holdBoss`).
- Presentación `dynamic`/`cinematic` según `localStorage` `perusurvivor-option-domain-dynamic` (`sideral-domain.js:5`).

## Cooperativo
- Q: el cliente delega; solo el servidor ejecuta `P.SideralKit.activate` (`sideral-kit.js:92`). El servidor serializa Q, huevos y pasiva por jugador (`tests/sideral-kit.test.cjs:21`).
- R: el cliente llama a `P.Coop.requestDomain` (`sideral-domain.js:10`; `src/network/cooperative.js:17`); el servidor elige `P.SideralDomain` por `input.domain` y lo avanza en `backend/simulation.cjs:41,43`.
- El cliente cooperativo precarga el arte propio de Sideral (`src/network/cooperative.js:13`).

## Movimiento reducido
- R: `introShake` devuelve 0 con movimiento reducido (`sideral-domain.js:22`); `dynamicIntro` y el temblor de `P.Ultimate.shake` lo consultan (`sideral-domain.js:37,64`). Test: `tests/sideral-domain.test.cjs:81`.
- Arte: `src/rendering/sideral-art.js:11` consulta `reduced`.
- Q y pasiva no tienen ramas propias.

Ver [[sistemas/ulti/README]], [[sistemas/dominios/README]], [[sistemas/pasivas/README]], [[sistemas/cooperativo/README]], [[sistemas/movimiento-reducido/README]].
