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
Los rivales dejan experiencia (fama). Al llenar la barra, subes de nivel y eliges una de tres mejoras, con el mundo pausado; cada cuatro niveles aparece una cuarta opción de pacto. El exceso de XP se conserva y encadena elecciones. El arma inicial puede subir hasta rango 5; se ofrecen desbloqueos de Onda causa (área), Tarjetas del caos (perforantes) y Escudo de bandas (área cercana), con un máximo de dos apoyos. Cada poder tiene cinco rangos. A partir de nivel 8, los poderes de rango 5 pueden evolucionar mediante una elección especial: el arma gana daño, alcance, proyectiles y perforación; los apoyos duplican daño y amplían alcance. Las parejas arma + onda y tarjetas + escudo habilitan combos legendarios. Las mejoras de atributos tienen cinco rangos y no ocupan espacios de poderes. El HUD muestra XP, poderes, rangos y estrellas de evolución. Todo se reinicia al empezar otra partida.

P.Progression centraliza opciones, rarezas, comparaciones, combos, pactos, aplicación, efectos automáticos y resumen. El servidor cooperativo pausa la sala y genera tres o cuatro ofertas por jugador; valida ID de elección y aplica cada mejora una sola vez. Espera a ambos y encadena niveles pendientes. Los rangos, combos y tiempos de los apoyos se serializan con cada jugador. No se cambian las ultis ni se requieren compras para evolucionar.
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
- kingteka: **Escopeta Contra** — Tres disparos concentrados, tres penetraciones base y pérdida de fuerza a distancia.
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


Ulti de Fujimori: [Tribunal](docs/GAME_DESIGN.md), entrada de 1,3 s y tribunal compartido de 3,4 s, aliado como abogado y remate de radio 340 u que excluye jefes. El menu incluye practica con recarga gratis y objetivos dentro/fuera del radio.
## Pileta y fachada de la Plaza
La fuente ornamental y el edificio colonial usan [sprites cartoon con acabado pixel](docs/PLAZA_LANDMARKS.md): piedra/bronce, balcones tallados y arcos. Conservar perspectiva, contornos y sombras al pie, sin volver a bloques geométricos como arte definitivo. Atlas compartido, ocho reflejos de agua como máximo y transparencia al pasar detrás. No cambia colisiones ni cupos del mapa.

## Inicio y demostraciones de ataques
El inicio se organiza como un lobby: causa destacado, botón Jugar ahora y accesos a mapas, personajes, habilidades y cooperativo. Conserva el estilo peruano y todos los controles existentes; no añade funciones de cuenta ni tiendas inexistentes.

El menú de habilidades compara ataque básico y evolución en dos canvas animados con los perfiles, glifos, poses y efectos del juego. Incluye pausa/reproducción y descripción de requisitos. Son demostraciones cosméticas sobre muñecos: no ejecutan combate, no alteran XP, monedas, salud, equipo ni estado de sala y no desbloquean poderes. La animación comparte el bucle de dibujo a un máximo de 30 Hz, usa dos superficies, se detiene al cerrar o esconder la pestaña y arranca estática con movimiento reducido. Los recursos faltantes usan el retrato existente y se reutiliza la carga de sprites.

## Vestíbulo pixel art
La portada muestra «Pulsa para empezar» sobre el escenario con nueve personajes decorativos en movimiento. Al entrar, el causa elegido ocupa el centro y una navegación lateral abre secciones independientes: Jugar (mapas y comienzo), Causas (colección y ficha con atributos), Habilidades (rama y comparación animada), Cooperativo (salas existentes) y Ajustes (sonido, controles y prácticas). En móvil la navegación se sitúa abajo. No introduce cuentas, monedas persistentes ni un gacha ficticio. El fondo y los retratos son cosméticos: no avanzan la partida, no crean enemigos ni consumen recursos. Se reutilizan los atlas cargados y se respeta movimiento reducido. El mejor récord mostrado sigue siendo local.
## Bancas y faroles
El mobiliario de Campo y Plaza utiliza [sprites cartoon con acabado pixel](docs/STREET_FURNITURE.md): dos bancas con madera y hierro ornamentales y farol colonial. Conservar perspectiva, sombras pequeñas pegadas a las patas y base del poste. Atlas compartido de unos 50 KB; luz del vidrio cacheada y ligada al ciclo de día/noche. No cambiar colisiones, cantidades ni añadir luces dinámicas por objeto.

## Progreso permanente por personaje
El progreso se guarda automáticamente en localStorage de este navegador (causas-progress-v1), conservando el récord anterior. No sincroniza cuentas ni guarda una partida en curso. El panel Mejoras muestra saldo, partidas, victorias, rivales y mejores marcas de cada causa.

Las monedas permanentes son distintas del dinero temporal del mapa. Al terminar una partida de al menos 15 s se entregan 1 por cada 5 rivales, 2 por cada 30 s y 50 extra por victoria. Cada partida tiene ID y recibo para impedir cobros repetidos. No se premian abandonos, prácticas, laboratorios ni pruebas de rendimiento. El cooperativo entrega recompensa local a cada participante a partir del resultado de la sala.

Cada personaje tiene cinco rangos de Vitalidad (+8 vida/rango), Fuerza (+4% daño base/rango), Reflejos (recarga ×0.97/rango), Zapatillas (+3% velocidad base/rango) e Imán (+12% recogida base/rango). El coste es base × (rango actual + 1): 40, 50, 55, 35 y 35 respectivamente. Las mejoras se aplican una sola vez al comenzar el combate individual normal. El cooperativo mantiene sus atributos de servidor y los rangos de poderes de cada partida continúan reiniciándose.

P.Meta valida esquema, identificadores, rangos y saldo. Compra y premio escriben un único documento; las operaciones releen el estado y usan Web Locks cuando está disponible. Los cambios de otras pestañas se reflejan por storage. Una lectura corrupta o un fallo de escritura no confirma gasto ni premio: conserva el guardado y muestra estado y reintento. No se utiliza el monedero local como autoridad de combate cooperativo.
## Árboles y jardineras
Campo y Plaza usan [árboles y jardineras cartoon con acabado pixel](docs/TREES_PLANTERS.md): dos copas orgánicas y jardineras de piedra en orientación horizontal y alargada. Mantener raíces y sombras apoyadas; solo la parte alta del árbol oscila, con transparencia al pasar detrás. Un atlas compartido, dos llamadas de imagen por árbol y una por jardinera; sin cambiar colisiones ni cantidades. Pausa y movimiento reducido detienen el movimiento.


## Equilibrio y autoataque
La [primera pasada de equilibrio](docs/COMBAT_BALANCE.md) limita los objetivos automáticos a pantalla y alcance; las balas lanzadas conservan su recorrido. Los minions comienzan sus ataques a distancia a la vista. Kingteka tiene alcance/cadencia revisados y daño decreciente a distancia; Cerdito comparte la regla de escopeta. Cooperativo valida la cámara de cada jugador. Comparación de 18 personajes y evolución de Kingteka: docs/balance-audit.json. Se conservan salud y patrones de jefes.

## Monumento y picnic de Campo de Marte
El [monumento y las mesas de picnic](docs/CAMPO_LANDMARKS.md) conservan el estilo cartoon con acabado pixel: piedra tallada, relieves, madera y metal, mantel o canasta/termo. Mantener sombras pegadas a la base y patas, escala coherente y transparencia detrás del monumento. Atlas compartido de unos 96 KB, una llamada de dibujo por objeto, sin cambiar cantidades ni colisiones.


## Perdigones y resistencia de minijefes
La [segunda pasada](docs/COMBAT_BALANCE_2.md) reduce los impactos adicionales de una descarga sobre el mismo enemigo (100/35/15/15… %), manteniendo daño independiente por rival y jugador. Los minijefes fijan su vida al aparecer según tiempo de mapa y grupo; no crece durante el combate. Los minions básicos conservan su salud. Medición de 18 personajes: docs/shotgun-miniboss-audit.json.


## Piedra de Machu Picchu
Las [rocas, muros y terrazas](docs/MACHU_STONE.md) usan sprites cartoon con acabado pixel, grietas y musgo discreto. Mantener siluetas irregulares, piedra coherente y sombras al pie. Atlas compartido de unos 287 KB, una llamada de imagen por obstáculo y bordes del suelo cacheados por sector. Conserva colisiones, rutas y cantidades; sin añadir partículas ni animaciones.

## Tienda del menú y mochila
El monedero permanente compra unidades de Lonchera del causa (20: +25 vida máxima/inicial), Café de cabina (25: recarga ×0.88), Zapatillas de repuesto (25: velocidad ×1.10), Imán de bolsillo (20: recogida ×1.25), Llave rara (30) y Llave legendaria (70). Los cuatro bonos duran una partida; las llaves se suman al inventario temporal del mapa. Los objetos usan iconos pixel art propios y el estilo azul del vestíbulo.

La mochila es compartida entre personajes, tiene hasta 99 unidades por objeto y permite preparar como máximo tres tipos distintos, una unidad por tipo. Preparar, quitar o cambiar de mapa no gasta objetos. Al comenzar el individual normal se confirma un consumo atómico, se limpia la selección preparada y se aplican sus efectos una sola vez, después de las mejoras permanentes. Cada partida tiene un recibo de consumo para evitar descuentos duplicados. No se consumen en cooperativo, prácticas, laboratorio ni rendimiento; permanecen preparados para la siguiente partida individual.

El esquema local v2 incorpora inventario, preparados y recibos, leyendo también los guardados v1 y conservando saldo, mejoras y marcas. Mantiene la clave local existente; al escribir migra a v2. Las versiones antiguas rechazan ese formato en lugar de sobrescribir la mochila. P.Supply reutiliza P.Meta.transaction y su bloqueo entre pestañas; compra, preparación y consumo validan cantidad, saldo, cupos y modo antes de persistir. El juego espera sin avanzar reloj mientras confirma la mochila; un fallo permite reintentar, conservar objetos y jugar o volver al menú. Nada se aplica si el consumo no queda confirmado. No se distribuyen controles de QA.

### Perfiles de combate
El selector Causas muestra rol, fortalezas, debilidades y estadísticas base reales de los 18 personajes, separadas del progreso permanente. Consulta [la tabla de personajes](docs/CHARACTER_PROFILES.md). La rareza del botín no clasifica el poder de los personajes.

## Gacha de personajes
Cada tirada cuesta 60 monedas permanentes. Probabilidades base por rareza: común 60%, raro 27%, épico 10%, legendario 3%; cada personaje se elige uniformemente dentro de su rareza. Los repetidos devuelven 15/25/40/60 monedas respectivamente, sin duplicar personajes. Tras nueve tiradas sin épico o superior, la siguiente garantiza al menos épico; tras 29 sin legendario, la siguiente garantiza legendario. Las garantías pueden elevar la rareza de la tirada base. No se cobra si la colección está completa. No hay compra con dinero real.

Perfiles nuevos reciben Cristorata, Cuy Supremo y Paloma del Centro. El esquema v3 conserva saldo, mochila y mejoras de v1/v2 y desbloquea además los personajes con partidas, premios o mejoras anteriores. El formato antiguo no puede sobrescribir el nuevo. La colección marca bloqueados y rareza: se pueden consultar habilidades y prácticas, pero para jugar en individual o solicitar sala debe estar desbloqueado. El servidor cooperativo sigue usando su catálogo y atributos; el progreso del navegador no es autoridad de cuenta en la sala.

P.Gacha resuelve cargo, devolución, desbloqueo, garantías e historial en una sola P.Meta.transaction. El resultado se guarda antes de la animación y se puede consultar de nuevo sin pagar; cerrar o recargar no vuelve a tirar. La animación comparte el bucle de dibujo, se detiene al salir/ocultar pestaña y se revela inmediatamente con movimiento reducido. La rareza de colección no cambia las estadísticas de combate.
## Acabado de caminos
Los [caminos](docs/PATH_FINISH.md) conservan sus rutas y texturas aprobadas, con bordes de pasto en Campo, juntas de pavimento en Plaza y desgaste sutil en Machu. Acabado de dos unidades por píxel, detalles deterministas y composición cacheada por sector. Sin imágenes adicionales ni cambios de colisiones; hasta 96 grupos de pasto en los bordes, fuera del corredor.


## Ambiente sonoro de los mapas
Campo tiene hojas y aves discretas; Plaza, agua que aumenta al acercarse a la pileta; Machu, viento grave y suave. Síntesis original con dos fuentes de ruido compartidas, sin descargas de audio, y ajustes a 10 Hz. Respeta el botón de sonido, pausa, menú y pestaña oculta; se retira durante jefes, arenas y pruebas. Los trinos son espaciados y ceden prioridad a los efectos del combate.


## Invocación ×10
El menú Gacha permite una tirada por 60 monedas o diez por 600. Se requiere el saldo completo antes de comenzar, sin descuento adicional. Las diez se resuelven en orden con las mismas probabilidades, garantías y devoluciones por repetidos. Si la colección se completa dentro del lote, se terminan las diez tiradas; una colección ya completa impide iniciar otra compra. El resumen muestra cada causa, rareza, nuevo/repetido, devolución total y coste neto. La animación se puede saltar y respeta movimiento reducido. El último lote se recupera al recargar sin volver a cobrar.

## Historial, copias y estrellas
Gacha incorpora pestañas Invocar, Historial y Estrellas. El historial guarda las últimas 200 tiradas con personaje, rareza, nuevo/repetido y fecha/hora local; incluye filtros y páginas de 20. Las tiradas antiguas disponibles se conservan como «Fecha no registrada» y no se recuperan registros que el límite anterior ya había descartado.

Los repetidos mantienen su devolución de monedas y añaden una copia del mismo personaje hasta 5★. Todos empiezan a 1★; ascender manualmente a 2★/3★/4★/5★ consume 2/3/4/5 copias respectivamente, sin monedas adicionales. Cada ascenso añade +3% de vida y daño en individual (máximo +12%); no altera partidas cooperativas ni prácticas. Puedes seguir invocando con la colección completa para obtener copias, hasta tener todos a 5★. A 5★, los repetidos solo devuelven monedas. El perfil v4 migra los repetidos del historial v3 conservado a copias una sola vez y conserva saldo, colección, mochila y mejoras.
