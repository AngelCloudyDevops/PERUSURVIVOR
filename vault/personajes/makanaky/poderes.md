---
tipo: personaje
id: makanaky
archivos: [src/systems/passives.js, src/systems/makanaky-ultimate.js, src/systems/domain.js, src/systems/ability-cards.js, src/network/cooperative.js]
verificado: 2026-10-31
---
# Makanaky · poderes

Cada poder tiene su propia carga: Q usa `ultimate.charge` («Respeto») y R usa `ultimate.domainCharge`. No se pisan.

## Pasiva · Racha de la Realeza (`src/systems/passives.js:6`)
- Acumula hasta 10 marcas GA. Solo cuentan Puño y Cabezazo (`eligible` exige `attack.kind==='melee'` y `actor.attack==='royalEcho'`, `passives.js:9`). GAA no.
- Máximo una marca por lanzamiento. Fallar resta 2. Tras 2,5 s sin acertar pierde 1 por segundo (`passives.js:16,43`).
- Con 10 marcas el siguiente golpe es **Golpe Real**: Puño ×1,35 y empuje ×1,4, Cabezazo ×1,6 con aturdimiento garantizado; consume las 10 (`passives.js:35`).
- Cada golpe que conecta carga Q: +6 (Puño) o +10 (Cabezazo) (`passives.js:43`).

## Q · Los Tres de la Realeza (`src/systems/makanaky-ultimate.js`, carta `ability-cards.js:19`)
- Activación: tecla Q (pulsación breve; mantener muestra la carta, `src/systems/ultimate.js:25`) con carga 100, un objetivo a ≤500 u y fuera de dominio o tribunal (`makanaky-ultimate.js:23`).
- Carga («Respeto»): solo por golpes (+6/+10) y +5 al recibir daño (`makanaky-ultimate.js:6,27`). **No carga por bajas**: `P.Ultimate.gain` desvía esa carga a R (`domain.js:60`).
- Duración 4 s, un golpe cada 0,48 s (`makanaky-ultimate.js:3`). Cada golpe teletransporta junto a un enemigo nuevo y aplica Puño, Cabezazo y GAA al 50 % de potencia (jefe ×0,55, minijefe ×0,7) (`makanaky-ultimate.js:13-15`).
- Invulnerable mientras dura; bloquea `P.Combat.cast` (`makanaky-ultimate.js:22,31`). No consume la carga de R. Al activar suma una marca de la pasiva (`makanaky-ultimate.js:24`).

## R · La Realeza (`src/systems/domain.js`, carta `ability-cards.js:20`)
- Solo si `P.Gacha.tier==='ultra'` (`domain.js:6`). Necesita el arte de intro cargado; si no, lo carga y no activa (`domain.js:16`).
- Carga `domainCharge` hasta 100: +1 baja normal, +2 pesado o dinosaurio, +15 minijefe, +25 jefe (`domain.js:60`).
- Tiempos: entrada 3 s (2,8 en modo dinámico), combate 9 s, salida 1,35 s (`domain.js:3`). Golpe cada 0,4 s, alcance 4,2 (`domain.js:4`).
- Rivales normales caen de un golpe; jefes y minijefes reciben `min(140, power×4)` (`domain.js:22`).
- Presentación `dynamic` o `cinematic` según `localStorage` `perusurvivor-option-domain-dynamic` (`domain.js:7`).

## Cooperativo
- Q: en el cliente se delega al envoltorio cooperativo; solo el servidor ejecuta la lógica (`makanaky-ultimate.js:28`; `src/network/cooperative.js:6`).
- R: `P.Domain.activate` llama a `P.Coop.requestDomain` en el cliente (`domain.js:16`; `cooperative.js:17`, mira `domainCharge`). El servidor elige el sistema por `input.domain` (`backend/simulation.cjs:41`) y lo avanza en `simulation.cjs:35,46`.
- Test: `tests/cooperative.test.cjs:214` (solicitar sin mutar localmente).

## Movimiento reducido
- R: `domain-art.js:6,7,35` y `domain-intro.js:31` usan `P.Motion.reduced()` (menos poses, sin temblor ni rotación).
- Q: el efecto de salto baja a 1 partícula (`src/rendering/effects.js:48`).
- Pasiva y técnicas no tienen ramas propias.

Ver [[sistemas/movimiento-reducido/README]], [[sistemas/cooperativo/README]], [[sistemas/ulti/README]], [[sistemas/dominios/README]], [[sistemas/pasivas/README]].
