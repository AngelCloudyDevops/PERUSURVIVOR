# Arquitectura

## Separación entre fuente y distribución
src/ contiene la lógica y la interfaz editables. public/assets/ contiene los recursos originales. scripts/build.cjs copia ambos a dist/ sin empaquetar ni minificar el código. dist/ está ignorado por Git y siempre puede reconstruirse.

El HTML conserva sus referencias js/*.js y style.css. scripts/modules.cjs mapea cada ruta de fuente organizada a la ruta histórica de distribución y preserva el orden de ejecución. Solo las referencias a imágenes cambian de assets/sprites/ a assets/characters/ y assets/enemies/.

## Módulos y responsabilidades
| Fuente | Responsabilidad |
|---|---|
| data/catalog.js | Catálogos, estadísticas, ataques y mejoras |
| core/runtime.js | Estado P.state, controles, lienzo y guardado |
| entities/actors.js | Construcción de entidades, daño y recursos al derrotar |
| systems/combat.js | Ejecución de ataques y colisiones de proyectiles |
| systems/progression.js | Oleadas, movimiento, fama y subida de nivel |
| systems/encounters.js | Portal, arena, jefes locales y recompensas |
| systems/terrain.js | Obstáculos, cajas, cobertura y navegación |
| scenes/maps.js | Selección, carga y límites de mapas |
| scenes/game.js | Inicio, actualización y fin de partida |
| rendering/sprites.js | Hojas animadas de personajes |
| rendering/enemy-art.js | Hojas de rivales |
| rendering/effects.js | Efectos visuales |
| rendering/world.js | Dibujo del mundo por profundidad |
| ui/screens.js | Menús, HUD y elecciones |
| ui/styles.css | Estilo adaptable |

## Dependencias y ejecución
Se mantienen scripts clásicos que comparten P. No se introducen módulos ESM, un framework, motor externo ni cambios de formato de datos. catalog.js se carga primero y game.js inicia el juego al final.

Flujo principal:
1. P.Game procesa la actualización si el estado permite jugar.
2. Los sistemas actualizan apariciones, movimiento, combate y recogida.
3. Los encuentros controlan el reloj del mapa y las arenas opcionales.
4. El mundo dibuja escenario, terreno, entidades y efectos.
5. La interfaz refleja el estado y recibe elecciones.

Las referencias entre módulos se resuelven al ejecutar sus métodos, después de completar la carga. Para añadir un módulo, declarar su posición en scripts/modules.cjs y su etiqueta correspondiente en src/index.html.

## Recursos
Las imágenes de personajes están en public/assets/characters/, los rivales en enemies/ y los fondos en maps/. Los JSON junto a las imágenes conservan sus prompts y procedencia. audio/ es solo una reserva, sin uso actual.

## Pruebas
tests/gameplay.test.cjs ejecuta los mismos escenarios de regresión anteriores dentro de un DOM y Canvas simulados, cargando directamente las fuentes. tests/build.test.cjs valida referencias, orden, recursos e integridad de la copia. tests/server.test.cjs verifica respuestas HTTP, MIME y rutas inexistentes con un servidor en puerto efímero.

El servidor exporta createServer para permitir pruebas y conserva su puerto 4173 cuando se inicia normalmente. Los mocks no verifican fidelidad visual ni interacción real del navegador.

## Evidencia de equivalencia
docs/reorganization-baseline.json registra el commit de partida y los hashes de los dieciséis archivos originales. La migración comparó cada archivo de lógica antes y después, normalizando únicamente las dos rutas nuevas de imágenes. El HTML y el CSS se copiaron sin cambios.

Esta evidencia corresponde a la reorganización; no impide introducir funcionalidades futuras con pruebas y documentación específicas.

## Distribución
.openai/hosting.json mantiene static.directory=dist y la identidad del sitio. Todo despliegue debe ejecutar npm run build antes de empaquetar. La CI comprueba el proyecto sin publicar ni alterar servicios externos.

## Renderizado de encuentros
src/rendering/boss-art.js carga y recorta el atlas de jefes y registra las tres escenas de portal. scripts/modules.cjs lo carga antes de encounters.js. El encuentro guarda su scene, y World.draw elige exclusivamente BossArt.background o Maps.draw. La cámara de las arenas se centra en horizontal y sigue al jugador en pantallas verticales; abre el encuadre para mantener legibles el suelo, los ataques y los bordes. El retorno restaura la cámara del mapa de origen. El build copia los recursos originales de public/assets/bosses y public/assets/arenas.
Prueba visual local: npm run build y node tests/manual/serve-bosses.cjs; abrir /__qa/boss-arenas en el puerto 4184. Los controles de prueba se sirven solo en esa ruta local y nunca forman parte de dist.
## Mundo por sectores
src/systems/chunks.js se carga antes del terreno. P.Chunks mantiene una ventana de hasta 9 × 9 sectores de 512 unidades alrededor del jugador y caches de lienzos. La generación usa hashes de coordenadas enteras y tema; descargar y volver a cargar un sector conserva su geometría. Un Set guarda únicamente IDs de cajas destruidas durante la partida. P.Terrain reconstruye un índice espacial de celdas de 128 unidades al cambiar la ventana y usa una cuadrícula de navegación centrada en el jugador. La cámara del mapa principal no se limita por coordenadas; las arenas opcionales siguen siendo cerradas. Los fondos completos se conservan para menú y miniaturas; el terreno de combate combina muestras de suelo, caminos y obstáculos locales.

## Botín y equipo
src/systems/loot.js centraliza cofres, catálogo de objetos, monedas de partida, reemplazo reversible de accesorios y reducción de daño. Terrain.damage delega la creación del botín y protege contra premios duplicados. Game.start reinicia el sistema después de generar el terreno; Game.update avanza los cofres solo en estado play. World ordena los cofres por profundidad y dibuja monedas e indicadores de equipo.
Encounters.win crea el cofre dorado y difiere su selector de recompensas mediante una función onOpen. El inventario no altera el catálogo base del personaje. scripts/modules.cjs carga Loot antes del renderizador y las pantallas. La prueba local de interacción está en tests/manual/serve-loot.cjs y se sirve por el puerto 4186; sus controles no se distribuyen en dist.


## Poderes configurables
src/data/powers.js amplía el catálogo después de data/catalog.js. Combat interpreta count, spread, speed, pierce, motion, cloud y arc; las colisiones de proyectil recorren el segmento entre dos posiciones para evitar atravesar blancos al disparar rápido. El conjunto hits evita daño repetido por el mismo proyectil; el bumerán lo reinicia al regresar.
Los campos temporales viven en P.state.fields y se eliminan en arranque y transiciones. src/rendering/power-effects.js dibuja los proyectiles y los efectos adicionales; effects.js lo invoca conservando los efectos anteriores. El atlas powers-atlas-v1.png usa nueve filas y cuatro poses, y se carga con el renderizador de sprites existente.
Prueba visual: npm run build y node tests/manual/serve-powers.cjs; abrir /__qa/powers en el puerto 4185. Esta ruta y los controles no forman parte de la distribución.

## Arte modular del entorno
src/rendering/map-art.js carga tres atlas de objetos (3 columnas por 2 filas) y un atlas opaco de suelos/caminos. Los PNG y prompts están en public/assets/environment/. El cargador recorta por alfa y ancla cada sprite a su base; el render usa nearest-neighbor. Los sectores invalidan sus lienzos cuando termina de cargar el atlas de suelo. P.Terrain mantiene la geometría física independiente del dibujo; P.World ordena los objetos y los personajes por la coordenada de sus pies. Se conserva el renderer procedural como respaldo durante la carga.
## Laboratorio de desarrollo
src/development/lab.js se carga después de la UI y antes del arranque. El estado devRun separa las pruebas de la progresión: spawn omite las oleadas y los finales y victorias de arena delegan en Lab.finish, evitando el guardado del récord. La herramienta reutiliza el combate, el personaje y las escenas reales del juego.

## Ultimates
P.Ultimate encapsula carga, duración y dibujo procedural pixel art. Los modificadores se consultan al mover y disparar sin alterar estadísticas base ni mejoras. La transformación es visual, conserva colisiones y vida. El servidor local de QA permite recargar y cambiar personaje sin distribuir esos controles.

P.Audio usa Web Audio con ruido y osciladores originales, volumen maestro moderado, límite de voces y antirrebote por sonido. Se inicializa tras gesto, detiene voces al silenciar o perder foco y funciona sin AudioContext.

## Regiones y caminos continuos
P.Chunks.zone selecciona una distribución determinista por regiones de 1536 unidades. node y roadDistance construyen una red global con nodos desplazados y segmentos compartidos, independiente de los límites de caché. ground usa esa misma geometría para pintar y get la consulta para reservar corredores de paso. Las regiones modulan densidad, mezcla de objetos, orientación de muros y color del suelo sin añadir imágenes ni cambiar colisiones de arenas.

MapArt.simpleStyle desactiva la carga y dibujo de los atlas detallados; Chunks usa la muestra original de suelo y Terrain su renderer de formas simples. Los recursos se conservan para evitar perder variantes.

Ambient genera decoración determinista solo en la ventana visible de Campo de Marte; no mantiene cachés ni altera terreno. Usa elapsed para animación y matchMedia para movimiento reducido. World dibuja pasto/hojas debajo de actores e intercala arbustos por profundidad; Terrain desplaza únicamente las copas.

La capa de efectos de la ulti se rasteriza en un lienzo de media resolución y se escala por nearest-neighbor. Evita texto/rotaciones suavizados en el mundo. Se conserva el estilo simple del entorno y Ambient de la rama de mapas.

Ambient comparte la ventana determinista entre los tres mapas. En Plaza dibuja palomas por profundidad y anima la fuente según su posición real; en Machu usa ichu y niebla debajo del combate. Todo depende de elapsed y no introduce entidades de combate ni estado persistente.

## Atlas de botín
P.LootArt carga y mide un atlas alfa de 4×4 celdas. Las filas de cajas y cofres comparten el recorte por fila para mantener escala y anclaje entre poses; los objetos tienen recortes individuales. El filtrado se desactiva al dibujar. P.Loot gestiona loot-opening y el premio pendiente; Game.update solo avanza esa animación durante la apertura, sin combate ni reloj. El reinicio elimina premios pendientes y escombros. Terrain delega únicamente el dibujo de cajas; las colisiones y el botín permanecen independientes del arte.
