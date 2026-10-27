Warning: truncated output (original token count: 23131)
Total output lines: 566

# PERUSURVIVOR — Causas del Caos

Supervivencia peruana con dieciocho personajes, tres mapas, encuentros opcionales y objetos de Dota 2 adaptados como cartas de equipo evolutivo durante cada partida.

Estabilidad cooperativa: paquetes WebSocket de más de 1 KiB usan compresión rápida negociada, sin retener contexto, con dos tareas concurrentes como máximo; el límite de entrada de 2 KiB sigue aplicándose tras descomprimir. una excepción se limita a su sala y queda registrada; salud muestra errores y coste de tick/serialización agregados. Reconectar con el token válido sustituye la conexión anterior sin perder el grupo. El cliente procesa el último estado por fotograma, conserva el resultado final y evita recargarse automáticamente mientras tiene sala. Scripts VM compilados se reutilizan, manteniendo una VM independiente por sala. Las publicaciones solicitan reinicio al quedar el servidor sin salas: las partidas existentes no se cierran por cambiar de release (un reinicio forzado del contenedor sigue interrumpiéndolas). El backend puede permanecer temporalmente en la release anterior hasta quedar libre.

Cooperativo: señales Aquí/Peligro/Ayuda/Cofre desde el botón Señales, posición validada por servidor, 5 s de duración, una por jugador y recarga de 2 s. Ayuda funciona al estar caído. La escolta de la combi se desbloquea a los 90 s: acérquense y pulsen Iniciar escolta. Ambos vivos a 200 unidades; dos paradas de 6 s despejadas de enemigos. Vida 150, límite 100 s, reintento 20 s; premio único +50 monedas compartidas y 25% de vida a cada superviviente. Se suspende durante arenas, escenas, mejoras y desconexiones; no coincide con la defensa doble. Backend Escort/Signals serializados en activities; CoopExtras dibuja vehículo, avisos y controles sin autoridad sobre premios.

## Estándar obligatorio de tarjetas de ulti
Las entradas de ulti usan 40 % de ancho, 82 % de alto, x = 0, y = 8 %, 1,3 s, borde diagonal con marco oscuro y retrato dedicado de cintura arriba. Render a resolución de pantalla, sin margen ni ampliación del lienzo del dominio. Las vistas de espalda deben usar sprites cartoon pixel art completos y contorneados, nunca figuras geométricas de sustitución. Detalles y assets: [Contrato visual de ultis](docs/ULTIMATE_ART.md).

En partida, todos los personajes muestran dos espacios de carta en el HUD: ulti (Q) y Expansión de Dominio (R). La habilidad implementada usa su arte, carga y estado; si aún no existe para ese personaje, el espacio queda visible en gris como «PRÓXIMAMENTE», sin activarse. Mantener Q o R levanta la carta para revelar su arte; una pulsación breve activa una habilidad disponible cuando está cargada. Las expansiones de dominio comienzan con su cinemática a pantalla completa.

## Revelado de mejoras
Al subir de nivel se revelan las tres cartas antes de elegir una. El giro muestra un destello breve de izquierda a derecha según la rareza: turquesa para rara, violeta para épica y dorado para legendaria; común conserva un giro limpio. El efecto es cosmético y de una sola ejecución, respeta `prefers-reduced-motion` y no modifica el poder: la rareza solo influye en la probabilidad de aparición.

## Objetos de Dota durante la partida
Los objetos equipados aparecen en una fila de hasta cuatro espacios en la esquina inferior derecha. Cada espacio muestra el icono oficial de Dota 2, el nombre y un estado corto; al pasar el cursor o enfocarlo se lee la descripción completa. Si el CDN oficial no responde, se usa el icono pixel art local. Botas, Magic Stick/Wand, anillos y armas son pasivos; Blink Dagger y sus evoluciones son el único objeto activable y se usan con **E** o clic en su icono. El Ring of Health se obtiene desde nivel 2 y evoluciona a Ring of Tarrasque desde nivel 5 y Heart of Tarrasque desde nivel 8: aumentan vida máxima y regeneración. Blades of Attack también aparece desde nivel 2 y evoluciona en orden a Broadsword (nivel 5), Crystalys (nivel 8) y Daedalus (nivel 11): suben el daño y las dos últimas pueden asestar críticos. Cada rama ocupa un espacio y el equipo de objetos se reinicia al comenzar otra partida. Las cartas de objetos muestran ampliada la imagen original de Dota como arte principal, sin personaje de fondo; si falla la imagen oficial, se muestra el icono pixel art local.

## Dominio de Sideral: «¿QUÉ, EN SERIO?»
Como Expansión de Dominio UR, Sideral no usa tarjeta lateral: al activarla comienza directamente su cinemática propia a pantalla completa, igual que Makanaky. Cada onda morada nace desde la posición actual de Sideral al gritar, incluso si se ha movido desde el centro de la habitación.

La presentación respeta este orden: escucha, pregunta «¿QUÉ?», levanta la mano derecha y dice «¿EN SERIO?». Después se pone serio, endereza el cuerpo, junta ambas manos en un sello y las separa mientras declara «EXPANSIÓN DE DOMINIO… HABITACIÓN DEL LAGARTO». Finalmente adelanta ambas manos, da cuatro saltos hacia atrás y termina riéndose mientras la habitación sustituye al mapa.

Durante el sello la cámara se acerca a las manos, aparece un emblema violeta de lagarto y un destello cruza los lentes. Al separar las manos, suelo, paredes, biblioteca, escritorio y monitores se reconstruyen desde abajo mediante píxeles violetas, enlazando la cinemática con el mapa físico. El primer grito ocurre al entrar en la habitación, sin pausa intermedia: su onda nace en Sideral y aplica miedo inmediatamente. En cooperativo el compañero aparece confundido, se cubre los oídos durante la declaración y queda protegido durante toda la entrada; al recuperar el control conserva las interacciones normales para reanimar, abrir cofres y recoger objetos.

Sideral es UR y carga su expansión con 35 bajas. La entrada cinematográfica ocupa toda la pantalla durante 5,6 s y utiliza un atlas dedicado de doce poses: escucha, duda, sorpresa, mano derecha, gesto serio, sello de manos, apertura del sello, liberación violeta y cuatro etapas del retroceso con carcajada. El último salto rompe visualmente la habitación y forma el dominio con ondas concéntricas, grietas violetas, ecos visuales y pulsos sonoros.

Durante ocho segundos el escenario es reemplazado por un mapa temporal de habitación de 1.100 × 760 unidades: suelo embaldosado, tapete, escritorio con dos monitores, computadora, silla, sofá y biblioteca, rodeados por un vacío violeta. Sus cuatro paredes y los muebles son geometría con colisión real, no una imagen superpuesta. Enemigos, cofres, tienda, llaves, botín, evento y compañero son trasladados dentro conservando su posición cuando ya cabe; todo continúa siendo utilizable para saquear o reanimar y vuelve a sus coordenadas originales al finalizar.

El primer pulso borra proyectiles hostiles de minions y todos los minions normales huyen de Sideral. Durante el dominio Sideral no reproduce su ataque automático ni su pose de ataque: el control proviene exclusivamente de sus gritos periódicos, representados por ondas moradas que recorren toda la habitación. El daño de pared solo se dispara cuando la resolución física confirma el choque. Cada impacto quita 8 % de vida máxima, produce un rebote fuerte, sacudida localizada, polvo, texto y una grieta temporal, hasta tres choques por enemigo. Los jefes y minijefes quedan inmóviles, sin atacar ni hacer daño por contacto e invulnerables durante el dominio. Muestran una reacción de asco y no reciben la vulnerabilidad de los pulsos.

La alfombra se pinta en la capa del suelo; paredes y muebles usan capas separadas. Al trasladar cualquier entidad —incluidas las creadas con el dominio activo— se busca una celda libre para evitar apariciones dentro del escritorio, sofá o biblioteca. El portal también recibe una posición interior temporal. La cámara reserva margen superior para el HUD y encuadra la habitación completa incluso en pantallas bajas. Las paredes comparten exactamente el límite de colisión, sin huecos en las esquinas. Al finalizar, una transición de 0,95 s apaga los monitores, quiebra paredes y muebles en píxeles violetas, muestra el mapa original reconstruyéndose por debajo y remata con el destello de lentes y «¿QUÉ FUE?». El último pulso empuja a los minions sin añadir daño extra. Sideral y su compañero conservan invulnerabilidad hasta que termina la transición y se restauran las coordenadas. En cooperativo la simulación del servidor traslada a ambos jugadores y conserva la misma geometría, miedo, daño, interacciones y rescate. Prueba directa de administrador: `/?practice=sideral`; el laboratorio ofrece recarga automática y objetivos que reaparecen.

## Dominio de Makanaky: combos y cámaras
El dominio de Makanaky encadena jab izquierdo, jab derecho, cruzado y uppercut con giro del cuerpo, pasos y avance del personaje. Los jabs conservan cada puño claramente en su propio lado, retraen la mano contraria y alternan el brazo delantero para que izquierda y derecha sean legibles. El ciclo completo dura 1,30 s; los jabs son rápidos y el uppercut conserva más anticipación y peso. La cámara cercana muestra a Makanaky grande y de espaldas, con el rival al frente, embestida corporal, retroceso y silueta de velocidad; la tercera persona abre el plano según la cantidad de rivales visibles y A/D desplaza a Makanaky mientras cambia la perspectiva. La expansión arrastra a todos los enemigos vivos reales del mapa, sin límite de distancia ni cupo, y los ordena en oleadas de siete; minijefes y jefes esperan al fondo y mantienen su daño limitado. Su fase de combate UR dura 9 s. Cada combo completo de cuatro golpes acelera temporalmente la siguiente oleada, y desde GA×8 aparece la sobrecarga de neón morado. Mantén clic o Espacio para completar el repertorio; la racha continúa hasta `×99`. El objetivo válido queda fijado durante el golpe y el daño llega al conectar el puño. Cada impacto tiene microparada, destello, sacudida y reacción direccional; las eliminaciones de rachas altas salen despedidas con más fuerza. Los minions eliminados pierden la cabeza en pixel art y caen hacia el lado contrario, sin sangre; jefes y minijefes conservan el cuerpo. V o el botón cambia entre cámara cercana y tercera persona sin alterar el combate. La expansión tiene una cinemática a pantalla completa de 3 s: ocho poses de manos, «¡BÓTAME TU GAAAA!», grietas, postes, rejas y paredes que emergen del suelo. Ambos jugadores permanecen protegidos y el mapa no avanza durante la entrada. No usa tarjeta lateral. Prueba directa de administrador: /?practice=makanaky tras iniciar sesión; el parámetro se consume al cargar para que una recarga posterior vuelva al vestíbulo normal. Incluye Recargar dominio y oleadas infinitas de objetivos normales dentro de la expansión.

## Prototipo: dominio de Makanaky
El UR usa Expansión de dominio con Q (35 bajas). Entra al callejón en primera persona: A/D o flechas para esquivar, ratón para apuntar, clic/Espacio para golpear. En cooperativo el compañero se refugia detrás y puede pulsar ¡GA!. En el laboratorio de administrador, elige Makanaky y activa recarga automática; conserva los permisos existentes. Daño a jefes y arte del callejón son provisionales.

### Compañero cooperativo del dominio

Los 18 personajes que pueden acompañar a Makanaky tienen un atlas exclusivo de cuatro reacciones cartoon pixel art: carrera agachada hacia el refugio, cobertura con miedo, temblor/asomo y celebración. En tercera persona siguen al luchador desde atrás; en cámara cercana aparecen parcialmente en una esquina. Los avisos señalan el lado del peligro y el compañero reacciona si Makanaky recibe daño. Su botón «¡GA!» no ataca: si se pulsa dentro de la ventana del cuarto impacto, amplía el impulso de la oleada de 0,8 a 1,25 s y muestra «¡GA PERFECTO!». El compañero permanece protegido y no genera bajas, daño ni recompensas.

## Preferencias de colección persistentes
Rareza, estrellas, Solo listos para ascender y orden se guardan automáticamente en este navegador al cambiar un control y se restauran al recargar o volver a abrir el juego. Limpiar filtros guarda los filtros iniciales y conserva el orden elegido. Las pestañas del mismo sitio se sincronizan. Si el navegador impide guardar, los controles siguen funcionando durante la sesión y aparece un aviso con reintento; el progreso del personaje se conserva.



[![CI](https://github.com/AngelCloudyDevops/PERUSURVIVOR/actions/workflows/ci.yml/badge.svg)](https://github.com/AngelCloudyDevops/PERUSURVIVOR/actions/workflows/ci.yml)

Juego de supervivencia y parodia peruana para navegador: diecinueve personajes, Backyardigans y policías ficticios como rivales, tres mapas y encuentros opcionales. HTML, CSS y Canvas 2D, sin dependencias de ejecución.

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

WASD o flechas para moverse, ataque automático y Esc para pausar. E activa Blink Dagger si lo tienes; si no, activa la esquiva perfecta o abre el portal cercano. Con Blink equipado, el portal se abre con clic en su botón. Q activa la ulti; en Kingteka, las teclas 1, 2 y 3 cambian de arma cuando está desbloqueada y no activan objetos de Dota. En móvil se arrastra el dedo y se usa el botón del portal o el icono de Blink.

Al subir de nivel aparecen tres cartas boca abajo. Revela las tres con un clic para comparar poderes, rangos, rareza y cambios de atributos; recién entonces puedes escoger una. La rareza cambia la probabilidad de que una mejora salga y su marco visual, pero no multiplica su efecto: el poder depende de la mejora descrita y del rango. Los pactos también ocupan uno de los tres espacios. En teclado, 1–3 revela la carta correspondiente; después de revelar las tres, 1–3 selecciona.

En **Habilidades → Objetos de Dota** puedes consultar el catálogo de objetos, sus ilustraciones pixel art originales, efectos y ramas evolutivas antes de entrar a una partida. El catálogo, las cartas de subida de nivel y los espacios equipados muestran los iconos originales de los objetos de Dota 2 desde el CDN oficial de Valve, con ilustraciones pixel art propias como respaldo si el recurso externo no carga. En partida, el inventario ocupa la parte superior derecha debajo de avisos y rendimiento para no chocar con la ulti ni el minimapa. Botas y Magic Stick mantienen sus efectos pasivos/automáticos. Blink Dagger y sus evoluciones son el único espacio activo: usa **E** o haz clic en su icono para teletransportarte en la dirección del cursor. Si juegas solo con teclado, salta en la dirección en que te mueves; sin movimiento, usa tu último apuntado. El salto se acorta para evitar obstáculos y no consume la recarga si no encuentra una ruta libre. El anillo gris muestra la recarga de 18 s; Swift Blink, Arcane Blink y Overwhelming Blink conservan sus variantes y recargas. `E` prioriza una esquiva perfecta si su aviso está activo; al equipar un objeto activo, el portal cercano se abre con clic en el botón. **Q** sigue reservada a la ulti y **1–3** cambian el arma de Kingteka. Las evoluciones sustituyen el objeto base en su espacio de equipo.

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
Común (madera, ●), raro (azul, ◆) y legendario (violeta/dorado, ★), con cuatro objetos mejorados por nivel. Las aperturas y el arte se distribu…11131 tokens truncated…proporciona un ranking verificado.

La activación del backend requiere el volumen persistente y la ruta `/api/` del juego; el formulario por sí solo no activa la base de datos. Consulta [cuentas, esquema, instalación, backup y límites de confianza](docs/ACCOUNTS.md). **Este repositorio se trata como público**: nunca subir claves, `.env`, bases de datos, usuarios o backups. Los datos reales viven fuera de la carpeta pública y de las releases.

La pantalla de entrada ofrece **Iniciar sesión**, **Crear cuenta** o **Jugar como invitado**. El acceso utiliza los paneles azules y botones dorados del juego. Registro y recuperación tienen formularios separados; elegir invitado conserva su guardado local.

### Combo del Causa · carga de ultis
Las ultis de Kingteka, Alberto, Cuy y Paloma requieren tres cartas automáticas: Caos, Aguante y Hazaña. Se completan en 45–52 s de combate; con la duración de la habilidad, el ciclo ronda 50–60 s. Q consume las tres y puedes guardarlas hasta necesitarlas. Las propias bajas, proyectiles tardíos y nubes de la ulti no recargan. Funciona contra un jefe solo y respeta pausa/cooperativo; práctica y laboratorio conservan recarga gratis. Consulta [reglas, mediciones y límites](docs/CAUSA_COMBO.md).

En el laboratorio, «Minions al morir» permite dejarlos normales, hacer que reaparezcan a los 0,8 s o volverlos inmortales con un mínimo de 1 PV. Estas reglas solo afectan minions comunes de la prueba; los jefes y objetivos especiales mantienen su funcionamiento.

El laboratorio de administrador incluye «Supervivencia · oleadas reales» para jugar con un personaje nivel 1 y su arma base, sin estrellas ni mejoras permanentes. El ascenso de nivel dentro de esa partida sigue habilitado. El perfil local permite volver a Base o configurar multiplicadores de vida, daño, velocidad, cadencia, imán, alcance y atributos físicos/especiales (×0,5 a ×10), con un botón de buff global ×2. La casilla «Aplicar también al modo de juego normal» activa ese perfil al iniciar desde Jugar, con oleadas y niveles habituales; la sesión no guarda récords ni premios permanentes. Los ajustes se guardan en el navegador, separados del progreso de cuenta.

**Mi perfil** muestra usuario, monedas, colección y estadísticas. Invitados nuevos comienzan con cuatro causas; el resto se desbloquea jugando. El rol administrador se concede únicamente desde el VPS a una cuenta existente, nunca durante el registro ni desde el navegador.



**Panel admin:** exclusivamente la cuenta `reysuperior` con rol admin puede consultar usuarios, entregar 1–100.000 monedas por operación y desbloquear personajes. Incluye búsqueda, paginación, confirmación e historial. No permite cambiar roles ni ver contraseñas.

Las entregas administrativas se reciben en vivo durante la sesión: monedas y personajes se suman al guardado local sin reemplazar la partida. Un aviso confirma la recepción. Al reconectar se recuperan entregas pendientes sin duplicarlas.

## Música de fondo opcional

En la cabecera, pulsa la flecha junto a **🔊** y elige **Original del juego**, **Tema 1**, **Tema 2**, **Alternar ambas** o **Sin música**. El mismo panel reúne los volúmenes de música, efectos y enemigos; tocar el altavoz silencia o reactiva todo. Las dos pistas aportadas por el usuario se reproducen en bucle; el volumen y la selección se guardan en este navegador. Pausa, menú, pestaña oculta y pérdida de foco detienen su reproducción y conservan la posición para continuar.

Las pistas WebM/Opus se solicitan únicamente al reproducir la opción elegida: no forman parte de la descarga inicial. Un solo reproductor sustituye a la melodía sintetizada, conservando efectos y ambiente. Si falla la carga, se recupera la música original.


Las pistas WebM/Opus se solicitan únicamente al reproducir la opción elegida: no forman parte de la descarga inicial. Un reproductor en modo individual y hasta dos al alternar sustituyen a la melodía sintetizada, conservando efectos y ambiente. Si falla la carga, se recupera la música original.

**Alternar ambas es la opción predeterminada** cuando no existe una preferencia musical guardada. Se conserva cualquier elección anterior (incluida Sin música) y el silencio general. La música comienza al entrar en la partida tras un gesto del usuario, sin autoplay al cargar la página.

**Alternar ambas:** reproduce Tema 1 → Tema 2 → Tema 1 con un fundido cruzado de tres segundos. La siguiente pista se prepara en los últimos doce segundos; ambas se pausan y reanudan juntas, conservando el avance de la transición. Si falla la siguiente pista, continúa la actual. La elección se guarda en este navegador.

La música continúa durante la apertura de cofres, las recompensas y la elección de mejoras al subir de nivel. La pausa manual, el menú, el silencio general y ocultar o desenfocar la ventana sí la detienen. El selector y el volumen de enemigos permanecen anclados dentro de la pantalla durante la partida, también en móvil.


En Música ♫ puedes ajustar Música y Efectos por separado. Efectos controla ataques, impactos, avisos y voces de enemigos (que conservan su ajuste adicional propio); no cambia la música. Su nivel inicial es 70 %, se guarda en este navegador y el silencio general mantiene prioridad. El panel se adapta a pantallas estrechas y permite desplazamiento vertical al usarlo en horizontal con poca altura.

### Atributos y defensas de combate

Fuerza → Técnica → Ingenio → Fuerza: ventaja +15% de daño, desventaja −10%; mismo atributo es neutral. Personajes, minions, minijefes y jefes tienen ficha de combate. La selección muestra el atributo, el tipo principal y los índices de ataque y defensa física/especial. Los actores llevan una insignia F/T/I y los minijefes muestran el atributo junto a su nombre.

El daño existente de cada habilidad se multiplica por `2 × ataque / (ataque + defensa)` y por la ventaja de atributo. 100 contra 100 conserva el daño neutral; 100 contra 200 deja el 66,7%. El índice principal de cada personaje es 100 y el secundario 85; la rareza no cambia esos índices base, pero multiplica la ganancia de las mejoras permanentes y estrellas en individual.

Los proyectiles conservan dueño y tipo al crearse, también en cooperativo. Contactos y golpes son físicos; ondas, nubes y tarjetas de apoyo son especiales. Cuy y Paloma usan daño físico en sus estampidas aunque su ataque principal pueda ser especial. Las ejecuciones y la sentencia porcentual conservan su daño fijo y sus límites. Véase [auditoría de atributos](docs/ATTRIBUTES_BALANCE.md).

### Oleadas con presión desde el primer minuto

Los tres atributos aparecen desde el inicio. Hay ocho segundos sin ataques especiales para orientarse; después entran ataques avisados y empujes de doce segundos dentro de ciclos de treinta. El HUD distingue EMPUJE y RESPIRO. Los corredores se acercan más rápido, pero tienen 15% menos vida base; la infantería también avanza más y los minijefes conservan acompañantes moderados.

Las apariciones se sitúan fuera de la cámara, con margen de 90 u y separación mínima de 230 u; en cooperativo se consideran ambas cámaras. Se evitan obstáculos sólidos, con un máximo de ocho intentos y una aparición por tick, sin recuperar de golpe los spawns de una pausa. No se aumentan el máximo de 80 enemigos ni los límites de 40 peligros/8 atacantes normales; los minijefes conservan su presupuesto propio. No se añaden partículas o recursos gráficos.

Para evitar que la densidad regale niveles, los minions de oleada dan 0,75 de fama, los corredores 0,5 y los pesados 2,25; las cantidades son cuartos exactos. Minijefes, cofres y recompensas especiales mantienen sus reglas. Vida y velocidad base siguen definidas por personaje y rol; la rareza afecta solo cuánto crecen mediante estrellas y mejoras permanentes en individual.

Comparación y límites de las pruebas en [WAVE_PRESSURE.md](docs/WAVE_PRESSURE.md).

Las criaturas de las ultis de Cuy y Paloma tienen una retirada visual de 1,6 segundos: los cuyes siguen corriendo y las palomas ascienden y planean, con desvanecimiento al final. La retirada no prolonga el daño ni la coraza; conserva posiciones del mundo en cooperativo y no se corta al recargar la ulti.
El panorama exterior del Gallinazo conserva ahora el original de 1536 × 1024, con filtrado al escalar y una sola capa ajustada a la cámara. Se elimina la copia ampliada a 6400 unidades que producía bloques enormes. La azotea jugable, los personajes, las colisiones y las animaciones mantienen su dibujo y escala.

### Cristorata: ¿Qué dragón es ese?
Tarjeta diagonal izquierda de 40 % × 82 % durante 1,3 s, con retrato propio. Después de la tarjeta, la revelación ocupa toda la pantalla durante 4,2 s con combate y reloj pausados (también en cooperativo). La máquina cae con rebote, sus tres rodillos frenan uno a uno y revelan una de tres variantes originales del dragón; Cristorata aparece de espaldas con la mano en la cabeza. El dragón sale de la pantalla y enlaza con la montura en el mapa. Al regresar monta ocho segundos, gana 60 % de velocidad y atraviesa obstáculos conservando límites de arenas. Cada dragón ataca y se anima de forma distinta: Jade expulsa bocanadas verdes y aplica veneno de 1,5 s sin apilar; Brasa usa una llama continua que crece hasta ×2 al mantener el objetivo tres segundos; Trueno carga chispas y encadena rayos entre hasta tres enemigos. La reacción «¿QUÉ DRAGÓN ES ESE?» aparece en un globo sobre Cristorata durante 1,2 s antes de salir el dragón.

En el laboratorio de administrador, el selector Dragón de Cristorata permite Aleatorio, Jade, Brasa, Trueno o Tricéfalo secreto. La elección se aplica a la próxima ulti: Recargar dragón → Lanzar ulti. Está deshabilitada durante una ulti y no altera el sorteo de partidas normales/cooperativas.

La máquina conserva su color rojo al caer. Solo con el secreto, los tres golpes convierten el marco en oro por franjas ascendentes, manteniendo pantalla, metal y contornos. La caída añade sombra creciente, sacudida breve, polvo lateral, piedritas y grietas visuales; el dorado aporta luz cálida al piso y a Cristorata y el despliegue de alas aparta otra nube de polvo.

La revelación secreta dura 6,4 s después de la tarjeta: avería y silencio breve, tres impactos, cabezas que salen una por una, ruptura con fragmentos, plano grande y despegue hacia la cámara. El combate permanece pausado y los ocho segundos de montura empiezan al terminar.

El Tricéfalo del Caos tiene un 5 % de probabilidad (el 95 % restante se reparte entre los tres dragones normales). Sprite original de tres cabezas, rodillos verde/rojo/azul, grieta, chispas y tres rugidos sintetizados; Cristorata reacciona con ambas manos en la cabeza y el globo ¡¿QUÉ DRAGÓN ES ESEEE?!. Alterna veneno, fuego y rayos y los combina cada ocho pulsos de ataque (dos segundos), conservando ocho segundos de montura.



## Cooperativo con amigos
Inicia sesión, abre Cooperativo y agrega a tu amigo por su nombre exacto de usuario. Debe aceptar la solicitud. Invitar crea una sala si hace falta; el destinatario acepta desde Invitaciones para jugar o el aviso del vestíbulo. Cada uno elige un causa desbloqueado, el anfitrión elige mapa y ambos pulsan Estoy listo. Al cargar sus sprites, el anfitrión puede comenzar. Cambiar mapa/personaje o desconectarse borra los listos. Invitaciones válidas durante un minuto. Como invitado se mantiene la entrada por código; no se necesita compartir un enlace.

La revelación secreta encadena un falso resultado Jade, un último giro, vapor y un seguro que salta al dorarse la máquina. Los ojos preceden a cada cabeza con desplazamientos propios; Cristorata retrocede y extiende el brazo durante su frase. El dragón se inclina para la subida y el aleteo final levanta polvo. Todo deriva de la edad autoritativa de la ulti, conserva los 6,4 s y la pausa compartida; movimiento reducido omite sacudidas, vapor y ráfagas. No añade daño ni entidades.


### Fluidez y diagnóstico cooperativo
El servidor envía posiciones cada 40 ms (25 Hz). El cliente interpola aliados y enemigos y anticipa visualmente su movimiento con reconciliación y colisión local; daño y posición real siguen siendo del servidor. Los cambios de dirección se envían al siguiente frame. El panel de rendimiento distingue FPS, ping RED, coste de tick del servidor y frecuencia de snapshots. El ping depende de la conexión y distancia al VPS.

### Evento para dos y relevo de anfitrión
**Dos puestos, una causa** se desbloquea a los 45 s de mapa en los tres escenarios. Los indicadores A/B del borde guían a los puestos fuera de cámara. Acérquense a los puestos A/B y pulsen **F** o el botón para empezar. Cada jugador ocupa uno distinto: acumulen 15 s de defensa simultánea antes de que pasen 45 s. Salir del radio detiene el progreso; fallar permite reintentar tras 20 s. Completar da **35 monedas de equipo y 20% de curación a ambos**, una sola vez por partida. Arenas, elecciones y desconexiones no consumen el reloj del evento.

Entre partidas, si el anfitrión sale, el compañero conserva **la misma sala, código, mapa y personaje**, pasa a ser anfitrión y puede invitar a otro amigo. Ambos deben volver a marcar Estoy listo. También se conserva la sala si el anfitrión desconectado no vuelve durante los 30 s de espera en el vestíbulo. Durante una partida en curso, salir mantiene el cierre de grupo existente.

### Rescate, amigos y remate compartido
**Jugar con amigos** está disponible desde las pantallas del menú y el perfil. La lista muestra conectados y permite **Unirme a su sala** solo cuando un amigo aceptado tiene una plaza libre. Se conservan invitaciones y códigos.
En combate, la flecha señala al compañero caído, el círculo muestra la reanimación real de cuatro segundos y se avisa si hay enemigos cerca. Una desconexión muestra nombre y segundos restantes del plazo existente de 30 s.
El **combo del equipo** gana 5% al alternar impactos efectivos entre ambos dentro de 3 s (máximo un impacto válido por jugador cada 0,45 s). Al 100%, ambos vivos y separados como máximo 420 unidades confirman con **R** o el botón en un plazo de 3 s: onda de radio 450, 120 de daño ordinario, contra jefes como máximo 4% de vida máxima y 120 de daño. Respeta coberturas. Recarga de 20 s sin generar carga; la revancha reinicia la barra. Es una primera versión para equilibrar con partidas reales.

### Revancha cooperativa
Al terminar una partida, ambos pulsan **Volver juntos a la sala**. El grupo, código y anfitrión se conservan; pueden cambiar personajes y mapa y deben confirmar **Estoy listo** de nuevo. Una sola confirmación espera al compañero sin cerrar su resultado. **Salir del grupo** termina la sesión compartida. La actualización pendiente del juego se aplaza mientras regresan juntos.


El despegue del Tricéfalo tiene carga de peso, aletazo descendente y recuperación con poses completas del atlas. La montura se inclina alrededor de la silla con Cristorata agarrado; la elevación espera al impulso y el polvo permanece en el suelo. No recorta ni estira alas o manos, respeta movimiento reducido y mantiene la duración y el combate.


El vuelo del Tricéfalo usa 16 pasos de aleteo y 12 pasos de despegue cacheados, derivados del atlas con muestreo sin suavizado. Una malla continua mantiene la raíz del ala y el agarre, repliega las patas hacia el vientre y transmite un movimiento leve al jinete. El ciclo comparte fase entre cinemática y combate; hasta 28 superficies por atlas, sin recalcular la malla cada cuadro. Movimiento reducido conserva una pose quieta y no cambia el combate.

Corrección visual de Cristorata: las poses completas del atlas cristorata-reaction-v2 sustituyen los recortes de brazos y piernas. El dibujo conserva sus proporciones al señalar y subir; el Tricéfalo aparece completo sin cortes horizontales. Véase docs/CRISTORATA_REACTION_ART.md para origen y prompt.

Cristorata usa doce poses completas del atlas reaction-v3 para señalar, girar, elevar la rodilla y sentarse. La escala común y el anclaje de cabeza evitan saltos de tamaño y posición. Reacción y subida comparten la misma selección de cuadro y una inclinación continua; sin fundidos o siluetas dobles. Documentación de arte: docs/CRISTORATA_REACTION_ART.md.

El cierre del asiento converge al anclaje y ancho de cabeza del jinete de la montura, compartiendo el mismo cálculo para posición y escala. La sala de revelación añade suelo en perspectiva, paneles con pliegues, luces laterales, reflejo cálido localizado y hasta 18 motas ambientales; todo procede del reloj de la escena, sin entidades de combate. Movimiento reducido retira las motas y se conserva el alfa de la transición al mapa.

La revelación del dragón incorpora un reflector cenital sobre la máquina. El aletazo mueve pliegues de cortinas y lámparas colgantes con amortiguación y desplaza una ráfaga de polvo por el suelo. En cooperativo aparece el personaje real del compañero, con pequeños saltos y celebración al revelar el dragón (más marcada con el secreto). Todo es visual, deriva de la edad de la ulti y no mueve ni modifica jugadores. Movimiento reducido conserva iluminación y texto, sin saltos o sacudidas.

El compañero celebra el dragón secreto con una silueta completa de brazos levantados y cara alegre; cuy y paloma usan patitas o alas. El atlas cubre los 21 personajes y conserva escala corporal y anclaje de pies, sin estirar miembros. El salto se reduce para destacar el gesto. Arte y prompt: docs/COMPANION_CHEER_ART.md.

Sideral: al cargar su atlas se conserva la figura conectada principal de cada cuadro y se eliminan fragmentos aislados de cuadros vecinos, incluida la onda roja que invadía la recuperación. La limpieza se hace una sola vez, mantiene la cuadrícula, tamaño y anclaje originales y conserva la lata roja unida a la mano.

Sideral: ataque visual de preparación, grito y recuperación con retroceso continuo; figuras completas, altura visible normalizada y pies anclados. Se omite el cuadro de susto. No cambia el daño ni la cadencia.

Kingteka: durante 8 s los minions normales se convierten en gallinazos, reciben ×2 de daño del equipo, pierden ataques y contacto, y se abalanzan con zigzag hacia Kingteka en grupos alrededor de él. Al volver se detienen y muestran «¡VUELVE!» durante 0,6 s sin atacar. Jefes y minijefes conservan forma y ataques; reciben ×1,2 de daño. Cofres imitadores quedan excluidos.

Las cartas de nivel se aplazan durante las presentaciones de ultis y las escenas de dominio; la experiencia permanece acumulada. Sideral permite elegir durante el combate de su habitación, después de la entrada y antes de la salida. Individual y cooperativo comparten el bloqueo; los niveles pendientes se entregan en orden al volver al combate.

Las cinemáticas a pantalla completa ocultan todas las capas DOM del HUD (vida, minijefes, inventario, combos, rendimiento y controles). El bucle sincroniza cinematic-only antes de renderizar; se restaura al volver al combate, pausar o salir. El combate interactivo de los dominios conserva sus controles.

## Chamelín Trovo · El baño de Trovo
UR de control de zonas. Sus emojis dejan charcos de 4 s sin acumular daño al solaparse. R abre un baño físico: entrada de 2,6 s con ocho gestos completos, 8 s de combate jugable para ambos compañeros y enemigos, y mordida protegida de 0,6 s. Solo entrada y mordida protegen; durante el combate se conservan movimiento, ataques, daño y avisos de jefes. El chorro sigue el giro con retardo, respeta paredes y aplica defensa −20 % y velocidad −25 %. El compañero dispara su arma normal y aprovecha el debuff. La mordida conserva instakill normal, ×3 a minijefes y ×1,90 a jefes. Regreso a posiciones originales y 2 s de vapor/gotas visuales sin daño. Prueba admin /?practice=chamelin con recarga; Invencible es opcional dentro del baño.

Sideral: los aterrizajes del retroceso sacuden brevemente la cámara (último salto más fuerte), seguidos por un temblor leve de risa. Desplazamientos enteros sin reescalar sprites; movimiento reducido desactiva todo temblor. El dominio ofrece 8 s para auxiliar o saquear: jefes/minijefes están inmóviles e inmunes, con reacción pixel art de asco. Al terminar ambos jugadores vivos conservan al menos 0,8 s de protección. No puede iniciarse sobre otra cinemática a pantalla completa.

## Modos de partida

- **Partida rápida:** conserva el recorrido original de 5 minutos, un portal opcional y ElZeein al final.
- **Supervivencia del Caos:** recorrido individual de 30 minutos en el mapa elegido, dividido en seis etapas de cinco minutos: Calma sospechosa, Primer desorden, El mapa responde, Crisis nacional, Caos desatado y Preludio de ElZeein.
- En Supervivencia aparecen minijefes cada 4–6 minutos y tres ventanas de portal. El reloj se pausa dentro de cada arena y ElZeein aparece al minuto 30.
- Cada etapa puede añadir un solo obstáculo destructible y seguro: ramas en Campo de Marte, barricadas en Plaza de Armas y derrumbes pequeños en Machu Picchu.
- Las seis etapas cambian el tono del terreno con una transición breve; al vencer a un jefe de portal, el mapa responde con otro pulso visual. El escenario elegido no cambia de forma arbitraria.
- La luz recorre día, atardecer, anochecer y noche durante los 30 minutos (los cambios principales llegan aproximadamente en 9, 18 y 27 min). Garúa/reflejos de Plaza y niebla de Machu vuelven por ciclos; los efectos respetan movimiento reducido.
- Desde 2:45 aparece un minievento opcional aproximadamente cada 2:45 (la apertura se aplaza si coincide con un jefe, portal, tienda o evento de emoliente). Solo hay uno activo: meteoritos, picnic y cometas en Campo; garúa, palomas y faroles en Plaza; cóndor, viento y terrazas en Machu. Cada evento avisa 7 s, dura 45 s y permite recoger tres señales para ganar hasta 25 monedas; no causa daño ni cambia colisiones.
- A los 12 minutos se ofrece una sola vez un minijuego opcional por mapa: cinco señales en 60 s y hasta 50 monedas. Se pausa durante jefes y portales; si coincide, aparece cuando se despeja la actividad principal.
- Los eventos dibujan como máximo cinco señales y un marcador en el terreno, sin crear enemigos, partículas persistentes ni índices de colisión. El reloj y los efectos se congelan durante portales; se conservan señales y progreso.
- Cooperativo y las pruebas de desarrollo permanecen temporalmente en Partida rápida para conservar el protocolo autoritativo actual.

El HUD superior agrupa nombre, nivel, XP y vida en una sola tarjeta izquierda; tiempo, rivales y etapa ocupan el centro. El contador de ElZeein aparece al comenzar cada etapa y durante el último minuto, sin repetir nivel o experiencia. Los portales no publican su horario exacto: diez segundos antes anuncian una anomalía y, al abrir, una flecha de borde señala dirección y distancia hasta acercarse. El jefe se revela al cruzar y recibe una barra superior propia con nombre, fase, PV reales y aviso de reloj pausado. En móvil el panel de audio se abre como una bandeja inferior y los controles conservan áreas táctiles separadas.

Chamelín: sello encadenado con pausa y pisotón, giro con arrastre visual, chorro de pulsos/gotas y salpicaduras, tuberías y charcos animados. Al cerrar la boca las baldosas se desprenden y revelan el mapa original; quedan huellas y vapor 2 s sin daño extra. Se conservan el baño jugable, las duraciones y protección solo de entrada/mordida; respeta movimiento reducido.

Las cartas de todos los objetos Dota muestran su imagen original grande como arte principal, igual que el catálogo y el inventario. No usan una reinterpretación generada ni el fondo de personaje con franjas. Se conserva el respaldo local si falla la imagen remota.
