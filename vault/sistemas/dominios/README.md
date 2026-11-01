---
tipo: sistema
id: dominios
archivos: [src/systems/domain.js, src/systems/domain-aftermath.js, src/systems/domain-return.js, src/systems/kingteka-domain.js, src/systems/sideral-domain.js, src/systems/chamelin.js, src/systems/cirilo-ur.js, src/systems/cristorata-kit.js, src/systems/marciano-kit.js, src/core/runtime.js]
verificado: 2026-10-31
---
# Dominios (tecla R)

Expansión de dominio: escena autoritativa de varios segundos con carga propia. Es independiente de la ulti (Q): [[sistemas/ulti/README]]. Trampa de despacho: [[gotchas/G003-r-tres-sitios]]. Tarjetas: [[sistemas/progresion-cartas/README]].

## Dominios de jugador (módulo, estado en `P.state`, quién puede)
- Makanaky, «La Realeza»: `P.Domain` (`src/systems/domain.js:3`), `s.domain`. `eligible` exige `id==='makanaky'` y rareza gacha `ultra` (`:6`). Carga `u.domainCharge` hasta `balance.chargePoints:100`; cada muerte da 1 (normal), 2 (pesado), 15 (miniboss), 25 (jefe) y mientras es elegible NO suma carga de ulti (`P.Ultimate.gain`, `:60`). Entrada 3 s, combate 9 s, salida 1,35 s (`:3`).
- Kingteka, «Santuario»: `P.KingtekaDomain` (`kingteka-domain.js:6`), `s.kingtekaDomain`; carga por adaptación (`:10`), exige tier `ultra`.
- Sideral, «Vacío Sideral»: `P.SideralDomain` (`sideral-domain.js:2-4`), `s.sideralDomain`; `duration:8`, `chargeKills:35`, tier `ultra`.
- Cirilo, «Audiencia del Demonio»: `P.CiriloUR` (`cirilo-ur.js:3`), `s.ciriloDomain`, tier `ultra`.
- Chamelin, «Baño de Trovo»: `P.Chamelin` (`chamelin.js:3-5`), `s.chamelinDomain`; combate 8 s; arena en `chamelin-arena.js`.
- Cristorata, «Coliseo»: `P.CristorataKit.activateDomain` (`cristorata-kit.js:33`), `s.cristorataDomain`, `chargeField:'cristorataDomainCharge'`.
- Marciano, «Manhattan»: `P.MarcianoDomain` (`marciano-kit.js:42`), `s.marcianoDomain`.
- Jefes de mapa (no del jugador): `P.ChosicanoDomain` (`s.roadDomain`, `chosicano-domain.js:3`) y `P.VultureDomain` (`vulture-domain.js`).
- Apoyo: `P.DomainAftermath` (`domain-aftermath.js:2`; ralentización y secuela, `slow(e)` envuelta por kits) y `P.DomainReturn` (curva de salida, `domain-return.js:2`).
- Presentación: cinematográfica o dinámica según `localStorage['perusurvivor-option-domain-dynamic']` (`domain.js:7`). Arte en `src/rendering/domain-art.js`, `domain-intro.js`, `domain-finale.js`.
- Lista de claves de estado que bloquean subidas de nivel: `Progression.domainActive` (`src/systems/progression.js:84`): `cristorataDomain, domain, kingtekaDomain, court, roadDomain, sideralDomain, chamelinDomain, ciriloDomain, marcianoDomain`.

## Tecla R: tres sitios en `src/core/runtime.js`
- Clic en `#domain-ability` (`:22`): Marciano, Cristorata, Cirilo UR, Kingteka, Chamelin, `P.Domain`, Sideral.
- `keydown` R (`:24`): arranca el temporizador de vistazo (180 ms, mantener); activa Chamelin, `P.Domain`, Sideral directamente.
- `keyup` R (`:25`): pulsación corta; Cristorata, Cirilo UR, Kingteka, Chamelin, `P.Domain`, Sideral. No incluye Marciano (propio `keyup` en `marciano-kit.js:66`, según G003).
- El botón solo funciona con `mode==='play'` y no oculto; la tarjeta exige carga >= 100 (`AbilityCards.hud`, `ability-cards.js:40-47`).
- Pasos para un dominio nuevo: `eligible(p)`, `activate()`, entrada en `AbilityCards.entries` (kind `domain`), alta en los tres sitios y en `Progression.domainActive`.

## API común
- `eligible(p)`, `activate()`, `tick(dt)`, `hud()`, `end()`, `entryFor`, `presentation()`; en coop `activate()` envía `P.Coop.requestDomain()` (`domain.js:16`, `cooperative.js:17`).

## Estado y reinicio
- `P.state.<xDomain>` (objeto con `age`, `exit`, jugador dueño...), `u.domainCharge`. Se limpia al terminar (`end`) y en `P.Game.start`.

## Envoltorios
- `P.Ultimate.activate/gain/hud` en `domain.js:59-61` y `kingteka-domain.js:77`, `sideral-domain.js:65-67` (cada dominio añade el suyo). `P.Entities.hurt` y `P.Combat.cast` en `sideral-domain.js:72,82,103`. `P.World.render` en `kingteka-domain.js:75`, `sideral-domain.js:70`, `cirilo-arena.js:86`, `domain-art.js:68`.
- `P.Terrain.active/hit/resolve/draw` se sustituyen durante el dominio (`sideral-domain.js:73-76`, `chamelin-arena.js:24-32`, `cirilo-arena.js:75-77`).

## Cooperativo
- Escena autoritativa («One authoritative encounter. Targets keep their real HP, loot and original world positions», `domain.js:2`). El cliente envía `domain:true` y `domainPresentation` en `input`; el servidor gestiona la escena. Con `P.Combat.server` los kits devuelven por servidor (`cristorata-kit.js:33`).

## Tests
- `tests/domain.test.cjs`, `domain-camera.test.cjs`, `kingteka-domain.test.cjs`, `sideral-domain.test.cjs`, `chamelin.test.cjs`, `cirilo-ur.test.cjs`, `cristorata-kit.test.cjs`, `marciano-kit.test.cjs`, `vulture-domain.test.cjs`, `chosicano.test.cjs` (en `package.json`).

## Qué no romper
- Dominio nuevo: registrar en los tres sitios de R o fallará con tecla (G003).
- El dominio no debe consumir `u.charge` de la ulti ni al revés (dos cargas separadas).
- No aplicar subidas de nivel ni cofres con un dominio activo (`blocksUpgrade`).
- Respetar `P.Motion.reduced()` en arte de dominio ([[sistemas/movimiento-reducido/README]]).
