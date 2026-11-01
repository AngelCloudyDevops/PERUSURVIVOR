---
tipo: evento
id: minibosses-machu
archivos: [src/systems/minibosses.js, tests/miniboss-phase.test.cjs]
verificado: 2026-10-31
---
# El Huaco Renegado (`machu`)

Parte de [[eventos/minijefes/README]]. Definición: `src/systems/minibosses.js:8` (vida 540, radio 35, velocidad 55, especial, `statusResistance .2`). Mapa: `machu` y bioma `santuario-niebla`.

## Ataques (ciclo `quake → shards → stelae`)
- Sismo (`quake`): onda de suelo radio 145, daño 16, aviso 1 s (`fire :46`).
- Esquirlas (`shards`): 8 proyectiles radiales, velocidad 175 (`fire :46`). La onda es radial: `tests/miniboss-phase.test.cjs:38`.
- Estelas (`stelae`): 3 impactos en línea, radio 44, daño 15, aviso 0,95 s (`fireStelae :44`).

## Fase II
- Cada 4.º ataque: Derrumbe del Santuario (`collapse`, aviso 1,25 s): 12 proyectiles convergentes desde radio 205, daño 17, con 2 salidas opuestas (`fireCollapse :45`).

## Tests
`tests/miniboss-phase.test.cjs:75` (contrato, estelas y derrumbe), `:168` (contraataque tras la onda).
