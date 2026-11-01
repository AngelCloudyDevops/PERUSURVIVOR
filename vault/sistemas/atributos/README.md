---
tipo: sistema
id: atributos
archivos: [src/data/attributes.js, src/data/stats.js, tests/attributes.test.cjs, tests/stats.test.cjs]
verificado: 2026-10-31
---
# Atributos (Fuerza, Técnica, Ingenio)

Triángulo de ventajas que escala el daño. Detalle de daño en [[sistemas/combate/README]].

## Reglas
- Nombres: `force` Fuerza, `technique` Técnica, `wit` Ingenio (`src/data/attributes.js:4`).
- `beats`: Fuerza > Técnica > Ingenio > Fuerza (`attributes.js:4`).
- `advantage(a,b)`: 1 si iguales o desconocido; 1.15 si `a` gana; 0.9 si pierde (`:9`).
- `multiplier`: `2*atk/(atk+def*(1-penetración))*advantage` (`:14`). Valores de ataque/defensa fuera de 1-1000 se recortan (`rating`, `:13`).
- `P.Attributes.roster[id]` = `[atributo, tipo de daño, defensa física, defensa especial]` (`:5`); `character(c)` construye `combatStats` (`:7`). Makanaky y Sideral tienen excepciones (`:7`).
- Enemigos sin roster: `init(e)` asigna por tipo (miniboss por mapa, jefe de mapa, diseño `design%6`) (`:8`).

## API pública
- `P.Attributes.init`, `source(actor,type)` (`:10`), `owner(source)` (`:12`), `outgoing` (`:15`), `incoming` (`:16`), `badge(ctx,e)`.
- `P.Stats`: límites `penetration 0-.75`, `criticalChance 0-1`, `recoveryRate .25-4` (`src/data/stats.js:6`).

## Estado
- Todo vive en `entity.combatStats`; no hay `P.state` propio. `Stats.step` regenera cada frame (`stat-runtime.js:5`).

## Envoltorios
- `P.Attributes.outgoing`: `src/systems/chamelin.js:28`. `P.Attributes.source` e `incoming`: `src/systems/character-balance.js:23`.

## Cooperativo
- Corre en el servidor; `source.ownerSlot` distingue jugadores del mismo personaje.

## Tests
- `tests/attributes.test.cjs`, `stats.test.cjs`, `stats-step-cache.test.cjs` (en `package.json`).

## Qué no romper
- Un `source` sin `combatStats` cae a los del jugador (`outgoing`, `:15`): usar `Attributes.source`.
- Añadir un personaje: entrada en `roster` o recibe `stats()` neutral.
