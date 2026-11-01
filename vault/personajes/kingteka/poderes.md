---
tipo: personaje
id: kingteka
archivos: [src/systems/passives.js, src/systems/ultimate.js, src/systems/kingteka-domain.js, src/systems/ability-cards.js, backend/simulation.cjs]
verificado: 2026-10-31
---
# Kingteka · pasiva, Q y R

Volver: [[personajes/kingteka/README]]. Teclas: Q = ulti, R = dominio. Pulsar breve activa; mantener ~180 ms solo enseña la carta (`src/systems/ultimate.js:25`, `src/core/runtime.js:24-25`).

## Pasiva · Instinto de expedición
Datos en `src/systems/passives.js:5`; lógica en `:23-39`.
- Se activa con un **cambio real** entre dos armas desbloqueadas (`weaponSwitch`, `:23`; lo llama `src/systems/kingteka-arsenal.js:24`).
- Cura `2,5 %` de la vida máxima (mínimo 1) y deja el siguiente ataque «preparado» 4 s con daño ×1,12 (`:27-28`, `:33`).
- Recuperación de 7 s entre activaciones (`cooldownUntil`, `:26-27`).
- Si el ataque preparado impacta, suma **+8** a la carga de R (`:39`, `src/systems/kingteka-domain.js:5,10`).

## Q · Gallinazos
Carta: `src/systems/ability-cards.js:13`. Lógica: `P.Ultimate` (`src/systems/ultimate.js`).
- **Carga**: +5 por cada baja, solo si no está activa (`gain`, `:12`); campo `charge`. Requiere 100 %.
- **Duración**: 8 s (`activate`, `:13`); al terminar queda 2,6 s el sello de papel (`:14`).
- **Efecto**: todo rival «normal» (no jefe, minijefe ni mimic; `normal`, `:6`) se vuelve gallinazo, pierde sus ataques y proyectiles y vuela hacia el jugador (`flockStep`, `:11`; `activate` limpia `s.danger` de minions).
- **Daño recibido por rivales**: ×2 normales, ×1,2 jefes y minijefes (`multiplier`, `:8`), aplicado en `src/entities/actors.js:22` y `src/systems/minibosses.js:88`. Vale para el daño de cualquiera mientras haya un Kingteka con Q activa (`owner`, `:7`).
- **Bloqueos**: no se activa durante el Santuario (`src/systems/kingteka-domain.js:77`), ni si `left>0` o `charge<100` (`:13`).
- Skin Cerdito VTuber cambia texto y arte (`pig`, `:26`; `src/systems/character-skins.js:19`).

## R · Santuario del Reino Animal
Carta: `src/systems/ability-cards.js:14`. Lógica: `P.KingtekaDomain` (`src/systems/kingteka-domain.js`).
- **Elegibilidad**: `id==='kingteka'` y rareza `ultra` (`:6`).
- **Carga**: campo propio `domainCharge`, independiente de Q (`:9-10`). Solo sube con ataques «adaptados» (pasiva). 100 % para activar.
- **Bloqueos** (`:14`): sin carga, Q activa o sello de papel, otro dominio activo, encuentro en derrota.
- **Tiempos**: entrada 2,6 s con invulnerabilidad, duración 9 s, salida 0,85 s (`:5`). Oleadas cada 1,25 s y una final 0,35 s antes del cierre (`:36-37`).
- **Radio**: 520 u, objetivos hasta radio+120 (`:5,21`).
- **Daño** (especial, `fixedDamage`, `:18`), por `power` de Kingteka (`:24`):

| Rival | Oleada | Final |
|---|---|---|
| Normal | 0,42 | 0,8 |
| Pesado (`heavy`) | máx(0,42·power, 7,5 % vida máx) | máx(0,8·power, 14 % vida máx) |
| Jefe/minijefe | 0,58 | 1,15 |

- **Curación al equipo**: 2,2 % de vida máx por oleada, 5,5 % en la final, más invulnerabilidad breve (`:28`).
- Al terminar da 0,65 s de invulnerabilidad (`:41`).

## Cooperativo
- R: el cliente llama `P.Coop.requestDomain` (`src/systems/kingteka-domain.js:12`, `src/network/cooperative.js:17`); el servidor lo ejecuta con `input.domain` (`backend/simulation.cjs:41`) y lo avanza en `:44`.
- Q: `input.ultimate` → `P.Ultimate.activate()` (`backend/simulation.cjs:41`). Cada jugador tiene su `ultimate`; `use/save` lo intercambian (`:26-27`).
- El cambio de arma viaja como `P.Coop.weapon` / `input.weapon` (`src/systems/kingteka-arsenal.js:23`, `backend/simulation.cjs:41`).
- `kingtekaDomain` va en el snapshot (`backend/simulation.cjs:63`); lo cubre `tests/kingteka-domain.test.cjs:9`.
- `P.Game.update` del cliente no avanza el dominio si hay cooperativo (`src/systems/kingteka-domain.js:72`): lo hace el servidor.

## Movimiento reducido (`P.Motion.reduced`, `src/rendering/ambient.js:3`)
- Q: sin temblor de cámara (`src/systems/ultimate.js:19`), papel sin caída ni rebote (`:30-31`), comic estático en pose 2 (`src/rendering/ultimate-comic.js:4,10,17`).
- R: el destello pasa de alfa 0,42 a 0,1 (`src/systems/kingteka-domain.js:67`). Los espíritus, hojas y el anillo del suelo **no** están condicionados (`:57-62`).
- Mecánica y daño no cambian con la preferencia.

Más: [[sistemas/ulti/README]] · [[sistemas/dominios/README]] · [[sistemas/movimiento-reducido/README]] · [[sistemas/cooperativo/README]]
