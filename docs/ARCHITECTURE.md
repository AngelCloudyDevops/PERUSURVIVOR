Warning: truncated output (original token count: 36025)
Total output lines: 694

# Arquitectura

Estabilidad cooperativa: paquetes WebSocket de más de 1 KiB usan compresión rápida negociada, sin retener contexto, con dos tareas concurrentes como máximo; el límite de entrada de 2 KiB sigue aplicándose tras descomprimir. una excepción se limita a su sala y queda registrada; salud muestra errores y coste de tick/serialización agregados. Reconectar con el token válido sustituye la conexión anterior sin perder el grupo. El cliente procesa el último estado por fotograma, conserva el resultado final y evita recargarse automáticamente mientras tiene sala. Scripts VM compilados se reutilizan, manteniendo una VM independiente por sala. Las publicaciones solicitan reinicio al quedar el servidor sin salas: las partidas existentes no se cierran por cambiar de release (un reinicio forzado del contenedor sigue interrumpiéndolas). El backend puede permanecer temporalmente en la release anterior hasta quedar libre.

Cooperativo: señales Aquí/Peligro/Ayuda/Cofre desde el botón Señales, posición validada por servidor, 5 s de duración, una por jugador y recarga de 2 s. Ayuda funciona al estar caído. La escolta de la combi se desbloquea a los 90 s: acérquense y pulsen Iniciar escolta. Ambos vivos a 200 unidades; dos paradas de 6 s despejadas de enemigos. Vida 150, límite 100 s, reintento 20 s; premio único +50 monedas compartidas y 25% de vida a cada superviviente. Se suspende durante arenas, escenas, mejoras y desconexiones; no coincide con la defensa doble. Backend Escort/Signals serializados en activities; CoopExtras dibuja vehículo, avisos y controles sin autoridad sobre premios.

DomainArt separa la proyección lateral por cámara: tercera persona fija el lateral del escenario y desplaza playerX; la cámara cercana aplica la misma cámara a muros, suelo, rivales y proyectiles. lean y sideSteps viajan en domain para reproducir inclinación y zancada. La cámara cercana carga el atlas de seis poses de espalda y lo compone en resolución nativa sobre el escenario, con desplazamiento continuo de cuerpo, retroceso y estela; no usa puños geométricos flotantes. La mira y el ratón incorporan el desplazamiento del actor y el letterbox.

MakanakyBoxing usa seis piezas raster de un atlas y cinemática de dos huesos por brazo; anclajes coincidentes, piernas con malla continua acotada y render nativo sin suavizado. No alterna las seis poses antiguas. Domain serializa pending (objetivo y tiempo de contacto), route y move; resuelve el daño al 40 % de cada golpe.

DomainArt comparte UltimateComic.layout y panelFrame. La tarjeta evita el letterbox del dominio y se compone en resolución nativa; el actor de tercera persona también se dibuja al final en el contexto nativo. Dos atlas WebP con seis poses de espalda y cuatro retratos, límites alfa compartidos y fallback al sprite actual mientras cargan.

## Dominio de Makanaky: combos y cámaras
Domain serializa combo, comboTimer, step, strike, punchLength, move, impact y freeze; autoridad idéntica en cliente individual y servidor cooperativo. Domain.camera permanece local y no se transmite. La microparada varía entre 55 y 90 ms según el golpe y solo detiene el desplazamiento visual de objetivos/suelo, no el reloj ni la red. Los minions normales reciben metadatos deterministas de remate (`decap`, `deathSide`, `deathMax`); jefes y minijefes no los reciben. DomainArt mantiene el mapa original bajo la tarjeta y cambia al callejón después; compone cabeza y cuerpo por separado, rayos, poses y contador GA lateral en el lienzo pixel sin suavizado. El enlace practice=makanaky reutiliza TestBench con comprobación del rol administrador existente.

## Dominio UR de Makanaky (prototipo)
Domain mantiene un único encuentro autoritativo en state.domain. Cada objetivo referencia domainKey del enemigo real; los HP y callbacks de botín siguen usando Entities.hurt y la victoria se difiere hasta cerrar la escena. La activación incorpora todos los enemigos vivos del mapa, sin radio ni tope artificial, y los ordena en oleadas deterministas de siete; normales primero y minijefes/jefes al fondo. El objetivo válido se fija al iniciar el golpe y usa una tolerancia moderada de puntería para que el desplazamiento lateral importe sin volver impreciso el contacto. Simulation congela el combate y el reloj base, recibe punch/domainAim/ga validados y serializa el encuentro para ambos clientes. El propietario usa primera persona; el compañero ve a Makanaky desde atrás y queda protegido. No se cambian las coordenadas originales de jugadores o enemigos. DomainArt renderiza el callejón con perspectiva a 640×360 sin suavizado y controles táctiles. Como Game.update queda interceptado durante la expansión, la práctica directa recicla sus minions en oleadas infinitas de siete dentro de Domain cuando el laboratorio está en modo respawn, evitando quedarse sin objetivos.

CompanionArt carga tres atlas WebP compactos con 18 filas totales y cuatro columnas de reacción; conserva los PNG fuente para auditoría y el build omite esos PNG cuando existe su WebP. Cada celda de 64 × 64 se escala sin suavizado para mantener el pixel art. El atlas antiguo `minibosses/makanaky-v1.webp` permanece en Git, pero no se distribuye: el runtime usa exclusivamente `characters/makanaky-motion-v2.webp` para caminar y atacar. La identidad se resuelve por id y nunca por posición del catálogo. Domain serializa `companionShock`, `assistFlash` y `assistCount`; el servidor acepta `ga` solo del slot distinto al lanzador y el cuarto impacto decide autoritativamente si el impulso dura 0,8 o 1,25 s. DomainArt deriva la pose de entrada, amenaza, asomo o celebración sin timers externos, dibuja al mismo compañero en ambas vistas y usa el sprite normal como fallback mientras carga el atlas.

## Almacenamiento de preferencias de colección
P.Gacha usa la clave independiente causas-collection-preferences-v1 con version/tier/stars/ready/order. No cambia ni escribe el perfil v4. loadPrefs se ejecuta antes de crear controles; la normalización admite únicamente opciones conocidas. Cada gesto de control y Limpiar filtros guarda una instantánea pequeña; refresh, selección, ascensos y RAF no escriben preferencias. El evento storage actualiza controles/filtros/orden sin eco de escritura y contempla eliminación o clear. Errores de lectura usan valores iniciales sin borrar el contenido; errores de escritura conservan la vista de sesión y ofrecen reintento explícito. La preferencia no sincroniza navegadores ni crea una cuenta.

El paquete también excluye tres metadatos de autoría conservados en public/Git (gallinazo-phase2-frames.json, gallinazo-rig-frames.json y kingteka-ultimate-portrait.json). Los frames usados en ejecución ya están integrados en los módulos JS; ningún runtime solicita estos JSON. Se conserva el margen de tamaño existente sin cambiar imágenes ni reglas.


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

TestBench conserva `minionMode` únicamente durante las pruebas de desarrollo. Entities limita el golpe final de minions comunes cuando el modo es inmortal y notifica sus derrotas para programar una reaparición a los 0,8 s. La cola se limpia al repetir, salir o cambiar de modo; reutiliza la entidad con su diseño y atributos, restablece vida y estados de ataque, y la coloca de nuevo alrededor del jugador. Las comprobaciones excluyen jefes, minijefes, imitadores y objetivos especiales.
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
El build genera version.json con una huella reproducible del contenido y añade hashes a las URLs de JavaScript y CSS. P.Updates consulta la versión sin caché al abrir, al recuperar el foco y cada 30 segundos. Recarga automáticamente en menú o fin de partida; durante una partida muestra un botón y espera para …24025 tokens truncated…so llama pick(). No añade datos de variante al protocolo de red.

DragonEpic.environmentPose deriva oro, sombra, polvo, piedras, viento y sacudida del reloj de cinemática; environment dibuja un número fijo de primitivas sin entidades, timers ni listas de partículas. surface mantiene dos superficies raster cacheadas (marco dorado y luz cálida del actor), reutiliza el atlas original y conserva alfa y contornos. La revelación normal reutiliza los efectos de caída con secret=false.

DragonUltimate.introFor/sceneFor conservan la duración por variante tanto en la simulación como en la protección, pausa y HUD. DragonEpic deriva cabezas, ruptura y despegue únicamente de dragon.age y reutiliza el atlas existente sin decidir daño. Los límites temporales se ajustan con tolerancia numérica para devolver exactamente ocho segundos al salir de la cinemática.

La variante 3 de DragonUltimate es el secreto; pick(roll) concentra la regla del 5 %. hitElement comparte las tres mecánicas sin duplicar fuentes ni listas: chaosPulses/elements/burstAt se serializan por jugador. DragonArt carga el atlas secreto bajo demanda, conserva figuras fuera de celdas nominales y aplica corte de alfa a 160 para eliminar halos y conservar contornos nítidos. secretFeedback identifica cada lanzamiento con cast y limita los tres rugidos a una vez por jugador.
Domain acumula defeated/peakCombo y remateImpact en la instantánea autoritativa. DomainFinale deriva la pose del cierre de domain.age, reutiliza el actor existente y fragmenta una captura del callejón sobre el render original del mapa; no ejecuta daño ni modifica el tiempo de la simulación. El informe visual local usa elapsed, por lo que se congela al pausar, y se descarta al volver al menú.


FujimoriArchives conserva marcas y horarios en encounter.archives. Al aterrizar registra el mismo objeto como obstáculo sólido con hp Infinity y crea un stomp de un solo impacto; el terreno compartido aporta colisión y bloqueo de proyectiles. La revisión del terreno cambia al añadir/retirar coberturas. El dibujo de archivadores se hace con primitivas canvas, ordenado por profundidad en Terrain.draw; marcas y caídas usan las capas de FujimoriBossArt.

DomainAftermath.apply se ejecuta una sola vez en el regreso natural con propietario vivo; usa pasos de 6 unidades con Terrain.clear/hit/resolve y World.collide, sin modificar terreno. domainAftermath se incluye en snapshots y domainSlowUntil en cada enemigo; Systems.move y la simulación cooperativa consultan el mismo multiplicador temporal, sin mutar la velocidad base. La huella se dibuja en coordenadas de mundo antes de actores y depende de elapsed. MakanakyBoxing.finaleMotion conserva longitudes de brazos por IK; DomainFinale usa composición por capas y ladrillos procedurales, no tiles del framebuffer.

DomainFinale.resultPose/rimPoint son funciones deterministas de tiempo de simulación y combo real. summary recibe una edad de cierre y report continúa la animación con elapsed tras volver; el perímetro usa exclusivamente una banda de 8–21 px, sin listeners ni capas que intercepten controles. domain-result oculta solo stats/level del encabezado mientras aparece el resultado. feedback deduplica carga/ladrillos por activación y respeta pausa. DomainAftermath.marker consulta el mismo slow(e) que la simulación, sin temporizadores paralelos.

ChosicanoArt usa chosicano-v1.webp y seis figuras completas recortadas por alfa en 3 × 2. PNG y prompt se conservan como fuente. step integra wheelPhase a partir del desplazamiento resuelto, sin avance al quedar bloqueado. El kind combi y el ID de la arena siguen estables para guardados y lógica existente; la carga se espera al entrar con reintento y cancelación al abandonar el diálogo. El atlas original de los tres jefes permanece intacto para Gabinete y Guardián.

Presupuesto del bus: boss-atlas-packed-v2.webp recodifica a calidad 100 el atlas histórico sin cambiar dimensiones ni alfa, mientras el PNG y WebP originales siguen guardados. El build distribuye solo la versión activa. Se conserva el diseño del Gabinete y el Guardián; la fila antigua de combi ya no se renderiza.
# Arte y control de Sideral

SideralArt carga un atlas WebP 4×2 de figuras completas: tres poses de locomoción y cinco cuadros continuos de ataque. Intercepta únicamente el dibujo del id `sideral`; los demás personajes conservan Sprites y PlayerAttackArt. Combat registra resistencia temporal por enemigo y usa la carga serializable existente para producir la huida, por lo que el comportamiento funciona también en la simulación cooperativa sin un estado paralelo.

ChosicanoCombat gobierna exclusivamente kind combi. La embestida resuelve colisión en subpasos de hasta 12 unidades; brake conserva posición y registra marcas acotadas. El bocinazo usa un stomp hornWave con waveFrom actualizado antes de avanzar age; MinionEvolution.hits prueba la banda barrida y su ángulo, y Combat aplica la cobertura y spent habituales. ChosicanoArt dibuja el mismo radio/frente y los mismos relojes; los efectos no causan daño. Audio.fx añade señales sintetizadas de aviso, bocina y neumáticos, sin nuevos assets.

Domain.damageTaken acumula únicamente pérdida efectiva de HP después de PlayerFeedback.hit del propietario; queda en el snapshot autoritativo del dominio. DomainFinale copia untouchable al resultado y deriva crownTier del peakCombo real (8/16). Las coronas reutilizan primitivas pixel art a escala entera; feedback deduplica coronation por activación y no emite durante pausa ni con propietario caído.

Fluidez cooperativa: snapshots a 25 Hz con serialización única por sala; ping/pong cada 2 s devuelve RTT y coste del último tick. CoopMotion conserva únicamente poses del paquete anterior por identidad, interpola en requestAnimationFrame y restaura las coordenadas en finally. La anticipación del jugador es visual, con horizonte de 120 ms, corrección exponencial, colisión y congelación tras 250 ms sin paquetes. Se corta al cambiar escena/ronda, morir o teletransportarse; nunca ejecuta daño ni combate local. La cola de input envía cambios de dirección/ulti/arma inmediatamente, manteniendo heartbeat.

DuoEvent es un estado autoritativo por Activities: selecciona dos puntos libres de colisión cercanos al origen en cada mapa. Se activa solo desde un puesto válido tras 45 s de mapTime. Dos ocupantes vivos distintos dentro de radio 65 acumulan 15 s antes de consumir 45 s de tick de mundo; el estado paid bloquea duplicar recompensa. Se suspende por las rutas existentes de pausa/cinemática/arena y se serializa como duoEvent. CoopAssist pinta puestos y objetivo, y envía únicamente la intención activity/duo-event con F o botón.

removeWaiting libera simulaciones terminadas, elimina al miembro saliente y conserva sala/código/selecciones. Reasigna índices y transmite a cada superviviente su propio joined/token para actualizar session.slot sin exponer tokens ajenos; invalida ready/revision. El nuevo primer miembro obtiene mapa/invitaciones por las validaciones existentes. Caducar una desconexión en vestíbulo conserva a los conectados; partidas activas mantienen la política de cierre previa.

Asistencia cooperativa: CoopAssist dibuja flecha/círculo de rescate en coordenadas de pantalla y calcula amenazas solo para avisar; no altera la reanimación autoritativa de Simulation. Lobby transporta reconnectMs calculado por servidor al desconectar; el cliente cuenta desde la recepción con performance.now y muestra la reserva real de 30 s. POST friends/join valida amistad bilateral y plaza libre y emite una invitación privada de un uso: no enumera códigos. El acceso global permanece en menú y el perfil tiene su acción equivalente.
TeamCombo pertenece a Simulation: observa daño efectivo y propaga coopSlot en fuentes creadas dentro del servidor para atribuir proyectiles tardíos. La carga exige alternancia con ventanas y cadencia; request valida dos votos, jugadores vivos/cercanos y ausencia de escenas o elecciones. La onda usa Entities.hurt, límites contra jefes y cobertura, y no se recarga a sí misma. Los votos se borran al desconectar y expiran por reloj de simulación; snapshot publica solo datos. start crea una instancia limpia en cada revancha. Coop.receive alimenta explícitamente CoopMotion antes de aplicar cada snapshot, incluyendo regresión de integración.

Cooperativo social: friends.cjs conserva amistades bilaterales e invitaciones de un uso en SQLite, con cookies y X-Account-Id del sistema existente, comprobación de origen, cupos y límites de frecuencia. Solo el destinatario autenticado consume una invitación de 60 s al entrar por WebSocket. La identidad y colección se obtienen de la sesión del servidor; el cliente no puede elegir un nombre de cuenta. El servidor local comparte la instancia de cuentas con el servidor de salas. Protocolo 2 incorpora revisión de sala, configure y ready; cambiar configuración/roster invalida ambas confirmaciones. Solo el anfitrión puede iniciar con dos conexiones listas. La UI precarga figuras antes de confirmar y rechaza cargas que terminen con una revisión antigua. La presencia usa sala conectada o consultas autenticadas recientes; se muestra solo a amigos aceptados. Las listas no se reconstruyen si los datos no cambiaron.

La revelación secreta encadena un falso resultado Jade, un último giro, vapor y un seguro que salta al dorarse la máquina. Los ojos preceden a cada cabeza con desplazamientos propios; Cristorata retrocede y extiende el brazo durante su frase. El dragón se inclina para la subida y el aleteo final levanta polvo. Todo deriva de la edad autoritativa de la ulti, conserva los 6,4 s y la pausa compartida; movimiento reducido omite sacudidas, vapor y ráfagas. No añade daño ni entidades.

DomainFinale.vaporParticles genera bloques pixel art deterministas a partir de elapsed, tamaño de vista, umbral ×16 y prefers-reduced-motion. rim solo compone esos bloques translúcidos, sin strokeRect del perímetro, canvas de pantalla completa extra, temporizadores o listeners. Cada rectángulo se limita al viewport y a la banda periférica; pruebas verifican escritorio/móvil, intensidad, expiración y estabilidad de movimiento reducido.

### Boletos del Chosicano
ChosicanoCombat comparte ticketAngles entre aviso y disparo; busTicket usa el procesamiento de proyectiles y el barrido de coberturas existente. ChosicanoArt pinta puerta, cobrador y boletos sin alterar el atlas. Todo el tiempo procede de la simulación; giro desactivado con movimiento reducido.

Revancha cooperativa: cada resultado mantiene su simulación hasta recibir `return` de ambos miembros conectados. El comando valida `round`, que aumenta por partida, para rechazar mensajes antiguos. Los votos viajan en la sala y sobreviven a la reconexión de 30 s. El acuerdo libera la simulación, borra entradas y votos, incrementa revisión y reinicia ready, conservando miembros/tokens/código. Cada start construye una Simulation nueva. El cliente cierra overlays con UI.menu({keepGroup:true}) sin cerrar WebSocket ni recargar actualizaciones pendientes, y abre la ruta coop; el guardado del resultado se ejecuta solo una vez por partida.

DomainFinale.smokeTexture cachea hasta doce texturas procedurales de 128×128 con lóbulos de gradiente radial y borde transparente. vaporParticles usa posiciones y escalas flotantes y mezclas continuas entre texturas, sin redondeo a cuadrícula ni blur de pantalla completa. rim habilita suavizado únicamente dentro de save/restore; las chispas son puntos de luz y el renderer no modifica combate, cronómetros ni entradas.


DomainFinale.flowTexture crea una textura periódica 512×96 con densidad continua y tres vórtices analíticos. flowStrip repite esa textura en una sola cinta cacheada; smokePlan recorre un perímetro cerrado con fase compartida entre lados. rim advecta 36 filas por capa y lado usando offsets flotantes y dos velocidades: 288 recortes de textura por fotograma, sin generar imágenes ni densidad por frame. Las pruebas verifican cobertura de toda la banda, continuidad circular de offsets, centro libre, caché y expiración.
El despegue del Tricéfalo tiene carga de peso, aletazo descendente y recuperación con poses completas del atlas. La montura se inclina alrededor de la silla con Cristorata agarrado; la elevación espera al impulso y el polvo permanece en el suelo. No recorta ni estira alas o manos, respeta movimiento reducido y mantiene la duración y el combate.


El vuelo del Tricéfalo usa 16 pasos de aleteo y 12 pasos de despegue cacheados, derivados del atlas con muestreo sin suavizado. Una malla continua mantiene la raíz del ala y el agarre, repliega las patas hacia el vientre y transmite un movimiento leve al jinete. El ciclo comparte fase entre cinemática y combate; hasta 28 superficies por atlas, sin recalcular la malla cada cuadro. Movimiento reducido conserva una pose quieta y no cambia el combate.

DomainFinale conserva el reporte durante 3 segundos y calcula su edad con ese intervalo; smokePlan sigue expirando a los 2 segundos, sin prolongar el humo.

### Derrota del Chosicano
ChosicanoCombat administra defeat/defeatTick y una pose pura por tiempo de simulación. Usa encounter.defeat como Fujimori y Gallinazo: actor separado de enemigos, actualización exclusiva y retorno único mediante Encounters.win. ChosicanoArt conserva el cuadro entero del frenazo y añade humo pixelado y cartel; sin partículas persistentes ni atlas nuevos.

Corrección visual de Cristorata: las poses completas del atlas cristorata-reaction-v2 sustituyen los recortes de brazos y piernas. El dibujo conserva sus proporciones al señalar y subir; el Tricéfalo aparece completo sin cortes horizontales. Véase docs/CRISTORATA_REACTION_ART.md para origen y prompt.

Cristorata usa doce poses completas del atlas reaction-v3 para señalar, girar, elevar la rodilla y sentarse. La escala común y el anclaje de cabeza evitan saltos de tamaño y posición. Reacción y subida comparten la misma selección de cuadro y una inclinación continua; sin fundidos o siluetas dobles. Documentación de arte: docs/CRISTORATA_REACTION_ART.md.

El cierre del asiento converge al anclaje y ancho de cabeza del jinete de la montura, compartiendo el mismo cálculo para posición y escala. La sala de revelación añade suelo en perspectiva, paneles con pliegues, luces laterales, reflejo cálido localizado y hasta 18 motas ambientales; todo procede del reloj de la escena, sin entidades de combate. Movimiento reducido retira las motas y se conserva el alfa de la transición al mapa.

### Atlas Chosicano v2
chosicano-v2 conserva la cuadrícula 3×2 y la medición por alfa del renderer. PNG fuente y prompt permanecen en Git; solo WebP v2 va al runtime, con v1 archivado para evitar duplicar la descarga. No cambian colisiones, balance ni tiempos.
Encounters.trackMotion y Encounters.navigate forman la capa compartida de navegación táctica para jefes de arena y minijefes. El estado navPath, navGoal, navStall, navFlank y navReplans es plano y serializable. Los adaptadores instalados después de Encounters conservan los sistemas de movimiento especializados y solo observan progreso real. Encounters.phaseEvent mantiene el quick event en tiempo de simulación; el botón es una entrada alternativa. El diagnóstico se dibuja dentro de la cámara únicamente con devRun y el interruptor del laboratorio activos.
La revelación del dragón incorpora un reflector cenital sobre la máquina. El aletazo mueve pliegues de cortinas y lámparas colgantes con amortiguación y desplaza una ráfaga de polvo por el suelo. En cooperativo aparece el personaje real del compañero, con pequeños saltos y celebración al revelar el dragón (más marcada con el secreto). Todo es visual, deriva de la edad de la ulti y no mueve ni modifica jugadores. Movimiento reducido conserva iluminación y texto, sin saltos o sacudidas.

### Dominio vial del Chosicano
roadDomain es un estado serializable independiente del dominio de Makanaky. ChosicanoDomain usa Court.players en cliente y servidor, carriles virtuales por slot, tres cruces temporales únicos y dirección bloqueada al aviso. Game y Simulation suspenden combate normal durante su ciclo; el snapshot transmite el estado completo. ChosicanoRoad dibuja un espacio vial propio con los sprites existentes; no altera coordenadas reales ni precarga nuevos atlas. Reiniciar y derrotar limpian el estado.
El compañero celebra el dragón secreto con una silueta completa de brazos levantados y cara alegre; cuy y paloma usan patitas o alas. El atlas cubre los 21 personajes y conserva escala corporal y anclaje de pies, sin estirar miembros. El salto se reduce para destacar el gesto. Arte y prompt: docs/COMPANION_CHEER_ART.md.

### Carrera lateral y chofer
roadDomain mantiene física por slot (altura, velocidad, deslizamiento, tropiezo y obstáculos ya cruzados). El servidor valida roadJump/roadSlide y calcula cruces por tiempo y posición virtual de cada jugador. El render comparte la misma función obstacleX, conserva sprites enteros y gira el cuerpo para deslizar. La voz WAV española es una síntesis local genérica; carga bajo demanda, se reproduce desde la edad autoritativa de intro y se detiene con pausa, silencio o salida. Atlas del chofer 3×2 con seis poses. Combi-packed-v2 conserva dimensiones de la arena y reduce descarga manteniendo fuente PNG y WebP anterior archivados.

Sideral: al cargar su atlas se conserva la figura conectada principal de cada cuadro y se eliminan fragmentos aislados de cuadros vecinos, incluida la onda roja que invadía la recuperación. La limpieza se hace una sola vez, mantiene la cuadrícula, tamaño y anclaje originales y conserva la lata roja unida a la mano.
El botón lab-ultimate despacha la prueba del Chosicano o la del Gallinazo. tryStart(force) solo omite el umbral y el uso previo si devRun es verdadero y Coop está inactivo; mantiene todos los bloqueos de escenas. No cambia PV ni habilita atajos en partidas normales o del servidor.

SideralArt normaliza cada figura con los límites alfa de su componente principal y un anclaje corporal por cuadro. La secuencia visual usa siete poses con desplazamiento suave durante un máximo de .42 s, acotado por la cadencia; no interpola ni deforma extremidades y no altera la simulación.
### Chofer integrado a la cabina
El renderer del bus compone el chofer dentro del mismo transform de carrocería, suspensión, orientación y escala. Se recorta el torso al polígono del parabrisas de cada pose; tablero y volante ocluyen la parte baja y una capa tenue de cristal integra el color. Se eliminan los sprites de cuerpo entero dibujados por encima del vehículo.

Ultimate.owner/multiplier/flockStep comparten reglas entre Systems.move y Simulation.tick. El dueño se resuelve entre jugadores vivos y su estado autoritativo; el objetivo siempre es Kingteka incluso si su compañero está más cerca. gallinazoTransformed y gallinazoGraceUntil son campos planos serializados del enemigo. La recuperación usa tiempo de simulación y no temporizadores de pared. El multiplicador se aplica una vez en Entities.hurt o Minibosses.hurt, conservando resistencias y fases invulnerables.

Progression.blocksUpgrade centraliza la exclusión de escenas para Progression.levelup y Activities.levelup. Consulta estados de simulación y ultis de todos los participantes; no usa temporizadores de pared ni descarta experiencia. collect vuelve a intentar la entrega cuando el bloqueo termina, y la selección existente encadena niveles acumulados sin duplicarlos.

Las cinemáticas a pantalla completa ocultan todas las capas DOM del HUD (vida, minijefes, inventario, combos, rendimiento y controles). El bucle sincroniza cinematic-only antes de renderizar; se restaura al volver al combate, pausar o salir. El combate interactivo de los dominios conserva sus controles.

### Chamelín
chamelin-arena.js implementa la arena física temporal. Conserva _trovoHome de jugadores/enemigos, sustituye Terrain.active/hit/resolve por paredes y lavamanos, suspende spawns y reloj del mapa, y restaura posiciones/cámara al salir o cancelar. La fase central sigue Game.update o Simulation.tick completos: ambos jugadores disparan y reciben contacto/proyectiles; solo advance bloquea entrada y mordida. El servidor publica chamelinDomain sin roomProps derivables y trovoAftermath. El cliente no decide daño. El chorro comparte ángulo retardado y colisión visual con hits; los especiales se ralentizan por desplazamiento sin cambiar avisos. chamelin-bathroom.js dibuja suelo, props y partículas en coordenadas de mundo, y ocho gestos/cuatro giros completos del nuevo atlas con bounds de figura. CoopMotion invalida interpolación al entrar/salir del baño.

SideralDomain.introShake deriva impulsos de los cuatro aterrizajes y la risa del reloj de escena; traslación de cámara entera, sin modificar el atlas. frozen/holdBoss comparten pausa de IA y contacto entre Systems.move y Simulation.tick; Entities.hurt y Minibosses.hurt bloquean daño a especiales mientras existe el dominio. drawHeldBoss usa los sprites completos existentes en reposo y una reacción pixel art de asco sobre ellos. Los temporizadores de ataque se conservan para reanudar al salir.

### Director de partidas largas

`RunMode` centraliza selección, duración, etapas, escala de luz y ventanas de portal. `Game.start` fija `state.runMode` y `Data.arena.duration` antes de reiniciar encuentros y minijefes; pruebas, laboratorio y cooperativo fuerzan `quick`. Los consumidores existentes conservan así una sola fuente de verdad.

`ChaosDirector` deriva su etapa de `state.mapTime`. En una transición puede añadir un prop sólido y destructible a `Terrain.props`, e invalida una vez el índice espacial y el flow field. El dibujo usa como máximo 18 motas y no crea entidades persistentes. `Encounters` registra `portal.index` y `clearedWindows`; la arena captura su índice para atribuir la victoria correcta. `DayNight.current` recibe tiempo visual escalado sin cambiar el contrato puro de `sample(t)`.

`MapEvents` mantiene un único evento pequeño en el cliente individual de 30 minutos. Su calendario usa `mapTime`; los tres hitos de recogida son coordenadas del evento, no actores ni colisiones. Se dibujan con primitivas en el pase de suelo, y los límites del evento omiten búsquedas de entidades e invalidaciones del terreno. Los jefes y portales pueden pausar el reloj y ocultar temporalmente los marcadores; el estado se retoma al regresar. `ChaosDirector` comparte el pase para los tintes y ondas de etapa/victoria, sin cambiar el escenario ni la simulación física.

DotaItems admite cadenas con from y requiredLevel, reemplazando el objeto de la familia sin duplicar espacios ni aplicar acumulativamente el mismo modificador. Las armas marcan weaponAttack en Combat para separar críticos de daños secundarios. Las pruebas de cadenas, cupo, regeneración y reducción de perdigones se ejecutan en CI.
chamelin-fluency.js añade exclusivamente presentación derivada de edad/elapsed. Conserva los atlas completos existentes. Captura el mapa una vez y reutiliza un lienzo para la arena (máximo una copia cada 0,16 s más el cierre), liberando ambos al salir. El remate compone el mapa bajo 96 fragmentos de la arena, sin modificar entidades ni colisiones. Partículas acotadas: 30 pulsos, 12 gotas de punta, 7 por impacto y 18 de vapor al regresar. El golpe remoto se reproduce una vez desde bit replicado; los cambios no agregan mensajes ni autoridad de daño.

UI.show usa upgrade-dota-art con DotaItems.iconUrl para la imagen protagonista de todas las cartas Dota, independientes del personaje y la rareza. Se conserva el contenido textual y la selección/revelado; el icono pequeño duplicado no se inserta. No añade assets generados ni modifica estadísticas.
