---
tipo: gotcha
id: sideral
archivos: [src/systems/sideral-kit.js, src/systems/sideral-domain.js, src/data/powers.js, src/systems/progression.js]
verificado: 2026-10-31
---
# Sideral · trampas

- **`powerScale` de la Mirada no pega.** `P.Data.attacks.sideralFear` tiene `powerScale .42` (`src/data/powers.js:98`), pero el golpe real usa solo `damageScale` 1 (`sideral-kit.js:7,38`). La ficha del lobby muestra `power×.42` (`powers.js:55`: ≈11,3) y el golpe hace 27 antes de defensas. Ajusta `damageScale`, no `powerScale`.
- **Dos cargas distintas.** Q usa `sideralCharge` y R usa `ultimate.charge`. El cooperativo mira `charge` para R (`src/network/cooperative.js:17`).
- **Orden de módulos.** `sideral-domain.js` se carga antes que `sideral-kit.js` (`scripts/modules.cjs`, líneas 422 y 446) y ambos envuelven `P.Ultimate.gain`. Respeta ese orden de envoltorios (sin verificar qué pasa al invertirlo).
- **Evolución de la Mirada es el perfil base.** `sideralFear` evoluciona con `{...P.Evolutions.profiles.sideral}` (`sideral-kit.js:12`): editar `evolutions.js:6` sí cambia el juego (al contrario que en Makanaky).
- **Dos nombres para la R.** Carta «Vacío Sideral» (`ability-cards.js:21`) y `specialNames.sideral.domain` «Habitación del Lagarto» (`character-contract.js:7`); gana la carta.
- **Progreso por tecla, no por «primary».** La carta de arma principal se omite para Sideral (`src/systems/progression.js:60`): sus mejoras salen de `P.SideralArsenal.card`.
- Ver [[gotchas/README]].
