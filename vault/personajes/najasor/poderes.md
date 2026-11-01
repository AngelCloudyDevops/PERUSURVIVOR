---
tipo: personaje
id: najasor
archivos: [src/systems/passives.js, src/systems/ability-cards.js, src/systems/ultimate.js]
verificado: 2026-10-31
---
# Najasor · pasiva, Q y R

Volver: [[personajes/najasor/README]]

**No tiene pasiva, Q ni R.** Verificado con `Simulation`: `P.Passives.definition`, `P.AbilityCards.definition(id,'ultimate')` y `(id,'domain')` devuelven `null` para `najasor`.
- Pasivas: solo `kingteka` y `makanaky` en `src/systems/passives.js:5-6`; otras se añaden desde su kit (p. ej. `src/systems/cirilo-kit.js:51`).
- Cartas Q/R: la tabla `entries` de `src/systems/ability-cards.js:13-23` no incluye `najasor`.
- Interfaz: el botón Q muestra «Q · ULTI · PRÓXIMAMENTE» (`src/systems/ultimate.js:26`) y R «R · EXPANSIÓN · PRÓXIMAMENTE» (`src/systems/ability-cards.js:50`). Ambos quedan deshabilitados.
- La carga de Q sigue subiendo +5 por baja (`src/systems/ultimate.js:12`) pero nada la consume para este personaje.

## Sí aplica
- Poderes de apoyo genéricos de [[sistemas/progresion-cartas/README]]: `pulse`, `cards`, `orbit`, hasta 3 entre arma y apoyos (`src/systems/progression.js:60`).

## Cooperativo
- Sin lógica propia. El servidor ejecuta el mismo ataque con `P.Combat.cast` en `backend/simulation.cjs` (sin referencias al id).

## Movimiento reducido
- Sin efectos propios que dependan de `P.Motion.reduced` (ningún sistema de `src/` nombra a `najasor` fuera de datos y arte, ver README).
- El zigzag, el campo o el bumerán son mecánica y no cambian con la preferencia.

Cuando se añadan poderes, registrar: carta en `ability-cards.js`, pasiva en `passives.js`, nombre en `src/data/character-contract.js:7` y wrappers de `P.Ultimate.*`/HUD como en `kingteka-domain.js`.
