---
tipo: personaje
id: cristorata
archivos: [src/systems/cristorata-kit.js, src/data/catalog.js, src/data/powers.js, src/systems/combat.js, src/systems/evolutions.js]
verificado: 2026-10-31
---
# Cristorata · ataques
Arsenal propio `P.CristorataArsenal` (`src/systems/cristorata-kit.js:3-16`), orden `clip`, `cristoDash`, `cristoClaw` (`:4`). Todos físicos (`:39`). Poder base 18.

## 1. Clip de ida y vuelta (`clip`)
- `kind boomerang`, `range 520` (`src/data/catalog.js:15`), `cooldown 0.9` (catálogo 0.95, parche `src/data/powers.js:83`).
- Sin `count` ni `powerScale`: 1 micrófono, daño 18 por impacto (`src/systems/combat.js:22`). Velocidad 470, vida 1,3·reach, giro a 0,55·reach (`combat.js:22`), regreso a 530 (`combat.js:45`).
- Al girar se vacía `hits`: el mismo rival puede golpearse en ida y vuelta (`combat.js:45`); eso alimenta la pasiva.
- **Evolución «Directo encadenado»** (`src/systems/evolutions.js:7`): `count 2`, `extra:'chain'`. Tras lanzar, hasta 3 rivales a ≤220 u del objetivo reciben 45 % del daño (`evolutions.js:36`).

## 2. Derrape del directo (`cristoDash`)
- `kind dash`, `cooldown 2.6`, `range 165`, `damageScale 1.35` → 24,3 de daño, físico (`cristorata-kit.js:6`).
- Recorre `min(260, range·reach)` a ≤620 u/s, máx. 1 s; un golpe por rival, empuje 10; se detiene en paredes; sin invulnerabilidad (`:27-28`).
- Necesita un objetivo dentro de `range·reach`; si no, no se lanza (`:48`).
- **Evolución «Derrape encendido»** (`:7`): estela cada 24 u, máx. 24 zonas, radio 31, 1,6 s, daño especial `power·0.18`, pulso cada 0,4 s, sin acumular (`:28,31`).

## 3. Garra del dragón (`cristoClaw`)
- `kind melee`, `cooldown 1.35`, `range 145`, arco 130°, `damageScale 1.25` → 22,5; empuje 22 (0 contra jefes) (`:6,29-30`).
- **Evolución «Doble garra»** (`:7`): segundo zarpazo a +0,24 s, 55 % del daño, empuje 10 (`:29`).

## Rangos, desbloqueo y evolución
- `cristoDash` se ofrece con nivel ≥ 2, `cristoClaw` con nivel ≥ 4 (`:14`).
- Rango 1→5 exige nivel ≥ 6, 8, 10, 12 (`gates`, `:4,14`). Cada rango: +14 % daño, +5 % alcance, −4 % intervalo (`:10,14`).
- Evolución: rango 5 y nivel ≥ 14 (`:14-15`). El `clip` evolucionado marca `p.evolved.primary` (`:15`).
- `progression.js` omite la carta genérica `primary` para `cristorata` (`src/systems/progression.js:60`).
- Cambio de arma: `request(index)` (`:12`), mínimo 0,3 s entre cambios (`:13`); en cooperativo viaja como `input.weapon` (`backend/simulation.cjs:41`).
- Pasiva en 3 cargas: +20 % daño y +15 % alcance al siguiente ataque (`:10`). Ver [[personajes/cristorata/poderes]].

Volver a [[personajes/cristorata/README]].
