---
tipo: arquitectura
id: envoltorios
archivos: [scripts/modules.cjs, src/entities/actors.js, src/scenes/game.js, src/systems/ultimate.js, src/rendering/world.js, src/ui/screens.js, src/systems/combat.js, src/development/performance.js]
verificado: 2026-10-31
---
# Envoltorios de funciones de `P`

Patrón: `const prev=P.X.y; P.X.y=function(...a){…; return prev.apply(this,a)}`.
El **último** módulo cargado es la capa **más externa**: corre primero y decide si llama
al resto. Pos. = índice en `scripts/modules.cjs`. Lista obtenida cruzando
`grep "<Ns>.<fn>\s*="` con el orden de módulos (incluye formas con `bind` y flechas).

## `P.Entities.hurt` (base: pos. 31, `src/entities/actors.js:22`) · 13 envoltorios
| Pos. | Archivo:línea | Qué añade |
|---|---|---|
| 49 | `src/systems/vulture-moon.js:186` | Ignora daño a enemigos `moonAirborne` |
| 91 | `src/systems/map-events.js:298` | Multiplica daño por evento de mapa; `enemyHit` |
| 97 | `src/scenes/practice.js:15` | Registra daño al jefe de práctica |
| 99 | `src/systems/court-ultimate.js:49` | ×1,2 a enemigos con veredicto del tribunal |
| 120 | `src/systems/causa-combo.js:25` | Cuenta golpes para el combo Causa |
| 131 | `src/systems/sideral-domain.js:72` | ×1,2 a jefes débiles en dominio Sideral |
| 131 | `src/systems/sideral-domain.js:103` | Enemigos congelados no reciben daño |
| 145 | `src/systems/cirilo-ur.js:86` | Efecto del vómito de Cirilo |
| 153 | `src/systems/stat-runtime.js:10` | Robo de vida (`P.Stats.lifeSteal`) |
| 157 | `src/systems/cirilo-kit.js:62` | Marcas del kit de Cirilo |
| 159 | `src/systems/chamelin-kit.js:61` | Efectos al golpear de Chamelín |
| 161 | `src/systems/cristorata-kit.js:50` | Efecto del micrófono (`glyph==='MIC'`) |
| 165 | `src/systems/dota-equipment.js:67` | Eventos de daño para objetos Dota (más externo) |

## `P.Game.update` (base: pos. 96, `src/scenes/game.js:4`) · 13 envoltorios
| Pos. | Archivo:línea | Qué añade |
|---|---|---|
| 97 | `src/scenes/practice.js:13` | En práctica, `P.Practice.update` sustituye al juego |
| 98 | `src/rendering/ultimate-comic.js:30` | Invulnerable durante el cómic de la ulti |
| 99 | `src/systems/court-ultimate.js:43` | Avanza la escena del tribunal |
| 108 | `src/systems/kingteka-domain.js:72` | Tick del dominio de Kingteka |
| 114 | `src/development/test-bench.js:146` | `P.TestBench.tick` |
| 121 | `src/systems/domain.js:62` | Dominio de Makanaky: sustituye o complementa el tick |
| 131 | `src/systems/sideral-domain.js:68` | Tick del dominio Sideral |
| 134 | `src/systems/dragon-ultimate.js:34` | Escena del dragón bloquea el tick |
| 138 | `src/systems/chosicano-domain.js:25` | Dominio de la carretera (Chosicano) |
| 140 | `src/systems/chamelin.js:33` | Dominio de Chamelín |
| 145 | `src/systems/cirilo-ur.js:96` | Ralentiza y quema enemigos de Cirilo |
| 150 | `src/rendering/portal-fx.js:22` | Transición de portal bloquea el tick |
| 153 | `src/systems/stat-runtime.js:5` | `P.Stats.step` (regeneración) en `play` (más externo) |

## `P.Game.start` (base: pos. 96, `src/scenes/game.js:3`) · 14 envoltorios
| Pos. | Archivo:línea | Qué añade |
|---|---|---|
| 97 | `src/scenes/practice.js:13` | Oculta la práctica |
| 98 | `src/rendering/ultimate-comic.js:30` | Reinicia el cómic |
| 99 | `src/systems/court-ultimate.js:42` | Limpia `court`, `courtBurst` |
| 108 | `src/systems/kingteka-domain.js:73` | `kingtekaDomain=null` |
| 114 | `src/development/test-bench.js:145` | Perfil de balance de admin en partida normal |
| 117 | `src/network/account.js:27` | Bloquea si la cuenta está cambiando (flecha + `bind`) |
| 121 | `src/systems/domain.js:63` | Limpia `domain`, `domainAftermath` |
| 131 | `src/systems/sideral-domain.js:69` | `sideralDomain=null` |
| 135 | `src/rendering/dragon-art.js:49` | Carga arte del dragón si el jugador es Cristorata |
| 138 | `src/systems/chosicano-domain.js:26` | Limpia `roadDomain` y voz |
| 140 | `src/systems/chamelin.js:34` | Limpia dominio y charcos de Trovo |
| 145 | `src/systems/cirilo-ur.js:97` | `ciriloDomain=null` |
| 146 | `src/systems/character-balance.js:23` | Aplica balance pendiente antes de empezar |
| 161 | `src/systems/cristorata-kit.js:60` | `cristorataDomain=null` (más externo) |

## `P.Ultimate.activate` (base: pos. 86, `src/systems/ultimate.js:13`) · 17 envoltorios
| Pos. | Archivo:línea | Qué añade |
|---|---|---|
| 93 | `src/network/cooperative.js:6` | En cooperativo envía la intención al servidor (flecha + `bind`) |
| 98 | `src/rendering/ultimate-comic.js:30` | Lanza el cómic si activó |
| 99 | `src/systems/court-ultimate.js:39` | Alberto → `P.Court.activate` |
| 108 | `src/systems/kingteka-domain.js:77` | Bloquea durante el dominio de Kingteka |
| 113 | `src/systems/animal-ultimates.js:24` | Ultis animales |
| 120 | `src/systems/causa-combo.js:22` | Consume el combo Causa |
| 121 | `src/systems/domain.js:59` | Paso directo (no cambia nada) |
| 127 | `src/systems/makanaky-ultimate.js:28` | Ulti de Makanaky |
| 131 | `src/systems/sideral-domain.js:65` | Paso directo |
| 134 | `src/systems/dragon-ultimate.js:36` | Dragón de Cristorata |
| 140 | `src/systems/chamelin.js:30` | Ulti de Chamelín |
| 145 | `src/systems/cirilo-ur.js:93` | Bloquea la ulti genérica de Cirilo |
| 155 | `src/systems/sideral-kit.js:92` | Q de Sideral |
| 157 | `src/systems/cirilo-kit.js:64` | Q de Cirilo |
| 159 | `src/systems/chamelin-kit.js:63` | Q de Chamelín |
| 161 | `src/systems/cristorata-kit.js:54` | Bloquea durante el dominio de Cristorata |
| 163 | `src/systems/marciano-kit.js:77` | Q de Marciano (más externo) |

## `P.World.render` (base: pos. 78, `src/rendering/world.js:33`) · 17 envoltorios
| Pos. | Archivo:línea | Qué añade |
|---|---|---|
| 79 | `src/rendering/juice.js:22` | Capa de juice |
| 80 | `src/rendering/hurt-vignette.js:10` | Viñeta de daño |
| 98 | `src/rendering/ultimate-comic.js:30` | Dibuja el cómic |
| 99 | `src/systems/court-ultimate.js:44` | Escena del tribunal (puede no llamar a la base) |
| 108 | `src/systems/kingteka-domain.js:75` | Superposición del dominio de Kingteka |
| 113 | `src/systems/animal-ultimates.js:27` | Dibujo de ultis animales |
| 115 | `src/rendering/animal-entry.js:9` | Entrada animal |
| 124 | `src/rendering/domain-art.js:68` | Arte del dominio de Makanaky |
| 131 | `src/systems/sideral-domain.js:70` | Arte del dominio Sideral |
| 135 | `src/rendering/dragon-art.js:48` | Dragón y clase `dragon-cinematic` |
| 138 | `src/systems/chosicano-domain.js:27` | Carretera: **sustituye** la base si está activa |
| 141 | `src/rendering/chamelin-art.js:21` | Arena de Chamelín |
| 144 | `src/rendering/chamelin-fluency.js:32` | Fluidez de Chamelín |
| 145 | `src/systems/cirilo-ur.js:98` | Dominio de Cirilo |
| 148 | `src/systems/cirilo-arena.js:86` | Oculta gemas y escombros en arena separada |
| 150 | `src/rendering/portal-fx.js:23` | Transición de portal |
| 164 | `src/rendering/marciano-kit-art.js:16` | Dominio de Marciano (más externo) |

## `P.UI.hud` (base: pos. 84, `src/ui/screens.js:69`) · 14 envoltorios
| Pos. | Archivo:línea | Qué añade |
|---|---|---|
| 97 | `src/scenes/practice.js:13` | HUD de práctica |
| 101 | `src/systems/ability-cards.js:53` | Cartas de habilidad |
| 108 | `src/systems/kingteka-domain.js:76` | HUD del dominio de Kingteka |
| 114 | `src/development/test-bench.js:143` | HUD del banco de pruebas |
| 121 | `src/systems/domain.js:67` | Herramientas de práctica de Makanaka |
| 140 | `src/systems/chamelin.js:46` | Clase `trovo-domain` |
| 142 | `src/systems/chamelin-arena.js:44` | Práctica de Chamelín |
| 142 | `src/systems/chamelin-arena.js:46` | Clase `trovo-arena` |
| 154 | `src/systems/passives.js:65` | HUD de pasivas (solo si `P.UI.hud` existe) |
| 155 | `src/systems/sideral-kit.js:97` | HUD de Sideral |
| 157 | `src/systems/cirilo-kit.js:70` | HUD de Cirilo |
| 159 | `src/systems/chamelin-kit.js:74` | HUD de Chamelín |
| 161 | `src/systems/cristorata-kit.js:59` | HUD de Cristorata |
| 163 | `src/systems/marciano-kit.js:79` | HUD de Marciano y su dominio (más externo) |

## `P.Combat.cast` (base: pos. 32, `src/systems/combat.js:17`) · 11 envoltorios
| Pos. | Archivo:línea | Qué añade |
|---|---|---|
| 95 | `src/systems/miniboss-relics.js:23` | Reliquias tras lanzar |
| 127 | `src/systems/makanaky-ultimate.js:31` | Bloquea durante la ulti de Makanaky |
| 131 | `src/systems/sideral-domain.js:82` | Bloquea a Sideral en arena separada |
| 140 | `src/systems/chamelin.js:25` | Marca disparos de Chamelín |
| 145 | `src/systems/cirilo-ur.js:84` | Fase de Cirilo UR |
| 155 | `src/systems/sideral-kit.js:89` | Arsenal de Sideral |
| 157 | `src/systems/cirilo-kit.js:58` | Arsenal de Cirilo |
| 159 | `src/systems/chamelin-kit.js:57` | Arsenal de Chamelín |
| 161 | `src/systems/cristorata-kit.js:48` | Arsenal y dash de Cristorata |
| 163 | `src/systems/marciano-kit.js:74` | Arsenal de Marciano |
| 165 | `src/systems/dota-equipment.js:66` | Cuenta `dotaCast` (más externo) |

## Envoltorio en ejecución
- `src/development/performance.js:5` (`instrument`): con `?profile` en la URL envuelve
  `P.Game.update`, `P.World.render`, `P.UI.hud` y otros **en runtime**, por encima de todo.

## Reglas
- Antes de tocar una de estas funciones: `grep -rn "P.Combat.cast=" src` y esta tabla.
- Varias capas no llaman a la base en ciertos estados (dominios, escenas): un efecto
  nuevo puesto «dentro» puede no correr nunca. Ver [[gotchas/G014-orden-envoltorios]].
- Las capas que no deben correr en el cliente cooperativo comprueban `P.Coop?.active` y
  `P.Combat.server`: ver [[gotchas/G015-coop-active]].
- Las flechas (`account.js:27`, `cooperative.js:6`) no reenvían `this` ni argumentos extra.
