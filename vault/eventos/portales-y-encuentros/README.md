---
tipo: evento
id: encounters
archivos: [src/systems/encounters.js, src/scenes/maps.js, src/entities/actors.js, backend/activities.cjs, tests/boss-charge-ranges.test.cjs, tests/cooperative.test.cjs, tests/encounter-navigation.test.cjs]
verificado: 2026-10-31
---
# Portales y encuentros de jefe de mapa

`P.Encounters` (`src/systems/encounters.js:3`). Un portal abre una arena aparte; el reloj del mapa se detiene dentro.

## Cuándo abre
- `tick()` (`encounters.js:52`): índice de ventana según [[eventos/modos-de-partida/README]]; `portal.open` si la ventana no está superada, no hay jefe final y `mapTime < duration`.
- Aviso sonoro 10 s antes (`encounters.js:52`); alerta 3,2 s al abrir.
- Posición del portal: `catalog[encounterBase||id].portal` (`encounters.js:46`): campo 440,180; plaza 420,260; machu 300,180; halloween 420,180; navidad 420,220 (`encounters.js:40-44`).
- Entrada: tocar el centro (`touch`, radio 30, `:53`) o estar a ≤105 y confirmar (`near`/`offer`, `:54-55`). `Encounters.range=105` (`:4`).
- `unlock:180` (`:4`) solo lo usa el laboratorio; la rápida usa 180 s fijo en `run-mode.js:17`.

## Sorteo del jefe (`encounters.js:47-50`)
- `portalPool`: `[campo, plaza, machu, Vulture.definition, FujimoriBoss.definition]` (5 jefes).
- En `halloween` el elemento `stone` se sustituye por la Procesión; en `navidad` el `cabinet` por el Grinch (`:47`).
- `portalDefinition(index)`: guarda la elección en `s.portal.bossChoices[index]`; excluye el último jefe de portal (`localStorage perusurvivor-last-portal-boss-v1`, `:48,50`) y los ya usados en la partida (`:49`).
- `recordPortalBoss` no guarda en práctica/balance ni en servidor/coop (`:50`).
- Test: `tests/boss-charge-ranges.test.cjs:51-52`.

## Dentro de la arena (`enter`, `encounters.js:56`)
- Espera a que carguen Gallinazo, Fujimori y Chosicano antes de entrar.
- Crea `s.encounter` con la escena (`P.BossArt.scene(kind)`), cuatro coberturas (`cover`, `:14`) y guarda enemigos/gemas del mundo.
- Un solo enemigo: `{hp:def.hp, max:def.hp, mapBoss:true, phase:'approach'...}`. Vida de jefe de mapa: 3 barras (`src/entities/actors.js:3`).
- Sin escala de vida por número de jugadores (no hay referencia en `enter`; contrastar con minijefes en [[eventos/minijefes/README]]).
- Daño de contacto 24 a todo jugador cercano (`src/systems/progression.js:21`).
- Tabla de vidas y mapas: ver cada jefe en [[eventos/README]].
- Evento rápido de fase al 50 %: ventana 1,15 s; tecla `E` da esquiva perfecta (`:34-35`).
- `bossMove` despacha por tipo (`:65`): `combi`→`ChosicanoCombat`, `vulture`→`Vulture`, luego `CabinetBoss`, `GuardianBoss`, `ProcessionBoss`, `HolidayBoss`; el resto usa el genérico (carga/abanico). Fujimori se despacha por un adaptador en `src/systems/fujimori-boss.js:27`.
- Proyectiles de aviso y disparo comparten plan: `projectilePatterns` (`:5-9`), `projectilePlan` (`:11`). Test: `tests/boss-projectile-contracts.test.cjs:8,26,33`.
- IA de ruta persistente `planRoute`/`navigate` (`:17-32`). Test: `tests/encounter-navigation.test.cjs:17,23,30`.

## Victoria (`win`, `encounters.js:57-63`)
1. Solo/Caos: `P.Maps.transition(kind)` cambia al bioma del jefe (`src/scenes/maps.js:23`). `kind→bioma`: `combi→ruta-chosicano`, `cabinet→distrito-gabinete`, `stone→santuario-niebla`, `vulture→azoteas-lima`, `fujimori→archivo-final` (`maps.js:12-16`).
2. Al cambiar de bioma se reinician mundo, terreno, `MapEvents.event`, zonas, barriles, mercader y estación (`encounters.js:58`). Rápida: regresa al mapa con enemigos guardados.
3. Cofre dorado `P.Loot.bossChest` y elección (`encounters.js:59-62`):
   - Poder del portal: +30 % daño.
   - Corazón de la arena: +40 vida máxima y cura total.
   - Ritmo del campeón: ataques +25 % más frecuentes (`rate*.75`, mínimo .1).
4. `reward()` llama `ChaosDirector.bossVictory()` y retoma la cuenta a ElZeein (`:64`).
- Caos: se marca la ventana en `clearedWindows`; `cleared` cuando son 3 (`:59`). Rápida: `cleared=true`.

## Cooperativo
- `Encounters.win` se reemplaza en el servidor por `returning=true` (`backend/activities.cjs:4`) y `returnFromArena` (`:31-38`) repone mundo y deja un cofre dorado `boss:<mapa>` legendario.
- Entrada: contacto de uno basta (`autoPortal`, `activities.cjs:28`) o voto de los dos (`tryPortal`, `:29`, exige `votes.size===2`). Ambos aparecen en la arena (x 0 y 60, y 220).
- Premio: cada jugador elige uno de 3 (`kind:'portal-reward'`, `activities.cjs:82-85`).
- `returnFromArena` no llama `Maps.transition` ni actualiza `clearedWindows` (no hay cambio de bioma en coop). Efecto en Caos sin verificar en ejecución.
- Tests: `tests/cooperative.test.cjs:19`, `tests/boss-charge-ranges.test.cjs:53-58` (dúo, contacto, retorno individual).

Jefes: [[eventos/jefe-chosicano/README]], [[eventos/jefe-gabinete/README]], [[eventos/jefe-guardian-niebla/README]], [[eventos/jefe-procesion/README]], [[eventos/jefe-grinch/README]], [[eventos/jefe-gallinazo/README]], [[eventos/jefe-fujimori/README]].
