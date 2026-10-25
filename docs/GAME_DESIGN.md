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
- Cada mapa tiene dos cofres comunes. Se abren al permanecer quieto a menos de 75 unidades durante 1,8 segundos. Alejarse o moverse reinicia la apertura; las pantallas de pausa o selección detienen el progreso.
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

## Vida en Plaza y Machu Picchu
Plaza de Armas incorpora reflejos y gotas animadas en la fuente, palomas pequeñas que picotean y partículas de viento discretas. Machu Picchu añade matas de ichu que oscilan y tres franjas de niebla escalonada de muy baja opacidad, debajo de los actores. La decoración no bloquea ni daña. Conserva las formas geométricas del README, pausa y movimiento reducido (sin niebla ni partículas, vegetación y aves estáticas).
