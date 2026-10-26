# Documento de diseño — PERUSURVIVOR

## Identidad y objetivo
Título visible: Causas del Caos. Supervivencia de acción en vista superior con humor y referencias peruanas. El jugador controla el movimiento y esquiva rivales mientras su personaje ataca automáticamente. La meta es crecer durante la partida y derrotar al jefe final ElZeein.

Este documento describe la implementación existente. La reorganización de carpetas no modifica sus reglas ni agrega mecánicas.

## Bucle de juego
1. Elegir uno de catorce personajes y uno de tres mapas.
2. Moverse y combatir oleadas; recoger puntos de fama.
3. Al subir de nivel, elegir una de tres mejoras; cada cuatro niveles puede aparecer un cuarto pacto opcional.
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
La fama recogida llena la barra de experiencia. El primer umbral es 6; los siguientes crecen según la fórmula existente en progression.js. Cada nivel ofrece tres mejoras distintas del catálogo; cada cuatro niveles aparece además un pacto que intercambia una estadística por otra:
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

Cinemática de Lima: 3 s con azotea dedicada y visible, cámara lenta, cuerpo articulado continuo (sin cambiar de pose), primer plano del ojo que se retira, grito que levanta una bandada y aleteo que desplaza polvo/plumas y sacude antenas. Grietas solo desde las puntas de las alas al final; se eliminan los rayos radiales. Conserva pausa total y 0,7 s de aviso al regresar. Movimiento reducido conserva fondo y ave estáticos.
### Ataques animados de minijefes
Fiscalizador: anticipación hacia atrás, cuerpo inclinado y estela de figuras completas durante la embestida; polvo al frenar o chocar. Paloma: elevación, alas cerradas/abiertas en preparación y aleteo de ejecución, plumas sueltas y arcos de viento. Huaco: levanta el cuerpo con los puños, se comprime al golpear y produce polvo, grietas y onda decorativa. Los avisos, daño, velocidades, alcance y cadencias anteriores no cambian. Movimiento reducido omite las transformaciones y partículas.

El clima episódico se extiende a Plaza de Armas (garúa y reflejos sutiles) y Machu Picchu (bancos de niebla de baja opacidad). Mantiene episodios de 25 s y pausas despejadas de 65 s, sin efectos físicos. Machu deja de dibujar su niebla permanente para evitar sumarla a la episódica.

El ambulante tiene un sprite pixel art de 48×52 con dos cuadros de animación: capucha, toldo morado/dorado y carrito con mercancía. Su icono de tienda aparece en el minimapa mientras la visita esté activa, fijándose al borde si queda fuera del alcance. Encima del minimapa se muestra «TIENDA · N s», con aviso naranja durante los últimos 10 segundos. Usa el reloj del mapa y el estado compartido del servidor: respeta la pausa individual, las arenas y la expiración cooperativa. Los cuadros se dibujan en una caché de canvas sin suavizado.

## Dificultad por etapas y poses de ataque
El reloj de mapa controla ocho etapas; pausa, mejoras y arenas de jefes no adelantan la progresión. A 0:00 aparece Pablo con contacto; a 0:20 lanza un cristal; a 0:45 entra Tyrone y sus embestidas; a 1:25 Uniqua y abanicos de tres cristales; a 2:05 Tasha y sus pisotones; a 2:50 Austin y el zigzag; a 3:35 la PNP con dos disparos; a 4:15 llegan ráfagas de tres. El jefe obligatorio sigue en 5:00 y los portadores de llaves conservan sus horarios. Las criaturas anteriores conservan el patrón de su etapa de nacimiento.
Los límites de población suben de 16 a 80, los proyectiles de 0 a 40 y los ataques simultáneos de 0 a 8. Los pesados aparecen gradualmente (0–25 %) y conservan su resistencia parcial al cargar. El laboratorio y la prueba de rendimiento muestran el repertorio completo.
Los 18 jugables disponen de seis cuerpos completos de ataque: armas apuntadas, lanzamientos, abanico, megáfono, alas, grito y patada. Los ataques en marcha siguen la fase de los pies; en reposo muestran preparación, ejecución y recuperación. La G5 ejecuta seis fases de patada. La dirección de la pose sigue la puntería. No cambian daño, alcance ni proyectiles jugables.


## Progresión survivor por partida
Los rivales dejan experiencia (fama). Al llenar la barra, subes de nivel y eliges exactamente una de tres mejoras, con el mundo pausado. El exceso de XP se conserva y encadena elecciones. El arma inicial puede subir hasta rango 5; se ofrecen desbloqueos de Onda causa (área), Tarjetas del caos (perforantes) y Escudo de bandas (área cercana), con un máximo de dos apoyos. Cada poder tiene cinco rangos. A partir de nivel 8, los poderes de rango 5 pueden evolucionar mediante una elección especial: el arma gana daño, alcance, proyectiles y perforación; los apoyos duplican daño y amplían alcance. Las mejoras de atributos tienen cinco rangos y no ocupan espacios de poderes. El HUD muestra XP, poderes, rangos y estrellas de evolución. Todo se reinicia al empezar otra partida.

P.Progression centraliza opciones, aplicación, efectos automáticos y resumen. El servidor cooperativo pausa la sala y genera tres ofertas por jugador; valida ID de elección y aplica cada mejora una sola vez. Espera a ambos y encadena niveles pendientes. Los rangos y tiempos de los apoyos se serializan con cada jugador. No se cambian las ultis ni se requieren compras para evolucionar.

## Vegetación reactiva y palomas
Los arbustos de Campo de Marte y las matas de Machu Picchu se sacuden brevemente al pasar cerca; las palomas de la Plaza levantan vuelo y vuelven al suelo. Mantener el estilo cartoon con acabado pixel, masas redondeadas y sombras ancladas al suelo. Son decoración local: no afectan combate, colisiones ni sincronización. Máximo seis palomas y 32 plantas reactivas del grupo visible, detección limitada a 30 Hz y estado descartado al salir de cámara. El reloj de mapa respeta pausa y arenas; movimiento reducido desactiva reacciones y vuelo.



Aleteo fluido: alas articuladas sobre la pose abierta del atlas existente, con subida y bajada continuas a 2,8 ciclos por segundo, ligera flexion de plumas, balanceo del cuerpo y sombra acompasada. Cada gallinazo tiene una fase propia estable, sin sincronizar toda la bandada. El panel de Kingteka comparte el mismo dibujo. Movimiento reducido mantiene alas y cuerpo fijos. No cambia dano, velocidad ni colisiones.

### Marcha de minijefes sin deslizamiento
Los tres alternan apoyo y paso según la distancia recorrida: el Fiscalizador camina, la Paloma hace pequeños saltos y el Huaco da pasos cortos y pesados. El apoyo fija visualmente el pie durante el 40 % de cada ciclo; el traslado ocurre al levantar la pierna. La sombra acompaña el apoyo. Al detenerse o bloquearse dejan de dar pasos. Se conservan la velocidad real, colisiones y animaciones de ataque.
La embestida también avanza un ciclo de carrera por distancia: el Fiscalizador intercala apoyo y pierna elevada con rebote corto; la picada de la Paloma alterna alas durante el impulso.

## Reacciones de los jugables y dirección de disparo
Los 18 jugables reaccionan al daño durante 0,26 s con retroceso visual, una inclinación breve y señal de impacto. No cambia su posición, colisión ni ventana de invulnerabilidad. Al caer muestran el cuerpo completo inclinado y una señal de derrota; permanecen visibles. En individual y derrota de equipo, el resultado aparece tras 0,95 s mientras combate y relojes permanecen detenidos. En cooperativo los caídos conservan la reanimación de cuatro segundos y recuperan la caminata al levantarse. Movimiento reducido elimina la sacudida y reduce la inclinación.
Las armas de fuego conservan la orientación del último disparo durante su recuperación (hasta 0,5 s), aunque se camine en sentido contrario. La pose sigue la fase real de los pies y la dirección registrada al crear los proyectiles; no cambia el alcance, daño ni trayectoria. Esto evita que Kingteka vuelva a mirar hacia su movimiento antes de terminar de disparar.

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
Entrada oscura del Gallinazo: 4 s. Empieza en el ojo, la cámara retrocede de 6,5x a 1x sin cortes, revela al jefe en penumbra y un aura negra que circula delante/detrás. Anticipa el aletazo y lanza 28 plumas en perspectiva hacia el espectador; cierran la pantalla antes de volver a la arena. Sin carteles, viñetas, grietas ni bandada. Mantiene pausa total y aviso posterior de 0,7 s. Movimiento reducido usa encuadre completo y aura fija.

Arte ambiental v2: palomas reconocibles con cuello tornasolado y cuatro poses; tres arbustos orgánicos con flores o bayas y mata de ichu. Conserva escala discreta, sombras al pie, reacciones y cupos previos. Césped y árboles conservan su arte. Referencia: NATURE_ART.md.

### Entradas propias de minijefes
El Fiscalizador entra caminando y emite un pitido doble (1,3 s). La Paloma desciende con alas abiertas y polvo de aterrizaje (1,5 s). El Huaco emerge entre piedras y polvo (1,5 s). Son entradas locales al encuentro: el jugador conserva control y los demás enemigos siguen activos. Durante su entrada el minijefe no golpea ni recibe daño; después conserva 1,4 s antes de preparar el primer ataque. El aviso de 60–90 s y las pruebas de laboratorio usan la misma entrada. Pausa y movimiento reducido se respetan.
Las apariciones priorizan laterales visibles: entre 220 y 260 unidades del jugador y hasta 130 de separación vertical, siempre fuera de obstáculos. Si el jugador se aleja durante el aviso se busca otra posición segura antes de entrar.

Remate DENUNCIADO: papel compacto de 72 x 48 unidades, caida acelerada con giro que se estabiliza al aterrizar, sello de 84 x 20 sin ampliacion gigante, impacto unico sincronizado con audio, rebote y onda breve. Se dibuja directamente a resolucion completa para conservar texto nitido. Se fija al lugar donde termina la ulti y respeta pausa y movimiento reducido. El panel tambien usa resolucion completa sin suavizado y reduce el gallinazo para evitar recortar las alas.

### Segunda fase de minijefes al 50 %
Al llegar a la mitad de vida, cada minijefe anuncia una única segunda fase durante 0,95 s con pose, rótulo y sonido propio. Cancela amenazas pendientes de ese jefe; no hay daño de contacto durante el aviso, pero el jugador puede seguir atacándolo. El Fiscalizador encadena dos embestidas; la Paloma lanza dos abanicos con un salto lateral entre ellos; el Huaco golpea dos veces. Cada ejecución tiene su aviso completo, con dirección fijada al empezar ese aviso. Pausa intermedia: 0,55 s para la Paloma y 0,65 s para los otros. Se conservan daño, velocidad y alcance; los ataques secundarios se mantienen y las recompensas siguen siendo únicas.
## Puntería en ocho direcciones
Los quince jugables con ataques de proyectil o cono usan cinco orientaciones dibujadas (arriba, diagonal superior, horizontal, diagonal inferior y abajo), reflejadas para cubrir ocho sentidos. Cada orientación contiene seis cuerpos completos con pasos; al cambiar de objetivo se conserva `walkPhase`. Los pies siguen el recorrido real, la mirada y el arma siguen el último ataque; no se gira ni deforma el cuerpo entero para apuntar. Se mantienen daño, alcance, colisiones, dispersión y trayectorias continuas: la orientación dibujada corresponde al octante más cercano. Las ondas radiales, órbitas y patada conservan su presentación específica.

### Recompensas exclusivas de minijefes
Además de su botín habitual, cada minijefe deja un cofre legendario sin llave que permanece al alejarse. Se elige su accesorio exclusivo o 50 monedas. Ocupa el espacio de accesorio existente: reemplaza el equipo anterior. Silbato del caos: cada 6 s empuja 55 unidades a rivales comunes en radio 150 con línea de visión; no mueve jefes. Pluma brava: cada ataque acertadamente iniciado añade dos plumas con 35 % de daño, hasta tres impactos cada una. Corazón de barro: absorbe un golpe completo y recarga en 10 s de combate. Pausa, menús y elecciones detienen recargas. En cooperativo cada jugador elige una vez y las monedas van al fondo compartido. El laboratorio permite continuar tras vencer para abrir el cofre.
Aletazo corporal: ocho dibujos nuevos de reposo, agachado, anticipación, impulso, elevación, golpe frontal, retroceso y recuperación. La cabeza y las patas cambian de pose dibujada, sin estirar la imagen. El fondo usa cielo, ciudad y azotea independientes, con desplazamientos distintos y polvo que nace del techo al golpear. Se conserva el ojo, la cámara atrás, el aura negra, cuatro segundos de pausa y el aviso de 0,7 s.

Ulti de Alberto Fujimori: TRIBUNAL. Carga 20 bajas como Kingteka; Q inicia una secuencia de 4,7 s (entrada y tribunal) que congela combate y reloj de ambos jugadores. El publico muestra minions de espaldas, Fujimori sentado al centro, aliado vivo como abogado y un juez original. Tras SOY INOCENTE y el martillazo, el mapa retorna: elimina minions normales y pesados con centro a 340 unidades o menos del punto de activacion. Excluye jefes, subjefes y mimicos. No carga la propia ulti con esas bajas, mantiene recompensas normales y concede 1,2 s de proteccion al volver. La sala autoriza, sincroniza y resuelve una sola vez; nunca acepta objetivos del cliente. Practica publica de Fujimori con recarga y reposicion de objetivos, sin records. No usa voz real.
La Plaza reemplaza la pileta y fachada geométricas por sprites cartoon detallados. Mantiene la física y escala del lugar, sombras al pie y ocho reflejos pequeños de agua. El jugador se mantiene visible detrás con opacidad reducida del objeto; pausa congela el agua y movimiento reducido la desactiva. Referencia: PLAZA_LANDMARKS.md.

## Inicio y demostraciones de ataques
El inicio se organiza como un lobby: causa destacado, botón Jugar ahora y accesos a mapas, personajes, habilidades y cooperativo. Conserva el estilo peruano y todos los controles existentes; no añade funciones de cuenta ni tiendas inexistentes.

El menú de habilidades compara ataque básico y evolución en dos canvas animados con los perfiles, glifos, poses y efectos del juego. Incluye pausa/reproducción y descripción de requisitos. Son demostraciones cosméticas sobre muñecos: no ejecutan combate, no alteran XP, monedas, salud, equipo ni estado de sala y no desbloquean poderes. La animación comparte el bucle de dibujo a un máximo de 30 Hz, usa dos superficies, se detiene al cerrar o esconder la pestaña y arranca estática con movimiento reducido. Los recursos faltantes usan el retrato existente y se reutiliza la carga de sprites.


Arte Tribunal v2: sprites dedicados de juez, seis minions sentados de espaldas y retrato de Fujimori con dedo levantado. La activacion comienza con panel diagonal izquierdo durante 1,3 s, gesto articulado continuo y frase SOY INOCENTE, seguido del tribunal de 3,4 s (total 4,7 s). Ambos clientes usan el mismo reloj autoritativo. El martillo tiene anticipacion, bajada rapida, rebote, onda, virutas, sacudida breve e inserto de acercamiento. Movimiento reducido elimina sacudidas y acercamiento. WebP sin perdida con PNG originales y prompts en docs/court-art-prompts.json. El radio, carga, exclusiones y recompensas siguen iguales.

Articulaciones Tribunal v3: torso y antebrazo usan capas pixel art separadas (judge-joints-v2 y fujimori-joints-v2). El hombro y rostro permanecen fijos; el antebrazo, la mano y el dedo giran con una transformacion rigida y escala uniforme. Se retira la malla que estiraba la silueta. El mazo conserva el anclaje de agarre y el acercamiento completo. Sin cambios de duracion, radio ni autoridad cooperativa. Prompts y fuentes en court-joint-prompts.json.
## Vestíbulo pixel art
La portada muestra «Pulsa para empezar» sobre el escenario con nueve personajes decorativos en movimiento. Al entrar, el causa elegido ocupa el centro y una navegación lateral abre secciones independientes: Jugar (mapas y comienzo), Causas (colección y ficha con atributos), Habilidades (rama y comparación animada), Cooperativo (salas existentes) y Ajustes (sonido, controles y prácticas). En móvil la navegación se sitúa abajo. No introduce cuentas, monedas persistentes ni un gacha ficticio. El fondo y los retratos son cosméticos: no avanzan la partida, no crean enemigos ni consumen recursos. Se reutilizan los atlas cargados y se respeta movimiento reducido. El mejor récord mostrado sigue siendo local.
Bancas y faroles: variantes de parque y colonial con contornos cartoon y acabado pixel. Mantienen posiciones, tamaños de colisión y cantidades. Las sombras tocan patas/base; los faroles encienden gradualmente con DayNight y respetan pausa. Reglas y fuentes: STREET_FURNITURE.md.

Remate de la ulti: el aura se contrae, hay una suspensión sonora breve y el golpe ilumina la azotea en violeta. Las plumas detalladas salen de ambas alas y dan paso a la arena sin corte a negro; el jefe termina allí la misma pose y muestra BAJO MIS ALAS antes de retirar el título. Las grietas permanecen durante el encuentro y el polvo baja en un segundo; no cambian terreno ni coberturas. Ráfagas a 0, 0,42 y 1,9 s tras el aviso: dos rápidas (12 daño), una pesada (18 daño, menor velocidad) con dirección fijada y aviso de 1,1 s. Las coberturas bloquean todas. La siguiente picada conserva su aviso. Movimiento reducido elimina destellos, sacudida, humo y fragmentos.

Árboles y jardineras: copas irregulares, hojas agrupadas, troncos con carácter y piedra con flores variadas. El pie y sombra se anclan; la parte alta tiene oscilación mínima. Se conserva transparencia detrás, pausa, movimiento reducido, densidad y colisiones. Referencia: TREES_PLANTERS.md.

## Salida desde la punta del arma
Las seis armas que producen fogonazo (Kingteka, Cerdito, Najasor, Sustento, Charles y Cevichero) usan 180 anclajes revisados: cinco direcciones dibujadas por seis pasos, reflejados para cubrir ocho sentidos. Balas y destello nacen en el mismo punto del cuadro actual. El fogonazo sigue la punta durante su breve vida; las balas ya lanzadas continúan su trayectoria. Quieto se usa la postura con los pies apoyados.
Se apunta al objetivo desde la boca del arma y se conserva el radio máximo de alcance. Un barrido inicial impide que el nuevo origen atraviese una cobertura o salte enemigos cercanos; el vuelo de estas balas también comprueba el segmento frente a paredes finas. Daño, cadencia, cantidad de proyectiles, dispersión y evoluciones permanecen. El anclaje incorpora el retroceso y la reacción al daño sin cortar el cuerpo. Individual y cooperativo comparten los cálculos.

## Progreso permanente por personaje
El progreso se guarda automáticamente en localStorage de este navegador (causas-progress-v1), conservando el récord anterior. No sincroniza cuentas ni guarda una partida en curso. El panel Mejoras muestra saldo, partidas, victorias, rivales y mejores marcas de cada causa.

Las monedas permanentes son distintas del dinero temporal del mapa. Al terminar una partida de al menos 15 s se entregan 1 por cada 5 rivales, 2 por cada 30 s y 50 extra por victoria. Cada partida tiene ID y recibo para impedir cobros repetidos. No se premian abandonos, prácticas, laboratorios ni pruebas de rendimiento. El cooperativo entrega recompensa local a cada participante a partir del resultado de la sala.

Cada personaje tiene cinco rangos de Vitalidad (+8 vida/rango), Fuerza (+4% daño base/rango), Reflejos (recarga ×0.97/rango), Zapatillas (+3% velocidad base/rango) e Imán (+12% recogida base/rango). El coste es base × (rango actual + 1): 40, 50, 55, 35 y 35 respectivamente. Las mejoras se aplican una sola vez al comenzar el combate individual normal. El cooperativo mantiene sus atributos de servidor y los rangos de poderes de cada partida continúan reiniciándose.

P.Meta valida esquema, identificadores, rangos y saldo. Compra y premio escriben un único documento; las operaciones releen el estado y usan Web Locks cuando está disponible. Los cambios de otras pestañas se reflejan por storage. Una lectura corrupta o un fallo de escritura no confirma gasto ni premio: conserva el guardado y muestra estado y reintento. No se utiliza el monedero local como autoridad de combate cooperativo.
Los minijefes muestran nombre y vida en el HUD superior: una barra con divisor al 50 %, valores reales y distintivo de fase. La segunda fase cambia el color a coral sin rellenar vida ni añadir otra reserva. El aviso previo ocupa el mismo panel sin barra.

## Etiquetas de minions
Los minions no muestran nombres, incluidos los pesados y la PNP. Los portadores conservan únicamente su barra de vida y la indicación de llave sobre la cabeza, ajustadas a la pose visible al caminar, atacar o recibir daño.


Primera pasada de equilibrio: objetivos visibles dentro del alcance, prioridad a enemigos sobre cajas; proyectiles y áreas activas pueden continuar fuera de pantalla. Minions no inician avisos fuera de vista. Kingteka: 480 de alcance, intervalo 0,78 s, escala 0,6 y caída desde 180 al 35 % máximo; evolución con tres penetraciones base. Cerdito: 400, caída desde 140, daño cercano intacto. Sin aumento global de salud ni cambios de patrones de jefes. Comparación y límites: COMBAT_BALANCE.md.


Campo de Marte: monumento de piedra con arco y relieves, más dos variantes de picnic con madera, metal y accesorios. Interpretación estilizada de parque, sin reconstrucción histórica. Mantiene sombra al pie, transparencia detrás del monumento, posiciones y colisiones. Referencia: CAMPO_LANDMARKS.md.

HUD de combate distribuido en los bordes: XP de ancho completo arriba, personaje/nivel/vida a la izquierda, tiempo al centro y habilidad abajo. La información de botín y eventos permanece visible sin un panel central opaco.


Machu Picchu: tres variantes de roca, dos orientaciones de muro y terrazas con escalera, piedra irregular y musgo sutil. Conserva rutas, cantidades y colisiones, sombras apoyadas y transparencia detrás. Los bordes de piedra del suelo mantienen su distribución y se integran en la caché del terreno. Referencia: MACHU_STONE.md.

## Tienda del menú y mochila
El monedero permanente compra unidades de Lonchera del causa (20: +25 vida máxima/inicial), Café de cabina (25: recarga ×0.88), Zapatillas de repuesto (25: velocidad ×1.10), Imán de bolsillo (20: recogida ×1.25), Llave rara (30) y Llave legendaria (70). Los cuatro bonos duran una partida; las llaves se suman al inventario temporal del mapa. Los objetos usan iconos pixel art propios y el estilo azul del vestíbulo.

La mochila es compartida entre personajes, tiene hasta 99 unidades por objeto y permite preparar como máximo tres tipos distintos, una unidad por tipo. Preparar, quitar o cambiar de mapa no gasta objetos. Al comenzar el individual normal se confirma un consumo atómico, se limpia la selección preparada y se aplican sus efectos una sola vez, después de las mejoras permanentes. Cada partida tiene un recibo de consumo para evitar descuentos duplicados. No se consumen en cooperativo, prácticas, laboratorio ni rendimiento; permanecen preparados para la siguiente partida individual.

El esquema local v2 incorpora inventario, preparados y recibos, leyendo también los guardados v1 y conservando saldo, mejoras y marcas. Mantiene la clave local existente; al escribir migra a v2. Las versiones antiguas rechazan ese formato en lugar de sobrescribir la mochila. P.Supply reutiliza P.Meta.transaction y su bloqueo entre pestañas; compra, preparación y consumo validan cantidad, saldo, cupos y modo antes de persistir. El juego espera sin avanzar reloj mientras confirma la mochila; un fallo permite reintentar, conservar objetos y jugar o volver al menú. Nada se aplica si el consumo no queda confirmado. No se distribuyen controles de QA.

Ajuste Tribunal: entrada comparte el layout de Kingteka (40 % ancho, 82 % alto, origen vertical 8 %) y dura 1,3 s; tribunal 3,4 s, total 4,7 s. El antebrazo del juez gira como una pieza rígida desde el codo y el mango usa exactamente el mismo punto de agarre, tambien en el acercamiento. El impacto se calibra contra el bloque de madera. Fujimori sentado levanta el dedo durante la frase y lo baja antes del golpe; la burbuja queda al lado para no ocultar el gesto.
Subida de nivel: tres tarjetas y una cuarta ocasional con icono, categoría, rareza, nombre, efecto, comparación numérica y una vista previa animada. Común, rara, épica y legendaria tienen marcos propios sobre la paleta carbón, crema, coral y latón. La elección produce impacto, destello e icono viajando al personaje; evoluciones y combos reciben presentación completa. Cooperativo conserva la espera por ambos jugadores.

Minijefes: conos y luces ámbar, sombras/plumas y símbolos/polvo identifican el combate en su mapa, sin añadir colisiones inesperadas. Se desvanecen durante la derrota. Tras terminar el combo hay 1,5 s de agotamiento, sin daño por contacto y con +35 % de daño recibido. Un choque corta la cadena y concede 2 s. Las plumas se bloquean con cobertura; la onda del huaco exige salir del radio avisado, incluso detrás de paredes.
## Evolución de minions
Las nuevas oleadas mezclan normales, veteranos y élites según el reloj de mapa: antes de 2:05 solo normales; desde 2:05 un 35 % de veteranos, desde 2:50 un 50 %; desde 3:35 un 20 % de élites y 45 % de veteranos; desde 4:15 un 40 % de cada rango evolucionado y 20 % de normales. El rango queda fijado al nacer, sin transformaciones imprevistas durante una carga. Pausas y arenas no adelantan la progresión. Jefes, minijefes e impostores quedan fuera.
Veteranos: vida ×1,35, velocidad ×1,06, contacto ×1,15, daño especial ×1,20 y enfriamiento ×0,92. Élites: vida ×1,85, velocidad ×1,12, contacto ×1,30, daño especial ×1,45 y enfriamiento ×0,82. Los avisos previos conservan su duración. Los élites de Pablo lanzan cinco cristales, Uniqua aumenta sus estrellas (tres veterana, cuatro élite), Tasha amplía su pisotón, Austin élite lanza dos zigzags y la PNP élite añade una bala a la ráfaga, hasta cuatro. Tyrone gana velocidad y duración de embestida con el aviso de trayectoria correspondiente. Se respetan cobertura y cupos de amenazas.
Los veteranos llevan detalles bronce y aro sencillo; los élites llevan armadura violeta y un aro con marcas laterales. Son adornos que acompañan el cuerpo completo, incluidos daño y muerte. Los seis pasos originales y las caras permanecen intactos. No se dibujan nombres ni rangos de texto sobre ellos. Pesados y portadores conservan sus propiedades adicionales.

Las tarjetas usan iconos pixel art de 32×32 específicos del arma, poder o atributo. Las teclas 1, 2, 3 y 4 eligen la tarjeta correspondiente solo con el selector abierto, sin repetición al mantener la tecla. Directo viral combina arma principal y onda; Prensa blindada combina tarjetas y escudo. Los sonidos sintetizados distinguen navegación, elección y evolución. Identidad visual de vestíbulo y mejoras: carbón, coral y latón, bordes rectos y acentos de impresión. Movimiento reducido elimina destellos y desplazamientos sin cambiar la elección.

### Gallinazo: impacto y forma II
La ulti al 30 % de vida presenta una tarjeta diagonal propia durante los primeros 1,22 s, sin alargar la cinemática. En el impacto, el plumaje cambia a violeta oscuro y conserva la forma II hasta la derrota; es un cambio visual sin aumentar daño, vida ni velocidad. Bloques de concreto con caras claras/oscuras saltan y aterrizan; una nube de polvo escalonado atraviesa la entrega a la arena y se disipa antes de 2,8 s. Avisos y coberturas conservan su comportamiento. Movimiento reducido elimina el salto y giro del escombro y disminuye el polvo.
Derrotas de minijefes (2,2 s): el Fiscalizador se desploma y pierde cinco conos; la Paloma cae de lado entre dieciocho plumas; el Huaco se agrieta y se separa en fragmentos de su propio sprite. No causan daño. Pausa detiene la secuencia; movimiento reducido conserva el cuerpo estático con desvanecimiento. El laboratorio espera al final antes de mostrar el resultado.
Veteranos: coraza bronce, hombreras remachadas y grebas. Élites: coraza violeta con cristal y hombreras puntiagudas. No cubren las caras. Al atacar: chispas bronce o runas violetas; proyectiles, pisotones y embestidas incorporan adornos del rango. Esta mejora visual no cambia daño, alcance ni colisiones.

## Gacha de personajes
Cada tirada cuesta 60 monedas permanentes. Probabilidades base por rareza: común 60%, raro 27%, épico 10%, legendario 3%; cada personaje se elige uniformemente dentro de su rareza. Los repetidos devuelven 15/25/40/60 monedas respectivamente, sin duplicar personajes. Tras nueve tiradas sin épico o superior, la siguiente garantiza al menos épico; tras 29 sin legendario, la siguiente garantiza legendario. Las garantías pueden elevar la rareza de la tirada base. No se cobra si la colección está completa. No hay compra con dinero real.

Perfiles nuevos reciben Cristorata, Cuy Supremo y Paloma del Centro. El esquema v3 conserva saldo, mochila y mejoras de v1/v2 y desbloquea además los personajes con partidas, premios o mejoras anteriores. El formato antiguo no puede sobrescribir el nuevo. La colección marca bloqueados y rareza: se pueden consultar habilidades y prácticas, pero para jugar en individual o solicitar sala debe estar desbloqueado. El servidor cooperativo sigue usando su catálogo y atributos; el progreso del navegador no es autoridad de cuenta en la sala.

P.Gacha resuelve cargo, devolución, desbloqueo, garantías e historial en una sola P.Meta.transaction. El resultado se guarda antes de la animación y se puede consultar de nuevo sin pagar; cerrar o recargar no vuelve a tirar. La animación comparte el bucle de dibujo, se detiene al salir/ocultar pestaña y se revela inmediatamente con movimiento reducido. La rareza de colección no cambia las estadísticas de combate.

Caminos: integrar bordes con el césped, mantener el centro legible y añadir detalles propios del mapa sin manchas grandes ni ruido excesivo. La red transitable, áreas especiales, obstáculos y colisiones se conservan. Campo tiene grano y pasto lateral; Plaza juntas de pavimento; Machu desgaste y piedra existente. Referencia: PATH_FINISH.md.



Segunda pasada de equilibrio: cada descarga de escopeta aplica 100 %, 35 % y 15 % por impactos posteriores contra el mismo enemigo; reinicia por enemigo, disparo y jugador. Minijefes usan vida base × (1 + clamp((mapTime-45)/75,0,2.6)) × 1,65 para dos jugadores. Salud fijada al nacer; laboratorio conserva base, sin ajuste por daño/nivel del jugador. Minions y jefes finales/arenas conservan salud. Ver COMBAT_BALANCE_2.md.


### Gallinazo: fase II física y ataques propios
La transformación cambia el cuerpo al atlas gallinazo-phase2-v1: cresta erizada, cuello y hombros reforzados, alas dentadas con puntas marfil y fisuras violetas. Se revela a los 2,65 s de la ulti entre rayos localizados y continúa en combate; no es una recoloración. La tarjeta anterior se sustituye por un único panel izquierdo con las proporciones de Kingteka/Fujimori.
Tras la ulti, las plumas normales pasan a Plumas serpiente: dos abanicos de nueve proyectiles ondulantes, 14 de daño, separados 0,42 s tras 1,1 s de aviso. La invocación pasa a Tormenta de azotea: tres círculos de radio 46 fijados al preparar el ataque, 18 de daño por impacto, aviso mínimo 1,1 s y golpes escalonados 0,18 s. No se colocan sobre cobertura; se respetan los bordes y la visibilidad del aviso. Las picadas mantienen sus avisos y comportamiento. Máximo global: 70 amenazas. Los rayos localizados tienen menor intensidad y no oscilan en movimiento reducido.

Cada minijefe tiene motivos sintetizados propios de entrada, aviso de ataque, agotamiento y derrota (silbato, arrullo tonal o cerámica grave). La flecha del borde indica nombre, dirección y distancia cuando su sprite está completamente fuera de vista; desaparece al volver, morir o entrar a una arena. Respeta silencio y pausa.
Variantes creativas de veteranos y élites: Pablo ingeniero con casco blanco, chaleco y pala; Tyrone musculoso con camiseta y cinturón; Uniqua abanderada del Perú; Tasha guardaespaldas de terno negro; Austin mecánico con casco blanco y llave; PNP con escudo y vara. Los élites añaden acabados propios al oficio, sin armadura genérica. Los accesorios siguen seis claves de caminata y una pose de preparación/liberación, bajo la transformación del cuerpo completo. No cambian ataques ni colisiones.

### Entrada y transformación continua del Gallinazo
La tarjeta izquierda dura 1,3 s antes de los cuatro segundos de cinemática; muestra la forma base con malla de alas, no el atlas transformado. El reloj del ojo no avanza durante la tarjeta. Combate y tiempo de mapa se congelan en ambas etapas; pausa detiene también la entrada. El erizado comienza a 1,7 s del plano: cresta y plumaje se revelan progresivamente entre 1,95–2,87 s con anclaje al mismo pie y escala de píxel, mientras el aura y los rayos crecen por separado. No añade desplazamiento horizontal al cambiar de atlas. Mantiene la gracia de 0,7 s al regresar a la arena y los ataques de fase II.
Legibilidad de minijefes: al agotarse aparece una mira grande y se mantiene +35 % desde cualquier dirección. Cada ventana aprovechada otorga 5 monedas (máximo tres), sin daño suma 10 opcionales; se acreditan una vez al equipo y el laboratorio no concede monedas. Una tarjeta lateral muestra frase de entrada durante 3 s y resumen durante 8 s de juego, con tiempo, daño total recibido durante el encuentro, contraataques y botín. Las visitas por mapa tienen tres niveles: velocidad +0/5/10 %, pequeña variación del abanico/giro y embestida +0/4/8 %, sin aumentar proyectiles ni reducir avisos; las variaciones se suprimen con 35 rivales o 24 peligros. Se conserva el escalado de salud por reloj/grupo y su tope existente. El botín base pasa de 20 a 25/30 monedas. Durante un minijefe, el límite temporal de nuevos minions se reduce a la mitad y el intervalo se multiplica por 2,5; se excluyen apariciones a menos de 260 unidades del minijefe. No se eliminan enemigos existentes.

Los minions con oficio de rangos veterano/élite atacan según su accesorio: Pablo golpea con pala en un sector de 70/77 unidades, Tyrone da un puñetazo de 58/63,8 unidades y Uniqua barre con la bandera en un arco de 2,7 radianes y 88/96,8 unidades. Preparación mínima 0,9/0,85/0,85 s; el aviso muestra el alcance y dirección fijados antes del golpe. El impacto dura 0,28 s, causa daño una vez y respeta cobertura. Los normales conservan sus patrones originales. Se refinan casco, pala, manos y anatomía de brazos con contornos, luces y sombra.


Ambiente sonoro: agua por proximidad en Plaza (alcance 550 unidades), hojas y trinos en Campo, viento en Machu. Volumen bajo respecto a música/ataques; sin efectos físicos ni señales confundibles con avisos de peligro. Silencio y pausa se respetan. Se retira durante jefes, arenas y prácticas; trinos omitidos con seis o más voces activas.


## Lotes de gacha ×10
Una compra de diez requiere 600 monedas de saldo inicial. Cada tirada actualiza inmediatamente la colección y las garantías antes de resolver la siguiente; un personaje nuevo repetido dentro del lote devuelve monedas a partir de su segunda aparición. La colección completa al inicio bloquea compras; completarla durante un lote no cancela sus tiradas restantes. El resumen presenta diez resultados y el total de nuevos, repetidos, devoluciones y coste neto. Revelado secuencial de 4,6 segundos, botón para mostrar resultado inmediato y modo de movimiento reducido.
### Consulta de personajes
Las fichas de Causas muestran valores base de rango 1 sin mochila ni mejoras permanentes, rol descriptivo y evolución. El daño por impacto incluye powerScale; no se presenta como DPS. La rareza de colección no aumenta atributos. Véase CHARACTER_PROFILES.md.


## Historial y ascensos por copias
Desde el perfil v4 se conservan las últimas 200 tiradas. Cada recibo nuevo registra fecha/hora del dispositivo, nuevo/repetido y copias concedidas. Historial en orden inverso, filtros de rareza y resultado, 20 filas por página. Los recibos anteriores no reciben fechas inventadas.

Cada repetido entrega la devolución existente y una copia de su propio personaje mientras esté por debajo de 5★. Ascensos manuales de 1★ a 5★ con costes marginales de 2/3/4/5 copias (14 en total). Cada estrella adicional aporta 3% aditivo de vida y daño, hasta 12%, sobre el personaje con sus mejoras permanentes al empezar individual; cooperativo, prácticas y desarrollo conservan sus reglas. El ascenso no cobra monedas. Colección completa permite tiradas para copias; todos los personajes desbloqueados y a 5★ bloquea compras. Un repetido a 5★ conserva solo el reembolso. Esta regla sustituye el bloqueo anterior al completar la colección. En migración se reconocen exclusivamente los repetidos del historial v3 disponible; no se reconstruyen tiradas descartadas por el límite anterior de diez.
### Balance por rol
La rareza afecta a la obtención, sin bonus automático de combate. La tercera pasada compara los 18 personajes con progresión idéntica y ajusta ataques base y evolucionados. Véase ROSTER_BALANCE.md para parámetros, resultados y límites del ensayo.

Navegación de minijefes: rutas locales rodean coberturas con su radio completo, sin teletransporte ni atravesar esquinas. Recalculan ante bloqueo, cambios de terreno o desplazamiento del jugador; no inician ataques desde lejos o a través de paredes. Embestidas mantienen dirección fijada y castigo por choque. Tras el impacto, el Fiscalizador baja la guardia inclinado, la Paloma baja alas/cuerpo y el Huaco se asienta encorvado; respiración sutil desactivada con movimiento reducido. Ventana y +35 % permanecen iguales.
Los seis oficios evolucionados usan sprites raster completos con vestuario y accesorios integrados en cada dibujo: seis pasos, preparación, impacto y derrota con ojos X. Se elimina la ropa geométrica superpuesta. Los normales conservan sus láminas y los rangos siguen diferenciándose por aros y efectos. Se mantienen los ataques, daños, avisos, fases y geometría de colisión existentes.

## Presentación de estrellas
El ascenso confirmado celebra la nueva estrella sin retrasar el guardado ni aplicar otra recompensa. La animación de estrella dura 1,8 s y puede omitirse cerrando el diálogo; con movimiento reducido se muestra el resultado estático. El diálogo presenta antes/después, copias gastadas/restantes y bonificación; Ver en colección selecciona el personaje ascendido. La colección muestra estrellas, vida/daño porcentual solo individual, copias y coste del próximo ascenso; personajes bloqueados no muestran estrellas ganadas ni bonificaciones.
Tribunal legendario: al regresar, el radio de 340 unidades elimina minions y muestra expedientes CASO ARCHIVADO (máximo 48). Jefes reciben 8 % de salud máxima, tope 200, sin golpe letal; respeta entrada invulnerable de minijefes y ulti del Gallinazo. Sentenciado añade 20 % de daño recibido durante 5 s, sin acumular; escudo Expediente bloquea daño durante 3 s para ambos jugadores vivos. Ambos vencen por elapsed autoritativo y viajan como propiedades serializadas; pausa y Tribunal congelan el reloj. Grietas y onda doradas son cosméticas, sin daño duplicado.
# Laboratorio de combate
En Ajustes, un único laboratorio permite elegir cualquiera de los 18 causas y probar ataques contra objetivos invencibles o contra un jefe/minijefe. La barra permanece en la arena: cambiar un selector reinicia directamente la prueba, sin regresar al vestíbulo. Ofrece repetir, lanzar las ultis disponibles (Kingteka y Fujimori), recarga automática al terminar la animación, reponer objetivos, curar y activar la ulti del Gallinazo. Se puede minimizar y volver a Ajustes. Las pruebas no gastan mochila ni monedas, no requieren desbloquear el personaje y no guardan récords. La invencibilidad es fija con objetivos y opcional con jefes; el rendimiento conserva su sección independiente.

