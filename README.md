# PERUSURVIVOR — Causas del Caos

[![CI](https://github.com/AngelCloudyDevops/PERUSURVIVOR/actions/workflows/ci.yml/badge.svg)](https://github.com/AngelCloudyDevops/PERUSURVIVOR/actions/workflows/ci.yml)

Juego de supervivencia y parodia peruana para navegador: dieciocho personajes, Backyardigans y policías ficticios como rivales, tres mapas y encuentros opcionales. HTML, CSS y Canvas 2D, sin dependencias de ejecución.

Modo público: [Práctica de Kingteka con recarga gratuita](docs/KINGTEKA_PRACTICE.md).

## Desarrollo

Requiere Node.js 20 o superior. CI verifica Node 22 y 24 en Linux y Windows.

```sh
npm ci --ignore-scripts
npm start
```

Abre http://127.0.0.1:4173. El comando de inicio genera primero dist/. Para ver una edición nueva, vuelve a ejecutar npm run build y recarga el navegador; no hay recarga automática.

| Comando | Función |
|---|---|
| npm start | Genera dist/ y sirve el juego |
| npm run build | Copia fuentes y recursos a dist/ |
| npm run check | Comprueba la sintaxis de los módulos |
| npm test | Genera el juego y ejecuta todas las pruebas |
| node check.cjs | Compila y ejecuta las pruebas (comando histórico) |

WASD o flechas para moverse, ataque automático, Esc para pausar y E para entrar a un portal cercano. En móvil se arrastra el dedo y se usa el botón del portal.

## Estructura

```text
src/
  core/          Estado y controles
  entities/      Jugador, enemigos y daño
  systems/       Combate, progresión, portales y terreno
  data/          Catálogo y balance
  scenes/        Mapas y ciclo de partida
  rendering/     Sprites, efectos y dibujo
  ui/            Menús, HUD y estilos
  index.html
public/assets/
  characters/    Hojas de personajes y sus prompts
  enemies/       Hoja de rivales y su prompt
  maps/          Tres fondos y sus prompts
  audio/         Reservado; la ulti usa síntesis Web Audio
scripts/         Compilación y orden de carga
tests/           Regresión, compilación, HTTP y herramientas manuales
docs/            Diseño y arquitectura
.github/workflows/ci.yml
dist/            Generado, fuera del control de versiones
```

Edita src/ y public/, nunca dist/. Los scripts clásicos siguen compartiendo P; scripts/modules.cjs conserva su orden de carga. El servidor y los archivos compilados mantienen las rutas de JavaScript existentes.

## Documentación

- [Diseño del juego](docs/GAME_DESIGN.md): reglas actuales, personajes, habilidades, progresión y alcance.
- [Arquitectura](docs/ARCHITECTURE.md): responsabilidades, dependencias y flujo de datos.
- [Contribuir y validar](docs/CONTRIBUTING.md): procedimiento de cambios y CI.
- [Procedencia del arte](docs/ASSETS.md): hojas, prompts y referencias.
- [Registro de cambios](CHANGELOG.md).
- [Evidencia de la reorganización](docs/reorganization-baseline.json): hashes de las fuentes originales.

## Validación

Las pruebas cubren los ataques de los dieciocho personajes, oleadas, mejoras, pausa, bumerán, daño del jefe, los tres mapas, portales y sus recompensas, colisiones, cajas y rutas enemigas. También comprueban los recursos compilados y el servidor HTTP. La lógica corre en un entorno simulado; estas pruebas no sustituyen la revisión visual en navegador.

GitHub Actions ejecuta las mismas comprobaciones en cada push y pull request. La CI publica en el VPS únicamente tras un push a main y después de superar todas las pruebas.

## Publicación

El destino principal es https://perusurvivor.michitech.tech, en el VPS de Hostinger srv2060131.hstgr.cloud (179.236.77.159). Nginx (perusurvivor-web) sirve /opt/perusurvivor/live/current detrás de Caddy. Un push a main despliega automáticamente dist/ después de CI; las ramas y PR no publican. Véase docs/DEPLOYMENT.md. El sitio de ChatGPT configurado en .openai/hosting.json es una copia separada: publicarlo no actualiza el dominio principal.

Esta es una versión de un jugador, sin cuentas, pagos, multijugador ni voces de figuras reales. El récord se guarda en el navegador. Las figuras públicas aparecen como caricaturas de parodia con habilidades inventadas; no existe afiliación.

## Terreno continuo
El mapa principal ahora continúa sin bordes mediante sectores deterministas. Conserva los tres temas, obstáculos y cajas destruibles; las arenas de portales siguen cerradas. El terreno de combate usa texturas de suelo de los fondos, no mosaicos de la ilustración completa. Código en src/systems/chunks.js; build generado con npm run build. Las pruebas verifican viaje a coordenadas lejanas, caché acotada, cámara libre y persistencia de cajas destruidas.

## Estilo visual obligatorio

Toda contribución debe respetar la dirección artística elegida por el usuario. La referencia obligatoria es **cartoon (caricaturesco) en pixel art**, tomando los personajes actuales como guía de dibujo. El entorno conserva su sencillez, césped con textura y caminos claros, pero comparte contornos oscuros y sombras de pocos tonos con los personajes. No sustituir este estilo por una variante más detallada sin aprobación expresa del usuario.

- **Personajes y enemigos:** caricaturas pixel art legibles, proporciones coherentes con los sprites actuales, contornos oscuros definidos y colores agrupados. Conservar identidad, vestuario y escala entre reposo, caminata y ataque. No mezclar personajes realistas, 3D o ilustraciones suavizadas con los sprites existentes.
- **Entorno:** árboles de copas simples con contorno oscuro, troncos, bancas, cajas y arbustos caricaturescos. Las formas geométricas son una base de construcción, no un estilo distinto del cartoon de los personajes. Mantener el césped con textura de la referencia y caminos de color claro. Evitar follaje minucioso, edificios ornamentados, texturas realistas o exceso de ruido visual. Los elementos peruanos deben reconocerse mediante formas simples.
- **Coherencia del dibujo:** usar una escala de píxel compatible entre personajes y objetos; bordes nítidos, sin desenfoque ni suavizado al escalar el mundo. La perspectiva es suelo visto desde arriba y objetos de frente en tres cuartos. Mantener sombras discretas en las bases y orden de profundidad al pasar detrás de objetos.
- **Color y lectura:** reservar el mayor contraste para personajes, enemigos, ataques y objetos interactivos. El fondo acompaña el combate; no debe competir con él. Mantener espacio libre para desplazarse y distinguir peligros y recompensas.
- **Animación ambiental:** movimientos suaves y cortos de copas, arbustos y pasto, con ritmos distintos; pocas hojas y partículas, sin cubrir el combate. Respetar la pausa y la preferencia de movimiento reducido. Campo de Marte implementa esta referencia en src/rendering/ambient.js.
- **Ataques y efectos:** conservar el lenguaje pixel art de los personajes, con siluetas claras y colores que permitan distinguir impactos, proyectiles y avisos de peligro. No introducir efectos realistas que rompan la coherencia del dibujo.
- **Mapas y jugabilidad:** conservar la identidad de Campo de Marte, Plaza de Armas y Machu Picchu, el terreno infinito, los caminos variados y las colisiones. Una mejora visual no debe revertir estas funciones.
- **Revisión de arte nuevo:** comparar la propuesta con los personajes actuales dentro de una escena real, a escala de juego y también en móvil. Para cambiar la dirección artística, presentar primero una muestra con un personaje encima y obtener la elección del usuario antes de aplicarla al resto.

### Implementación de referencia

src/rendering/map-art.js mantiene simpleStyle activado: los atlas detallados de public/assets/environment/ se conservan como variantes archivadas, no como referencia visual vigente. El suelo se dibuja en src/systems/chunks.js y los objetos sencillos en src/systems/terrain.js. No reactivar los atlas detallados para una mejora rutinaria. La interfaz puede mantener su tipografía actual; estas reglas de píxel se aplican al dibujo del mundo, personajes y efectos.

La prueba de poderes respeta esta referencia: efectos de Kingteka rasterizados a píxeles de dos unidades, sin halo desenfocado, conservando globos de cómic y sello. Audio y controles de ulti se mantienen.

## Despliegue automático
La preparación y el estado de activación están documentados en [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md). Cada push a main publica el juego después de las pruebas, mediante la cuenta restringida del VPS y comprobación HTTPS con reversión automática.


## Fondos y objetos coherentes
El mundo y el fondo del menú usan el mismo dibujo sencillo con contornos oscuros y colores agrupados. Los atlas detallados de public/assets/environment/ quedan archivados y desactivados; no reactivarlos como arte vigente. Los props nuevos deben compararse con un personaje a escala de juego antes de incorporarlos. Evitar tanto el realismo de alta textura como los objetos planos sin el contorno y sombreado cartoon del elenco. Mantener las identidades de los tres mapas sin recargar su dibujo.

## Arte del botín
Cajas, cofres comunes y dorados y los cuatro objetos usan el atlas pixel art public/assets/loot/loot-atlas-v1.png. Conservan siluetas sencillas y contornos visibles; las tablas y herrajes añaden detalle. Los cofres animan la tapa antes de revelar el premio.

## Cofres por rareza
Común (madera, ●), raro (azul, ◆) y legendario (violeta/dorado, ★), con cuatro objetos mejorados por nivel. Las aperturas y el arte se distribuyen desde GitHub al hosting de producción https://perusurvivor.michitech.tech según docs/DEPLOYMENT.md. El sitio chatgpt.site es una copia independiente y no es el destino principal.

## Kingteka: ulti y sonido
La ulti se carga con 20 bajas y se activa con Q o el botón táctil: ocho segundos de gallinazos animados, velocidad ×1,5 y cadencia ×2; rivales normales reciben ×2 daño. Incluye aleteo, escopeta reforzada, efectos pixel art y sello DENUNCIADO con golpe sincronizado. El botón Sonido permite silenciar. La recarga instantánea y el selector de pruebas son utilidades locales y no se publican.

## Sonido y música
Música retro original por mapa, tema de jefe y efectos sintetizados mediante Web Audio. El botón Sonido recuerda el silencio. Requiere una interacción inicial y se pausa fuera de la partida. No descarga grabaciones externas.

## Cofres al explorar
Los cofres se distribuyen por sectores de 768 unidades con posiciones y una semilla nuevas por partida. Cada sector tiene un 60% de posibilidad de contener uno; el sector de inicio garantiza un común en posición aleatoria segura. Entre cofres fuera del inicio: común 72%, raro 26%, legendario 2%; los legendarios requieren estar a 1800 unidades del punto de aparición. Un sorteo legendario cercano se convierte en raro. Se generan al explorar y se conservan las aperturas al regresar, sin repetir premios. Se comprueban obstáculos, fuente y portal. Las arenas no generan cofres normales; el cofre de jefe conserva su recompensa.

## Gallinazo del Caos
Nuevo jefe opcional de pixel art detallado en los Techos de Lima. Portal desde las 3:00 o acceso directo en Desarrollo → Probar jefes. Picadas señalizadas, plumas bloqueables, bandadas y furia con doble picada bajo el 50 % de vida.
## Cámara y visibilidad
En exploración la cámara debe mostrar caminos, obstáculos y enemigos con anticipación, conservando los personajes legibles. Se reduce el zoom del mundo de 1,7 a 1,3 en una pantalla de 1280 px (aprox. 24% menos acercamiento); el mínimo móvil es 0,95. Las arenas de jefe conservan su cámara propia. El HUD de exploración es compacto y evita repetir la habilidad: mantiene vida, tiempo, bajas, nivel, botín y objetivos. No volver a acercar la cámara global ni ampliar el panel sin comparar una partida en escritorio y móvil. La fórmula está en World.zoomFor y tiene regresión en tests/gameplay.test.cjs. Todo ajuste se guarda en una rama y commit de Git antes de publicarse.

Las jardineras deben reconocerse como macetas: volumen frontal, borde, tierra, follaje irregular y flores con pétalos. No usar una cuadrícula de puntos sobre un rectángulo como sustituto del dibujo. Conservar las colisiones al corregir el arte.
## Llaves y portadores
En partidas individuales, los cofres comunes son gratis. Los raros requieren una llave azul ◆ y los legendarios una violeta ★; se consume una al comenzar la apertura. Los enemigos especiales PORTADOR tienen aura, icono de llave, barra de vida y más resistencia. Aparece un portador raro desde 0:30 y luego cada 40 s; uno legendario desde 1:30 y luego cada 90 s. Solo hay uno vivo por tipo y respetan el límite de enemigos. Soltarán una llave garantizada que debes recoger; el HUD muestra las cantidades. Las llaves se reinician con la partida. Los cofres de jefe siguen siendo gratuitos.

### Control de versiones
Repositorio Git: https://github.com/AngelCloudyDevops/PERUSURVIVOR. Los cambios se guardan mediante commits y pull requests; main conserva el historial integrado. Antes de publicar se ejecutan npm run check y npm test. GitHub Actions valida main y despliega en https://perusurvivor.michitech.tech, según docs/DEPLOYMENT.md. No se versionan credenciales ni dist/.

Los arbustos deben tener silueta orgánica, redondeada e irregular, con masas de hojas y sombras de pocos tonos. El acabado pixelado no justifica dibujarlos como cajas apiladas. La misma regla se aplica al follaje de jardineras; conservar el movimiento suave y la lectura del combate.
## Portadores y llaves en el minimapa
Los portadores vivos y las llaves que quedan en el suelo se muestran hasta 900 unidades: azul para rareza rara y violeta para legendaria. El portador usa un rombo y la llave su propia silueta; una leyenda explica ambos símbolos. Los marcadores se actualizan al moverse, desaparecen al derrotar al portador o recoger la llave y se ocultan en arenas y menús. El cambio se conserva en Git mediante commit y PR, y main se publica automáticamente en Hostinger tras pasar CI.

## Flecha hacia portadores y llaves
El HUD indica con una flecha de ocho direcciones y distancia al portador vivo o llave sin recoger más cercano. Usa azul para raros y violeta para legendarios, cambia automáticamente al desaparecer el objetivo y también orienta hacia llaves fuera del alcance del minimapa. Se oculta sin objetivos, en arenas, laboratorio, cooperativo y al terminar la partida. Implementación guardada mediante commits y PR en Git; main se publica en Hostinger tras CI.

## Suelo, caminos y profundidad
El césped conserva la textura anterior aprobada; no sustituirla por grandes manchas planas. Los caminos curvos comparten sus extremos entre sectores y reservan corredores libres para caminar. Árboles con copas orgánicas, sombra oval y transparencia al pasar detrás. Campo de Marte incorpora mesas de picnic; Plaza, jardines pareados y plazoletas; Machu Picchu, franjas de terrazas y pasos de piedra. Mantener el dibujo cartoon, las señales de combate visibles y el suelo cacheado por sector.
El HUD indica con una flecha de ocho direcciones y distancia al portador vivo o llave sin recoger más cercano. Usa azul para raros y violeta para legendarios, cambia automáticamente al desaparecer el objetivo y también orienta hacia llaves fuera del alcance del minimapa. Se oculta sin objetivos, en arenas, laboratorio y al terminar la partida. Implementación guardada mediante commits y PR en Git; main se publica en Hostinger tras CI.

El indicador también funciona en cooperativo: cada jugador ve la dirección y distancia desde su propia posición, usando los portadores y llaves compartidos por el servidor.

Entrada visual de Kingteka: [cómic pixel art y pausa breve de la ulti](docs/KINGTEKA_COMIC.md). Disponible también en la práctica pública con recarga gratuita.

Las sombras de árboles deben tocar la base del tronco: pequeñas y discretas, ancladas al pie visible del dibujo, no al centro o borde de su colisión. Evitar óvalos separados que hagan flotar árboles y mobiliario.

## Ambulante misterioso y cofre impostor
El ambulante aparece desde 0:45, permanece 45 s y vuelve cada 90 s cerca del jugador. Tiene una unidad por producto y visita: emoliente 20, accesorios comunes 35, imán/batería raros 70, llave rara 40 y legendaria 100 monedas. Acércate y pulsa Hablar con el ambulante. Las compras validan distancia, saldo, stock y expiración; los accesorios reemplazan al actual y la curación no se vende con vida completa. En individual la tienda pausa el mundo; en cooperativo sigue activo y el servidor valida el gasto compartido.

Un 12% de los cofres generados fuera del sector inicial son impostores. Despiertan a menos de 100 unidades, persiguen y atacan. No gastan llaves. Vencerlos deja un cofre de la misma rareza, gratis y con un único objeto. El impostor y su premio no se regeneran al regresar al sector.

Código guardado en rama propia, commits y PR de GitHub; main se publica en Hostinger mediante CI. Las utilidades de QA no se distribuyen.

## Ciclo de luz
El reloj del mapa controla día (0–1:30), atardecer (1:30–3:00), anochecer (3:00–4:30) y noche (desde 4:30). Transiciones graduales y faroles que se encienden al oscurecer. El tinte afecta al suelo antes de dibujar actores, botín y avisos, manteniendo visible el combate. Pausa y arenas detienen el reloj del mapa; arenas y prácticas conservan su luz propia. No cambia dificultad, colisiones ni recompensas.

Entrada de ulti de Kingteka: panel diagonal al 40 %, retrato animado de cintura arriba y 1,3 s sin pausa, con invulnerabilidad. Detalles en [KINGTEKA_COMIC](docs/KINGTEKA_COMIC.md).

## Garúa de Campo de Marte
Episodios visuales de 25 segundos desde el minuto 1, separados por 65 segundos despejados. Entrada y salida suaves, gotas y pequeñas salpicaduras debajo de actores y avisos. Sigue mapTime: pausa y arenas no avanzan el clima. No aparece en prácticas y se desactiva con movimiento reducido. No modifica daño, velocidad, colisiones ni premios.


## Clima en Plaza y Machu Picchu
La Plaza comparte los episodios de garúa y añade reflejos cortos y tenues en el pavimento. Machu Picchu tiene bancos de niebla intermitentes en esos intervalos, sustituyendo la niebla ambiental permanente para no acumular capas. El indicador distingue GARÚA y NIEBLA. Todo queda debajo del combate, se congela al pausar y se desactiva con movimiento reducido.

El ambulante tiene un sprite pixel art de 48×52 con dos cuadros de animación: capucha, toldo morado/dorado y carrito con mercancía. Su icono de tienda aparece en el minimapa mientras la visita esté activa, fijándose al borde si queda fuera del alcance. Encima del minimapa se muestra «TIENDA · N s», con aviso naranja durante los últimos 10 segundos. Usa el reloj del mapa y el estado compartido del servidor: respeta la pausa individual, las arenas y la expiración cooperativa. Los cuadros se dibujan en una caché de canvas sin suavizado.


## Progresión survivor por partida
Los rivales dejan experiencia (fama). Al llenar la barra, subes de nivel y eliges exactamente una de tres mejoras, con el mundo pausado. El exceso de XP se conserva y encadena elecciones. El arma inicial puede subir hasta rango 5; se ofrecen desbloqueos de Onda causa (área), Tarjetas del caos (perforantes) y Escudo de bandas (área cercana), con un máximo de dos apoyos. Cada poder tiene cinco rangos. A partir de nivel 8, los poderes de rango 5 pueden evolucionar mediante una elección especial: el arma gana daño, alcance, proyectiles y perforación; los apoyos duplican daño y amplían alcance. Las mejoras de atributos tienen cinco rangos y no ocupan espacios de poderes. El HUD muestra XP, poderes, rangos y estrellas de evolución. Todo se reinicia al empezar otra partida.

P.Progression centraliza opciones, aplicación, efectos automáticos y resumen. El servidor cooperativo pausa la sala y genera tres ofertas por jugador; valida ID de elección y aplica cada mejora una sola vez. Espera a ambos y encadena niveles pendientes. Los rangos y tiempos de los apoyos se serializan con cada jugador. No se cambian las ultis ni se requieren compras para evolucionar.
## Vegetación reactiva y palomas
Los arbustos de Campo de Marte y las matas de Machu Picchu se sacuden brevemente al pasar cerca; las palomas de la Plaza levantan vuelo y vuelven al suelo. Mantener el estilo cartoon con acabado pixel, masas redondeadas y sombras ancladas al suelo. Son decoración local: no afectan combate, colisiones ni sincronización. Máximo seis palomas y 32 plantas reactivas del grupo visible, detección limitada a 30 Hz y estado descartado al salir de cámara. El reloj de mapa respeta pausa y arenas; movimiento reducido desactiva reacciones y vuelo.


## Evoluciones propias y menú de habilidades
Cada uno de los 18 personajes conserva su arma inicial y tiene una evolución exclusiva, disponible mediante elección con rango 5 y nivel 8. «Habilidades y evoluciones» en la selección y «Habilidades» en la partida permiten recorrer personajes, consultar cinco rangos, requisitos, efectos y apoyos. Verde indica rangos obtenidos en la partida actual. La consulta pausa el individual; en cooperativo detiene únicamente la entrada local y avisa que la sala continúa. Escape y Cerrar vuelven al estado previo; las elecciones del servidor tienen prioridad.

- cristorata: **Directo encadenado** — Dos micrófonos de retorno enlazan hasta tres rivales con sonido.
- cuy: **Terremoto del cuy** — Una onda completa empuja y deja una zona de temblor a tus pies.
- paloma: **Corona de plumas** — Doce plumas salen en todas direcciones y atraviesan dos rivales.
- alan: **Eco de la plaza** — Un discurso amplio alcanza también a los rivales detrás de ti.
- alberto: **Órbita presidencial** — Seis bandas giran alrededor y una onda golpea el centro.
- keiko: **Abanico solar** — Cuatro abanicos salen en cruz, regresan y dejan un remolino junto al objetivo.
- ollanta: **Marcha del comando** — Un cono largo y estrecho empuja; dos ondas laterales cubren los flancos.
- kingteka: **Escopeta Contra** — Tres disparos concentrados de alta velocidad perforan ocho rivales.
- shaka: **Tornado bananero** — Cinco plátanos parten en todas direcciones y regresan; un torbellino golpea cerca.
- najasor: **Marea CPEZ** — Siete pescados zigzaguean y una ola daña al grupo junto al objetivo.
- cirilo: **Concierto orbital** — Tres micros van y vuelven en abanico; una onda corta protege al artista.
- fuzo: **Banca infinita** — Cinco tarjetas rápidas atraviesan ocho rivales y enlazan al grupo más cercano.
- charles: **Lluvia de pañales** — Tres pañales dejan nubes y una nube adicional aparece junto al objetivo.
- axelbenba: **Tormenta relámpago** — Dos clips buscan al enemigo vivo más cercano durante su vuelo.
- cerdito: **Fiesta del cerdito** — Doce balas salen en círculo; una onda corta despeja el puesto.
- sustento: **Infestación veloz** — Tres cucarachas perforantes avanzan en zigzag; una zona de enjambre queda junto al objetivo.
- cevichero: **Marea del enjambre** — Seis cucarachas salen en círculo y regresan como bumeranes.
- g5: **Huracán G5** — Tres barridos consecutivos cubren frente y flancos, con fuerte empuje.

P.Evolutions define perfiles de ataque inmutables y efectos serializables por personaje; Combat conserva el ID de ataque original para mantener sus sprites. Las animaciones nuevas son geometría pixel art de raíles, ondas, abanicos, enjambres, plumas y barridos, además de trayectorias radiales, retorno, búsqueda y zonas persistentes según el perfil. El servidor usa el mismo módulo. Movimiento reducido estabiliza la animación decorativa sin alterar impactos. El menú es solo de consulta: no concede niveles ni poderes.
## Arte de naturaleza
Las palomas y la vegetación reactiva utilizan [sprites cartoon con acabado pixel](docs/NATURE_ART.md): cuatro poses de ave, tres arbustos con flores/bayas y una mata de ichu. Usar siluetas orgánicas, contornos oscuros y sombras al pie; evitar rectángulos como diseño definitivo. Atlas compartido de 512×256, sin cambiar los límites ambientales ni añadir partículas.


## Pileta y fachada de la Plaza
La fuente ornamental y el edificio colonial usan [sprites cartoon con acabado pixel](docs/PLAZA_LANDMARKS.md): piedra/bronce, balcones tallados y arcos. Conservar perspectiva, contornos y sombras al pie, sin volver a bloques geométricos como arte definitivo. Atlas compartido, ocho reflejos de agua como máximo y transparencia al pasar detrás. No cambia colisiones ni cupos del mapa.

## Inicio y demostraciones de ataques
El inicio se organiza como un lobby: causa destacado, botón Jugar ahora y accesos a mapas, personajes, habilidades y cooperativo. Conserva el estilo peruano y todos los controles existentes; no añade funciones de cuenta ni tiendas inexistentes.

El menú de habilidades compara ataque básico y evolución en dos canvas animados con los perfiles, glifos, poses y efectos del juego. Incluye pausa/reproducción y descripción de requisitos. Son demostraciones cosméticas sobre muñecos: no ejecutan combate, no alteran XP, monedas, salud, equipo ni estado de sala y no desbloquean poderes. La animación comparte el bucle de dibujo a un máximo de 30 Hz, usa dos superficies, se detiene al cerrar o esconder la pestaña y arranca estática con movimiento reducido. Los recursos faltantes usan el retrato existente y se reutiliza la carga de sprites.

## Vestíbulo pixel art
La portada muestra «Pulsa para empezar» sobre el escenario con nueve personajes decorativos en movimiento. Al entrar, el causa elegido ocupa el centro y una navegación lateral abre secciones independientes: Jugar (mapas y comienzo), Causas (colección y ficha con atributos), Habilidades (rama y comparación animada), Cooperativo (salas existentes) y Ajustes (sonido, controles y prácticas). En móvil la navegación se sitúa abajo. No introduce cuentas, monedas persistentes ni un gacha ficticio. El fondo y los retratos son cosméticos: no avanzan la partida, no crean enemigos ni consumen recursos. Se reutilizan los atlas cargados y se respeta movimiento reducido. El mejor récord mostrado sigue siendo local.
