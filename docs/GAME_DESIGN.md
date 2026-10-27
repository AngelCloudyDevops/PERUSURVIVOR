Warning: truncated output (original token count: 38264)
Total output lines: 802

# Documento de diseño — PERUSURVIVOR

Estabilidad cooperativa: una excepción se limita a su sala y queda registrada; salud muestra errores y coste de tick/serialización agregados. Reconectar con el token válido sustituye la conexión anterior sin perder el grupo. El cliente procesa el último estado por fotograma, conserva el resultado final y evita recargarse automáticamente mientras tiene sala. Scripts VM compilados se reutilizan, manteniendo una VM independiente por sala. Las publicaciones solicitan reinicio al quedar el servidor sin salas: las partidas existentes no se cierran por cambiar de release (un reinicio forzado del contenedor sigue interrumpiéndolas). El backend puede permanecer temporalmente en la release anterior hasta quedar libre.

Cooperativo: señales Aquí/Peligro/Ayuda/Cofre desde el botón Señales, posición validada por servidor, 5 s de duración, una por jugador y recarga de 2 s. Ayuda funciona al estar caído. La escolta de la combi se desbloquea a los 90 s: acérquense y pulsen Iniciar escolta. Ambos vivos a 200 unidades; dos paradas de 6 s despejadas de enemigos. Vida 150, límite 100 s, reintento 20 s; premio único +50 monedas compartidas y 25% de vida a cada superviviente. Se suspende durante arenas, escenas, mejoras y desconexiones; no coincide con la defensa doble. Backend Escort/Signals serializados en activities; CoopExtras dibuja vehículo, avisos y controles sin autoridad sobre premios.

Mover A/D o flechas desplaza al propio Makanaky en tercera persona; la fila y el escenario conservan su lateral. La cámara cercana muestra el paso con perspectiva del callejón completo y a Makanaky grande desde atrás, interpuesto entre cámara y rival. Jab izquierdo, derecho, cruzado y uppercut usan poses de espalda dedicadas, embestida corporal, retroceso y estela pixel art. Conserva alcance, daño, secuencia, tarjeta y retorno al mapa.

Mantener el combo recorre siempre los cuatro golpes, aunque fallen o no queden rivales. Fallar corta la racha GA, sin reiniciar la secuencia visual. El botón de combo apunta al frente; ratón/canvas conservan la puntería manual.

Dominio: mantener clic/Espacio encadena jab izquierdo → jab derecho → cruzado izquierdo → uppercut derecho. Duración 0,34/0,34/0,46/0,60 s; daño al contacto (40 %), con 45 ms de pausa de impacto. Makanaky avanza automáticamente, da pasos y reduce la zancada al golpear; minions fijos en su fila, sin caminata de aproximación. Se conserva la tarjeta previa, el cambio de cámara y la recarga del laboratorio.

Las tarjetas de ulti siguen el contrato visual de docs/ULTIMATE_ART.md: 40 % × 82 %, borde izquierdo x=0, entrada 1,3 s y retrato dedicado. Makanaky muestra la tarjeta antes del dominio y usa seis poses cartoon pixel art de espalda para tercera persona; las reglas de combate y carga no cambian.

## Dominio de Makanaky: combos y cámaras
Makanaky: golpes encadenados jab/jab/cruzado/uppercut. Conectar suma racha GA; fallar o esperar 1,1 s la corta, sin perder energía acumulada. Uppercut añade 0,65 de alcance. Los enemigos vivos reales se presentan en oleadas de siete, con especiales al fondo; cada cuatro impactos la siguiente oleada acelera y GA×8 activa la sobrecarga morada. La cinemática protegida de 3 s aparece antes del callejón; cámaras V equivalentes en daño y alcance. Práctica administrativa con recarga explícita y oleadas infinitas gratuitas.

## Expansión de dominio · ¡BÓTAME TU GA!
Exclusiva del UR Makanaky. Carga con 35 bajas. Entrada de 3 s, combate de 9 s y salida de 1,35 s: callejón recto, avance automático, desplazamiento lateral con A/D/flechas, puntería con ratón y puñetazo con clic/Espacio o botón táctil. Entran todos los enemigos vivos reales del mapa, sin radio ni cupo, ordenados en oleadas de siete; minions caen de un golpe conectado y jefes/minijefes quedan atrás y reciben daño provisional finito (poder×4, máximo base 140). Cada combo de cuatro impactos acelera brevemente el avance y GA×8 activa una sobrecarga visual. Las zonas de invulnerabilidad de jefe se respetan. Los ataques se anuncian y se esquivan lateralmente. GA de bajas (máximo 10) potencia el remate; no recarga el dominio. El reloj del mapa queda detenido, pero el encuentro avanza. El compañero se refugia protegido detrás de Makanaky, no ataca y puede animarlo con ¡GA!; otro dominio no consume su carga mientras hay uno activo. Al volver se mantienen bajas, botín y HP, sin duplicar recompensas. La práctica recicla minions en oleadas infinitas; una partida normal solo usa los enemigos existentes. Los ataques de jefes dentro del dominio son genéricos en este prototipo; el daño se ajustará después de probarlo.

En cooperativo, cualquiera de los 18 compañeros no-Makanaky usa cuatro poses específicas: carrera agachada, cobertura, asomo tembloroso y celebración. Sigue al lanzador uno o dos pasos detrás y permanece invulnerable. Los avisos «¡CUIDADO!» indican el lateral de la amenaza y el compañero retrocede visualmente cuando Makanaky recibe daño. «¡GA!» abre una ventana de 0,7 s; si el cuarto impacto conecta dentro de ella, el impulso de la oleada dura 1,25 s en vez de 0,8 s. Esta ayuda no causa daño, no suma GA de bajas y no concede recompensas.

## Persistencia de la vista de colección
Filtros y orden se recuerdan entre visitas en el mismo navegador. Se restauran antes de presentar la colección; la prioridad de listos para ascender se recalcula con el progreso actual. Limpiar filtros también queda guardado y mantiene el criterio de orden. La sincronización entre pestañas no escribe otra vez ni consume recursos del juego. Si no hay acceso al almacenamiento, se informa que la vista solo se aplica a la sesión.



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

## Objetos de Dota 2 durante la partida
Los objetos aparecen como opciones entre las tres cartas reveladas al subir de nivel y duran solo esa partida. Inventario separado del accesorio de cofres: cuatro espacios, sin duplicados. Elegir una evolución reemplaza la versión base en el mismo espacio; los objetos no se compran ni se guardan entre partidas. Las cartas base comienzan desde nivel 2; Magic Wand puede aparecer desde nivel 4 y las evoluciones de botas y Blink Dagger desde nivel 5. La selección usa rareza para ponderar la aparición.

Familias iniciales: Boots of Speed → Phase Boots, Power Treads, Tranquil Boots, Arcane Boots o Boots of Travel; Magic Stick → Magic Wand; Blink Dagger → Swift Blink, Arcane Blink u Overwhelming Blink. Las ramas son excluyentes dentro de cada familia. Efectos adaptados: botas mejoran velocidad, cadencia, curación fuera de combate o alcance de recogida; Magic Stick/Wand acumula cargas al recibir daño y las convierte automáticamente en curación al bajar de vida; Blink y sus evoluciones realizan un escape automático al sufrir un golpe fuerte con poca vida, con recarga. Son adaptaciones propias, no una reproducción exacta de las estadísticas de Dota 2. El inventario individual se muestra en el HUD; el cooperativo aún no incorpora estos objetos.

El catálogo se consulta desde **Habilidades → Objetos de Dota**. Muestra cada objeto base, sus ramas disponibles, efectos adaptados, rareza y nivel mínimo de aparición; no es necesario iniciar una partida para revisar las evoluciones. El catálogo y las cartas de subida de nivel presentan los iconos originales de Dota 2 desde el CDN oficial de Valve; si el recurso no carga, muestran el sprite pixel art propio correspondiente.


## Poderes de personajes · primera versión
Se añaden Cerdito VTuber, Sustento, Cevichero y La G5 (18 personajes en total), y se actualizan los poderes de Kingteka, Ñajasor, Charles, Shakadoto y Fuzo.
- Kingteka: cinco balas por descarga de escopeta arcade. Cerdito VTuber comparte el arma con siete balas y más dispersión.
- Arsenal de Kingteka: escopeta física de cuatro perdigones (alcance 330, cadencia 0,92 s); Gallinazo, dos plumas guiadas especiales, hasta dos objetivos cada una (alcance 520, cadencia 1,15 s); golpe físico frontal (alcance 105, arco 120°, empuje 34, cadencia 0,78 s). El golpe mantiene daño alto en corto alcance, con una recuperación más pausada; las plumas ganan potencia y atraviesan un rival adicional. Gallinazo puede desbloquearse en nivel 2 y el golpe en nivel 4. Se alterna con `1–3` o botones HUD; durante una subida de nivel, `1–3` elige tarjeta. Solo se ofrecen tarjetas de arsenal en niveles pares y se mejora el arma activa, con cinco rangos independientes: +16 % daño y +6 % alcance por rango, cadencia +5 % (intervalo ×0,95). Rangos posteriores exigen nivel 4, 7, 10 y 13; Escopeta Contra requiere escopeta rango 5 y nivel 14. Plumas solo fijan objetivos visibles y dentro del alcance factible de vuelo. Mediciones y límites de la pasada de balance: `docs/KINGTEKA_ARSENAL_BALANCE.md`.
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
Plaza de Armas incorpora reflejos y gotas animadas en l…26264 tokens truncated… máquina: sombra previa, polvo lateral durante 1,25 s desde el aterrizaje, piedritas balísticas durante 0,9 s y grietas decorativas. La revelación secreta transforma el marco rojo en oro con los golpes de 2,35/2,75/3,15 s; los dragones normales conservan máquina roja. No añade obstáculos ni daño. Movimiento reducido conserva el cambio de color y elimina sacudidas, polvo y piedras en movimiento.

La cinemática secreta usa 6,4 s frente a 4,2 s de los dragones normales. La tarjeta anterior conserva 1,3 s. Avería 1,9–2,35 s; impactos 2,35/2,75/3,15; salida de cabezas 2,65/3,05/3,45; cuerpo y marco desde 3,85; plano protagonista 4,15–5,5; salto y despegue desde 5,05 y retorno entre 6–6,4. Ninguno de esos tiempos consume los ocho segundos de combate.

Dragón secreto: probabilidad 5 %, resuelta en la simulación y compartida por snapshot. El resto se distribuye uniformemente entre Jade, Brasa y Trueno. Alterna un elemento por pulso de 0,25 s a escala ×1,35; cada octavo pulso usa los tres a escala ×0,45 cada uno. Contra jefes, minijefes y jefes de mapa aplica ×0,7 y limita cada impacto y tick de veneno al 1 % de vida máxima antes de defensas/atributos. No usa ejecución ni daño fijo. Los ocho segundos y la velocidad ×1,6 no cambian. La máquina no muestra su figura durante los rodillos: revela tres colores normales, falla y aparece el tricéfalo.
El cierre UR de Makanaky dura 1,35 s después de los nueve segundos de combate: carga el cruzado, aplica el remate existente una sola vez a los 0,26 s y sostiene el contacto 0,08 s. Desde 0,55 s el callejón se fragmenta para revelar el mapa original. Las bajas y el combo máximo son contadores reales de esta activación, incluidos objetivos que reaparecen en práctica; el cierre no añade una segunda recompensa ni cambia el límite de daño anterior. El resumen continúa dos segundos del reloj de simulación tras volver.


Archivo reservado de Fujimori: tercer ataque del ciclo. Tres marcas fijas en línea, horizontal en fase I y vertical en fase II, con huecos transitables. Caídas a 1,1 / 1,4 / 1,7 s; solo el impacto hace 16 de daño en radio 70. Los archivadores de 72 × 48 bloquean movimiento y expedientes durante 6 s desde su caída. No se colocan pegados a paredes, coberturas ni al jefe; si no cabe la línea se usa el abanico habitual. No se acumulan más de tres. Recuperación de 1,1 s después de la última caída. Pausa congela caída y caducidad; al vencer al jefe desaparecen.

El remate real usa una pose articulada exclusiva: pies plantados, carga del brazo derecho, giro del torso, energía violeta y contacto de 80 ms. La palabra inclinada queda detrás del actor y se acerca la cámara al puño. La salida abre una grieta de suelo y desprende ladrillos de las paredes, sin cuadricular personajes o interfaz; el resultado usa el sello «LA REALEZA MANDA». Al regreso quedan grietas/polvo 3,5 s. Supervivientes normales dentro de 420 unidades reciben empuje de hasta 48 unidades y velocidad ×0,7 durante 2 s. Jefes reciben como máximo 12 unidades y reacción visual; fases de carga, aviso, furia o ulti no se desplazan ni se interrumpen. Colisiones intactas, sin daño o recompensas adicionales.

El resultado de Makanaky entra como sello con borde neón violeta y cifras reveladas en dos pasos. Desde combo máximo ×8 usa «REALEZA ABSOLUTA»; muestra valores reales, sin animar números inventados. Al regresar, una descarga se divide por ambos sentidos del perímetro y completa una sola vuelta visual en 0,55 s. Queda un borde fino hasta apagar cartel y marco a los 2 s; el centro y los controles permanecen libres. Movimiento reducido conserva marco estático y cifras sin rebote. Los minions supervivientes ralentizados llevan dos pequeñas marcas violetas bajo los pies exactamente mientras su slow está activo. Sonidos sintetizados de carga, contacto y caída de ladrillos se sincronizan por fases y se emiten una sola vez.

### El Chosicano · Última Parada
Sustituye visualmente a La Combi Final: minibús blanco y azul, cristales oscuros y letrero amarillo CHOSICA. Seis poses completas: reposo, dos de marcha, aceleración, embestida y frenado. Ruedas y marcha siguen la distancia realmente recorrida; la orientación se fija durante aviso/embestida/frenado. Permanece como jefe del portal de Campo de Marte y en Probar jefes. Conserva 1250 PV, radio 74, velocidad 48, aviso de 1,15 s y embestida de 530; mismas coberturas y recompensas.
# Sideral · UR de control

Sideral es un personaje UR de Ingenio cuyo ataque automático, **Mirada Sideral**, cubre un cono frontal de 270 unidades. Los minions normales huyen durante 0,9 s; los pesados resisten y retroceden menos, los minijefes solo sufren una interrupción breve y los jefes no abandonan su patrón. Cada objetivo obtiene 2,5 s de resistencia antes de poder ser asustado otra vez. Su evolución **Rostro prohibido** ensancha el cono y prolonga el miedo, sin convertir la rareza en daño bruto gratuito.

El Chosicano alterna embestida y bocinazo. El bocinazo fija dirección, avisa 1 s con faros y un sector de 99°, y lanza una onda frontal desde el morro: alcance 245, velocidad 650, daño especial 14, un solo impacto y bloqueo por cobertura. La franja visible y el barrido de daño avanzan juntos. Después de ambos ataques hay 1,1 s de recuperación. El frenazo añade giro visual de 0,35 s, polvo y marcas de llantas de 2,5 s; no cambia la trayectoria física después de detenerse. Movimiento reducido omite giro/polvo y deja faros estables. No se añade todavía fase doble, boletos ni derrota nueva.

El resultado de Makanaky muestra dos coronas pixel art desde combo máximo ×8; desde ×16 se iluminan con destellos pequeños. INTOCABLE exige propietario vivo y cero vida perdida durante toda la activación: golpes bloqueados o entrada protegida no cuentan, curarse después no borra el daño registrado. Es una distinción visual, sin premios ni cambios de balance. La coronación sintetizada se reproduce una vez al mostrar una distinción, con cuatro notas en ×16 y tres en el resto. Se mantienen los dos segundos del resultado y movimiento reducido.

Revancha en grupo: victoria y derrota ofrecen volver juntos a la sala (confirmación 0/2, 1/2). Ninguno puede sacar unilateralmente al otro del resultado. Ambos conectados y de acuerdo regresan al mismo grupo con selección conservada y confirmaciones de preparación canceladas. Se permite cambiar causa y escenario antes de iniciar una partida limpia, sin bonificaciones, bajas ni cofres heredados.

Fluidez de red: actores con movimiento visual entre snapshots de 40 ms; input inmediato al girar o soltar la dirección. Posición, colisión real, daño y recompensas permanecen bajo autoridad del servidor. Las escenas y teletransportes no se interpolan. FPS y latencia de red se muestran por separado en el diagnóstico de rendimiento.

Evento opcional cooperativo «Dos puestos, una causa»: disponible desde 45 s de mapa en Campo de Marte, Plaza de Armas y Machu Picchu. Activación F/botón a 110 unidades de cualquiera de los puestos. Defender ambos, con ocupantes vivos distintos a 65 unidades de su puesto, durante 15 s acumulados dentro de 45 s de mundo. No retrocede el progreso al salir, pero sigue el límite de tiempo. Reintento tras 20 s al fallar. Recompensa única: +35 monedas de equipo y 20% de curación a ambos; se reinicia en revancha.

Salir entre partidas transfiere el anfitrión al compañero y conserva código, escenario y selección. El superviviente puede invitar a otro jugador; las confirmaciones Estoy listo se reinician. Una desconexión en vestíbulo reserva 30 s antes de reasignar; una salida durante combate conserva el cierre compartido.

Cooperativo: rescates muestran flecha al caído, progreso de permanencia real (4 s) y advertencia si un enemigo vivo está a menos de 140 unidades del caído o del rescatador cercano. Es informativo; no cambia daño ni requisitos. Reconexión conserva 30 s y muestra nombre/tiempo. Amigos aceptados pueden entrar a una sala libre desde la lista sin copiar código.
Remate de equipo inicial: 20 alternancias de daño efectivo (+5% por alternancia, ventana 3 s, cadencia mínima 0,45 s por jugador). Ambos vivos, a 420 unidades como máximo, confirman en 3 s con R/botón; daño de 120 en radio 450 con cobertura; jefes reciben como máximo 4% de vida máxima y 120, sin multiplicar durante recuperación. Cooldown 20 s sin carga. No añade aturdimiento ni invulnerabilidad y se reinicia en revancha.

Primera entrega social: buscar usuario exacto, solicitud de amistad aceptada por ambos, lista persistente con Conectado/En sala/Jugando/Desconectado, invitaciones dentro del juego, sala de espera para dos con retratos animados, selección individual y mapa del anfitrión. Ambos deben pulsar Estoy listo; el botón inicia solo cuando las dos conexiones están preparadas. Los códigos permanecen para invitados. Las invitaciones vencen al minuto, no permiten entrar a salas llenas/iniciadas y no revelan información a terceros. Límite 100 relaciones por usuario, 20 solicitudes entrantes y 30 acciones sociales por minuto. Cargar figuras falla de forma recuperable y no confirma un personaje distinto del elegido.

La revelación secreta encadena un falso resultado Jade, un último giro, vapor y un seguro que salta al dorarse la máquina. Los ojos preceden a cada cabeza con desplazamientos propios; Cristorata retrocede y extiende el brazo durante su frase. El dragón se inclina para la subida y el aleteo final levanta polvo. Todo deriva de la edad autoritativa de la ulti, conserva los 6,4 s y la pausa compartida; movimiento reducido omite sacudidas, vapor y ráfagas. No añade daño ni entidades.

Revancha en grupo: victoria y derrota ofrecen volver juntos a la sala (confirmación 0/2, 1/2). Ninguno puede sacar unilateralmente al otro del resultado. Ambos conectados y de acuerdo regresan al mismo grupo con selección conservada y confirmaciones de preparación canceladas. Se permite cambiar causa y escenario antes de iniciar una partida limpia, sin bonificaciones, bajas ni cofres heredados.
El marco eléctrico de resultado se sustituye por vapor morado pixel art translúcido con chispas en los cuatro bordes. Dura exactamente los mismos 2 s; aumenta volumen, densidad y chispas desde combo máximo ×16. Ocupa como máximo 34 px de profundidad normal y 42 px intenso, reducidos proporcionalmente en móvil. No cruza el centro ni intercepta controles. Movimiento reducido conserva nubes estáticas sin chispas y solo funde la opacidad. El cartel, coronas, INTOCABLE y sus sonidos no cambian.

### Contrato visual de ataques de jefes
Los avisos de Gabinete, Guardián, Fujimori, Gallinazo y ElZeein se derivan del mismo plan que crea sus proyectiles: cantidad, ángulos, velocidad y vida. Cada trayectoria visible termina donde terminaría el proyectil por alcance, borde de arena o primera cobertura. El Guardián muestra sus doce direcciones radiales; el Gabinete y Fujimori muestran cada calle del abanico; las plumas base, de fase II y del Eclipse Carroñero muestran el recorrido de cada ráfaga. Los círculos del sello, archivos y tormenta conservan exactamente el radio de impacto.

ElZeein fija la dirección del jugador durante un aviso de 0,7 s, permanece quieto mientras carga y después dispara cinco proyectiles. Moverse durante el aviso permite esquivar; el disparo no vuelve a apuntar en el instante final. Las coberturas cortan tanto el aviso como el proyectil.

### IA táctica y diagnóstico de jefes
Los jefes y minijefes calculan rutas con el radio real de su cuerpo. Si no avanzan durante 0,42 s invalidan la ruta; si el bloqueo persiste alternan un flanqueo lateral durante 1,6 s. Una embestida fija dirección, distancia, punto final y cobertura al comenzar el aviso. Si choca, consume la carga pendiente, cancela cadenas incompatibles y entra en recuperación. La cobertura que detendrá una carga se resalta como COBERTURA SEGURA.

Al cruzar 50 % de vida, cada jefe salvo el Gallinazo ofrece una única esquiva perfecta opcional de 1,15 s. E o el botón táctil conceden 0,85 s de invulnerabilidad sin pausar la pelea; fallar no bloquea la progresión. El Gallinazo conserva su transformación cinematográfica propia. Los impactos de área se consumen una sola vez aunque un escudo absorba el daño. En Probar jefes, Diagnóstico muestra hitbox, ruta, destino, estado, flanqueo y recálculos.

### Chosicano: ¡Al fondo hay sitio!
Tercer ataque tras carga y bocinazo: aviso de 1.2 s con puerta y cobrador, cinco boletos de trayectoria fija (220 unidades/s, 11 de daño), hueco central y bloqueo por coberturas. Recupera 1.1 s; la puerta cierra en 0.3 s. Sin persecución ni nuevos enemigos.

Por petición explícita del usuario, el humo del resultado deja de ser pixel art: usa vapor suave, volumétrico y translúcido, con remolinos continuos y puntos de luz. Ocupa hasta 72 px normal y 90 px en ×16, proporcionalmente menos en móvil; el centro y controles permanecen libres. Dura 2 s y conserva reducción de movimiento. Esta excepción visual solo afecta al humo; no cambia sprites, coronas ni cartel.


El humo del resultado forma ahora una corriente cerrada por los cuatro bordes, en lugar de nubes sueltas. Una base continua de densidad mantiene la unión del vapor; dos capas de remolinos se desplazan y retuercen a distintas velocidades. Conserva los 2 s, la intensidad ×16 y el ancho periférico anterior, sin ocupar el centro ni interceptar controles. Movimiento reducido fija el flujo y omite las chispas.

El HUD de resultado de Makanaky permanece 3 segundos después de regresar al mapa; el humo del borde conserva su límite independiente de 2 segundos.

### Derrota del Chosicano
Al llegar a cero PV, el bus deja de atacar y frena en su posición. Durante 3 s la carrocería se asienta, apaga faros, sale humo y aparece FUERA DE SERVICIO. Se limpian peligros; la recompensa llega una sola vez al terminar. Pausar congela la secuencia; movimiento reducido omite inclinación, caída y humo.

### Diseño del Chosicano blanco y verde
El bus usa la referencia aportada: carrocería blanca, franja verde, frente rojo y amarillo, cuatro faros y parabrisas amplio. Seis poses del mismo vehículo mantienen ataques y derrota actuales.
La revelación del dragón incorpora un reflector cenital sobre la máquina. El aletazo mueve pliegues de cortinas y lámparas colgantes con amortiguación y desplaza una ráfaga de polvo por el suelo. En cooperativo aparece el personaje real del compañero, con pequeños saltos y celebración al revelar el dragón (más marcada con el secreto). Todo es visual, deriva de la edad de la ulti y no mueve ni modifica jugadores. Movimiento reducido conserva iluminación y texto, sin saltos o sacudidas.

### Dominio del Chosicano: Última ruta, sin frenos
Una vez al 50 % de vida, transporta visualmente a los participantes a una carretera nocturna de tres carriles. Entrada de 3 s, tres ciclos de 3.5 s y salida de 1.5 s. Cada ciclo avisa 1.6 s, fija el carril del objetivo y embiste sin perseguirlo; alterna jugadores vivos en dúo. Cambiar de carril usa controles habituales. Un atropello causa 24 de daño y pequeño desplazamiento lateral, nunca muerte automática. Sin minions ni proyectiles durante la escena. Al regresar mantiene posiciones y vida; el bus se agota 2 s. Pausa y desconexión conservan el reloj autoritativo.

### Dominio del Chosicano: persecución lateral
Sustituye los carriles por carrera automática hacia la derecha. Intro de 4.8 s: el chofer ficticio dice «Expansión de dominio. La familia es primero», levanta una cerveza, bebe, sube y conduce. Voz sintética genérica en español con subtítulos y controles de silencio. Tres acelerones de 5 s con seis obstáculos: cono y barrera se saltan; cartel bajo requiere deslizamiento. Espacio/W/↑ salta; S/↓ desliza; dos botones táctiles. Un salto por pulsación, sin doble salto; deslizamiento de .85 s con recarga. Los fallos hacen 18 de daño y un tropiezo de .65 s solo al afectado, con 1 s de protección. En dúo, ambos ven la misma carretera pero esquivan individualmente. Tras 1.2 s de salida, retorno intacto y 2 s de agotamiento.

### Probar dominio del Chosicano
En Desarrollo → Probar jefes, el Chosicano muestra «Probar dominio». Inicia la intro y la persecución con la vida actual, sin esperar el 50 %. Se bloquea durante la secuencia y permite repetir al regresar. La casilla de invencibilidad también se respeta dentro de la persecución. Solo funciona en laboratorio individual.

### Kingteka: bandada inofensiva
La transformación de 8 s atrae minions normales hacia el lanzador (90–180 unidades/s, zigzag leve y posiciones repartidas a 32–53 unidades). Cancela ataques preparados, embestidas y ráfagas; elimina proyectiles de minions al activar y bloquea contacto. Todo el equipo hace ×2 de daño mientras dura. Al volver hay una pausa de aviso de 0,6 s, sin movimiento ni ataques. Jefes/minijefes no se transforman ni pierden ataques; reciben ×1,2 de daño durante la ulti. Mímicos excluidos.

### Mejoras sin interrumpir cinemáticas
No se abre el selector de nivel durante entradas de Kingteka, cuy, paloma o Cristorata, su revelación de dragón, el remate del papel de Kingteka, el tribunal, Makanaky, la carretera del Chosicano ni entradas y salidas de Sideral y del Gallinazo. No se consume XP ni se incrementa el nivel hasta que pueda mostrarse la elección. La fase de combate normal de Sideral y los buffs activos permiten elegir tras la entrada. En cooperativo se considera la animación de cualquiera de los jugadores.

Las cinemáticas a pantalla completa ocultan todas las capas DOM del HUD (vida, minijefes, inventario, combos, rendimiento y controles). El bucle sincroniza cinematic-only antes de renderizar; se restaura al volver al combate, pausar o salir. El combate interactivo de los dominios conserva sus controles.

### Chamelín Trovo
UR: 125 PV, velocidad 185, poder 28; charcos de radio 48 duran 4 s y aplican 20 % del poder del proyectil cada 0,5 s, sin acumular superpuestos (máximo 48). Dominio: entrada protegida 2,6 s, baño jugable de 1100×760 durante 8 s y mordida protegida 0,6 s. Ambos jugadores y los enemigos conservan IA, ataques y daño real durante la fase central. Se mantienen los avisos y tiempos de ataques especiales; las cinemáticas incompatibles esperan al salir. El chorro barre desde el personaje móvil, con retardo de viaje y bloqueo por paredes; impactos cada 0,5 s hacen 30 % de su poder, defensa −20 % y velocidad −25 % por 1,1 s. El aliado usa su arma y gana carga normal, pero ninguna otra cinemática puede activarse dentro. La mordida sigue haciendo instakill normal, ×3 minijefe y ×1,90 jefe sin multiplicadores extra. Se restauran posiciones, cofres y escenario al salir; vapor/gotas duran 2 s sin daño ni protección adicional. En la prueba directa los objetivos caminan dentro y la casilla Invencible puede activarse opcionalmente.

Sideral: los aterrizajes del retroceso sacuden brevemente la cámara (último salto más fuerte), seguidos por un temblor leve de risa. Desplazamientos enteros sin reescalar sprites; movimiento reducido desactiva todo temblor. El dominio ofrece 8 s para auxiliar o saquear: jefes/minijefes están inmóviles e inmunes, con reacción pixel art de asco. Al terminar ambos jugadores vivos conservan al menos 0,8 s de protección. No puede iniciarse sobre otra cinemática a pantalla completa.

## Supervivencia del Caos

El lobby ofrece dos reglas independientes. La partida rápida conserva 300 s y una arena opcional. Supervivencia del Caos dura 1800 s en un único mapa, con ElZeein como cierre al minuto 30. Sus etapas exactas de 300 s son Calma sospechosa, Primer desorden, El mapa responde, Crisis nacional, Caos desatado y Preludio de ElZeein.

Los minijefes conservan su IA, con intervalo aleatorio de 240–360 s. Hay tres ventanas de portal: Campo usa 06:00–09:00, 13:00–17:00 y 21:00–25:00; Plaza desplaza cada ventana 35 s y Machu Picchu 70 s. Cada victoria cuenta por ventana, devuelve al mismo punto y permite otra recompensa. El reloj no avanza dentro de la arena.

Las horas anteriores son reglas internas, no información permanente del HUD. Diez segundos antes de cada apertura aparece «Se detecta una anomalía» sin cuenta regresiva. Al abrir, un aviso temporal y una flecha fijada al borde muestran dirección y distancia; cerca del portal la reemplaza el botón Entrar. El encuentro es sorpresa: la partida larga rota una vez entre el jefe del mapa, Gallinazo y Fujimori, con un desplazamiento distinto por mapa para evitar el mismo orden; la partida rápida conserva el jefe local. La identidad se revela después de cruzar.

Jerarquía del HUD: tarjeta izquierda con personaje, nivel, XP y vida; reloj, bajas y etapa en el centro; controles agrupados de sonido y pausa a la derecha. El contador de ElZeein se muestra durante los primeros 12 s de cada etapa y durante el último minuto. En la arena, una barra central sustituye esos avisos y muestra nombre, fase, vida real y «Reloj del mapa pausado». El panel de sonido reúne pista, música, efectos y enemigos; en móvil se convierte en bandeja inferior. Flecha y avisos respetan movimiento reducido y no realizan búsquedas adicionales de entidades.

Desde la segunda etapa, el director intenta una sola vez crear un obstáculo destructible a distancia segura del jugador. Rechaza colisiones y un radio de 150 u alrededor del portal. El máximo total es cinco, por lo que navegación y dibujo no crecen sin control ni cierran corredores completos. La luz usa la curva existente estirada seis veces; tintes y motas son visuales, derivan de mapTime y se omiten en arenas y con movimiento reducido.

Las seis etapas reciben un tinte visual breve, una señal de HUD y una onda de contorno de 2,2 s; la victoria de un jefe de portal agrega un pulso de 1,8 s al volver de la recompensa. No cambia el mapa elegido ni altera colisiones. `MapEvents` solo corre en Supervivencia individual: programa minieventos cada 165 s desde 2:45 y una actividad a los 12:00. Campo alterna meteoritos, picnic y cometa; Plaza, garúa, palomas y faroles; Machu, cóndor, viento y terrazas. El aviso dura 7 s, el objetivo dura 45 s y ofrece tres señales de recogida, +5 monedas cada una y +10 por completar. El minijuego único usa cinco señales, 60 s, +5 por señal y +25 al completar. Ambas actividades son opcionales, sin daño, enemigos añadidos, colisión ni estado persistente de terreno. Se aplazan ante jefe, minijefe, portal, tienda, cinemática o evento del emoliente; si un portal se abre durante una actividad, el reloj y los marcadores se ocultan hasta volver. Hay un solo estado activo y un máximo de cinco señales dibujadas por cuadro.

### Objetos Dota: vida y daño
Dos cadenas temporales: Ring of Health → Ring of Tarrasque (nivel 5) → Heart of Tarrasque (8), y Blades of Attack → Broadsword (5) → Crystalys (8) → Daedalus (11). Cada cadena reemplaza su objeto anterior en el mismo espacio del inventario de cuatro. Los anillos dan vida máxima y regeneración continua; las armas dan daño y los dos últimos añaden críticos a los impactos básicos compatibles. Los objetos base se ofrecen desde nivel 2; la oferta es aleatoria, no garantizada en cada subida.
Chamelín: la presentación encadena el sello con una pausa breve, pisotón y oleada de baldosas. El giro usa figuras completas e inercia leve; el chorro muestra pulsos, gotas y salpicaduras, baja visualmente la presión antes de la mordida. Tuberías, charcos y vapor tienen animación discreta. El contacto final sigue en +0,28 s, después las baldosas se desprenden desde el centro para revelar el mapa original. Huellas mojadas y vapor permanecen 2 s sin daño adicional. Duración, daño, debuffs y protección no cambian; movimiento reducido elimina sacudida y desplazamiento de fragmentos.
