---
tipo: evento
id: minibosses-makanaky
archivos: [src/systems/minibosses.js, tests/miniboss-phase.test.cjs]
verificado: 2026-10-31
---
# Makanaky · La Realeza (minijefe de `plaza`)

Parte de [[eventos/minijefes/README]]. Definición: `src/systems/minibosses.js:5` (vida 480, radio 30, velocidad 72, alto 122). Personaje jugable homónimo: [[personajes/makanaky/README]].

- Aparece en Plaza alternando con la Paloma Brava: `choose` devuelve `makanaky` en los turnos impares de `miniPlazaTurn` (`minibosses.js:10`; el contador sube en `:19`).
- Ataques (`fireRoyal :36`): `shout` abanico de 3 pulsos (velocidad 185, daño 10) y `flash` estampida de radio 110 (daño 12, especial).
- Fase II: `beginFury :28`; no tiene ataque especial propio (`nextAttack :75` solo cubre campo, plaza y machu).
- Botín: `mini_whistle` (`src/systems/miniboss-relics.js:3`).
- Tests: `tests/miniboss-phase.test.cjs:176,179,183,187`.
