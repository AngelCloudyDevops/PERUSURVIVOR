---
tipo: indice
id: eventos
archivos: [src/systems/map-events.js, src/systems/encounters.js, src/systems/minibosses.js, src/systems/run-mode.js, src/scenes/maps.js, backend/activities.cjs]
verificado: 2026-10-31
---
# Eventos de mapa, encuentros y jefes

Cada carpeta es un evento. IDs en kebab-case (los fija este índice).

## Índice
| Carpeta | Qué es | Dónde corre |
|---|---|---|
| [[eventos/modos-de-partida/README\|modos-de-partida]] | Rápida (300 s) y Caos (1800 s), etapas, ventanas de portal | solo + coop |
| [[eventos/jefe-final-elzeein/README\|jefe-final-elzeein]] | Jefe final `P.Data.boss`, al agotar el reloj | solo + coop |
| [[eventos/portales-y-encuentros/README\|portales-y-encuentros]] | Portal, arena, sorteo de jefe, recompensa, cambio de mapa | solo + coop |
| [[eventos/jefe-chosicano/README\|jefe-chosicano]] | Portal `combi` (campo) | portal |
| [[eventos/jefe-gabinete/README\|jefe-gabinete]] | Portal `cabinet` (plaza) | portal |
| [[eventos/jefe-guardian-niebla/README\|jefe-guardian-niebla]] | Portal `stone` (machu) | portal |
| [[eventos/jefe-procesion/README\|jefe-procesion]] | Variante de halloween del `stone` | portal |
| [[eventos/jefe-grinch/README\|jefe-grinch]] | Variante de navidad del `cabinet` | portal |
| [[eventos/jefe-gallinazo/README\|jefe-gallinazo]] | Portal `vulture` (todos los mapas) | portal |
| [[eventos/jefe-fujimori/README\|jefe-fujimori]] | Portal `fujimori` (todos los mapas) | portal |
| [[eventos/minijefes/README\|minijefes]] | Fiscalizador, Paloma Brava, Huaco Renegado, Makanaky | mundo abierto |
| [[eventos/extincion/README\|extincion]] | Evento mundial: meteorito, dinosaurios, Tirano, mazmorra | mundo abierto |
| [[eventos/minieventos-supervivencia/README\|minieventos-supervivencia]] | Recoger señales (3 por mapa) y reto del minuto 12 | solo Caos |
| [[eventos/estacion-emoliente/README\|estacion-emoliente]] | Defender el puesto 20 s | solo `campo` |
| [[eventos/zonas-dinamicas/README\|zonas-dinamicas]] | Curación / veneno / debilidad | solo + coop |
| [[eventos/barriles-explosivos/README\|barriles-explosivos]] | Dinamita y fuego | solo + coop |
| [[eventos/mercader/README\|mercader]] | Ambulante y El Hueco | solo + coop |
| [[eventos/dos-puestos/README\|dos-puestos]] | Defensa doble | solo coop |
| [[eventos/escolta-combi/README\|escolta-combi]] | Escolta de la combi | solo coop |

No son eventos (son personaje): `src/systems/dragon-ultimate.js` es la ulti de un personaje, no un jefe.

## Mapa → eventos
Mapas públicos: `src/scenes/maps.js:5-9` (`campo`, `plaza`, `machu`, `halloween`, `navidad`).
Biomas de jefe (solo se llega por portal en Caos): `src/scenes/maps.js:12-16`.

| Mapa | Minievento (`eventBase`) | Minijefe | Jefe de portal propio | Portal (x,y) |
|---|---|---|---|---|
| `campo` | `catalog.campo` | Fiscalizador | Chosicano | 440,180 |
| `plaza` | `catalog.plaza` | Paloma Brava / Makanaky (alternan) | Gabinete | 420,260 |
| `machu` | `catalog.machu` | Huaco Renegado | Guardián | 300,180 |
| `halloween` | campo (sin `eventBase`) | Fiscalizador (`miniboss:'campo'`) | Procesión | 420,180 |
| `navidad` | campo | Paloma/Makanaky (`miniboss:'plaza'`) | Grinch | 420,220 |

- Portal: `src/systems/encounters.js:39-44` y `:46`. Minijefe: `src/scenes/maps.js:8-9`.
- Estación del emoliente: solo si `P.Maps.selected==='campo'` (`src/systems/exploration.js:4`); no en halloween/navidad.
- Los 5 jefes de portal posibles salen de `Encounters.portalPool` (`src/systems/encounters.js:47`).
- Biomas: `ruta-chosicano`→combi, `distrito-gabinete`→cabinet, `santuario-niebla`→stone, `azoteas-lima`→vulture, `archivo-final`→fujimori.

## Cooperativo (resumen)
- Sala de 2; el servidor siempre crea la simulación en `'chaos'` (`backend/cooperative.cjs:47`) y el cliente fuerza `P.RunMode.selected='chaos'` (`src/network/cooperative.js:25`).
- Orden por tick del servidor: `Encounters.tick` → `MapEvents.tick` → `DynamicZones` → `ExplosiveBarrels` → `Systems.spawn` (`backend/simulation.cjs:38`).
- Actividades, votos y recompensas de a dos: `backend/activities.cjs`.
- Tests: `tests/cooperative.test.cjs`, `tests/coop-enemy-parity.test.cjs`, `tests/coop-choice-timeout.test.cjs`.

Ver también: [[sistemas/mapas/README]], [[sistemas/cooperativo/README]], [[sistemas/oleadas-dificultad/README]], [[sistemas/cofres-mercader/README]], [[gotchas/README]].
