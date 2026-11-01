---
tipo: evento
id: vulture
archivos: [src/systems/vulture-boss.js, src/systems/vulture-domain.js, src/systems/vulture-ultimate.js, src/systems/vulture-impact.js, src/systems/vulture-moon.js, src/systems/vulture-phase2.js, src/systems/encounters.js, tests/vulture-domain.test.cjs, tests/vulture-ultimate.test.cjs]
verificado: 2026-10-31
---
# El Gallinazo del Caos (`kind:'vulture'`)

- Definición: `P.Vulture.definition`, `src/systems/vulture-boss.js:4`. Vida 1800, radio 62, velocidad 62. Daño especial (`technique`).
- Sin mapa propio: es el 4.º elemento de `portalPool` (`src/systems/encounters.js:47`), sale en cualquier mapa. Bioma al vencer: `azoteas-lima` (`src/scenes/maps.js:15`).
- Invocación: portal; antes de entrar espera `P.Vulture.ready` (`encounters.js:56`; `Vulture.wait`, `vulture-boss.js:12`).

## Ataques base (`vulture-boss.js:21`, ciclo `['dive','feathers','summon']`)
- Picada (`dive`): aviso 1,05 s, avanza 560/s la ruta avisada exacta (`warn :15`, `move :19`). Tests: `tests/boss-charge-ranges.test.cjs:4`.
- Plumas (`feathers`): 7 plumas (11 en furia), paso .17, velocidad 225, daño 12 (`featherPlan :23`, `feathers :24`).
- Invocar (`summon :25`): hasta 3 gallinazos de 48 de vida; tope 4 vivos (6 en furia).
- Furia al <50 %: 2 picadas seguidas, más plumas y más invocados (`vulture-boss.js:17,21`).
- Hambre de carroña: cada invocado vivo (máx. 3) acorta el siguiente ataque (`VultureDomain.pressure`, `vulture-domain.js:11`).

## Expansión: Techos sin salida (50 %)
- `approach` y hp ≤50 %, una vez (`vulture-domain.js:16`). Encender 3 puntos en orden 1·3·2 en 7 s con viento que empuja al jugador (`start :8`, `tick :10`). Éxito: −4 % de vida; fallo: 20 de daño (`finish :9`).
- Test: `tests/vulture-domain.test.cjs:3,4,5`.

## Ulti: Eclipse Carroñero (≤30 %, una vez)
- Disparo: `approach` y hp ≤30 % (`src/systems/vulture-ultimate.js:25`; `start :11`). Fase II visual (atlas propio, `src/systems/vulture-phase2.js:3`, entrada 1,3 s).
- Secuencia lunar: despegue 1,25 s, caída avisada, aterrizaje 1,2 s con impacto único (`src/systems/vulture-moon.js:3,174`). Sin contacto con el jugador mientras vuela (`noContact :75`).
- Remate «Impacto»: con `chaosUltimate` se usan 3 oleadas de plumas en `t=0, 0,42, 1,9` s (7, 7 y 9 plumas; 11 en furia; la 3.ª pesada, daño 18) y luego una picada (`vulture-impact.js:18-22,31`).
- Ulti base (sin impacto): 4 s de intro, 3 abanicos cada 0,9 s y picada (`vulture-ultimate.js:4,15`).
- Derrota: animación 2,8 s y `Encounters.win` (`defeatDuration`, `vulture-boss.js:6-8`).

## Cooperativo
- `tests/coop-enemy-parity.test.cjs:18`: el servidor respeta `VultureMoon.noContact` (el contacto de 24 de `stepBody` lo comprueba, `src/systems/progression.js:21`).
- Portal coop con Gallinazo: `tests/boss-charge-ranges.test.cjs:53`.

## Tests
`tests/vulture-ultimate.test.cjs:2`; `tests/vulture-phase2.test.cjs:6,11,14`; `tests/vulture-impact.test.cjs:4,7`; `tests/vulture-moon.test.cjs:29,32,35`; `tests/boss-projectile-contracts.test.cjs:33,39`.
- Recompensa: la estándar de portal; ver [[eventos/portales-y-encuentros/README]].
