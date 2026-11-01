---
tipo: evento
id: minibosses-plaza
archivos: [src/systems/minibosses.js, tests/miniboss-phase.test.cjs]
verificado: 2026-10-31
---
# La Paloma Brava (`plaza`)

Parte de [[eventos/minijefes/README]]. Definición: `src/systems/minibosses.js:7` (vida 420, radio 29, velocidad 82, físico, técnica). Mapas: `plaza` (alterna con [[eventos/minijefes/makanaky]]), `navidad` (`miniboss:'plaza'`) y los biomas de jefe.

## Ataques (ciclo `feathers → peck → droppings`)
- Plumas (`feathers`): 5 proyectiles, velocidad 205 (`fire :46`).
- Picotazo (`peck`): carga corta a 410 de velocidad con ruta avisada (`warn :32`, `move :76`).
- Bombardeo (`droppings`): fija 3 marcas (tu posición y ±65 en la dirección), radio 42, daño 12, aviso 0,95 s (`warn :32`, `fireDroppings :38`).

## Fase II
- Aleteo encadenado con salto lateral. Cada 4.º turno: Bandada del Centro (`flock`, aviso 1,15 s), 8 plumas laterales cruzadas, velocidad 235, daño 13 (`fireFlock :43`, `nextAttack :75`).

## Tests
`tests/miniboss-phase.test.cjs:68` (bombardeo fijo y bandada cruzada), `:38` (plumas no atraviesan muros).
