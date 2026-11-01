---
tipo: evento
id: extinction-fases
archivos: [src/systems/map-events.js, tests/map-events.test.cjs]
verificado: 2026-10-31
---
# Extinción: fases

Padre: [[eventos/extincion/README]]. Estado en `event.phase`; avance en `tickWorld` (`src/systems/map-events.js:164-173`).

| Fase | Dura / termina | Clave |
|---|---|---|
| `cinematic` | 6,4 s | impacto a 4,75 s (`impact :39`); todos invulnerables (`:165`) |
| `invasion` | 3 oleadas | `wavePlan :52`; `activateWorld :74` |
| `fragments` | destruir 3 | `spawnFragments :80` |
| `boss` | matar al Tirano | `spawnBoss :83` |
| `portal` | acercarse a 125 | `offerPortal :152`, `declinePortal :155` |
| `dungeon` / `dungeonChoice` / `dungeonBoss` | 15 bajas en 3 salas + jefe | `beginDungeon :156`, `spawnDungeonBoss :86` |
| `reward` | elegir reliquia | `chooseRelic :162`, `applyRelic :163` |

## Relojes (`extinctionBalance`, `map-events.js:5`)
- Exterior 240 s (`exteriorSeconds`); al nacer el jefe `remaining = max(remaining, 90)`. Mazmorra 180 s; jefe de mazmorra mínimo 150 s.
- Avisos a 60 s y 30 s; a 0 s `failEvent('SE ACABÓ EL TIEMPO')` (`:165`). Si cae todo el equipo, `failEvent('EL EQUIPO CAYÓ')` (`:165`).
- `failEvent` restaura terreno, devuelve a los jugadores a su posición previa si habían entrado, y da 6 s de retorno seguro sin spawns (`:161`, `blocksSpawns :88`).
- El reloj del mapa se congela durante todo el evento (`mapTime -= dt`, `:165`).

## Tormenta y meteoritos (`:174-178`)
- Radios por fase: invasión 650, fragmentos 560, jefe 480; el borde se mueve 25/s (`tickStorm :175`).
- Daño por fuera: 1,5 %, 3 % o 5 % de vida máx./s según 0-100, 100-250 o >250 de distancia (`stormRates`, `:5`).
- Meteoritos de presión: aviso 1,2 s, máx. 3 simultáneos, cadencia 3,2 s (2,4 s fase II del jefe; 1,5 s si alguien está fuera) (`queueMeteor :176`, `tickMeteorPressure :177`). Impactan a un jugador fuera de la tormenta si lo hay.

## Invasión
- Oleadas (`wavePlan :52`): 1. anquilosaurio + 2 raptores; 2. pterosaurio + dilofosaurio + 2 raptores; 3. anquilosaurio, raptor, pterosaurio, dilofosaurio, parasaurio.
- Máximo 3 vivos a la vez; entre oleadas 2,2 s y curación del 8 % (`waveRecovery`, `defeated :144`).
- Aviso de oleada y rol: `defeated :144`.

## Fragmentos
- 3 estructuras fijas (radio 27), vida `(190 + floor(mapTime/180)×20) × (1+(tier−1)×.12) × (1+.4×(jugadores−1))` (`spawnFragments :81`). Cada una destruida cura 4 % (`defeated :145`). Siguen apareciendo dinosaurios (máx. 3) (`tickWorld :170`).

## Tirano del Cráter (jefe, `spawnBoss :83-85`)
- Vida `(2200 + floor(mapTime/300)×220) × (1+(tier−1)×.15) × (1+.6×(jugadores−1))`, radio 72, velocidad 78; perfil de combate en `bossProfile :73`. Cura 12 % al aparecer.
- Rotación de 4 (`bossAction :137`): embestida avisada, rugido, pisotón, meteorito sobre el jugador (rompe cobertura a ≤95 durante 7 s). Cada 3 acciones se agota y queda expuesto (`bossAttackDone :126`, ×1,45 daño, `incomingMultiplier :138`).
- ≤50 % (fase II): ataques más rápidos y Expansión «Cráter del depredador»: 8 s, 4 pulsos, refugio dorado rotatorio (arco ±0,48 y distancia 125-390 seguros), daño 16 (`startTyrantDomain :128`, `tickTyrantDomain :129`).
- ≤25 %: Ulti «Cacería del último rey»: 5,2 s, 3 carriles de 132 de ancho, daño 22 (`startTyrantUltimate :130`, `tickTyrantUltimate :131`).
- Durante expansión y ulti recibe ×0,25 de daño (`incomingMultiplier :138`).
- Premio: 75×mult + 15 si `remaining ≥ 90`; abre el portal prehistórico (`defeated :146`).

## Mazmorra «Era perdida»
- Entrar quita la solidez de objetos a ≤720 y teletransporta a los jugadores (`beginDungeon :156`); límite de movimiento ±560 × ±360 (`tickWorld :172`).
- Dinosaurios de mazmorra: raptor, triceratops, pterosaurio, dilofosaurio, parasaurio; máx. 7 vivos (`spawnDinosaur :76`, `tickWorld :170`).
- 3 salas de 5 bajas; tras sala 1 y 2 se elige (`offerRoomChoice :157`, `applyRoomChoice :158`): curar 35 %; +20 % de daño hasta el final; o riesgo (tier+1 y botín +35 %).
- A las 15 bajas aparece el Triceratops Fósil (`defeated :144`).

## Triceratops Fósil (`spawnDungeonBoss :86`)
- Vida `1950 × (1+(tier−1)×.15) × (1+.5×(jugadores−1))`, radio 57, velocidad 49.
- Dos placas absorben todo el daño (14 % de la vida cada una) hasta romperse; luego el cristal queda expuesto (`modifyDamage :139`, test `tests/map-events.test.cjs:142`). Daño recibido ×1,25 (×0,9 en fase II, ×1,6 aturdido) (`incomingMultiplier :138`).
- Dos pilares a ±330 para hacerlo chocar (`:86`).
- ≤50 %: Cámara de Ámbar, 7,4 s, sello iluminado entre 3 cámaras (`startFossilDomain :133`, `tickFossilDomain :134`). ≤25 %: Tres Cuernos (`startFossilUltimate :135`, `tickFossilUltimate :136`). Test: `tests/map-events.test.cjs:82`.
- Premio: 100 monedas y elegir reliquia (`defeated :147`).

## Fin
- `completeEvent :160`: `extinctionClears++`, limpia enemigos y peligros, 6 s sin spawns, reprograma el siguiente.
- HUD/telegrafías: `hud :288`, `drawStorm :239`, `drawTyrantContract :240`, `drawFossilContract :241`.
