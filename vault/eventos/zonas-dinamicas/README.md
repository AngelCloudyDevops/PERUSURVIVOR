---
tipo: evento
id: dynamic-zones
archivos: [src/systems/dynamic-zones.js, backend/simulation.cjs, tests/dynamic-zones.test.cjs]
verificado: 2026-10-31
---
# Zonas dinámicas (`P.DynamicZones`)

Charcos ambientales de 10 s que afectan a jugadores y enemigos. `src/systems/dynamic-zones.js:3`.

## Cadencia
- Primera a `mapTime 28` s; luego cada `32-45` s (`nextAt:28`, `interval:[32,45]`, `dynamic-zones.js:4,24`).
- Aviso 1 s y dura 10 s (`warning:1`, `duration:10`, `:4`; vida `expiresAt = ahora+1+10`, `spawn :18`).
- Límite simultáneo: 4 (2 en pantallas ≤760 px) (`cap :12`).
- Se pausa con `devRun`, encuentro, jefe final, evento activo, dominio o rendimiento (`blocked :14`).
- Sin dependencia del modo: corre también en Rápida.

## Tipos (`definitions :5-9`, radio en `spawn :18`)
| Tipo | Radio | Efecto cada 0,5 s (`affect :23`) |
|---|---|---|
| `heal` | 78 | cura 0,75 % de vida máx. |
| `poison` | 88 | quita 0,5 % (0,25 % a jefes y minijefes); a jugadores baja vida directo (`poison :22`) |
| `slow` | 96 | −25 % de velocidad (`speed :25`) y ×1,12 sobre el daño entrante y el saliente del actor dentro (`defense :26`, parches de `Attributes.outgoing/incoming` en `:35-36`) |
- Elección rotativa por semilla sin repetir el anterior (`chooseKind :16`).
- Nombres por mapa: campo, plaza, machu (`label :27`).
- Posición: a 260-520 del jugador elegido, sobre terreno libre, a más de 170 de todo jugador y sin pisar otras zonas (`safe :15`, `point :17`).

## Cooperativo
- `players()` incluye a ambos jugadores (`:13`); la zona se ancla a uno elegido por hash (`spawn :18`).
- El servidor llama `DynamicZones.tick` en cada tick (`backend/simulation.cjs:38`) y envía `dynamicZones` en el snapshot (`simulation.cjs:63`).
- Tests: `tests/dynamic-zones.test.cjs:10,17,26,33`.
