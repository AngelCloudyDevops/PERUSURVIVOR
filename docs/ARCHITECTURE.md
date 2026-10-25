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

## Catálogo de rarezas
P.Loot.init genera cuatro objetos por cada rareza, con base compartida para iconos y valores independientes. El filtro del cofre limita el sorteo a su nivel. Equip conserva su reemplazo reversible mediante multiplicadores; la curación usa item.heal. LootArt carga un segundo atlas de 4×3 para las tres rarezas y conserva el atlas original de cajas, objetos y cofre de jefe. Etiquetas y símbolos identifican los niveles también sin percepción del color.

Audio usa Web Audio con osciladores y envolventes cortas, polifonía limitada y desconexión de nodos al terminar. El secuenciador sigue el frame y adapta el tema al mapa/jefe. Si Web Audio no está disponible, el juego continúa sin audio. El estado mute se guarda en localStorage.

Exploration administra un puesto por partida, sin persistencia externa. Se reinicia después de Terrain/Loot, avanza únicamente en play y fuera de arenas/laboratorio. World dibuja su zona debajo de actores y el puesto por profundidad. UI ofrece distancia, dirección, progreso y botón táctil.
La marcha de los rivales usa la distancia real tras resolver colisiones en Systems.move. EnemyArt combina los dos cuadros del atlas con balanceo, rebote y alternancia de cuadros completos; el ciclo se detiene sin desplazamiento y conserva la dirección horizontal. No modifica velocidad, daño ni colisiones.

P.CoverArt carga el atlas exclusivo de arena antes del arranque y dibuja solo props con id arena:. P.Terrain conserva la física y el fallback geométrico. P.World.zoomFor calcula el encuadre según ancho de ventana; P.BossArt.camera sigue al jugador dentro del fondo.

## Distribución de cofres por sectores
Loot usa una semilla de partida y Chunks.hash para derivar densidad, posición y rareza por sector. Mantiene solo los nueve sectores vecinos y el cofre de jefe, más los IDs de cofres abiertos durante la partida. Al volver se reconstruyen las mismas posiciones y el estado abierto. Safe comprueba objetos de sectores vecinos aunque aún no estén en el índice de colisiones activo. Tick sincroniza solo al cambiar de sector, fuera de pausas y arenas.

Sprites.draw acepta una marcha opcional para balancear el cuadro completo del actor sin afectar los retratos ni la pose de ataque. No se recortan brazos, torso ni piernas por separado. Systems.ranged administra aviso, dirección fijada y enfriamiento de minions; Combat comparte la colisión de proyectiles y acepta daño específico con valor previo por defecto.

## Cooperativo autoritativo
backend/cooperative.cjs administra WebSocket /coop, salas criptográficamente aleatorias de ocho caracteres hexadecimales, máximo dos miembros y token privado de reconexión de 192 bits. Solo el anfitrión inicia. Origen permitido, payload máximo 2 KiB, límite de mensajes/conexiones, autenticación inicial con tiempo límite y heartbeat evitan conexiones ilimitadas triviales. El código de sala funciona como invitación: debe compartirse solo con el amigo. No hay cuentas ni datos personales persistentes.
backend/simulation.cjs crea una VM aislada por sala reutilizando los scripts compilados del mismo release: catálogo, poderes, colisiones, terreno y Combat. Corre a 25 ticks/s y publica snapshots a 12.5/s. Cada jugador mantiene su cadencia, ulti y proyectiles; cada proyectil avanza una sola vez por tick y los bumeranes regresan al dueño. Los enemigos persiguen al jugador vivo más cercano. El cliente solo transmite dirección normalizada y petición de ulti, nunca posiciones, daño o vida. src/network/cooperative.js reemplaza la actualización local solo durante la sala; el renderer dibuja el compañero con el mismo sistema de sprites. Individual conserva sus sistemas originales.
El build agrega backend, manifiesto de módulos y package-lock. El contenedor Node no publica puertos en el host y recibe /coop mediante nginx del juego. El launcher sigue el enlace atómico live/current y carga el servidor desde la release real; un cambio de versión reinicia solo el proceso cooperativo. Las partidas no se persisten entre releases. Los límites de CPU/memoria y salas protegen los servicios existentes. npm start incluye WebSocket para pruebas locales; PORT permite cambiar el puerto.
Pruebas: tests/cooperative.test.cjs comprueba los tres mapas, los 18 ataques, mejoras, reanimación, salas con dos WebSocket reales, rechazo del tercero, inicio restringido al anfitrión, movimientos inválidos, autoridad de vida, pausa en desconexión, token de recuperación, caducidad y origen. Los mocks de simulación se complementan con revisión de dos navegadores.
World dibuja el fondo de menú con Chunks y props sencillos cuando simpleStyle está activo, sin cargar entidades de juego ni reiniciar estado. Terrain y Exploration añaden contornos visuales conservando la geometría física.
La entrada espera los tres atlas jugables, el mapa inicial y los rivales antes de revelar el menú. El HTML incluye un estado de carga con estilo mínimo para evitar arte provisional incluso antes de la hoja CSS. UI.loading suspende el dibujo del mundo durante esta espera y permite reintentar ante fallo o 20 segundos de espera; los recursos iniciales tienen preload. El HUD de botín tolera que su atlas llegue antes de crear al jugador.

## Marcadores de botín
Terrain.minimap transforma las coordenadas de Loot.active con la misma escala del terreno, filtra por distancia y estado abierto, y consulta Loot.rarity para compartir la paleta. Se dibujan sobre los obstáculos y bajo el jugador, respetando el recorte existente. La leyenda queda fuera del área recortada.

## Actualizaciones del navegador
El build genera version.json con una huella reproducible del contenido y añade hashes a las URLs de JavaScript y CSS. P.Updates consulta la versión sin caché al abrir, al recuperar el foco y cada 30 segundos. Recarga automáticamente en menú o fin de partida; durante una partida muestra un botón y espera para no perder el progreso. Errores de red no interrumpen el juego. El HTML de Hostinger se revalida con Cache-Control: no-cache. No se usa service worker.
Systems.minionAttacks define seis perfiles por design. Systems.ranged comparte preparacion, ejecucion y enfriamiento; Tyrone utiliza movimiento de carga resuelto por Terrain y PNP conserva una cola de dos pulsos. EnemyArt.attackPose y attackCue sincronizan cuerpo, brazos y avisos con el reloj de simulacion. Combat procesa ondas de impacto de un solo golpe y trayectoria lateral de Austin; FX identifica cada proyectil por su glyph. No se cambia el orden de modulos.

La carga prioritaria descarga los atlas jugables, rivales y Campo de Marte; el selector usa miniaturas WebP. Los otros mapas completos, arenas, jefes, coberturas y botín empiezan después de mostrar el menú. Maps.load deduplica solicitudes; cambiar a un mapa pendiente vuelve a mostrar el estado de carga hasta que llega. Las rutas de imágenes usan WebP y el servidor local entrega image/webp. Ver docs/asset-optimization.json para el presupuesto de bytes y scripts/optimize-assets.py para verificar equivalencia RGBA.

P.Vulture encapsula arte y máquina de estados del Gallinazo, carga de recursos con reintento, picadas, plumas y bandada acotada. P.Encounters.enter acepta una definición de jefe alternativa manteniendo la misma validación de portal y retorno. El arte del jefe se despacha desde P.BossArt y el de sus esbirros desde P.World. El encuentro nuevo es individual, igual que los otros portales; el cooperativo conserva su flujo.
World.zoomFor separa zoom de exploración y arenas. Los estilos #hud:not(.boss-hud) compactan solo el panel del mapa principal, conservando sus datos y los controles táctiles.
## Llaves y portadores
Loot administra state.keys, validación de rareza y consumo atómico dentro de open. spawnKeepers se invoca en Systems.spawn y respeta modo, tiempos, arenas, laboratorio y límite global. Entities.hurt delega la caída única a Loot.enemyDrop. Las llaves son gems de tipo key, recogidas mediante Loot.collect con protección de duplicados; se preservan al alejarse y se priorizan frente al descarte de fama acumulada. World usa Loot.drawKeeper para el distintivo y barra de vida, y drawDrop usa un icono de llave pixel art. Reset limpia inventario y temporizadores.

## Rendimiento durante la partida
Combat construye un índice espacial de centros de enemigos por celdas de 128 unidades cuando hay al menos 8 proyectiles y 24 enemigos. Consulta el rectángulo del segmento expandido por el radio máximo y mantiene el orden original de impactos; la colisión final sigue usando el segmento exacto. El índice se reconstruye después del ataque automático de cada paso. Ambient conserva una sola lista de posiciones por límites visibles, mapa y revisión de terreno; el reloj de balanceo sigue vivo. World descarta solamente el dibujo lejano a la cámara, con márgenes para animaciones y proyectiles; la simulación continúa fuera de pantalla. No se reduce la cantidad de enemigos ni se desactivan animaciones.

Medición local frente a e0913b2: node scripts/benchmark-performance.cjs permite medir 80 enemigos y 400 proyectiles (100 muestras tras calentamiento). Mediana de Combat.tick 9,339 → 1,706 ms y 31.842 → 1.054 pruebas de segmento por paso. En 200 consultas de decoración dentro del mismo sector, 571,63 → 0,179 ms. Son microbenchmarks de CPU, no FPS de un dispositivo real. Para comparar otra revisión se pueden pasar rutas de combat.js y ambient.js como argumentos. Las herramientas y fixtures viven fuera de public y dist.

## Coordinación de actividades cooperativas
backend/activities.cjs es el controlador de portales, cofres y eventos de la sala. Reutiliza Encounters.enter/bossMove, el catálogo de Loot, sus llaves y generación por semilla, y Exploration.tick. Los comandos WebSocket activity solo aceptan intenciones (portal, event, choose); las distancias, votos, llaves, opciones y premios se verifican en el servidor. Un ID incremental por recompensa y applied por jugador impiden dobles reclamos o elecciones retrasadas. Los snapshots excluyen callbacks y el estado de retorno del mundo; incluyen escena/coberturas, votos, cofres, estación, llaves y selección pendiente. Cada cliente dibuja la escena y muestra únicamente su elección.
Las transiciones de victoria se difieren hasta el final del tick para no sustituir enemigos mientras Combat recorre proyectiles. El estado del mundo se conserva en el servidor y se restauran ambas posiciones. Cada bumerán, campo y proyectil se limpia al cambiar de escena. Los cofres de las ventanas de ambos jugadores conservan identidad y progreso y solo se recalculan al cambiar de sector. tests/cooperative.test.cjs cubre los tres portales, retorno, jefe final, llaves únicas, dos elecciones independientes, pausa, repetición de mensajes, defensa alternada y recompensa única. tests/manual/serve-cooperative.cjs sirve herramientas solo en localhost:4191/__qa/activities; no se distribuyen en dist ni en el protocolo público.
EnemyArt.feedbackProfiles define seis reacciones visuales de impacto y muerte. Entities.hurt publica efectos cosmeticos con una copia minima de la apariencia; el enemigo muerto se elimina normalmente del combate y entrega su recompensa una sola vez. FX dibuja la copia durante aproximadamente 1 s. El reloj de efectos se congela al pausar y Game.start lo limpia. Los efectos de impacto reservan margen para muertes (280/300) y ninguna reaccion modifica velocidad, dano o colisiones. Cada actor se dibuja desde un cuadro completo del atlas, incluso durante ataques y muertes; se eliminan las deformaciones por bandas que producian separaciones visibles.

Sprites.bounds recorta la figura conexa principal por alfa y conserva detalles cercanos, descartando islas lejanas del personaje vecino. Sprites.measure y EnemyArt.measure comparten este recorte y reinician sus celdas al cargar para evitar acumulaciones. Los atlas originales no se modifican.

Ambient.leafMass rasteriza elipses por franjas de dos unidades; foliage agrupa esas masas en siluetas orgánicas. Ambient.bush y Terrain.planter reutilizan el dibujo, sin nuevos recursos ni cambios físicos.
## Señales de portadores y llaves
Terrain.minimapSignals consulta los enemigos vivos con keyTier y las gems key no recogidas, valida posición y rareza, y reutiliza la proyección y rango del minimapa. minimapSignal dibuja siluetas de rombo/llave con contraste oscuro y la paleta compartida de Loot.rarity. La misma función alimenta la leyenda de tipos; los marcadores se dibujan antes del jugador y dentro del recorte. No agrega estado persistente ni altera el botín.

## Indicador de objetivo de llaves
Loot.keyTarget recorre gems key y enemigos keyTier, descarta entidades muertas/recogidas y coordenadas inválidas y elige la menor distancia. keyDirection convierte atan2 en ocho sectores. targetHud actualiza el elemento key-target con texto y la paleta de Loot.rarity desde el HUD existente, sin temporizadores ni estado adicional. Usa el mismo origen de coordenadas que el minimapa.


Performance toma intervalos reales de requestAnimationFrame, sin usar el dt limitado de la simulación. Actualiza el panel cada 500 ms con una ventana de 240 muestras. La prueba acumula métricas solo en play, excluye la pestaña oculta y la preparación, y limita las muestras almacenadas a 20.000. Usa el laboratorio autorizado por el usuario y devRun para no escribir récords; salir al menú o iniciar otra partida cancela la prueba. Los perfiles están acotados a 160 enemigos y 600 proyectiles objetivo, con enemigos resistentes para mantener la carga y reponer proyectiles durante el combate normal.

P.Vulture mantiene sus partículas en cada enemigo, las actualiza con dt de combate y separa ground (sombras bajo los actores) de effects (plumas y polvo). pose devuelve la elevación y compresión del sprite sin modificar el cuerpo de colisión. pathLength calcula la franja de picada a partir de los mismos límites y coberturas de la escena. No se añaden imágenes ni temporizadores independientes.
Entities.chargingArmor centraliza la condición de resistencia (pesado vivo, perfil de minion y preparación activa); hurt aplica chargeResistance=0.4 antes de restar PV y emitir cifras. EnemyArt.armorGlow usa exactamente esa condición para no mostrar protección cuando ya terminó. La VM cooperativa reutiliza la misma función. EnemyArt.deathFace coloca ojos en X con anclajes del primer cuadro del atlas: son trazos superpuestos, sin dividir ni modificar la imagen. deathOpacity mantiene la pose opaca hasta el 65 % y desvanece solo al final; el reloj de vida sigue siendo el de simulación.

Chunks.curve y edges describen las curvas con polilíneas compartidas y una caché acotada de 100 entradas. roadDistance usa esas líneas tanto al colocar obstáculos como en las comprobaciones. floor rasteriza suelo y caminos a 128×128 y amplía con nearest-neighbor a 512×512; el trabajo queda cacheado por sector. patch interpola ruido de valor a escala 192 para manchas continuas entre sectores. Terrain reutiliza Ambient.foliage para copas y leafMass para sombras, con transparencia local.

## Composición reutilizable de proyectiles
FX.glyph conserva el dibujo vectorial completo. FX.cachedGlyph compone una vez la geometría y sus sombras a la resolución efectiva de Canvas (DPR × zoom) y reutiliza la superficie. Las estelas, posiciones y giros siguen calculándose cada fotograma. La cucaracha guarda sus dos estados por separado; estrellas y ondas expansivas siguen en dibujo dinámico. La clave incluye glifo, color, ulti, estado y escala. La caché tiene un máximo de 4.194.304 píxeles (16 MiB RGBA) y 96 superficies; usa el dibujado anterior si no hay contexto válido o la superficie excede el presupuesto. No baja el DPR ni elimina efectos.

Terrain.resolve conserva su algoritmo original junto a obstáculos. Si el índice corresponde al arreglo activo y confirma espacio libre, evita los tres recorridos completos; si el arreglo fue sustituido sin reindexar usa el algoritmo original. La prueba incorpora comparación con el dibujo anterior y una composición fija de 20 % pesados para comparar cargas iguales. scripts/benchmark-rendering.cjs acepta una ruta a @napi-rs/canvas como dependencia opcional de diagnóstico, fuera del paquete de producción. La comparación nativa a escala 1,3 observó diferencias medias menores de 0,012/255 por canal por redondeo de composición de sombras; el brillo y todas las formas se conservan. Los FPS se verifican aparte en el navegador.

Las superficies de proyectiles se ajustan a los límites de cada figura y reservan 24 píxeles físicos alrededor para conservar el brillo. Esto evita componer cuadrados transparentes grandes por cada ataque.

Chunks.floor compone la textura original en resolución completa y superpone la capa de caminos rasterizada. Terrain calcula la posición de sombra según la base visual por tipo, independiente del rectángulo de colisión.
