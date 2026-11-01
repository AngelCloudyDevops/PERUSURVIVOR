---
tipo: personaje
id: cirilo
archivos: [src/systems/cirilo-kit.js, src/systems/cirilo-ur.js, src/systems/evolutions.js]
verificado: 2026-10-31
---
# CiriloTV · ataques

Volver: [[personajes/cirilo/README]]. Tres técnicas, cambio con **1/2/3** o rueda (`src/core/runtime.js:24`, `src/systems/weapon-input.js:5`). Orden: `ciriloVomit`, `ciriloTaxi`, `ciriloEcho` (`src/systems/cirilo-kit.js:4`). `P.Evolutions.attack` devuelve primero el arsenal (`cirilo-kit.js:56`).

## Perfiles (rango 1)
| Técnica | Tipo | Cooldown | Alcance | Daño | Canal |
|---|---|---|---|---|---|
| Vómito tóxico | `spread`, 1 proyectil, speed 470 | 0,82 | 520 | `power × damageScale` (24 por impacto) | especial |
| Taxi de Cirilo | `taxi` | 3,8 | 240 | damageScale 1,8 | físico |
| Eco maldito | `spread` + marca | 1,75 | 430 | damageScale 1,25 | especial |

Fuentes: `src/systems/cirilo-kit.js:6`; vómito calculado por `CiriloUR.attack` en `src/systems/cirilo-ur.js:14`.

### Vómito (forma base)
- Nivel 10+ (etapa ≥1): alcance ×1,25, deja nube y ralentiza (`cloud`, `slow`; `src/systems/cirilo-ur.js:13-14`). Ralentización de 1,5 s por impacto y ×0,8 de velocidad (`:86-87`).
- Forma demonio: «Aliento infernal», cooldown 0,66, alcance ×1,15, speed 600, glifo `CIRILO_FIRE`; quema 1,8 s con tic de 0,45 s a `power × 0,08` (`:14,86,96`).
- Durante la Audiencia (`buff`): alcance ×1,8, damageScale ×1,5 (`:14`).

### Taxi
- Embiste con ventana 0,18 s, ida a 550 u/s, vuelta a 440 u/s, máximo 4 s y recorrido `min(420, alcance·reach)` (`src/systems/cirilo-kit.js:27,29-39`).
- Un golpe por rival en la ida; la vuelta no pega salvo evolucionado.
- Dentro del taxi recibe 40 % menos daño (`taxiResistance`, `:18`, `:61`).
- No arranca ocupado (taxi/Q), esquivando, con dominio activo o contra terreno (`:27`).

### Eco maldito
- Proyectil speed 500 con `power × 0,25 × damageScale`; marca al rival. Explota a los 0,75 s con `power × damageScale` en radio `min(150, 90·reach)` (`:40-42`).
- Máximo 6 marcas activas por jugador (`:40-41`).

## Rangos
- Fórmula (`cirilo-kit.js:10`): alcance ×(1+0,05·(rango−1)), cooldown ×0,96^(rango−1), damageScale ×(1+0,14·(rango−1)), y ×1,15 extra al evolucionar el vómito.
- Puertas de nivel `[0,6,8,10,12]` (`:4`): rango 1→2 con nivel 6, 2→3 con 8, 3→4 con 10, 4→5 con 12.
- Taxi se ofrece desde nivel 2 y Eco desde nivel 4 (`:14`). Evolución: rango 5 y nivel 14 (`:14-15`).
- Cambio de técnica: mínimo 0,3 s y no durante taxi, Q o dominio (`:12-13`).

## Evoluciones
| Técnica | Evolución | Efecto | Línea |
|---|---|---|---|
| Vómito | Glucosa Maldita | cambia el nombre, daño ×1,15 y `afterCast` añade un golpe central de radio 110 al 40 % del daño (`extra:center`); el perfil sale de `P.Evolutions.profiles.cirilo` | `src/systems/evolutions.js:17,31`, `cirilo-kit.js:7,10` |
| Taxi | Carrera de ida y vuelta | alcance 300; la reversa golpea al 55 % del daño, una vez por rival | `src/systems/cirilo-kit.js:7` |
| Eco | Maldad contagiosa | la explosión pasa hasta 2 marcas débiles (poder ×0,5, radio ×0,8, 0,45 s, a ≤160 u), sin más propagación | `src/systems/cirilo-kit.js:7,42` |

- La Cirilo se excluye de la rama genérica `primary` ([[sistemas/evoluciones/README]]): `src/systems/progression.js:60`.
- `P.Data.attacks.micro` (el ataque original del catálogo) ya no se usa en combate; ver [[personajes/cirilo/gotchas]].
