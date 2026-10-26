# Documento de diseño — PERUSURVIVOR

## Identidad y objetivo
Título visible: Causas del Caos. Supervivencia de acción en vista superior con humor y referencias peruanas. El jugador controla el movimiento y esquiva rivales mientras su personaje ataca automáticamente. La meta es crecer durante la partida y derrotar al jefe final ElZeein.

Este documento describe la implementación existente. La reorganización de carpetas no modifica sus reglas ni agrega mecánicas.

## Bucle de juego
1. Elegir uno de catorce personajes y uno de tres mapas.
2. Moverse y combatir oleadas; recoger puntos de fama.
3. Al subir de nivel, elegir una de tres mejoras.
4. Desde 3:00 del reloj del mapa, entrar opcionalmente a su portal.
5. A los 5:00 del reloj del mapa, enfrentarse a ElZeein.
6. Tras victoria o derrota, repetir o cambiar personaje.

## Controles y estados
- WASD / flechas: movimiento normalizado, sin ventaja diagonal.
- Ratón o dedo sobre el escenario: control virtual de movimiento.
- Esc / botón de pausa: pausa.
- E / botón táctil: interacción con un portal cercano.
- La pérdida de foco pausa una partida activa.
- Estados: menú, partida, pausa, mejora, confirmación del portal, recompensa y final.

## Selección y ataques
| Personaje | Habilidad |
|---|---|
| Cristorata | Micrófono bumerán |
| Cuy Supremo | Onda expansiva con empuje |
| Paloma del Centro | Abanico de cinco plumas |
| Alan García | Discurso en cono |
| Alberto Fujimori | Tres bandas orbitales |
| Keiko Fujimori | Abanico naranja de ida y vuelta |
| Ollanta Humala | Ondas de megáfono |
| Kingteka | Abanico de controles |
| Shakadoto | Onda de grito |
| Najasor | Abanico de teléfonos |
| CiriloTV | Micrófono bumerán |
| Fuzo | Teclado giratorio |
| Charles | Megáfono azul |
| Axel Benba | Abanico de clips |

Cada personaje tiene vida, velocidad, daño y cadencia propios. Los valores exactos permanecen en src/data/catalog.js para evitar dos fuentes de balance. Los cinco comportamientos reutilizables son abanico de proyectiles, bumerán, nova, cono y órbita.

## Rivales y dificultad
Las apariciones alternan Pablo, Tyrone, Uniqua, Tasha, Austin y policías ficticios de la PNP. Los rivales normales persiguen al jugador y dañan por contacto; las variantes pesadas tienen mayor resistencia. La frecuencia y dificultad aumentan con el tiempo. El límite base es de 80 enemigos normales; el jefe puede añadirse al alcanzar su momento.

ElZeein es un jefe ficticio de parodia: persigue al jugador y lanza ráfagas de cinco proyectiles. Vencerlo termina la partida en victoria. Llegar a cero de vida termina en derrota.

## Progresión durante la partida
La fama recogida llena la barra de experiencia. El primer umbral es 6; los siguientes crecen según la fórmula existente en progression.js. Cada nivel ofrece tres mejoras distintas del catálogo:
- +25% de daño.
- Cadencia un 18% más frecuente, con límite inferior.
- +25 de vida máxima y recuperación de hasta 40.
- +15% de velocidad.
- +50% de radio para recoger fama.
- +20% de alcance de habilidad.

Las mejoras de combate pertenecen a esa partida. No hay árbol permanente de mejoras, economía ni tienda implementados.

## Escenarios y terreno
| Mapa | Aspecto | Encuentro opcional |
|---|---|---|
| Campo de Marte | Césped, senderos y monumento | La Combi Final |
| Plaza de Armas | Piedra, edificios coloniales y fuente | El Gabinete Infinito |
| Machu Picchu | Terrazas, ruinas y montañas | El Guardián de la Niebla |

Son entornos estilizados de exploración continua, no planos geográficos. El terreno del mapa principal se genera por sectores y no tiene un borde jugable. Cada mapa define una zona inicial y un punto de aparición. La Plaza de Armas conserva una fuente visible con colisión elíptica en el origen. La cámara sigue al personaje con zoom y suavizado; un minimapa muestra la orientación.

Árboles, bancas, jardineras, rocas y muros bloquean el paso. Las cajas tienen 55 de vida, bloquean proyectiles y al romperse dejan curación y fama. Los enemigos comparten una cuadrícula de navegación para rodear obstáculos. Los objetos se reinician con cada partida. Los sectores lejanos se descargan, pero las cajas destruidas se recuerdan durante la partida. Los rivales normales y objetos recogibles demasiado lejanos se retiran para mantener la simulación acotada; los jefes no se eliminan.

## Portales
A los 180 segundos del reloj del mapa se abre un portal opcional. El jugador debe acercarse a su posición; el alcance de interacción es 105 unidades. Puede declinar la entrada y volver después.

Entrar conserva los enemigos, recursos y punto de retorno del mapa. Se activa una arena cerrada sin terreno normal. El reloj del mapa y las oleadas normales se detienen; la animación y el tiempo total de la partida continúan.

- La Combi Final avisa antes de embestir.
- El Gabinete Infinito avisa antes de lanzar un abanico de proyectiles.
- El Guardián de la Niebla avisa antes de lanzar anillos.

Al ganar, se restaura el mapa y se otorgan dos segundos de invulnerabilidad. La recompensa es única y permite elegir +30% de daño, +40 de vida máxima con curación completa, o ataques un 25% más frecuentes. Perder termina la partida. El portal cierra cuando aparece ElZeein; ignorarlo no evita el jefe final.

## Presentación
Los personajes usan cuatro poses: reposo, dos pasos y ataque. El motor invierte horizontalmente según dirección; no hay ocho direcciones independientes. Los rivales usan dos pasos. Las hojas conservan transparencia y se dibujan sin suavizado. Los efectos incluyen estelas, ondas, impactos y números de daño.

## Persistencia y alcance
Solo el récord local del navegador es persistente. No hay inicio de sesión, servidor de partidas, ranking en línea, audio, pagos ni multijugador. Esas posibilidades quedan fuera del alcance actual y necesitan una decisión de diseño antes de implementarse.

## Arenas independientes y arte de jefes
Los portales ahora seleccionan una escena completa distinta del mapa de origen: Terminal del Último Viaje, Salón del Gabinete Infinito o Santuario de la Niebla. Cada escena tiene fondo propio y límites de suelo jugable; no se dibuja el mapa original ni sus obstáculos o minimapa mientras dura el encuentro. Al vencer se restaura la escena original y la cámara del jugador.
Los tres jefes usan un atlas pixel art transparente de seis columnas por tres filas: reposo, dos poses de movimiento, preparación, ataque y recuperación. La pose de ataque sigue la fase real del patrón, y la recuperación tiene una ventana de 0,55–0,6 s. Las marcas de peligro y los ataques originales siguen activos. Los PNG no incluyen HUD ni personajes del escenario.
## Extensión del mundo
El suelo del combate usa texturas extraídas de los fondos originales y caminos continuos; no se repite la ilustración completa del lugar. Cada sector de 512 unidades recibe obstáculos deterministas según el mapa y sus coordenadas, también en coordenadas negativas. La zona inicial mantiene sus obstáculos diseñados y el portal opcional conserva su posición. Solo las arenas de los portales permanecen cerradas. El minimapa muestra el entorno local, no un rectángulo que represente el mundo entero.

## Cajas, cofres y objetos
- Las cajas tienen 55 de vida y se pueden atacar incluso sin enemigos cercanos. Al romperse dejan curación de 18 puntos y 3 de fama; además tienen un 70% de probabilidad de dejar 5 monedas. Una caja rota no vuelve a dar botín.
- Los cofres se distribuyen aleatoriamente por sectores durante la exploración. Se abren al permanecer quieto a menos de 75 unidades durante 1,8 segundos. Alejarse o moverse reinicia la apertura; las pantallas de pausa o selección detienen el progreso.
- Un cofre común revela un objeto y ofrece usarlo/equiparlo o conservar lo que llevas. Solo se equipa un accesorio; el reemplazo retira el efecto anterior y conserva las mejoras de nivel.
- Emoliente: curación instantánea del 35% de vida máxima, sin superar el máximo. No ocupa el hueco de equipo.
- Imán: +60% de radio de recogida. Chaleco: -20% de daño recibido por contacto, jefes y proyectiles. Batería externa: -15% de recarga entre ataques.
- Al vencer al jefe del portal, se vuelve al mapa y aparece un único cofre dorado. Al abrirlo se elige la recompensa especial del jefe. El premio ya no aparece de forma inmediata al vencer. El reloj del mapa continúa hasta detenerse en la pantalla de elección.
- La fama, monedas, equipo, estado de cajas y cofres pertenecen a la partida; se reinician al comenzar otra. Esta versión no incluye una tienda ni guardado permanente de monedas.
- El HUD muestra monedas, objeto equipado e icono, y avisos breves de recogida. Los cofres abiertos permanecen visibles, pero vacíos. No hay cofres ni obstáculos del mapa de origen dentro de la arena del portal.


## Poderes de personajes · primera versión
Se añaden Cerdito VTuber, Sustento, Cevichero y La G5 (18 personajes en total), y se actualizan los poderes de Kingteka, Ñajasor, Charles, Shakadoto y Fuzo.
- Kingteka: cinco balas por descarga de escopeta arcade. Cerdito VTuber comparte el arma con siete balas y más dispersión.
- Ñajasor: tres pescados por descarga y texto CPEZ en cada disparo.
- Sustento: rifle automático de cucarachas con movimiento zigzag. Cevichero, con disfraz azul, lanza pares de cucarachas marrones a menor cadencia.
- Charles: lanzador con bebé de juguete y pañales caricaturescos; el impacto deja una nube de daño de 2,5 segundos.
- Shakadoto: dos plátanos bumerán. Fuzo: tarjetas BCP que atraviesan hasta tres rivales cada una.
- La G5: melee, patada alta y barrido total de 145° (±72,5° respecto a la dirección del ataque), alcance base 118 y empuje. Espera a tener un rival cerca; no crea proyectiles.
Las armas son automáticas y eligen al rival más cercano. Los poderes tienen daño, cadencia y alcance propios; la mejora Uno más para el combo agrega un proyectil, o daño para ataques de área. Las nubes se eliminan al cambiar de arena o reiniciar.
Las apariencias animales y los disfraces son caricaturas de fantasía, y La G5 es un avatar adulto original. Charles conserva los rasgos de su referencia sin estereotipos étnicos o religiosos.

## Identidad visual de los mapas
Cada tema utiliza una hoja propia de objetos pixel art: árboles y mobiliario de parque en Campo de Marte, palmeras y mobiliario colonial en Plaza de Armas, roca y muros incas en Machu Picchu. Un monumento, una fachada colonial y una ruina de terrazas se sitúan en las respectivas zonas iniciales como referencias visibles. La fuente de Plaza de Armas usa un sprite con el mismo volumen de colisión elíptica. Los caminos y el suelo usan seis texturas dedicadas y conservan la extensión por sectores. Las colisiones se aplican a la base del objeto, no a toda su silueta. La vegetación decorativa de Machu Picchu no bloquea el paso.
## Laboratorio de jefes (desarrollo)
El menú ofrece Desarrollo · Probar jefes, con selector de los tres jefes de mapa o ElZeein. Usa el personaje seleccionado y entra de inmediato en el encuentro. La invencibilidad es opcional y está activada por defecto. Los controles permiten reiniciar, cambiar de jefe, curar y salir. No aparecen oleadas normales, no se otorgan recompensas de progresión y nunca se escribe el récord. Reiniciar una partida normal desactiva el estado devRun. Es una herramienta de desarrollo del producto solicitada expresamente; no es el servidor o los controles locales de QA.

## Ulti de Kingteka
Q o botón táctil, carga de 5% por rival derrotado (20 rivales). Ocho segundos: gallinazos visuales en enemigos normales presentes y nuevos, velocidad ×1,5 y cadencia ×2. Jefes conservan su forma. Al acabar cae DENUNCIA durante 2,6 segundos, sin daño ni bloqueo. Pausas congelan el efecto; reiniciar o cambiar personaje en QA limpia su estado.

La ulti usa globo explosivo de cómic, flash amarillo y sacudida breve (respeta movimiento reducido), humo/plumas al transformar incluso nuevos rivales, sombras y aleteo, siluetas y polvo, balas doradas y casquillos, cuenta 3-2-1 y expediente con PAM y sello DENUNCIADO. Los gallinazos reciben ×2 daño; los jefes quedan excluidos.

El disparo de ulti tiene retroceso visual sin mover la colisión, impactos radiales dorados y flash del gallinazo. El expediente aterriza a los 0,7 s; a los 0,95 s el sello cae ampliado y se comprime con PAM y partículas rojas, sin bloquear movimiento.

Audio de Kingteka: aleteo al activar y transformar nuevos rivales (agrupado para evitar saturación), escopeta grave durante ulti y golpe sincronizado con sello. Botón de silenciar; audio desbloqueado con interacción.

## Variedad al explorar
Cada región de 1536 unidades alterna entre zonas densas, áreas de descanso, corredores y claros. Campo de Marte combina arboledas y paseos circulares; Plaza de Armas añade plazoletas pavimentadas; Machu Picchu alterna pasos y terrazas. La red de caminos conecta nodos compartidos con desvíos y algunas diagonales. Los obstáculos respetan un margen libre alrededor de los caminos. La geometría y las cajas persisten al volver a una zona. Se conservan los atlas pixel art.

### Cámara y escala de las arenas
La cámara del terreno usa zoom base 1,45 y las arenas 1,05. Los sprites conservan su tamaño de mundo. Las arenas de jefe tienen suelo jugable de 1360 × 720 unidades, fondo de 1920 × 1280 y cámara que acompaña parcialmente al jugador. Los márgenes de la embestida se calculan desde los límites de la escena y el radio del jefe.
### Cobertura en arenas
Cada arena contiene cuatro obstáculos sólidos permanentes: barreras de concreto para la Combi, jardineras para el Gabinete y muros para el Guardián. Bloquean el movimiento y los proyectiles de ambos bandos. La Combi detiene su embestida al chocar; los otros jefes rodean la cobertura. Los ataques de área conservan su efecto. El centro y las rutas entre coberturas quedan abiertos.
## Estilo sencillo elegido
Se restaura el suelo original con textura y el dibujo geométrico de árboles, bancas y cajas. Los atlas detallados quedan guardados, desactivados mediante simpleStyle. Los hitos, faroles y vegetación usan formas simples. La red variada de caminos y las regiones mantienen sus reglas y colisiones.

## Campo de Marte vivo
Arbustos y matas de pasto decorativos aparecen fuera de caminos y obstáculos. El follaje oscila dos píxeles con fases distintas y siete hojas cruzan suavemente la vista, por debajo del combate. Los arbustos se ordenan por profundidad. No bloquean al jugador ni cambian el botín. El tiempo ambiental se pausa con la partida; la preferencia de movimiento reducido deja la vegetación estática y elimina las hojas.

### Jefes y arenas: estilo geométrico
La Combi, el Gabinete y el Guardián se dibujan mediante rectángulos en una retícula de 3 unidades, con contornos oscuros y paletas cortas. Conservan las fases de reposo, movimiento, aviso, ataque y recuperación. Las arenas usan suelos discretos, caminos claros y bordes simples; las coberturas conservan sus colisiones. Los PNG detallados anteriores permanecen archivados y no se usan en el dibujo del combate. Implementación en src/rendering/boss-art.js.
## Vida en Plaza y Machu Picchu
Plaza de Armas incorpora reflejos y gotas animadas en la fuente, palomas pequeñas que picotean y partículas de viento discretas. Machu Picchu añade matas de ichu que oscilan y tres franjas de niebla escalonada de muy baja opacidad, debajo de los actores. La decoración no bloquea ni daña. Conserva las formas geométricas del README, pausa y movimiento reducido (sin niebla ni partículas, vegetación y aves estáticas).

## Animación del botín
Al terminar los 1,8 segundos de apertura, el mundo se detiene durante 0,65 segundos para mostrar la tapa abriéndose en cuatro poses y destellos. Después aparece la elección del objeto; el premio solo se concede una vez. Las cajas muestran grietas tras recibir daño y una animación breve de tablas rotas al destruirse. Los iconos del HUD y del premio comparten el atlas de objetos.

## Rarezas de cofres
Los cofres comunes son de madera, los raros azules y los legendarios violetas/dorados. Se distribuyen por sectores según las reglas de exploración siguientes. Además del color se muestran símbolo y nombre. Cada cofre entrega solo objetos de su nivel. Emoliente cura 35/60/100% de vida máxima; imán aumenta alcance 60/100/160%; chaleco reduce daño 20/30/40%; batería reduce recarga 15/28/40%. Solo hay un accesorio equipado y reemplazarlo conserva mejoras de nivel. Los cofres de jefe siguen separados y mantienen su recompensa especial. Apertura animada y premio único en todas las rarezas.


## Audio
Música instrumental sintetizada original por mapa y tema de jefe. Efectos de ataques, impactos, daño, mejora y resultado. El botón Sonido activa o silencia todo y recuerda la elección. Solo arranca tras interacción; no suena en menú, pausa o pestaña oculta. No utiliza voces ni grabaciones de personas.

## Evento de emoliente
Campo de Marte tiene un puesto cerca de la zona inicial. Al acercarse a 150 unidades se ofrece una defensa opcional con botón, accesible también en móvil. Mantenerse a menos de 200 unidades durante 20 segundos otorga una sola vez 25 monedas y cura el 35% de vida máxima. Salir reinicia el progreso; cada 4 segundos dentro aparece un rival adicional respetando el límite global. Pausa, mejoras y portales suspenden el evento. El jefe final lo interrumpe. Reiniciar la partida reinicia el puesto. El puesto es decorativo, sin nuevas colisiones, y usa el dibujo simple del README.
## Cámara y coberturas detalladas
El zoom de combate escala con el ancho de escritorio: arenas 1,5 a 1280 px y 2,25 a 1920 px; terreno 1,7 y 2,55 respectivamente. En móvil se limita el acercamiento para conservar espacio de maniobra. La cámara de arena sigue al jugador en vertical y lo mantiene dentro del encuadre. Las cuatro coberturas conservan posición, tamaño de colisión y bloqueo de proyectiles; su atlas detallado distingue barreras, jardineras y muros incas.

## Cofres al explorar
Los cofres se distribuyen por sectores de 768 unidades con posiciones y una semilla nuevas por partida. Cada sector tiene un 60% de posibilidad de contener uno; el sector de inicio garantiza un común en posición aleatoria segura. Entre cofres fuera del inicio: común 72%, raro 26%, legendario 2%; los legendarios requieren estar a 1800 unidades del punto de aparición. Un sorteo legendario cercano se convierte en raro. Se generan al explorar y se conservan las aperturas al regresar, sin repetir premios. Se comprueban obstáculos, fuente y portal. Las arenas no generan cofres normales; el cofre de jefe conserva su recompensa.

Los personajes jugables animan brazos y pies según la distancia recorrida; se detienen al chocar. La PNP y los Tyrone pesados pueden disparar orbes de 8 de daño: avisan 0,7 s, apuntan a la posición inicial, disparan a 180 unidades/s y esperan 4,2 s. Alcance de activación 120–480, proyectil de 2,5 s, bloqueado por coberturas y máximo 40 proyectiles hostiles para iniciar disparos.

## Cooperativo privado (2 jugadores)
El menú conserva el inicio individual y añade Crear sala / Unirme por código de 8 caracteres. Cada persona elige su personaje antes de entrar; el anfitrión fija el mapa y comienza cuando hay exactamente dos conectados. Los 18 personajes conservan los ataques del catálogo y se puede elegir cualquiera de los tres mapas.
El servidor valida movimiento, ataques, enemigos, daño, cajas, fama y jefe final. La fama es compartida; cada nivel otorga a ambos +12% de daño y hasta 15 de curación, sin selector que interrumpa la sala. No hay fuego amigo. La distancia entre compañeros vivos se limita a 720 unidades. Un jugador caído revive con 50% de vida si el compañero permanece a 85 unidades durante 4 segundos. Si ambos caen, termina la partida. ElZeein aparece a los 5 minutos y su derrota gana para los dos.
El cooperativo incluye portales opcionales, cofres de equipo y el evento del emoliente; las reglas compartidas se describen abajo. Los récords cooperativos no se mezclan con los locales individuales. La desconexión detiene la simulación hasta 30 segundos para recuperar la misma sesión; recargar cierra la sesión local y exige crear otra sala. Las salas viven en memoria: una actualización del servidor las finaliza. Límite inicial de despliegue: 6 salas simultáneas; no implica capacidad garantizada sin pruebas de carga.
Las publicaciones nuevas se cargan automáticamente desde el menú. Una partida iniciada puede terminar sin interrupciones: aparece “Nueva versión disponible · Actualizar” y al volver al menú se recarga. El botón permite actualizar antes de terminar, reiniciando la partida.
## Coherencia cartoon pixel art
Los personajes definen el dibujo: objetos simples con contornos oscuros y sombras en pocos tonos. Árboles, mobiliario, arbustos, piedra y puesto comparten esos bordes. El menú usa el terreno sencillo del juego en lugar de la ilustración detallada. Se conservan animaciones, eventos, caminos y colisiones.

## Cofres en el minimapa
El minimapa muestra cofres sin abrir a un máximo de 900 unidades del jugador, con el mismo color de rareza: común arena, raro azul y legendario violeta. Los iconos tienen forma de cofre y una leyenda de colores. El cofre de jefe usa dorado. Los marcadores desaparecen al abrirse y no se dibujan dentro de arenas ni en el menú.


### Ataques propios de minions
Todos los ejemplares de cada tipo, pesados incluidos, comparten un ataque. Se detienen y anuncian su direccion o area; apuntan a la posicion inicial y respetan coberturas. Maximo 40 proyectiles especiales hostiles. La pausa congela preparacion y animaciones.

| Rival | Ataque y animacion | Aviso | Espera | Dano |
| --- | --- | --- | --- | --- |
| Pablo | Aleteo y abanico de tres cristales de hielo | 0,85 s | 5,8 s | 6/cristal |
| Tyrone | Se agacha y embiste 126 unidades en direccion fija; chocar lo detiene | 0,85 s | 5 s | 12/contacto durante embestida |
| Uniqua | Alza brazos y lanza dos estrellas divergentes | 0,65 s | 4,8 s | 6/estrella |
| Tasha | Se comprime, salta y pisa; circulo de radio 85, un golpe por onda | 1 s | 5,5 s | 12 |
| Austin | Salto y rayo violeta en zigzag | 0,75 s | 5 s | 7 |
| PNP | Apunta, retrocede y lanza tres pulsos separados 0,18 s | 0,7 s | 5 s | 8/pulso |

Sustituye el ataque a distancia provisional de solo PNP y Tyrone pesado. El contacto normal conserva 10 de dano y la invulnerabilidad existente evita golpes simultaneos.

## El Gallinazo del Caos
Jefe opcional alternativo de 1800 PV en Techos de Lima, disponible desde el portal de las 3:00 y en Desarrollo → Probar jefes. Elegirlo consume el encuentro opcional del mapa como los otros jefes; ElZeein sigue obligatorio al minuto 5. Alterna picada avisada de 1,05 s, abanico de 7 plumas (12 de daño) e invocación de hasta 3 gallinazos de 48 PV. Al bajar del 50 % encadena dos picadas con aviso separado, dispara 11 plumas y permite hasta 6 esbirros vivos (4 antes). Las coberturas frenan picadas y plumas. Se conservan pausas, recompensas, retorno y reloj de mapa congelado en la arena.
## Visibilidad de exploración
Zoom base de exploración 1,3 en 1280 px y mínimo móvil 0,95; aproximadamente 24% menos acercamiento que el anterior 1,7. Cámaras de jefes intactas. HUD compacto con vida, tiempo, nivel, botín y objetivos, sin repetir nombre y habilidad del personaje.

Las jardineras muestran maceta en perspectiva, arbustos escalonados y flores con pétalos y centro; la disposición alterna alturas y colores para evitar el aspecto de tablero. Conservan su volumen de colisión.
## Llaves de cofres
Los cofres raros y legendarios necesitan una llave de su mismo nivel. Sin ella, la apertura no progresa y se muestra el requisito; una llave no sustituye a la de otro nivel. Se consume exactamente una al iniciar la apertura animada. Los comunes y los de jefe no requieren llave. Los portadores raros aparecen desde el segundo 30 y tienen ×2,5 de vida; los legendarios desde el segundo 90 y tienen ×4. Son enemigos normales reforzados con aura y llave visibles, conservan sus patrones de ataque y dejan una llave garantizada al caer. No aparecen en arenas, laboratorio, pausa ni durante el jefe final, y no se acumulan dos vivos del mismo tipo. Las llaves se recogen del suelo, no dan fama y se cuentan en el HUD; se pierden al reiniciar la partida. La función está disponible en individual y cooperativo; en la sala, las llaves pertenecen al equipo y una apertura consume una llave para entregar una recompensa a cada jugador.

## Actividades compartidas en cooperativo
Los portales se desbloquean al minuto 3. Ambos jugadores vivos deben estar cerca y confirmar con E o el botón; volver a pulsar cancela, y alejarse elimina el voto. Los dos entran a la misma arena, con coberturas y ataques del jefe del mapa. Se detiene solo el reloj del mapa; al vencer, ambos vuelven a sus posiciones originales y aparece un cofre dorado. Cada jugador escoge individualmente daño, vida o cadencia. ElZeein sigue apareciendo al minuto 5 del mapa.
Los cofres se generan en el servidor para la zona de ambos jugadores. Cualquiera puede detenerse 1.8 s cerca para abrir; los raros y legendarios consumen una única llave del equipo. La sala pausa el combate durante la animación y las dos elecciones. Cada uno recibe una copia del objeto sorteado y puede equiparlo/beberlo o conservar lo que llevaba. Cada elección y cada cofre se reclaman una sola vez, incluso con mensajes repetidos.
El evento del emoliente sigue en Campo de Marte. Cualquiera puede iniciarlo cerca del puesto. Basta un jugador vivo dentro del círculo para avanzar la defensa; los dos pueden alternarse. Salir ambos reinicia el progreso. Completar 20 s entrega una sola vez 25 monedas de equipo y cura 35% de vida máxima a cada jugador vivo, sin repetir por volver al puesto. Los cofres y el evento conservan su estado durante un portal. Las actividades se detienen si falta la conexión de uno.
Los cofres raros y legendarios necesitan una llave de su mismo nivel. Sin ella, la apertura no progresa y se muestra el requisito; una llave no sustituye a la de otro nivel. Se consume exactamente una al iniciar la apertura animada. Los comunes y los de jefe no requieren llave. Los portadores raros aparecen desde el segundo 30 y tienen ×2,5 de vida; los legendarios desde el segundo 90 y tienen ×4. Son enemigos normales reforzados con aura y llave visibles, conservan sus patrones de ataque y dejan una llave garantizada al caer. No aparecen en arenas, laboratorio, pausa ni durante el jefe final, y no se acumulan dos vivos del mismo tipo. Las llaves se recogen del suelo, no dan fama y se cuentan en el HUD; se pierden al reiniciar la partida. La función corresponde a la partida individual, donde existen los cofres.
### Reacciones de minions y sprites integros
La caminata de personajes y minions alterna sus cuadros originales con balanceo suave del cuerpo entero, sin separar las extremidades. Al recibir dano, el cuerpo reacciona durante 0,22 s y muestra un acento visual propio. Las muertes duran aproximadamente un segundo, son cosmeticas y no demoran el botin ni dejan un enemigo activo.

| Rival | Al recibir dano | Al morir |
| --- | --- | --- |
| Pablo | Sacudida y cristales celestes | Se encoge y dispersa cristales |
| Tyrone | Se ladea y levanta polvo | Cae de lado en una nube de polvo |
| Uniqua | Rebote y destellos rosados | Giro suave y estrellas en espiral |
| Tasha | Compresion y aro dorado | Se aplasta y emite tres ondas |
| Austin | Pequeno salto y chispas violetas | Se estrecha y desaparece con aros violetas |
| PNP | Retroceso y chispas verdes | Se ladea y se desvanece con pulsos verdes |

Los ataques y las recompensas conservan sus reglas. Al pausar se congelan las reacciones y al reiniciar desaparecen.

Arbustos y follaje de jardineras comparten copas redondeadas con lóbulos asimétricos, contorno oscuro y hojas agrupadas. Se conservan posiciones, profundidad, viento y colisiones originales.
## Señales de llaves en el minimapa
El minimapa identifica portadores vivos con un rombo y llaves del suelo con un icono de llave, siempre en el color de su rareza (azul raro y violeta legendario). Comparte el alcance circular de 900 unidades de los cofres. No muestra portadores muertos ni llaves recogidas, eliminadas o lejanas. El marcador del jugador conserva la prioridad visual; hay leyenda de símbolos y colores. No se muestra en arenas o menús.

## Orientación a llaves
El indicador del HUD elige por distancia entre portadores vivos y llaves no recogidas; en un empate exacto prefiere la llave. Muestra tipo, rareza, flecha en ocho direcciones y distancia redondeada en las mismas unidades que la exploración. No limita la búsqueda a las 900 unidades del minimapa. Al recoger la llave o morir el portador se recalcula con los objetivos restantes. No se muestra sin objetivos, en menú/final, arenas o laboratorio. En pausa conserva la orientación congelada.


## Contador y prueba de rendimiento
En Desarrollo se puede activar el contador de FPS para las partidas y elegir una carga de 80 minions/200 proyectiles, 80/400 o 160/600. La prueba usa el escenario y personaje seleccionados, permite movimiento y pausa, mantiene ataques y animaciones, da invulnerabilidad y repone la carga. No guarda récords ni activa cofres o eventos opcionales. Tras 3 segundos de preparación mide 30 segundos visibles, con salida anticipada y resumen de FPS medios, ms por fotograma y P95. P95 es el tiempo que no superan el 95 % de los fotogramas; menor es mejor. El resultado depende del dispositivo, frecuencia de pantalla y navegador.

## Animación de la picada del Gallinazo
Durante el aviso, el ave levanta las alas, asciende y una sombra recorre la franja roja. La franja termina antes de la primera cobertura o borde previsto. Al lanzarse deja una estela acotada de plumas; al chocar o aterrizar produce polvo y un anillo de impacto, y comprime el cuerpo mientras recupera el equilibrio durante 0,65 s. Esa ventana permite atacarlo. La doble picada conserva su segundo aviso. El daño y la velocidad no cambian. Las partículas se pausan con la simulación, están limitadas a 32 por jefe y se omiten con movimiento reducido, conservando el aviso de peligro.
El indicador también funciona en cooperativo: cada jugador ve la dirección y distancia desde su propia posición, usando los portadores y llaves compartidos por el servidor.

### Resistencia durante la preparación y muerte legible
Los seis tipos de minion pesado reducen un 40 % el daño recibido solo mientras preparan su ataque (rangedAim activo y rangedWindup positivo). Un golpe de 20 inflige 12: siguen siendo vulnerables y pueden morir. Un halo dorado pulsante y un pequeño escudo indican la resistencia; desaparecen al ejecutar el ataque. Los normales y los jefes conservan el daño completo. Embestidas y ráfagas ya iniciadas no prolongan esta protección. Los portadores de llaves siguen las mismas reglas de pesado.

Al morir, el minion conserva su cuerpo completo, muestra ojos en X, cae y mantiene la pose antes de desvanecerse durante el tramo final. La duración varía entre 0,95 y 1,05 s y se conservan los seis efectos de partículas. Las recompensas y la eliminación del combate son inmediatas; el cadáver es cosmético.

## Fondos naturales cartoon
Manchas de color deterministas y flores dispersas reemplazan la muestra de suelo repetida. Caminos con curvas suaves y bordes de hierba, compartidos entre sectores; los obstáculos respetan su misma geometría. Copas orgánicas con transparencia cuando el jugador pasa detrás, sombras ovales y referencias locales: picnic, jardines coloniales y terrazas de piedra. No se cambian las cámaras ni las arenas de jefe.

## Aletazo animado del Gallinazo
El aviso de 0,8 s levanta las alas y polvo, muestra el sector del abanico con dirección fija y arcos de viento. Al lanzar las plumas, el cuerpo acompaña el golpe y vuelve a su pose de recuperación. Las plumas tienen silueta afilada y se fragmentan una sola vez al chocar con una cobertura. Se conservan cantidad, daño, velocidad y bloqueo de proyectiles; las partículas se pausan, respetan movimiento reducido y comparten los límites existentes.
La prueba de rendimiento permite marcar «Probar el dibujo anterior para comparar». Solo cambia cómo se dibujan los proyectiles durante esa prueba; mantiene el número de enemigos, ataques, estelas y patrones. El resumen identifica el método usado. La composición se fija en un 20 % de minions pesados para que las repeticiones sean comparables. Las partidas normales usan el dibujo optimizado.

## Corrección de césped y apoyo al suelo
Se recupera la textura anterior aprobada y se eliminan las manchas grandes planas. Caminos curvos, cámara y personajes se conservan. Las sombras se anclan al pie dibujado de cada objeto; árboles con sombra pequeña bajo el tronco para evitar apariencia de flotación.
### Ulti del Gallinazo: El cielo es mío
Una vez por encuentro, al entrar en aproximación con 30 % de vida o menos, abre las alas durante 2 segundos con seis fotogramas nuevos creados con IA. El jugador conserva el movimiento; no aparecen plumas nuevas durante el aviso. Después dispara tres abanicos separados por 0,9 s y prepara una picada avisada. Las coberturas bloquean las plumas. Desarrollo ofrece Probar ulti, repetible y sin récords. Movimiento reducido muestra la pose final sin sacudidas ni partículas.

### Derrota del Gallinazo
Al agotar su vida, se detiene el combate de la azotea durante 2,8 segundos: tambaleo, caída de lado, polvo y plumas al impactar, reposo y desvanecimiento. La recompensa o el resultado del laboratorio llega al terminar. Esc pausa la secuencia; movimiento reducido conserva una pose caída y el desvanecimiento sin sacudidas ni partículas.

La ulti del Gallinazo añade retrato animado durante el aviso, viento y plumas decorativas, ondas al suelo y acercamiento suave del 8 %. No alteran daño, colisiones ni duración. Movimiento reducido elimina zoom, pulsos y partículas.


La entrada individual de Kingteka ocupa el 40 % del ancho durante 1,3 s; mantiene combate continuo e invulnerabilidad temporal. Véase KINGTEKA_COMIC.md.
## Caminatas de seis cuadros completos
Los 18 personajes jugables y los seis tipos de rival usan una lámina propia con seis poses dibujadas de caminata. Hay contactos de pie opuestos, flexión y paso de cruce; los brazos alternan o acompañan el objeto que sostienen. Cuy usa sus cuatro patas y Paloma alterna las dos patas. Gallinazo invocado y transformación de la ulti tienen seis poses de aleteo. El ciclo avanza con la distancia real, se congela al detenerse o chocar y se espeja íntegro al cambiar de dirección. En movimiento se conserva el ciclo al disparar; la pose de ataque original queda para el reposo y se mantienen los efectos de combate. Los minions conservan preparación, resistencia, impactos y muertes con ojos X.
El menú espera las caminatas necesarias antes de iniciar una partida individual. En cooperativo la autoridad del servidor no espera recursos del navegador; se solicita la lámina del aliado al aparecer. Los recursos tienen reintento y la carga puede cancelarse antes de empezar.

La patada cuerpo a cuerpo de La G5 conserva su pose de ataque incluso en movimiento; los disparos mantienen la caminata y sus efectos de arma.

## Mercado y cofres impostores
El vendedor aparece en los tres mapas desde el segundo 45, cada 90 segundos, durante 45 segundos de reloj del mapa. Se sitúa en un punto seguro cercano. El HUD indica su dirección, distancia y tiempo restante, y permite hablar a 110 unidades. No aparece en arenas, laboratorio ni durante el jefe final. Cada visita renueva ocho ofertas de una unidad: emoliente (20), imán/chaleco/batería comunes (35), imán/batería raros (70), llave rara (40) y legendaria (100). No se cobra con saldo insuficiente, fuera de rango, después de expirar, por stock agotado, equipo idéntico o curación con vida completa. Cerrar no compra nada. En individual el menú pausa el combate; en cooperativo el compañero y el servidor continúan, las monedas/stock son compartidos y el objeto equipa al comprador.

El 12% de cofres no iniciales se determina como impostor mediante la semilla de la partida. Se despierta al acercarse a menos de 100 unidades, sin necesidad de llave, siempre dentro del límite de enemigos. Usa movimiento, daño y colisiones del combate y se conserva al alejarse. Al morir deja un cofre purificado de la misma rareza, con apertura gratuita y premio único; se conserva al salir de su sector. Los comunes iniciales y los cofres de jefe no son impostores. En cooperativo se despierta una sola vez para ambos y su premio permite la elección individual existente.

## Día, atardecer y noche
Ciclo visual por mapTime: día hasta 90 s, atardecer hasta 180 s, anochecer hasta 270 s y noche desde 270 s. Faroles se encienden gradualmente entre 165 y 225 s. La noche oscurece solo el fondo un máximo de 30%; los personajes y peligros se dibujan después. Pausa y arenas no avanzan el ciclo; la práctica queda de día. No incorpora clima ni efectos de dificultad.
Entrada cómic del Gallinazo: ojo 0–0,55 s, grito 0,55–1,15 s, alas fuera del panel 1,15–1,8 s y ruptura en plumas 1,8–2 s. Viñeta diagonal con azoteas, texto propio y dibujos IA exclusivos. Movimiento reducido usa una viñeta estática de alas. El combate, vulnerabilidad y duración no cambian.

## Minijefes de superficie
Campo de Marte: El Fiscalizador (embestida y tres conos). Plaza de Armas: La Paloma Brava (cinco plumas y picotazo en carrera). Machu Picchu: El Huaco Renegado (onda de 145 m y ocho fragmentos cerámicos). La primera aparición ocurre entre los segundos 60 y 90, con aviso en los 2 s anteriores. Tras aparecer, el siguiente intervalo es de 60–90 s de reloj del mapa, aplazado si sigue vivo el anterior. Solo uno activo; no aparecen durante portales, laboratorio, pausa ni tras llegar ElZeein. Las coberturas bloquean proyectiles y cargas; los avisos fijan dirección antes de atacar. Cada victoria deja 12 de fama, 20 monedas y un 35 % de llave rara; una sola recompensa por enemigo. Sprite completo con cuatro poses y derrota de 1,5 s. Disponibles en Desarrollo → Probar jefes. Individual y cooperativo comparten la lógica.
La entrada del Gallinazo ocupa toda la pantalla durante 2 s. Se congela toda la simulación (jugador, jefe, proyectiles y relojes) mientras avanza exclusivamente el reloj de la cinemática; pausa manual también la detiene. Al volver hay 0,7 s para buscar cobertura antes de la primera ráfaga. HUD oculto durante la escena, movimiento reducido conserva imagen estática. Fuera de la escena el jefe sigue siendo vulnerable.
Garúa solo en Campo de Marte: 1:00–1:25, 2:30–2:55 y 4:00–4:25, con transiciones de tres segundos. Es visual, tenue y por debajo del combate. Los demás mapas no cambian; movimiento reducido la desactiva.

Kingteka: el retrato usa una malla articulada continua de 16 por 12 celdas. Brazo y escopeta se elevan desde el hombro, disparan a mitad de la entrada y retroceden con recuperacion amortiguada. Cabeza y cintura mantienen anclajes; el fogonazo sigue la boca del arma. No cambia de pose ni usa fundidos. Mantiene 40 %, 1,3 s, combate activo e invulnerabilidad. Movimiento reducido conserva el retrato fijo.

El ambulante tiene un sprite pixel art de 48×52 con dos cuadros de animación: capucha, toldo morado/dorado y carrito con mercancía. Su icono de tienda aparece en el minimapa mientras la visita esté activa, fijándose al borde si queda fuera del alcance. Encima del minimapa se muestra «TIENDA · N s», con aviso naranja durante los últimos 10 segundos. Usa el reloj del mapa y el estado compartido del servidor: respeta la pausa individual, las arenas y la expiración cooperativa. Los cuadros se dibujan en una caché de canvas sin suavizado.
