---
tipo: sistema
id: audio
archivos: [src/systems/audio.js, src/systems/minion-audio.js, src/systems/background-music.js, src/systems/soundscape.js, tests/minion-audio.test.cjs]
verificado: 2026-10-31
---
# Audio

Efectos y música sintetizados con Web Audio, música grabada opcional, mezclador acotado de ataques enemigos y ambiente por mapa. Solo cliente.

## Módulos
- `P.Audio` (`src/systems/audio.js:3`): contexto, volumen de efectos (`effectsVolume:.7`), `muted`, `voices`. «Efectos y música sintetizados; las pistas opcionales viven en BackgroundMusic» (`:2`).
  - `init` `:5` (lee `perusurvivor-audio-muted` y `perusurvivor-effects-volume` de `localStorage`, enlaza `#effects-volume`), `unlock` `:7` (crea `AudioContext` tras un gesto), `sync` `:11`, `tick` `:23`.
  - `fx(name)` `:13`: efecto por nombre con limitador por nombre (hit 0,1 s; hurt 0,25 s; otros 0,18 s). `hurt`, `boss`, `whistle`, `mini-fury-*` bajan la música (`duckMusic` `:9`).
  - `tone` `:12` (tope 16 voces), `voice` `:24` (tope 20), `play(kind)` `:25`, `pickup(n)` `:22`.
  - `musicLive` solo en modos `play`, `upgrade`, `loot-opening`, `item` (`:11`). Silencia en menú, pausa, portal, pestaña oculta o `blurred`.
- `P.BackgroundMusic` (`background-music.js:3`): pistas `tema1`, `tema2` (`assets/music/tema-*-v1.webm`, `:5`); `choice:'alternate'`; fundido 3 s; precarga 12 s. `useSynth()` `:15` decide si suena el sintetizador. Un reproductor por pista; solo se reutilizan dos al alternar (`:2`).
- `P.MinionAudio` (`minion-audio.js:3`): mezclador acotado solo de navegador (`:2`). Máx. 10 voces (`play` `:9`), atenuación por distancia 360 px (`gain` `:7`), volumen `perusurvivor-enemy-volume` (`:5`). Los contadores de ataque serializados sobreviven a los snapshots coop.
- `P.Soundscape` (`soundscape.js:3`): ambiente discreto con dos fuentes de ruido reutilizadas, sin archivos (`:2`). `profile(map,t,player,fountain)` `:5` (agua cerca de la fuente de plaza, viento en azotea/niebla), `ensure` `:7`, `tick(live)` `:8`. Se apaga en encuentros, jefe y práctica.

## Arranque y bucle
- `P.Audio.init()` en `P.Game.boot` (`src/scenes/game.js:8`). `P.Audio.tick()` orquesta: `sync()`, luego `Soundscape.tick(live)` y `MinionAudio.tick(live)` (`audio.js:23`).

## Estado y reinicio
- Todo vive en cada objeto (`ctx`, `last`, `voices`, `seen`, `active`). `MinionAudio.tick` limpia `seen/last` y se detiene si `elapsed` retrocede o `mode==='menu'` (`:8`). Preferencias en `localStorage`.

## Envoltorios
- `P.Audio.sync`: `src/systems/vulture-impact.js:44`.

## Cooperativo
- El servidor carga todos los módulos con un DOM falso (`backend/simulation.cjs:6-15`) y sin `AudioContext`: `fx()` sale si `!this.ctx`, así que llamar `P.Audio.fx` desde simulación es seguro. El audio de minions se activa en cliente a partir de eventos serializados.

## Tests
- `tests/minion-audio.test.cjs`, `combat-feedback.test.cjs` (en `package.json`). `tests/boss-health.test.cjs` NO está en `package.json`.

## Qué no romper
- No crear `AudioContext` sin gesto del usuario (`unlock`); respetar `muted` y `blurred` en todo sonido nuevo.
- Respetar los topes de voces (`voices>=16`, `>=20`, minions `>=10`) para evitar saturación.
- Todo `P.Audio.fx(nombre)` nuevo debe tolerar `ctx` nulo (servidor y tests).
- Mantener la mezcla: música baja a `.18` si es grabada (`musicMix`, `:8`).
