# Documento de diseño — PERUSURVIVOR

## Regla universal de mejoras durante dominios

La experiencia continúa acumulándose mientras cualquier expansión de dominio esté activa, pero nunca se abre una selección de nivel durante su introducción, combate ni transición de salida. La mejora pendiente se presenta únicamente después de que el dominio haya desaparecido por completo y el mapa original esté restaurado. Si la experiencia acumulada concede varios niveles, las selecciones se entregan consecutivamente después de resolver la anterior. La misma regla se aplica en cooperativo y a todos los dominios actuales o futuros; un dominio nuevo debe registrar su estado en `P.Progression.domainActive()` y añadir una prueba de regresión.

## Regla universal de continuidad al cerrar dominios

La presentación dinámica usa como referencia el círculo de Kingteka: no sustituye el seguimiento normal, no cambia el zoom y no mueve actores a coordenadas de una arena. Su geometría aparece sobre el mapa y el combate continúa dentro del mismo espacio. Los objetos y cofres contenidos por la huella se hunden progresivamente, dejan de ser interactivos cuando la construcción termina y vuelven a emerger intactos durante la salida; al quedar mayormente sumergido, un sólido pierde también su colisión y la recupera al emerger, mientras conserva una marca tenue en el suelo. Mobiliario, público, acompañantes y demás sprites propios se conservan como capas visuales sin colisión. Enemigos, jugadores, proyectiles y avisos peligrosos nunca se ocultan. Cuando el dominio cambia la forma del lanzador, la presentación dinámica reproduce una transformación breve anclada al actor mientras conserva movimiento, disparos, IA y cámara; la silueta inicial, los cuadros intermedios y la forma final deben mezclarse sin un cambio instantáneo. La presentación cinematográfica puede recolocar actores, pero nunca puede liberar cámara, zoom o posiciones mediante un salto visible; debe interpolar el retorno durante su destrucción y alcanzar el encuadre ordinario antes de eliminar el estado. Movimiento reducido conserva la continuidad y elimina únicamente adornos intensos. Todo dominio nuevo debe probar que el modo dinámico mantiene cámara, zoom y coordenadas y que el último fotograma cinematográfico coincide con el primero del mapa restaurado.

Makanaky es la excepción híbrida de este contrato. En modo dinámico, **El Callejón de la Realeza** se construye durante 2,8 s alrededor del punto de activación y conserva movimiento, disparos, IA, cámara y reloj del mapa. La construcción debe mostrar piso adoquinado, fachadas por tramos, puertas, ventanas, luminarias, letrero y partículas en fases reconocibles; no se admite una huella genérica seguida de un callejón completo. Al completarse, una transición de 0,7 s mezcla esa vista con la cámara cercana del dominio original, sin trasladar al personaje ni a los enemigos reales; tercera persona queda disponible mediante `V`, pero no es la entrada predeterminada. Desde allí se conserva el minijuego manual completo de jab izquierdo, jab derecho, cruzado y uppercut; no existen golpes automáticos. Tras el remate GA, el callejón se hunde mientras reaparecen el mapa, sus objetos y sus colisiones, y la cámara vuelve sin corte. **El Baño de Trovo** usa igualmente 2,8 s: el piso, los muros visuales y los lavaderos emergen sin adquirir colisión ni trasladar actores; durante el primer 1,05 s, los ocho gestos enlazan la silueta base con las poses de Trovo sobre el mapa. El chorro, la humedad, los charcos y la mordida siguen siendo autoritativos mientras continúa el combate normal. **Audiencia de Medianoche** utiliza del mismo modo sus doce cuadros de reconstrucción durante 1,05 s, con sellos, fuego y humo locales, antes del vuelo demoníaco; no cubre la pantalla ni detiene el combate en presentación dinámica. La opción general y la casilla del laboratorio fijan la presentación al activar; cambiarla a mitad de un dominio no altera esa ejecución.

Cooperativo: R activa el dominio; G confirma el combo compartido (también disponible por botón). Las partidas activas no caducan a los 45 min; ese plazo limpia salas de espera/resultados inactivos. Se cancelan entradas pendientes al desconectar o recuperar un socket, y no se admiten entradas mientras falta un compañero. La misma pestaña conserva una credencial efímera de recuperación en sessionStorage, renovada durante la partida y pagehide; al recargar, espera la comprobación de cuenta y solicita recuperar el grupo dentro de los 30 s del servidor. Salir, vencer el plazo o cambiar de cuenta elimina la recuperación; no se guarda en localStorage ni se sincroniza entre pestañas.

Cooperativo sin barrera de separación: cada jugador puede explorar libremente; el servidor conserva sectores y colisiones alrededor de ambos, alterna el foco de aparición sin duplicar enemigos y reutiliza dos mapas de navegación. Una flecha señala al compañero lejano. Los dominios de Makanaky, Sideral y Chamelín se solicitan al servidor sin activarse localmente. Las pulsaciones breves de dominio, ulti, golpe y salto se conservan entre mensajes hasta el siguiente paso de simulación y se consumen una vez.

Estabilidad cooperativa: una excepción se limita a su sala y queda registrada; salud muestra errores y coste de tick/serialización agregados. Reconectar con el token válido sustituye la conexión anterior sin perder el grupo. El cliente procesa el último estado por fotograma, conserva el resultado final y evita recargarse automáticamente mientras tiene sala. Scripts VM compilados se reutilizan, manteniendo una VM independiente por sala. Las publicaciones solicitan reinicio al quedar el servidor sin salas: las partidas existentes no se cierran por cambiar de release (un reinicio forzado del contenedor sigue interrumpiéndolas). El backend puede permanecer temporalmente en la release anterior hasta quedar libre.

Cooperativo: señales Aquí/Peligro/Ayuda/Cofre desde el botón Señales, posición validada por servidor, 5 s de duración, una por jugador y recarga de 2 s. Ayuda funciona al estar caído. La escolta de la combi se desbloquea a los 90 s: acérquense y pulsen Iniciar escolta. Ambos vivos a 200 unidades; dos paradas de 6 s despejadas de enemigos. Vida 150, límite 100 s, reintento 20 s; premio único +50 monedas compartidas y 25% de vida a cada superviviente. Se suspende durante arenas, escenas, mejoras y desconexiones; no coincide con la defensa doble. Backend Escort/Signals serializados en activities; CoopExtras dibuja vehículo, avisos y controles sin autoridad sobre premios.

## Contrato de estadísticas y pasivas

La estructura canónica de cada personaje está documentada en [README — Contrato general de personajes](../README.md#contrato-general-de-personajes-estadísticas-pasiva-y-habilidades). Toda causa debe declarar identidad, stats base, cuatro índices físico/especial, una pasiva única, kit, progresión y pruebas. Los valores de ficha representan rango 1, una estrella y ausencia de mejoras, objetos o bonificaciones temporales.

Una pasiva debe tener condición, efecto, límite, reinicio e indicador visibles. No se aceptan aumentos permanentes sin condición ni estadísticas decorativas. Poder estimado es un resumen de progreso del mismo personaje y no una estadística de combate. Rareza regula colección y crecimiento, no poder directo.

### Taxonomía obligatoria de personajes

`P.CharacterProfiles.taxonomies` es la única fuente de nombres para raza/especie, roles, alcance, clase de daño, etiquetas funcionales y dificultad. Cada personaje declara una entrada explícita en `P.CharacterProfiles.identities`; la interfaz traduce los identificadores centrales y no escribe nombres de rol ad hoc.

- Razas/especies: Humano, Animal, Criatura / meme, Sobrenatural y Constructo.
- Roles: Vanguardia, Tirador, Hostigador, Controlador, Guardián, Apoyo y Especialista.
- Alcances: Cuerpo a cuerpo, Corto, Medio, Largo y Variable.
- Clases del kit: Físico, Especial e Híbrido.
- Etiquetas: Ráfaga, Daño sostenido, Área, Perforación, Retorno, Control, Movilidad, Curación, Resistencia, Invocación, Evolución, Alto riesgo, Daño fijo, Arsenal intercambiable y Daño continuo.
- Dificultades: Fácil, Intermedia y Avanzada.

La raza describe la forma base; skins, evoluciones y transformaciones no la reemplazan. El atributo Fuerza/Técnica/Ingenio y el canal principal Físico/Especial son campos independientes. Daño fijo identifica una habilidad que omite la fórmula de ATQ, DEF y atributo, aunque puede seguir recibiendo escudos y modificadores externos de fase.

El contrato `P.Stats` es universal para jugables, minions, minijefes y jefes. Los stats avanzados parten de valores neutrales para mantener el balance histórico y se normalizan también en cooperativo. Los snapshots antiguos de Balance se migran completando los campos nuevos con esos valores; una partida en curso conserva sus primitivas y copias de `combatStats`.

### Contrato ejecutable de causas

P.CharacterContract proyecta el estado real de cada causa en nueve piezas: tres ataques personales, una evolución por ataque, una pasiva única, una ulti Q y un dominio R. `Implementado` exige una mecánica ejecutable; `Planeado` admite un concepto aprobado sin habilitarlo; `Por definir` mantiene visible el espacio vacío. Los dos poderes de apoyo se registran como capacidad de progresión compartida y no cuentan dentro del 9/9. Wiki, ficha extensa y Balance consumen esta misma proyección.

Kingteka y Makanaky son referencias completas con 9/9. Sideral tiene 3/9 —ataque, evolución y dominio—; no se considera completo hasta implementar los ataques y evoluciones 2–3, una pasiva única y una ulti Q. El porcentaje comunica cobertura funcional, no poder ni rareza.

Kingteka usa tres armas con rangos separados. Escopeta causa parte de 260 u y evoluciona a Escopeta Contra; Gallinazo evoluciona a Gallinazo de Expedición; Golpe de cuerpo evoluciona a Golpe de Supervivencia. Cada arma progresa de rango 1 a 5 y puede evolucionar independientemente en rango 5 y nivel 14. Balance expone un multiplicador de alcance por slot además del alcance general.

Q y R no comparten recurso. Gallinazos reúne Caos, Aguante y Hazaña durante aproximadamente 55–60 s de combate. Santuario reúne Vínculo animal: cada ataque potenciado por Instinto de expedición que conecta otorga 8 %. El Santuario tiene radio 520; el daño porcentual de vida solo se aplica a minions pesados y los normales reciben daño basado en el poder. Activar una habilidad no consume la carga de la otra.

### Contrato de amenazas

P.EnemyContract normaliza las cuatro categorías. Un minion dispone de un ataque, una pasiva y una fase; un dinosaurio separa ataque, habilidad de rol y pasiva; un minijefe admite hasta tres ataques, una pasiva y dos fases; un jefe admite hasta cuatro ataques, dos pasivas y dos fases. Todos declaran rol, atributo, canal de daño y debilidad. Las mecánicas compuestas que pertenecen al mismo rasgo se presentan como una sola pasiva.

La debilidad de atributo se deriva del ciclo Fuerza → Técnica → Ingenio → Fuerza. Debilidades espaciales adicionales —espalda del tanque, agotamiento del Tirano, placas fósiles o cobertura— permanecen en la guía particular. La Wiki muestra capacidad usada/máxima y nunca inventa habilidades para llenar un espacio.

Los campos ausentes permanecen visibles: rol, ataque, habilidad de rol, pasiva o guía dicen «Por definir»; atributo, canal y debilidad sin fuente dicen «Desconocido». El editor de Balance no completa esos campos porque solo ajusta mecánicas existentes. Sus multiplicadores sí alimentan la Wiki desde la misma revisión global: vida, velocidad y defensas se presentan ya calculadas cuando hay una base estable, mientras daño, recarga, radio y duración muestran el multiplicador vigente.

Makanaky es un contrato completo. Su pasiva implementada, **Racha de la Realeza**, acumula GA ×10, prepara el siguiente ataque elegible como Golpe Real y decae gradualmente. Cuenta con HUD, autoridad cooperativa y pruebas de integración.

Mover A/D o flechas desplaza al propio Makanaky en tercera persona; la fila y el escenario conservan su lateral. La cámara cercana muestra el paso con perspectiva del callejón completo y a Makanaky grande desde atrás, interpuesto entre cámara y rival. Jab izquierdo, derecho, cruzado y uppercut usan poses de espalda dedicadas, embestida corporal, retroceso y estela pixel art. Conserva alcance, daño, secuencia, tarjeta y retorno al mapa.

Mantener el combo recorre siempre los cuatro golpes, aunque fallen o no queden rivales. Fallar corta la racha GA, sin reiniciar la secuencia visual. El botón de combo apunta al frente; ratón/canvas conservan la puntería manual.

Dominio: mantener clic/Espacio encadena jab izquierdo → jab derecho → cruzado izquierdo → uppercut derecho. Duración 0,34/0,34/0,46/0,60 s; daño al contacto (40 %), con 45 ms de pausa de impacto. Makanaky avanza automáticamente, da pasos y reduce la zancada al golpear; minions fijos en su fila, sin caminata de aproximación. Se conserva la tarjeta previa, el cambio de cámara y la recarga del laboratorio.

Las tarjetas de ulti siguen el contrato visual de docs/ULTIMATE_ART.md: 40 % × 82 %, borde izquierdo x=0, entrada 1,3 s y retrato dedicado. Makanaky muestra la tarjeta antes del dominio y usa seis poses cartoon pixel art de espalda para tercera persona; las reglas de combate y carga no cambian.

## Dominio de Makanaky: combos y cámaras
Makanaky: golpes encadenados jab/jab/cruzado/uppercut. Conectar suma racha GA; fallar o esperar 1,1 s la corta, sin perder energía acumulada. Uppercut añade 0,65 de alcance. Los enemigos vivos reales se presentan en oleadas de siete, con especiales al fondo; cada cuatro impactos la siguiente oleada acelera y GA×8 activa la sobrecarga morada. La cinemática protegida de 3 s aparece antes del callejón; cámaras V equivalentes en daño y alcance. Práctica administrativa con recarga explícita y oleadas infinitas gratuitas.

## Expansión de dominio · ¡BÓTAME TU GA!
Exclusiva del UR Makanaky. Carga con 100 puntos independientes de Q (normal 1, pesado/dinosaurio 2, minijefe 15 y jefe 25). Entrada de 3 s, combate de 9 s y salida de 1,35 s: callejón recto, avance automático, desplazamiento lateral con A/D/flechas, puntería con ratón y puñetazo con clic/Espacio o botón táctil. Entran todos los enemigos vivos reales del mapa, sin radio ni cupo, ordenados en oleadas de siete; minions caen de un golpe conectado y jefes/minijefes quedan atrás y reciben daño provisional finito (poder×4, máximo base 140). Cada combo de cuatro impactos acelera brevemente el avance y GA×8 activa una sobrecarga visual. Las zonas de invulnerabilidad de jefe se respetan. Los ataques se anuncian y se esquivan lateralmente. GA de bajas (máximo 10) potencia el remate; no recarga el dominio. El reloj del mapa queda detenido, pero el encuentro avanza. El compañero se refugia protegido detrás de Makanaky, no ataca y puede animarlo con ¡GA!; otro dominio no consume su carga mientras hay uno activo. Al volver se mantienen bajas, botín y HP, sin duplicar recompensas. La práctica recicla minions en oleadas infinitas; una partida normal solo usa los enemigos existentes. Los ataques de jefes dentro del dominio son genéricos en este prototipo; el daño se ajustará después de probarlo.

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
| Noche de Halloween | Parque nocturno, bruma, tumbas y calabazas | La Procesión de Medianoche |
| Navidad Peruana | Parque nevado, pinos, regalos y luces | El Grinch del Cercado |
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
- Arsenal de Kingteka: escopeta física de cuatro perdigones (alcance 260, cadencia 0,92 s); Gallinazo, dos plumas guiadas especiales, hasta dos objetivos cada una (alcance 520, cadencia 1,15 s); golpe físico frontal (alcance 105, arco 120°, empuje 34, cadencia 0,78 s). El golpe mantiene daño alto en corto alcance, con una recuperación más pausada; las plumas ganan potencia y atraviesan un rival adicional. Gallinazo puede desbloquearse en nivel 2 y el golpe en nivel 4. Se alterna con `1–3` o botones HUD; durante una subida de nivel, `1–3` elige tarjeta. Solo se ofrecen tarjetas de arsenal en niveles pares y se mejora el arma activa, con cinco rangos independientes: +16 % daño y +6 % alcance por rango, cadencia +5 % (intervalo ×0,95). Rangos posteriores exigen nivel 4, 7, 10 y 13. En rango 5 y nivel 14 cada arma puede evolucionar por separado: Escopeta Contra, Gallinazo de Expedición y Golpe de Supervivencia. Plumas solo fijan objetivos visibles y dentro del alcance factible de vuelo. Mediciones y límites de la pasada de balance: `docs/KINGTEKA_ARSENAL_BALANCE.md`.
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
Cada región de 1536 unidades alterna entre zonas densas, áreas de descanso, corredores y claros. Campo de Marte combina arboledas y paseos circulares; Plaza de Armas añade plazoletas pavimentadas; Machu Picchu alterna pasos y terrazas. Halloween usa cruces, diagonales y anillos de cementerio; Navidad usa explanadas de feria, pasillos paralelos y plazas radiales. La red de caminos conecta nodos compartidos con desvíos y algunas diagonales. Los obstáculos respetan un margen libre alrededor de los caminos. La geometría y las cajas persisten al volver a una zona. Se conservan los atlas pixel art.

## Escenarios estacionales

Halloween y Navidad son mapas completos seleccionables, no capas aleatorias ni recolores de Campo de Marte. Mantienen la misma escala, cámara infinita y reglas de combate. Sus miniaturas, suelo procedural, caminos y zonas son propios. El primero conserva noche violeta, bruma continua, murciélagos y faroles encendidos; el segundo sigue el ciclo día/noche con nieve continua. `prefers-reduced-motion` reduce partículas y elimina recorridos decorativos, sin alterar visibilidad de ataques.

Las siluetas usan bloques de píxel, contorno oscuro, paletas cortas y sombra anclada al pie. Halloween distribuye árboles secos, lápidas reactivas, criptas, cercas, velas y grupos de calabazas alrededor de una casona embrujada. Navidad distribuye pinos, muñecos, regalos, puestos, carrito de cacao, nacimiento y arcos de luces alrededor de un árbol grande. Los objetos son geometría sólida cuando corresponde y participan en la misma navegación que los tres escenarios base; velas y arcos son decorativos para no formar bloqueos invisibles.

En superficie, Halloween reutiliza El Fiscalizador y Navidad alterna La Paloma Brava con Makanaky. Los portales tienen nombres y estadísticas propias, pero reutilizan contratos de combate ya verificados (`stone` y `cabinet`) para no introducir daño o telegráficos sin validar. Individual y cooperativo aceptan ambos IDs. La decoración estacional no se serializa como entidades: se reconstruye determinísticamente desde el sector.

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
El reloj de mapa controla ocho etapas en 0:00, 0:08, 0:30, 1:05, 1:50, 2:50, 3:35 y 4:15; pausa, mejoras y arenas de jefes no adelantan la progresión. Pablo, Tyrone y Uniqua cubren los tres atributos desde el principio; los nacidos antes de 0:08 solo tienen contacto. Después se habilita un atacante simultáneo y en 0:30 hasta dos, con avisos largos. Tasha entra en 1:05, Austin en 2:50 y la PNP en 3:35. El jefe obligatorio sigue en 5:00 y los portadores de llaves conservan sus horarios. Las criaturas anteriores conservan el patrón y el perfil de su etapa de nacimiento. Véase «Presión de oleadas desde el primer minuto» para cadencia y recompensas.
Los límites de población suben de 16 a 80, los proyectiles de 0 a 40 y los ataques simultáneos de 0 a 8. Los pesados aparecen gradualmente (0–25 %) y conservan su resistencia parcial al cargar. El laboratorio y la prueba de rendimiento muestran el repertorio completo.
Los 18 jugables disponen de seis cuerpos completos de ataque: armas apuntadas, lanzamientos, abanico, megáfono, alas, grito y patada. Los ataques en marcha siguen la fase de los pies; en reposo muestran preparación, ejecución y recuperación. La G5 ejecuta seis fases de patada. La dirección de la pose sigue la puntería. No cambian daño, alcance ni proyectiles jugables.


## Progresión survivor por partida
Los rivales dejan experiencia (fama). Al llenar la barra, subes de nivel y el mundo se pausa. Aparecen tres cartas boca abajo y se abren automáticamente de izquierda a derecha en 0,69 s; un toque o una tecla 1–3 salta la secuencia y muestra las tres al instante, sin elegir todavía. Después se escoge exactamente una con clic o 1–3. Las cartas muestran rareza, poder/rango, comparación de estadísticas y una vista previa. La rareza modifica la probabilidad de aparición y el acabado visual, nunca multiplica el efecto; este depende del texto y del rango de la mejora. Los pactos entran en el mismo sorteo, sin crear una cuarta carta. La primera mejora requiere 6 XP; después, el requisito crece ×1,22 + 1 (redondeado), favoreciendo avances iniciales sin eliminar la curva larga. El exceso se conserva y encadena elecciones. Las cartas no se repiten: una reserva la mejora elegible del arma base en una posición aleatoria y las otras dos se sortean, ponderando más las armas. Las cartas del arsenal de Kingteka compiten en la misma selección: no se fuerza su arma activa cada dos niveles, y rango/desbloqueos siguen sus requisitos de nivel. El arma inicial puede subir hasta rango 5; se ofrecen desbloqueos de Onda causa (área), Tarjetas del caos (perforantes) y Escudo de bandas (área cercana), con un máximo de dos apoyos. Cada poder tiene cinco rangos. A partir de nivel 8, los poderes de rango 5 pueden evolucionar mediante una elección especial: el arma gana daño, alcance, proyectiles y perforación; los apoyos duplican daño y amplían alcance. Las mejoras de atributos tienen cinco rangos y no ocupan espacios de poderes. Los proyectiles de minions conservan daño, aviso y límite de amenazas; los cuatro patrones de proyectil más lentos ganan velocidad y todos reciben un destello pixel adicional de bajo coste. El HUD muestra XP, poderes, rangos y estrellas de evolución. Todo se reinicia al empezar otra partida.

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
Cada uno de los 18 personajes conserva su arma inicial y tiene al menos una evolución. La evolución principal se elige con rango 5 y nivel 8; Kingteka es la excepción de arsenal y puede evolucionar independientemente sus tres armas en rango 5 y nivel 14. «Habilidades y evoluciones» en la selección y «Habilidades» en la partida permiten recorrer personajes, consultar cinco rangos, requisitos, efectos y apoyos. Verde indica rangos obtenidos en la partida actual. La consulta pausa el individual; en cooperativo detiene únicamente la entrada local y avisa que la sala continúa. Escape y Cerrar vuelven al estado previo; las elecciones del servidor tienen prioridad.

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

Cada personaje tiene cinco rangos de Vitalidad (+8 vida/rango), Fuerza (+4% daño base/rango), Reflejos (3% menos de recarga/rango), Zapatillas (+3% velocidad base/rango) e Imán (+12% recogida base/rango), antes del crecimiento. Rareza C/R/SR/SSR/UR multiplica vida, daño y recogida por ×1,00/×1,03/×1,06/×1,09/×1,12; velocidad y recarga usan la mitad de la diferencia. El coste no cambia. Solo se aplica al individual.

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
Subida de nivel: tres tarjetas y una cuarta ocasional con icono, categoría, rareza, nombre, efecto, comparación numérica y una vista previa. Común, rara, épica y legendaria tienen marcos propios sobre la paleta carbón, crema, coral y latón. El encabezado prioriza «Elige una mejora» y el revelado encadenado evita tres interrupciones manuales. Al revelar, rara emite un brillo turquesa, épica uno violeta y legendaria suma barrido dorado, rayos pixel, expansión del marco, destello del panel y una sacudida breve; común solo gira. Son efectos cosméticos de una sola ejecución, desactivados con `prefers-reduced-motion`; no alteran las estadísticas ni la probabilidad. Las cartas generales componen una escena estática con el sprite del personaje elegido y el símbolo de su mejora: así funcionan para todo el roster sin crear un full art por estadística y nivel. Los objetos conservan su icono propio y no heredan el arte del arma equipada. Las tres armas distintivas de Kingteka mantienen full art pixel art; los PNG maestros se conservan en `public/assets/cards/` y las copias WebP de calidad 88 reducen el paquete descargable. El build evita empaquetar ambos formatos. Prompts: `docs/kingteka-card-art-prompts.json`. La elección produce impacto, destello e icono viajando al personaje; evoluciones y combos reciben presentación completa. Cooperativo conserva la espera por ambos jugadores.

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

P.Gacha resuelve cargo, devolución, desbloqueo, garantías e historial en una sola P.Meta.transaction. El resultado se guarda antes de la animación y se puede consultar de nuevo sin pagar; cerrar o recargar no vuelve a tirar. La animación comparte el bucle de dibujo, se detiene al salir/ocultar pestaña y se revela inmediatamente con movimiento reducido. La rareza conserva las estadísticas base y multiplica solo el crecimiento permanente individual.

Caminos: integrar bordes con el césped, mantener el centro legible y añadir detalles propios del mapa sin manchas grandes ni ruido excesivo. La red transitable, áreas especiales, obstáculos y colisiones se conservan. Campo tiene grano y pasto lateral; Plaza juntas de pavimento; Machu desgaste y piedra existente. Referencia: PATH_FINISH.md.



Segunda pasada de equilibrio: cada descarga de escopeta aplica 100 %, 35 % y 15 % por impactos posteriores contra el mismo enemigo; reinicia por enemigo, disparo y jugador. Minijefes usan vida base × (1 + clamp((mapTime-45)/75,0,2.6)) × 1,65 para dos jugadores. Salud fijada al nacer; laboratorio conserva base, sin ajuste por daño/nivel del jugador. Minions y jefes finales/arenas conservan salud. Ver COMBAT_BALANCE_2.md.


### Gallinazo: fase II física y ataques propios
La transformación cambia el cuerpo al atlas gallinazo-phase2-v1: cresta erizada, cuello y hombros reforzados, alas dentadas con puntas marfil y fisuras violetas. Se revela a los 2,65 s de la ulti entre rayos localizados y continúa en combate; no es una recoloración. La tarjeta anterior se sustituye por un único panel izquierdo con las proporciones de Kingteka/Fujimori.
Tras la ulti, las plumas normales pasan a Plumas serpiente: dos abanicos de nueve proyectiles ondulantes, 14 de daño, separados 0,42 s tras 1,1 s de aviso. La invocación pasa a Tormenta de azotea: tres círculos de radio 46 fijados al preparar el ataque, 18 de daño por impacto, aviso mínimo 1,1 s y golpes escalonados 0,18 s. No se colocan sobre cobertura; se respetan los bordes y la visibilidad del aviso. Las picadas mantienen sus avisos y comportamiento. Máximo global: 70 amenazas. Los rayos localizados tienen menor intensidad y no oscilan en movimiento reducido.

Cada minijefe tiene motivos sintetizados propios de entrada, aviso de ataque, agotamiento y derrota (silbato, arrullo tonal o cerámica grave). La flecha del borde indica nombre, dirección y distancia cuando su sprite está completamente fuera de vista; desaparece al volver, morir o entrar a una arena. Respeta silencio y pausa.
Variantes creativas de veteranos y élites: Pablo ingeniero con casco blanco, chaleco y pala; Tyrone musculoso con camiseta y cinturón; Uniqua abanderada del Perú; Tasha guardaespaldas de terno negro; Austin mecánico con casco blanco y llave; PNP con escudo y vara. Los élites añaden acabados propios al oficio, sin armadura genérica. Los accesorios siguen seis claves de caminata y una pose de preparación/liberación, bajo la transformación del cuerpo completo. No cambian ataques ni colisiones.

### Entrada y transformación continua del Gallinazo
La tarjeta izquierda dura 1,3 s antes de los cuatro segundos de cinemática; muestra la forma base con malla de alas, no el atlas transformado. El reloj del ojo no avanza durante la tarjeta. Combate y tiempo de mapa se congelan en ambas etapas; pausa detiene también la entrada. El erizado comienza a 1,7 s del plano: cresta y plumaje se revelan progresivamente entre 1,95–2,87 s con anclaje al mismo pie y escala de píxel, mientras el aura y los rayos crecen por separado. No añade desplazamiento horizontal al cambiar de atlas. Mantiene la gracia de 0,7 s al regresar a la arena y los ataques de fase II.
Legibilidad de minijefes: al agotarse aparece una mira grande y se mantiene +35 % desde cualquier dirección. Cada ventana aprovechada otorga 5 monedas (máximo tres), sin daño suma 10 opcionales; se acreditan una vez al equipo y el laboratorio no concede monedas. Una tarjeta lateral muestra frase de entrada durante 3 s y resumen durante 8 s de juego, con tiempo, daño total recibido durante el encuentro, contraataques y botín. Las visitas por mapa tienen tres niveles: velocidad +0/5/10 %, pequeña variación del abanico/giro y embestida +0/4/8 %, sin aumentar proyectiles ni reducir avisos; las variaciones se suprimen con 35 rivales o 24 peligros. Se conserva el escalado de salud por reloj/grupo y su tope existente. El botín base pasa de 20 a 25/30 monedas. Durante un minijefe, el límite temporal de nuevos minions queda en el 70 % (mínimo ocho) y el intervalo base se multiplica por 1,6; se excluyen apariciones a menos de 260 unidades del minijefe. No se eliminan enemigos existentes.

Los minions con oficio de rangos veterano/élite atacan según su accesorio: Pablo golpea con pala en un sector de 70/77 unidades, Tyrone da un puñetazo de 58/63,8 unidades y Uniqua barre con la bandera en un arco de 2,7 radianes y 88/96,8 unidades. Preparación mínima 0,9/0,85/0,85 s; el aviso muestra el alcance y dirección fijados antes del golpe. El impacto dura 0,28 s, causa daño una vez y respeta cobertura. Los normales conservan sus patrones originales. Se refinan casco, pala, manos y anatomía de brazos con contornos, luces y sombra.


Ambiente sonoro: agua por proximidad en Plaza (alcance 550 unidades), hojas y trinos en Campo, viento en Machu. Volumen bajo respecto a música/ataques; sin efectos físicos ni señales confundibles con avisos de peligro. Silencio y pausa se respetan. Se retira durante jefes, arenas y prácticas; trinos omitidos con seis o más voces activas.


## Lotes de gacha ×10
Una compra de diez requiere 600 monedas de saldo inicial. Cada tirada actualiza inmediatamente la colección y las garantías antes de resolver la siguiente; un personaje nuevo repetido dentro del lote devuelve monedas a partir de su segunda aparición. La colección completa al inicio bloquea compras; completarla durante un lote no cancela sus tiradas restantes. El resumen presenta diez resultados y el total de nuevos, repetidos, devoluciones y coste neto. Revelado secuencial de 4,6 segundos, botón para mostrar resultado inmediato y modo de movimiento reducido.
### Consulta de personajes
Las fichas de Causas muestran valores base de rango 1 sin mochila ni mejoras permanentes, rol descriptivo y evolución. El daño por impacto incluye powerScale; no se presenta como DPS. La rareza no cambia estas fichas base: aumenta las ganancias posteriores de estrellas y mejoras. Véase CHARACTER_PROFILES.md.

La ficha de Mejoras muestra el estado permanente efectivo y una comparación actual → siguiente rango antes de confirmar la compra. Su índice de poder pondera vida 30%, daño 35%, frecuencia 20%, velocidad 10% e imán 5%, siempre relativo a la base del mismo personaje (=100); no compara directamente geometrías de ataque distintas. Incluye proyecciones a 1★, 3★ y 5★ con los rangos actuales. Para jugadores, Reiniciar devuelve `floor(invertido × 70 / 100)` y borra los rangos permanentes, conservando estrellas y colección. Para administradores, «Restablecer a Base» también baja las estrellas a 1★, conserva copias, desbloqueo, récords e historial y persiste el nivel base. La carga del perfil admin no vuelve a maximizar rangos ni estrellas después del reinicio.

La lectura visual sigue este orden: saldo/selector, identidad y poder, cinco valores efectivos, estrellas, historial, proyecciones y compras. Las reglas secundarias permanecen en un desplegable. Etiqueta y cifra viven en la misma tarjeta para evitar cruces de fila; móvil reduce a dos columnas. Combo del Causa pertenece al HUD de combate y se oculta mientras `body.menu` esté activo.


## Historial y ascensos por copias
Desde el perfil v4 se conservan las últimas 200 tiradas. Cada recibo nuevo registra fecha/hora del dispositivo, nuevo/repetido y copias concedidas. Historial en orden inverso, filtros de rareza y resultado, 20 filas por página. Los recibos anteriores no reciben fechas inventadas.

Cada repetido entrega la devolución existente y una copia de su propio personaje mientras esté por debajo de 5★. Ascensos manuales de 1★ a 5★ con costes marginales de 2/3/4/5 copias (14 en total). Cada estrella adicional aporta 3% aditivo de vida y daño, hasta 12%, sobre el personaje con sus mejoras permanentes al empezar individual; cooperativo, prácticas y desarrollo conservan sus reglas. El ascenso no cobra monedas. Colección completa permite tiradas para copias; todos los personajes desbloqueados y a 5★ bloquea compras. Un repetido a 5★ conserva solo el reembolso. Esta regla sustituye el bloqueo anterior al completar la colección. En migración se reconocen exclusivamente los repetidos del historial v3 disponible; no se reconstruyen tiradas descartadas por el límite anterior de diez.
### Balance por rol
La rareza afecta a la obtención y al multiplicador de crecimiento, sin bonus sobre un personaje a 1★ y rango cero. La tercera pasada compara los personajes con progresión idéntica y ajusta ataques base y evolucionados. Véase ROSTER_BALANCE.md para parámetros, resultados y límites del ensayo.

Navegación de minijefes: rutas locales rodean coberturas con su radio completo, sin teletransporte ni atravesar esquinas. Recalculan ante bloqueo, cambios de terreno o desplazamiento del jugador; no inician ataques desde lejos o a través de paredes. Embestidas mantienen dirección fijada y castigo por choque. Tras el impacto, el Fiscalizador baja la guardia inclinado, la Paloma baja alas/cuerpo y el Huaco se asienta encorvado; respiración sutil desactivada con movimiento reducido. Ventana y +35 % permanecen iguales.
Los seis oficios evolucionados usan sprites raster completos con vestuario y accesorios integrados en cada dibujo: seis pasos, preparación, impacto y derrota con ojos X. Se elimina la ropa geométrica superpuesta. Los normales conservan sus láminas y los rangos siguen diferenciándose por aros y efectos. Se mantienen los ataques, daños, avisos, fases y geometría de colisión existentes.

### Verificación del balance en partidas
La comparación estática se complementa con nueve partidas automatizadas por personaje (tres mapas por tres semillas), progresión desde rango 1, sin progreso permanente ni mochila. Las decisiones usan solo las opciones ofrecidas; no se conceden evoluciones ni curación fuera de las reglas. Se evalúan por separado supervivencia a 300 s, victoria final, bajas, progresión y minijefes abatidos. Véase FULL_RUN_BALANCE.md para resultados y límites del bot; no se cambian estadísticas por una única derrota aislada.

### Gallinazo articulado: sustituye la mezcla de atlas
La cinemática y la tarjeta dibujan un rig de ocho piezas: torso/patas, cabeza, mandíbula, dos alas, cresta, primaria y collar. Las alas giran desde el hombro y las primarias desde el cañón; cresta y collar se despliegan con rotación/escala desde su raíz. El torso y las patas conservan el mismo anclaje en todos los fotogramas. No interpola la transparencia entre dos figuras.
La tarjeta izquierda muestra la forma base abriendo alas y pico, sin cresta de fase II. Su título «¡BAJO MIS ALAS!» entra en banda dorada con golpe tipográfico sincronizado al aletazo. Durante los 1,3 s de tarjeta, el jugador se mueve, los proyectiles avanzan y los demás enemigos atacan; solo el Gallinazo prepara su ulti. Al terminar comienza el plano del ojo, con la congelación cinematográfica y gracia posterior ya existentes. Pausa manual detiene todas las etapas. Los patrones y daños de fase II permanecen.
Revisión de combate de minijefes: ataques directos, áreas, bandas, nubes y extras de evolución respetan cobertura al dañar minijefes. Durante estos encuentros los proyectiles también barren el trayecto frente a paredes finas. Los avisos tienen contorno oscuro/crema por encima de efectos. Impactos breves por material (metal, plumas, cerámica), cinco fragmentos como máximo por señal y límite de 0,12 s entre señales; movimiento reducido los suprime. Cada ventana aprovechada muestra una sola vez «¡BIEN! +35 %», sin multiplicador adicional ni interrumpir ataques.


## Presentación de estrellas
El ascenso confirmado celebra la nueva estrella sin retrasar el guardado ni aplicar otra recompensa. La animación de estrella dura 1,8 s y puede omitirse cerrando el diálogo; con movimiento reducido se muestra el resultado estático. El diálogo presenta antes/después, copias gastadas/restantes y bonificación; Ver en colección selecciona el personaje ascendido. La colección muestra estrellas, vida/daño porcentual solo individual, copias y coste del próximo ascenso; personajes bloqueados no muestran estrellas ganadas ni bonificaciones.
Tribunal legendario: al regresar, el radio de 340 unidades elimina minions y muestra expedientes CASO ARCHIVADO (máximo 48). Jefes reciben 8 % de salud máxima, tope 200, sin golpe letal; respeta entrada invulnerable de minijefes y ulti del Gallinazo. Sentenciado añade 20 % de daño recibido durante 5 s, sin acumular; escudo Expediente bloquea daño durante 3 s para ambos jugadores vivos. Ambos vencen por elapsed autoritativo y viajan como propiedades serializadas; pausa y Tribunal congelan el reloj. Grietas y onda doradas son cosméticas, sin daño duplicado.
La vulnerabilidad del Tribunal muestra resplandor dorado intenso pegado a la silueta (núcleo de 1,5–3 px y halo de 12–22 px, palpitación suave de 1,1 s), doce partículas pixel art y flechas descendentes grandes con borde oscuro y luz interior, sin aros, más cartel sobre el jefe con segundos decimales, +20 % de daño recibido y barra temporal. Usa courtVerdictUntil y elapsed compartidos; desaparece exactamente al vencer o morir. El brillo se aplica sólo al dibujar el sprite, sin duplicarlo ni afectar barras o nombres. Las flechas suben y bajan 7 unidades por lado en el mismo ciclo de 1,1 s. La fase depende de elapsed y del inicio de courtVerdictUntil: pausa estable y sin timers. Las flechas señalan el debuff y no representan aturdimiento. Movimiento reducido mantiene las partículas y flechas estáticas; no agrega daño ni cambia duración.
Práctica de Fujimori: incluye ElZeein de entrenamiento, inmóvil y sin ataques, con 1800 PV persistentes. El panel muestra vida, último daño efectivo, daño de la ulti y vulnerabilidad restante. Volver a invocar jefe reemplaza únicamente ese actor, restaura su vida y limpia disparos pendientes; no recarga la ulti. Reponer objetivos conserva el jefe y su vida. Ambos controles se bloquean durante el Tribunal. Su derrota no termina la práctica ni concede bajas, botín o recarga. Se usa el combate y la sentencia reales, sin estado de QA externo.
# Laboratorio de combate
El menú principal muestra Laboratorio como destino independiente para administradores. Usa la misma estructura oscura de Wiki y Opciones, sin quitar ninguna prueba, selector, perfil de balance o herramienta de rendimiento. Balance y Administración emplean la misma jerarquía visual y abandonan el amarillo heredado en favor de los acentos coral y turquesa de las herramientas internas.
En Ajustes, un único laboratorio permite elegir cualquiera de los 18 causas y probar ataques contra objetivos invencibles o contra un jefe/minijefe. La barra permanece en la arena: cambiar un selector reinicia directamente la prueba, sin regresar al vestíbulo. Ofrece repetir, lanzar las ultis disponibles (Kingteka, Fujimori, Cuy Supremo y Paloma del Centro), recarga automática al terminar la animación, reponer objetivos, curar y activar la ulti del Gallinazo. Se puede minimizar y volver a Ajustes. Las pruebas no gastan mochila ni monedas, no requieren desbloquear el personaje y no guardan récords. La invencibilidad es fija con objetivos y opcional con jefes; el rendimiento conserva su sección independiente.

El inicio es tolerante a conexiones móviles lentas. El primer toque cambia el botón a «Preparando sprites…», anuncia la carga en una región viva, impide solicitudes duplicadas y continúa automáticamente al quedar listos los recursos. Durante la transición usa «Entrando…». Si el arranque falla, vuelve a abrir el Laboratorio con un mensaje recuperable. Los controles de eventos se activan únicamente después de entrar en una prueba; antes de eso solo se configura el ambiente y el evento elegido.

El selector «Minions al morir» ofrece tres reglas exclusivas del laboratorio: normal, reaparecer e inmortales. En reaparecer, cada minion común derrotado vuelve con toda su vida cerca del jugador después de 0,8 s. En inmortales, recibe daño y efectos normalmente, pero conserva al menos 1 PV. Los jefes, minijefes, imitadores y objetivos especiales quedan fuera de ambas reglas para conservar sus fases y resultados.

«Supervivencia · oleadas reales» inicia una prueba desde nivel 1 con arma principal base y sin apoyos, estrellas ni mejoras permanentes, cualquiera que sea el progreso de administrador. La experiencia y las elecciones de nivel siguen activas. Oleadas, presión, minijefes, portadores, cofres, clima y ciclo día/noche funcionan con las reglas de la partida individual; los objetos y buffs del mapa solo duran esa sesión. El perfil ofrece Base (sin estrellas ni mejoras permanentes) y Personalizado: multiplicadores de vida, daño, velocidad, cadencia, imán, alcance y ataque/defensa físicos/especiales entre ×0,5 y ×10; Buff global aplica ×2. La configuración se guarda en una clave local separada del progreso. La casilla «Aplicar también al modo de juego normal» hace que las partidas iniciadas desde Jugar usen el perfil con las oleadas y el progreso de nivel habituales, pero sin registrar récords ni premios permanentes. Esa variante solo se activa para administradores. Las oleadas de prueba comienzan sin invencibilidad ni recarga automática de ulti.


## Filtros y presentación de rareza
C/R/SR/SSR son etiquetas visuales para common/rare/epic/legendary existentes (60/27/10/3%). La colección combina rareza, estrellas exactas y disponibilidad de ascenso; este último exige propiedad, rango menor de cinco y copias suficientes para el siguiente coste. Un borde e indicador verde identifica los listos. Las tarjetas bloqueadas solo aparecen con Todas las estrellas y sin Solo listos. Se conserva la selección aunque los filtros la oculten, con aviso explícito. Sin coincidencias muestra mensaje y botón para limpiar. No se gasta ni asciende por filtrar.

Ultis animales: Cuy Supremo activa Estampida Suprema durante 5 s: pulso de radio 200 cada 0,5 s, daño ×0,8 de poder, empuje 12 y coraza con 50 % menos daño recibido. Paloma del Centro activa Bandada del Centro durante 6 s: radio 270, pulso cada 0,6 s, daño ×0,65 y empuje 4. Ambas terminan con remate de radio ×1,15 y daño ×2; jefes reciben 35 % del daño y no son empujados. Carga: 20 bajas, Q o botón; no recargan durante su efecto. Movimiento y ataques normales continúan. Prácticas gratuitas en Ajustes con recarga y cambio entre ambas.
Audio de oficios: avisos breves y sonidos originales de pala, puño y tela para veteranos/élites. Sólo minions visibles a menos de 360 unidades; atenuación por distancia. Máximo dos sonidos de minions a la vez, separación global de 0,14 s y repetición por tipo/fase limitada a 0,45/0,65 s. Avisos tienen prioridad sobre impactos; durante jefes su volumen baja al 25 %. Volumen de enemigos independiente, persistente y silenciable. Respeta pausa, silencio general y pestaña oculta.
# Armas mejoradas en el laboratorio
El selector «Arma principal» permite probar base (rango 1), rangos 2–5 y la evolución exclusiva de cualquiera de los 18 causas, tanto con objetivos como con jefes. Usa las mejoras reales del arma sin exigir nivel 8 ni subir el nivel del jugador. Muestra el nombre, descripción y estadísticas de la configuración; conserva la selección al cambiar de causa o repetir. Cambiarla reinicia la prueba y limpia los proyectiles, campos y animaciones anteriores. Volver a base reconstruye el arma sin acumular multiplicadores. La selección es exclusiva del laboratorio: no desbloquea evoluciones permanentes, consume recursos ni cambia los requisitos de las partidas normales o cooperativas.


## Prioridad y orden de colección
La colección se ordena por rareza (SSR→SR→R→C), estrellas o copias disponibles en sentido descendente, siempre agrupando primero a quienes pueden ascender. Dentro de cada grupo se aplica el criterio elegido y se desempata por posición original en el catálogo. Bloqueados cuentan como cero estrellas/copias. El orden predeterminado es rareza y permanece en la sesión al limpiar filtros. Se recalcula después de ascensos y cambios de progreso; no selecciona ni consume nada automáticamente.
Makanaky · La Realeza es un minijefe de parodia ficticia que alterna con la Paloma en Plaza de Armas (uno activo). Abanico de tres ondas bloqueables y pulso cercano de 110 unidades, ambos avisados; al 50 % encadena dos abanicos. Conserva navegación, agotamiento, bonus, resumen, cobertura y derrota sin daño. Cofre: Silbato del caos o 50 monedas. Disponible directamente en Probar jefes. Arte nuevo de cuatro poses, sin sustituir personajes existentes.


Contacto de ultis animales: los cuyes rebotan ligeramente al golpear y dejan polvo breve; las palomas inclinan el cuerpo, despliegan alas y sueltan pocas plumas al recuperar altura. Los rivales normales reaccionan según el lado del grupo atacante. Pisadas por grupo, sin sonidos superpuestos en cada criatura. Daño, empuje real, alcance y duración sin cambios.

Trayectorias de ultis: cuyes en cuatro grupos de tres, con entradas por lados diferentes y cruce hacia enemigos cercanos. Las palomas planean, pican hacia objetivos del alcance y recuperan altura; sin objetivos solo planean. Se conserva el daño por pulsos, radio, duración y protección. No reaparecen círculos de alcance.

Las ultis animales sustituyen las líneas de alcance y el recuadro amarillo por polvo, plumas y pequeños impactos. Los cuyes corren con seis pasos y las palomas aletean con poses de vuelo, fases desfasadas y trayectorias sin reinicios bruscos. La coraza mantiene su etiqueta; sus reglas y el daño permanecen iguales.

Entradas animales v2: Paloma prepara el vuelo, eleva alas, empuja hacia abajo y recoge las patas antes de elevarse. Cuy usa anticipación, impulso, patas recogidas, extensión para aterrizar, compresión y recuperación. Se elimina el ala artificial superpuesta. Duración, protección y daño permanecen iguales.

Las ultis de Cuy y Paloma incluyen entrada diagonal izquierda de 1,3 s. Cuy: preparación, salto, aterrizaje y polvo. Paloma: alas articuladas, despegue y plumas. El combate continúa y el lanzador queda protegido durante la entrada; se respetan pausa y movimiento reducido.

Makanaky también es jugable y está disponible sin tirada inicial, manteniendo su minijefe separado. Vida 105, velocidad 190 y potencia 20; tres ondas a alcance medio, evolución de cinco ondas perforantes. Comparte el atlas de cuatro poses, a escala de jugador; el guardado conserva colección y añade su disponibilidad. Se integra en mejoras, habilidades, laboratorio y cooperativo.


### Ajuste fino del trío
Se modera la cadencia de G5 y el daño evolucionado de G5/Fuzo, conservando sus geometrías. Cerdito recibe más daño cercano y una pequeña mejora evolucionada; conserva caída por distancia, descuento de impactos sobre un mismo enemigo, alcance, vida y velocidad. No se añade resistencia específica por enemigo ni ventaja de rareza. Parámetros y partidas en TRIO_BALANCE.md.

### Ajuste anatómico del Gallinazo articulado
Las dos alas tienen raíces, tamaños y ángulos diferenciados para mantener una silueta legible al abrirse. El torso limita la capa de ala plegada que incluía el dibujo original, con borde de plumas, para evitar una tercera ala aparente. Pico inferior más corto y giro reducido; collar cubre la unión al cuello en la forma base, y cresta/puntas marfil son más pequeñas. La arena de fase II reutiliza el mismo rig de la cinemática y conserva su pose final durante la gracia; después mueve alas y pico al cargar y disparar. No altera daño, avisos ni el combate activo durante la tarjeta.
## Cuentas opcionales

El juego permite invitado o usuario registrado. La cuenta conserva colección, estrellas, mejoras, monedas e inventario entre dispositivos; no reanuda una partida en curso. El primer guardado puede importar explícitamente al invitado sin eliminarlo. Ante versiones en conflicto, se conserva la copia local y no se suman monedas ni se fuerzan reemplazos. Las copias individuales proceden del cliente y no habilitan ranking competitivo ni premios reales. Recuperación mediante código privado mostrado una vez, sin correo configurado en esta versión. Detalles en [ACCOUNTS.md](ACCOUNTS.md).

# Apoyos y combinaciones en el laboratorio
La sección «Poderes de apoyo» ofrece dos espacios distintos con Onda causa, Tarjetas del caos y Escudo de bandas. Cada espacio permite rango 1–5 o evolución inmediata, sin nivel ni recursos. Se pueden combinar con cualquiera de las 18 armas y sus evoluciones, en objetivos o jefes. No se puede repetir el mismo apoyo. Cambiar la configuración reinicia la prueba y elimina ataques anteriores; quitar un apoyo también retira su evolución y temporizadores. La configuración se conserva al cambiar de causa y al repetir, pero no se transfiere a partidas normales.
«Activar combos compatibles» está desactivado inicialmente para permitir comparar: Onda habilita Directo viral con el arma principal; Tarjetas + Escudo habilitan Prensa blindada. Sólo se aplican los combos cuyos apoyos están equipados. La interfaz describe sus efectos y el estado activo/disponible. Son las mismas reglas y efectos del combate normal, sin desbloqueos permanentes.

### Ulti lunar del Gallinazo
Secuencia: tarjeta de 1,3 s con combate activo → despegue de 1,25 s visible en la arena → plano de cielo y luna de 4 s → sombra fija y descenso de 1,2 s con control del jugador → impacto real y recuperación de 0,7 s → dos ráfagas rápidas y una pesada. El despegue bate alas y recoge patas; el cielo mantiene el mismo rig, despliega cresta/primarias entre aura y rayos, recoge las alas y sale en picada por abajo. La caída en arena conserva dirección y alas cerradas y extiende las patas antes de tocar el suelo.
El círculo de impacto tiene radio 110 y daño 20, una vez; su objetivo se fija al volver del cielo, dentro de límites y fuera de obstáculos. La cobertura sigue protegiendo por línea de visión. Polvo, bloques y grietas comienzan al aterrizar, no dentro de la cinemática. Mientras está elevado, el jefe no recibe golpes dirigidos a su posición del suelo ni causa contacto fantasma; durante la recuperación no añade contacto al impacto. Pausa manual detiene todos los relojes. Movimiento reducido conserva el aviso y atenúa movimientos/rayos.

Al entrar se elige iniciar sesión, crear cuenta o jugar como invitado. Invitado conserva el progreso de este navegador y no sobrescribe el de una cuenta; no exige conexión al servicio de cuentas. Iniciar sesión lleva al vestíbulo con el progreso recuperado. Registro pide confirmar la contraseña y muestra el código privado antes de continuar. Recuperación aparece solo al elegir «Olvidé mi contraseña».

### Combo del Causa
Tres cartas automáticas y conservables, sin azar: Aguante impone 55 s de combate; Caos acelera con bajas limitadas y Hazaña con daño efectivo, con progreso alternativo de combate hasta 60 s. Se consumen al activar Q; no se carga durante la ulti ni con sus fuentes persistentes posteriores. Sin enemigos visibles, en pausa o muerto se detiene. Kingteka conserva una carga independiente para R: cada disparo adaptado que conecta aporta 8 % al Vínculo Animal y activar el Santuario no consume Q. Cada jugador cooperativo conserva ambas cargas de forma autoritativa; entrenamiento permite recarga libre. Detalle del combo y mediciones históricas: CAUSA_COMBO.md.

Perfil de jugador: monedas, colección con bloqueos, partidas, victorias, bajas, mejor nivel, mejor tiempo y mejor racha. Invitado nuevo conserva cuatro causas iniciales (Cristorata, Cuy, Paloma y Makanaky); las ganancias anteriores no se borran. Admin es una cuenta de pruebas: todos los personajes a 5★, mejoras a rango 5, objetos disponibles y saldo mínimo de 1.000.000. No se inventan victorias ni partidas. Laboratorio y prácticas completas se ocultan a invitados/jugadores. Estas ventajas no añaden permisos para ver o modificar cuentas ajenas.

### Rareza UR y lenguaje visual de colección
Makanaky, Sideral, Chamelín Trovo y CiriloTV pertenecen oficialmente a UR · Supremo, por encima de SSR. CiriloTV se declara directamente en el catálogo UR; su sistema propio ya no cambia su rareza durante la carga. La colección permite filtrar UR y la coloca primero al ordenar por rareza (después de los listos para ascender). Probabilidades base: C 60 %, R 27 %, SR 9 %, SSR 3 %, UR 1 %. UR reinicia ambas garantías; la garantía de 30 asegura SSR o superior y nunca rebaja un UR natural. Los recibos antiguos conservan su rareza histórica.

Las full arts comparten dibujo caricaturesco, contorno oscuro, sombreado en bloques y textura de píxel fino. La espectacularidad progresa por rareza: C usa gris acero y una escena simple; R, verde esmeralda y acentos leves; SR, azul eléctrico, pose dinámica y efectos visibles; SSR, amarillo dorado, fondo elaborado y contraste fuerte; UR, magenta/violeta neón y el máximo nivel de detalle y efectos. La identidad del personaje conserva sus colores propios; el color de rareza guía la luz, el ambiente y el marco sin teñir toda la imagen.


### Makanaky cuerpo a cuerpo
UR gratuito conservado. Base: 135 PV, velocidad 190 y daño 30. Atributo Fuerza, canal físico principal, ATQ físico 115/especial 95, DEF física 110/especial 90, perforación 5 %, resistencia de estado 12 %, regeneración 0,4, crítico 8 % ×1,5, resistencia crítica 5 %, defensa crítica 10 %, recuperación 100 % y robo de vida 3 %. El selector 1–3 alterna técnicas con rango 1–5 independiente. Puño de la Realeza: área física de 120°, daño ×1, recarga 0,60 s, alcance 100 y empuje 22; Combo de la Realeza llega a 145°, ×1,25, 125 y empuje 32. Mete cabezazos como yo: un objetivo, ×1,80, recarga 1,15 s, alcance 78 y 10 % de aturdir 0,65 s; Cabeza de concreto llega a ×2,15, alcance 90 y 18 % durante 0,8 s. GAA es un proyectil especial individual, no perforante: ×1,15, recarga 1,30 s, alcance 380 y ralentización 30 % durante 2 s. GAAAA sin escapatoria llega a ×1,45, alcance 460, seguimiento ligero y slow 40 % durante 2,5 s; enraíza 0,5 s si el objetivo ya estaba ralentizado. Jefes y minijefes solo sufren una interrupción breve, nunca aturdimiento completo.

Los Tres de la Realeza es la Q. Su medidor Respeto es independiente del dominio: puño +6, cabezazo +10 y recibir daño efectivo +5, hasta 100; la propia Q y GAA no la recargan. Requiere un objetivo a 500 unidades, busca una posición libre a su costado y no consume carga si no puede entrar. Teletransporta con 0,25 s de protección y ejecuta Puño, Cabezazo y GAA al 50 % de su daño individual; cada componente calcula crítico por separado. El blanco principal recibe los tres, los cercanos solo el medio Puño, y todo el combo concede como máximo una GA. No concede velocidad, defensa ni cadencia.

El dominio usa `ultimate.domainCharge`, separado de Respeto. Requiere 100 puntos: minion normal 1, pesado o dinosaurio 2, minijefe 15 y jefe 25. Activar Q no altera R y activar R no altera Q.

Panel exclusivo de ReySuperior: consultar hasta 20 usuarios por página, buscar nombres, entregar monedas enteras positivas (máximo 100.000 por operación, saldo máximo 10.000.000) o desbloquear un personaje existente. Nunca consume tiradas ni copias, no altera estrellas, victorias o estadísticas y no elimina contenido. Cada entrega requiere revisar destinatario y contenido, luego confirmar. El destinatario recibe las entregas en vivo con esta versión, conservando el progreso de su sesión.

Regalos en vivo: el jugador conectado recibe monedas permanentes y personajes sin salir ni reiniciar. Un personaje nuevo se añade a la colección; no sustituye al causa de la partida actual. Las monedas del mapa, vida, experiencia y ataques no cambian. La notificación es no bloqueante. Una desconexión conserva la partida y recupera los regalos pendientes al volver. No se aplican dos veces recibos repetidos.
### Música opcional aportada por el usuario

Selector persistente en cabecera: original, Tema 1, Tema 2, Alternar ambas y sin música. Volumen musical independiente; silencio general conserva prioridad. Las pistas elegidas reemplazan la melodía sintetizada y se repiten, conservando efectos y ambiente. Pausa, menú, pestaña oculta o pérdida de foco suspenden la pista sin volver al principio. No hay reproducción automática al cargar la página.


### Composición de la tarjeta del Gallinazo
La tarjeta organiza identidad arriba, retrato central y nombre del ataque abajo dentro de la cuña. El retrato conserva la forma base y su animación articulada. Luz radial, rayos de composición y trama convergen detrás del pecho; sombra proyectada y plano bajo las garras separan al personaje del fondo. Durante el grito se expanden tres arcos desde el pico; cuatro plumas pasan por delante y un brillo recorre el marco. «¡BAJO MIS» y «ALAS!» entran con retrasos distintos y golpean junto al aletazo. Efectos acotados al panel, sin flashes de pantalla.
En móvil aumenta el ancho útil y limita altura a 1,55 veces el ancho, para que el personaje y el título no queden diminutos en una franja alta. El laboratorio se oculta solo durante la tarjeta para no tapar su pie; el combate sigue activo. Movimiento reducido elimina golpe tipográfico, brillo y plumas móviles y conserva la composición estática.


La segunda fase del Gallinazo mantiene movimiento articulado de alas, cabeza, corona y collar durante el combate. Las patas y el torso permanecen anclados; el aura y los rayos rodean el plumaje sin tapar su textura.
La transformación también cambia gradualmente el plumaje a morado oscuro. Conserva pico, patas, luces y transparencias; la tarjeta sigue mostrando la forma base.
Alternar ambas mantiene el orden Tema 1 → Tema 2 → Tema 1 con transición suave de tres segundos, sin solapar música sintetizada. Volumen, silencio y pausa afectan a las dos pistas; la transición continúa desde su punto al reanudar. Se prepara la próxima pista solo cerca del final y se mantiene la actual si no está disponible.

La música predeterminada para navegadores sin preferencia guardada es Alternar ambas. Las preferencias existentes y el silencio general se respetan; cargar el juego no reproduce ni descarga música automáticamente.


Cofres (loot-opening/item) y mejoras (upgrade) conservan la música y su fundido; no cuentan como pausa musical. Pausa explícita, menú, portal, fin de partida, silencio y pérdida de visibilidad/foco detienen la música. Ambiente y voces de combate siguen ligados exclusivamente a play.

Gallinazo fase dos: al desplazarse despega suavemente, recoge las patas y bate las alas con un ciclo completo. La sombra permanece en el piso y el aura acompaña el cuerpo elevado; al detenerse baja progresivamente. No cambia la colisión ni el daño. Movimiento reducido mantiene altura estable sin oscilación.


Volumen de efectos independiente de música, inicial 70 % y persistente. Afecta ataques, impactos, avisos y enemigos; el volumen específico de enemigos es un ajuste adicional. Silencio general sigue por encima de todos. Panel móvil con controles táctiles, ancho acotado y desplazamiento vertical cuando falta altura.

Fase dos: cada ráfaga de plumas tiene su propio aletazo, sincronizado a 1,10 y 1,52 segundos. Abre y carga las alas, descarga con cuello/pico y arcos de aire y recupera entre ráfagas. Antes de la picada eleva el cuerpo, abre las alas y las recoge; después adopta una silueta de vuelo inclinado. La carga conserva su posición física.

## Atributos físicos y especiales

Ciclo Fuerza > Técnica > Ingenio > Fuerza. Ventaja 1,15; desventaja 0,90; neutral 1. Un solo atributo por actor; el canal pertenece al ataque, no a la rareza ni al botón de ulti. F/T/I evita depender exclusivamente del color.

`daño = daño_base_de_habilidad × 2A/(A+D) × ventaja`. Ataques y defensas son índices positivos acotados 1–1000; entradas no finitas vuelven a 100. No hay inmunidad por defensa. Poder, rangos, caída de escopeta, armadura de carga, equipo y ventanas de contraataque conservan sus reglas. La defensa se calcula una vez en la ruta del blanco, antes de equipo/feedback. El daño fijo de ejecuciones de Tribunal/Dominio y la sentencia porcentual mantiene los topes originales, sin ventaja elemental.

Especialidad del personaje: índice principal 100, secundario 85. Defensas 90–110 según papel. La rareza no cambia directamente estos índices; multiplica las ganancias externas de progreso. Escopetas, micrófonos, bumeranes y golpes: físicos según ficha; discursos, emotes, nubes, ondas y tarjetas de apoyo: especiales. Extras persistentes de evolución conservan el tipo especial; otros extras usan el tipo principal. Contacto enemigo físico; proyectiles normales especiales y golpes de oficio físicos; las plumas/conos de minijefe son físicos, quake/flash especiales.

Minions 0/3 Fuerza, 1/4 Técnica, 2/5 Ingenio; pesados defensa física 110/especial 90. Minijefes: Fiscalizador y Makanaky Fuerza, Paloma Brava Técnica, Huaco Ingenio. Jefes finales Fuerza; Gallinazo Ingenio. Invocaciones de Gallinazo Ingenio. No modificar atributos durante el combate. Los proyectiles copian las estadísticas del dueño al nacer.

## Presión de oleadas desde el primer minuto

Cada ciclo de 30 s tiene EMPUJE entre los segundos 8–20: intervalo base ×0,72. El resto es RESPIRO: ×1,05. Solo cambia el ritmo de nacimiento; las unidades existentes no reciben acelerones ni vida de golpe. Los caps de cada etapa siguen en 16/24/32/40/48/60/72/80; máximos normales 40 peligros y 8 atacantes simultáneos. Cada tick crea como máximo un minion y prueba hasta ocho posiciones. No se compensan apariciones perdidas por pausa o saturación.

Los tres diseños iniciales cubren Fuerza/Técnica/Ingenio, con sus ataques y avisos originales escalados por etapa. Primeros ocho segundos: contacto, sin ataques especiales. Luego un atacante y desde 0:30 dos. Todos los avisos conservan cámara, cobertura y dirección fijada. Los veteranos/élites mantienen sus umbrales previos.

Perfil fijado al nacer: infantería 90 + tiempo×0,06 (máximo 110); corredor, uno de cada cinco seriales no pesados, 134 + tiempo×0,045 (máximo 150) y vida ×0,85 redondeada; pesado 65 + tiempo×0,05 (máximo 80). Los rangos evolucionados aplican después sus multiplicadores existentes. No afecta a laboratorio, arenas opcionales ni jefes. Fama de oleada: corredor 0,5; infantería 0,75; pesado 2,25. Es una compensación fija por mayor densidad, sin depender de las estadísticas o la rareza del jugador. Minijefes conservan 12 de fama.

Los puntos de aparición quedan fuera del rectángulo visible ampliado 90 u, y al menos a 230 u de todos los jugadores vivos. En cooperativo se usa la unión de sus cámaras autoritativas, incluso si difieren. Los obstáculos sólidos impiden el spawn; no se teletransporta un enemigo dentro del campo visible al fallar un intento. Durante minijefe no se acumula el EMPUJE: cap ×0,7 (mínimo ocho), intervalo base ×1,6, exclusión a 260 u del minijefe.

Vida y velocidad base son stats de rol. La rareza no las altera en rango cero; al invertir en estrellas o mejoras permanentes, sí multiplica su crecimiento según las reglas de progresión individual. Esta pasada de oleadas no modifica fichas, atributos ni canales físico/especial.

Antes del despegue lunar, la cámara encuadra al Gallinazo junto al jugador durante el final de la tarjeta. Acompaña la altura visual del jefe y abre el plano para conservar al jugador dentro de márgenes seguros, también en móvil. El combate continúa durante tarjeta y despegue. Una transición de 0,35 s enlaza el último fotograma de la arena con el cielo; movimiento reducido conserva la cámara habitual.

### Fujimori: El Expediente Final
Jefe opcional alternativo del portal del minuto 3, además de su versión jugable. Arena Archivo del Expediente Final, reutiliza el salón y sus coberturas. 1600 PV. Alterna abanico de expedientes bloqueables y sello de área fijado a la posición al avisar (1,1 s para salir). Al 50 % aumenta el abanico de 5 a 7 y el radio del sello de 85 a 105. Recuperación visible de 1,1 s tras atacar. Disponible en Probar jefes, con reinicio y curación habituales.

Picada lunar: apunta a la posición del jugador al comenzar el descenso y conserva la marca fija para permitir esquivar. La cámara sigue la altura visual del jefe manteniendo al jugador visible, enlaza el cielo con la arena en 0,32 s y regresa durante 0,95 s tras el impacto. El choque añade sacudida de 0,42 s, onda de presión, sonido y mayor dispersión de escombros/polvo. Movimiento reducido omite la sacudida. Daño y radio no cambian.

Continuidad nocturna del Gallinazo: panorama extendido de Lima cubre el encuadre completo al subir/abrir el plano. La arena conserva su geometría y textura, con iluminación azul violeta que progresa durante tarjeta/despegue y permanece durante cielo, caída y segunda fase. El horizonte cálido se desvanece en el nuevo cielo; no reaparece de día al impactar.

El panorama nocturno usa parallax leve respecto de la cámara, mientras la azotea permanece fija en el mundo. Durante la tarjeta, el exterior diurno desaparece antes del despegue y la zona jugable se mezcla por separado con su versión nocturna; así no se superponen dos horizontes ni se percibe la arena como un rectángulo pegado sobre Lima.

La apertura de cámara comienza antes y acelera gradualmente. El panorama absorbe solo una fracción del cambio de zoom, mientras una capa atmosférica del cielo deriva con el reloj de la secuencia. La azotea conserva la escala física completa: el resultado debe leerse como una cámara elevándose sobre Lima, no como una imagen estática ampliada.

La composición utiliza únicamente el cielo y la ciudad lejana del panorama nocturno. Las azoteas cercanas de la ilustración quedan recortadas porque entrarían detrás y debajo del piso jugable, creando una perspectiva imposible durante el ascenso.

El panorama termina físicamente en la línea del parapeto superior. Nunca se dibujan edificios en los laterales inferiores ni debajo de la plataforma; esa zona pertenece exclusivamente a la estructura de la arena.

La versión de producción utiliza una lámina nocturna completa de la misma azotea y perspectiva, no un panorama frontal superpuesto. Día y noche comparten el mismo plano físico. La cámara conserva como zoom mínimo la cobertura de esa lámina, por lo que nunca descubre un segundo paisaje debajo del suelo.

Cuando el seguimiento asciende por encima del borde superior de la lámina, la extensión contiene únicamente el cielo lunar de la cinemática. No repite ciudad ni arquitectura y enlaza visualmente con el siguiente plano.

Una máscara vertical corta funde exclusivamente el borde superior de las láminas diurna y nocturna con ese cielo. Los costados y la parte inferior permanecen opacos para conservar la estructura física de la azotea.
Fujimori jefe tiene atlas propio de 16 poses: reposo y pasos, preparación/lanzamiento de expedientes, preparación/golpe de sello y cuatro etapas de derrota. La derrota dura 2,8 s, despeja los ataques y congela el combate antes de entregar una sola recompensa. Pausa detiene la secuencia; movimiento reducido mantiene la pose final y un fundido. Los avisos, daño y ventanas de contraataque no cambian.

Pulido de fase dos: alas abiertas en reposo y vuelo, aleteo más lento con menor oscilación vertical, recuperación de ráfagas hacia la misma postura y orientación según desplazamiento real. Una sola aura acompaña al rig; descargas violetas cortas e intermitentes sustituyen los rayos gruesos que tapaban el cuerpo. Los menús automáticos de mejora se aplazan hasta terminar la llegada y recuperación de la ulti, sin gastar ni perder XP; pausa manual permanece disponible.
Sello de Fujimori: conserva 1,1 s de aviso y la posición fijada al iniciarlo. En los últimos 0,42 s cae desde el cielo sobre una sombra creciente. El contacto visual con el suelo coincide con la creación del único golpe de área; el sello queda 0,6 s antes de desaparecer, con polvo, papeles y una sacudida de 0,18 s. Pausa congela todo; movimiento reducido muestra una anticipación estática y elimina sacudida y partículas. Daño, radio y ventana de contraataque se conservan.


El fondo exterior del Gallinazo debe mostrar una ciudad lejana legible, sin ampliar píxeles hasta competir con los personajes. La capa exterior usa el original completo y filtrado suave; el piso y los actores conservan su acabado nítido. La mejora es visual y no modifica cámara, límites ni combate.

Mezcla clara: las pistas grabadas se calibran a 0,18 del volumen elegido para equilibrarlas con efectos Web Audio; la música sintetizada usa 0,85. Golpes y avisos reducen temporalmente la música al 25–45 % durante 0,14–0,35 s, con recuperación de 0,4 s. Los minions ganan presencia ×1,6 conservando distancia, prioridad, cupos y su volumen independiente. Silencio de efectos no activa reducción de música; las preferencias guardadas no cambian.

Ataques visuales del Gallinazo: las plumas base usan el arte detallado existente, el ala de fase dos carga tres primarias antes de cada ráfaga y las libera con el aletazo. Tormenta de plumas conserva tres áreas y tiempos de impacto; desde 0,42 s antes se ve una pluma grande cargada que cae hasta clavar la punta en cada marca, con fragmentos y polvo posteriores. Los props visuales no causan daño adicional.
Identidad sonora del Gallinazo: graznido descendente, aleteo pesado, silbido de plumas, caída en picada, impacto de suelo y derrota usan seis firmas sintetizadas diferentes. Cada evento acompaña su animación tanto en el combate normal como en el remate, la secuencia lunar y la fase dos. Cada firma tiene un intervalo mínimo propio, utiliza como máximo tres voces y comparte la atenuación musical para evitar saturación.

Sin objetivos, la estampida de Cuy corre en órbitas elípticas y la bandada de Paloma alterna aleteo y planeo con cambios de altura. Ambas orientan su cuerpo según el desplazamiento; no añaden daño ni cambian el radio de la ulti. Movimiento reducido conserva poses quietas.

Cristorata carga las tres cartas comunes de ulti. Tarjeta izquierda estándar: 1,3 s de combate continuo e invulnerabilidad. Luego, cinemática completa de 4,2 s: reloj, jugadores, enemigos, proyectiles y otras ultis quedan congelados en individual y cooperativo. Al volver empiezan los ocho segundos completos de montura; recibir daño vuelve a ser posible. Montura: ocho segundos, velocidad ×1,6, fase sobre sólidos y fuente, límites de jefe conservados. Ataques especiales cada 0,25 s, adquisición inicial de 230 u más radio del enemigo. Jade: cono (coseno ≥0,78), impacto de 0,18 × poder y veneno refrescable de 1,5 s, 0,22 × poder cada 0,5 s, sin apilar por lanzador. Brasa: mismo cono, 0,35 × poder y foco hasta ×2 sobre el objetivo principal tras tres segundos; cambiar/perder objetivo reinicia. Trueno: 0,4 × poder al objetivo inicial y hasta dos saltos de 140 u más radio del siguiente rival, multiplicando el daño por 0,65 por salto, sin repetir objetivos. No carga su propia ulti. Al desmontar se comprueba el terreno y se vuelve al último punto seguro si hace falta. Tres variantes con identidad de ataque propia. El veneno conserva dueño y marca de ulti, continúa hasta 1,5 s después del último impacto y se congela en las cinemáticas.
# Fondo reactivo de Campo de Marte

El fondo del mapa principal evoluciona antes del jefe final. La intensidad combina tiempo de partida, amenazas cercanas, vida baja y eventos mayores. Los enemigos normales aumentan gradualmente el viento; pesados y minijefes pesan más; la llegada del jefe final y la activación de una ulti generan una sola onda ambiental breve. La respuesta es informativa y estética: no concede ventajas, no modifica el terreno y no esconde proyectiles.

Las reacciones se mantienen cerca de la cámara y del evento. La onda alcanza 190 unidades para arbustos, dura 1,2 segundos y no se repite mientras la misma ulti siga activa. Movimiento reducido elimina ondas, ráfagas y reacciones adicionales. Pausa congela el reloj ambiental.

Dominio de Makanaky: entrada de 3 s a pantalla completa, excepción explícita a las tarjetas laterales. DomainIntro dibuja ocho figuras completas de manos y la construcción escalonada del callejón a resolución nativa. El progreso depende exclusivamente de domain.age; no altera estado ni usa timers para avanzar. Domain.entry es compartido por servidor/cliente; ambos jugadores quedan protegidos y los relojes del mapa congelados. Combate posterior conserva 9 s y retorno 1,35 s. Se precarga el atlas y se permite reintento si falla. Sonidos de sello/impacto/construcción originales, sin grabación de voz atribuida al streamer.

La entrada UR anuncia «EXPANSIÓN DE DOMINIO» antes de «¡BÓTAME TU GAAAA!»: atenúa la música, suspende motas durante el sello, acerca el retrato y rompe el suelo con energía violeta. El nombre del callejón remata la construcción y los últimos 0,42 s mezclan la cámara real de combate, sin prolongar los 3 s ni cambiar protección/tiempos.

Laboratorio de Cristorata: permite fijar la variante de la próxima ulti. Solo se admite en una prueba local activa de administrador (devRun y TestBench.active), nunca en simulación del servidor ni cooperativo. Aleatorio conserva el 5 % secreto. La selección no modifica una ulti en curso.

Impacto de la máquina: sombra previa, polvo lateral durante 1,25 s desde el aterrizaje, piedritas balísticas durante 0,9 s y grietas decorativas. La revelación secreta transforma el marco rojo en oro con los golpes de 2,35/2,75/3,15 s; los dragones normales conservan máquina roja. No añade obstáculos ni daño. Movimiento reducido conserva el cambio de color y elimina sacudidas, polvo y piedras en movimiento.

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
UR: 125 PV, velocidad 185, poder 28; charcos de radio 48 duran 4 s y aplican 15 % del daño base del arma cada 0,5 s, sin acumular superpuestos (máximo 48). Dominio: entrada protegida 2,6 s, baño jugable de 1100×760 durante 8 s y mordida protegida 0,6 s. Ambos jugadores y los enemigos conservan IA, ataques y daño real durante la fase central. Se mantienen los avisos y tiempos de ataques especiales; las cinemáticas incompatibles esperan al salir. El chorro barre desde el personaje móvil, con retardo de viaje y bloqueo por paredes; impactos cada 0,5 s hacen 30 % de su poder, defensa −20 % y velocidad −25 % por 1,1 s. El aliado usa su arma y gana carga normal, pero ninguna otra cinemática puede activarse dentro. La mordida sigue haciendo instakill normal, ×3 minijefe y ×1,90 jefe sin multiplicadores extra. Se restauran posiciones, cofres y escenario al salir; vapor/gotas duran 2 s sin daño ni protección adicional. En la prueba directa los objetivos caminan dentro y la casilla Invencible puede activarse opcionalmente.

Sideral: los aterrizajes del retroceso sacuden brevemente la cámara (último salto más fuerte), seguidos por un temblor leve de risa. Desplazamientos enteros sin reescalar sprites; movimiento reducido desactiva todo temblor. El dominio ofrece 8 s para auxiliar o saquear: jefes/minijefes están inmóviles e inmunes, con reacción pixel art de asco. Al terminar ambos jugadores vivos conservan al menos 0,8 s de protección. No puede iniciarse sobre otra cinemática a pantalla completa.

Sideral admite dos presentaciones elegibles en Opciones. **Cinemática** conserva la introducción completa de 5,6 s. **Dominio dinámico** usa una construcción jugable de 2,6 s: el suelo de la habitación se extiende desde el punto de activación, los objetos y cofres cubiertos se hunden, los cuatro muros emergen por tramos y escritorio, biblioteca, sofá y silla se materializan con polvo y fragmentos violetas mientras movimiento, disparos, enemigos y HUD continúan activos. El anuncio usa la misma jerarquía espectacular de Kingteka —«EXPANSIÓN DE DOMINIO» arriba y «HABITACIÓN DEL LAGARTO» en dos líneas abajo— con gradiente, resplandor y anillo expansivo, sin cubrir la acción central. La habitación dinámica es una proyección visual sin colisión ni traslado; conserva los mismos 8 s y pulsos. Los cofres sumergidos no pueden abrirse y reaparecen sin perder contenido durante la salida de 1,35 s. La cinemática conserva su cierre de 0,95 s y su arena física. La presentación elegida queda fijada al activar el dominio y, en cooperativo, viaja con la orden al servidor para que ambos jugadores compartan la misma duración. En el laboratorio una sola casilla compacta **Presentación dinámica** elige el modo de la siguiente activación; desmarcada usa la cinemática y el botón normal **Activar dominio · R** ejecuta la selección sin añadir botones flotantes al combate.

## Supervivencia del Caos

El lobby ofrece dos reglas independientes. La partida rápida conserva 300 s y una arena opcional. Supervivencia del Caos dura 1800 s en un único mapa, con ElZeein como cierre al minuto 30. Sus etapas exactas de 300 s son Calma sospechosa, Primer desorden, El mapa responde, Crisis nacional, Caos desatado y Preludio de ElZeein.

Los minijefes conservan su IA, con intervalo aleatorio de 240–360 s. Hay tres ventanas de portal: Campo usa 06:00–09:00, 13:00–17:00 y 21:00–25:00; Plaza desplaza cada ventana 35 s y Machu Picchu 70 s. Cada victoria cuenta por ventana, devuelve al mismo punto y permite otra recompensa. El reloj no avanza dentro de la arena.

Las horas anteriores son reglas internas, no información permanente del HUD. Diez segundos antes de cada apertura aparece «Se detecta una anomalía» sin cuenta regresiva. Al abrir, un aviso temporal y una flecha fijada al borde muestran dirección y distancia; cerca del portal la reemplaza el botón Entrar. El encuentro es sorpresa: la partida larga rota una vez entre el jefe del mapa, Gallinazo y Fujimori, con un desplazamiento distinto por mapa para evitar el mismo orden; la partida rápida conserva el jefe local. La identidad se revela después de cruzar.

Jerarquía del HUD: tarjeta izquierda con personaje, nivel, XP y vida; reloj, bajas y etapa en el centro; controles agrupados de sonido y pausa a la derecha. El contador de ElZeein se muestra durante los primeros 12 s de cada etapa y durante el último minuto. En la arena, una barra central sustituye esos avisos y muestra nombre, fase, vida real y «Reloj del mapa pausado». El panel de sonido reúne pista, música, efectos y enemigos; en móvil se convierte en bandeja inferior. Flecha y avisos respetan movimiento reducido y no realizan búsquedas adicionales de entidades.

Desde la segunda etapa, el director intenta una sola vez crear un obstáculo destructible a distancia segura del jugador. Rechaza colisiones y un radio de 150 u alrededor del portal. El máximo total es cinco, por lo que navegación y dibujo no crecen sin control ni cierran corredores completos. Al comenzar Supervivencia se elige una hora inicial entre mañana gris y fría, mediodía claro, tarde cálida, atardecer naranja y noche azul oscura. Las cinco horas rotan desde ese punto de partida, de modo que cada partida puede abrir con un ambiente distinto; la tormenta final gris azulada siempre ocupa los últimos cinco minutos. La transición visual empieza 18 s antes del límite, pero el nombre cambia exactamente al cumplir cada bloque de cinco minutos. El HUD muestra emoji, nombre, clima activo y tiempo hasta el siguiente cambio. La tormenta final mantiene lluvia fuerte; en Machu combina niebla y lluvia. Garúa, niebla, bruma y nieve permanecen visibles con movimiento reducido, pero con menos elementos y sin deriva intensa.

La presión de enemigos conserva el tope de 80 en Partida rápida. En Supervivencia, desde la segunda etapa el presupuesto añade cuatro rivales por etapa hasta un máximo de 100. Un minijefe reserva solo 15 % de ese presupuesto (85 rivales en la etapa final) y retrasa cada aparición 45 %, evitando el recorte anterior de 56 sin convertir la pantalla en una acumulación sin control.

Las seis etapas reciben una señal visual breve y una onda de contorno de 2,2 s; derrotar al jefe del portal agrega un pulso de 1,8 s al volver de la recompensa. El mapa seleccionado se mantiene durante la partida. MapEvents corre solo en Supervivencia individual: minieventos cada 165 s desde 2:45 y una actividad a los 12:00. Campo alterna meteoritos, picnic y cometa; Plaza, garúa, palomas y faroles; Machu, cóndor, viento y terrazas. El aviso dura 7 s, el objetivo 45 s y ofrece tres señales (+5 monedas cada una y +10 al completar). El minijuego usa cinco señales durante 60 s (+5 por señal y +25 al completar). Ambas actividades son opcionales, sin daño, enemigos añadidos, colisión ni cambios permanentes del terreno. Se aplazan ante jefes, minijefes, portales, tienda o evento del emoliente. Un máximo de cinco señales se dibuja por cuadro.

### Objetos Dota: vida y daño
Dos cadenas temporales: Ring of Health → Ring of Tarrasque (nivel 5) → Heart of Tarrasque (8), y Blades of Attack → Broadsword (5) → Crystalys (8) → Daedalus (11). Cada cadena reemplaza su objeto anterior en el mismo espacio del inventario de cuatro. Los anillos dan vida máxima y regeneración continua; las armas dan daño y los dos últimos añaden críticos a los impactos básicos compatibles. Los objetos base se ofrecen desde nivel 2; la oferta es aleatoria, no garantizada en cada subida.
Chamelín: la presentación encadena el sello con una pausa breve, pisotón y oleada de baldosas. El giro usa figuras completas e inercia leve; el chorro muestra pulsos, gotas y salpicaduras, baja visualmente la presión antes de la mordida. Tuberías, charcos y vapor tienen animación discreta. El contacto final sigue en +0,28 s, después las baldosas se desprenden desde el centro para revelar el mapa original. Huellas mojadas y vapor permanecen 2 s sin daño adicional. Duración, daño, debuffs y protección no cambian; movimiento reducido elimina sacudida y desplazamiento de fragmentos.

Chamelín — balance de zonas: el proyectil directo multiplica por 0,15; el charco usa la potencia previa a ese coeficiente, aplica 0,15 cada 0,5 s (0,30/s) durante 4 s y no suma zonas solapadas. Ralentización espacial mientras permanece dentro: normales 20 %, jefes y minijefes 10 %, salida inmediata al abandonar la zona o expirar. Entre charco y chorro se aplica el mayor slow de Chamelín, sin multiplicarlos. Los charcos no modifican defensa física ni especial. El dominio, su daño y la mordida no cambian.

### Cirilo UR: Audiencia de Medianoche
La Audiencia es una Expansión de Dominio y se activa exclusivamente desde la carta **R**, compartiendo el medidor de carga general pero no el botón **Q** de ulti. Durante su fase jugable Cirilo despega en 0,58 s, conserva sombra de suelo, alterna aleteo, se inclina hacia el movimiento y aterriza durante los últimos 0,72 s. Movimiento reducido mantiene las alturas y tiempos, pero elimina balanceo, inclinación y polvo.

La entrada conserva el estado de origen: forma completa de pie, brazos vendados o silla según el nivel. La reconstrucción empieza desde el primer paso que realmente falta y el cierre devuelve exactamente esa forma, salvo que la resurrección de nivel 20 ya haya vuelto permanente al demonio. La cinemática dura 4,6 s y usa un atlas transparente 4×3 de doce cuadros: sello corporal, brazos, piernas, terno, cuernos, alas plegadas, alas abiertas, ascenso y descenso. La mezcla limita el aleteo a una señal cada 0,62 s y encadena sello, reconstrucción, rugido, despegue, llamarada, impacto, martillazos, reacción del público, aterrizaje y ruptura. **Q** permanece visible y deshabilitada como `ULTI · PRÓXIMAMENTE`.

La preferencia **Dominios dinámicos** ofrece una segunda presentación de 3,2 s. El combate, el desplazamiento, los disparos y la IA continúan mientras el piso del tribunal se extiende, las paredes y bancadas emergen con polvo y escombros, aparece el nombre `AUDIENCIA DE MEDIANOCHE`, se levanta el estrado y se materializan Sandy y el público animado. Todo el tribunal dinámico es decoración visual sin colisión ni traslado. Su ancla queda fijada en el punto de lanzamiento durante toda la construcción: la explosión final no vuelve a centrar la corte alrededor de Cirilo ni cambia la referencia visual de su desplazamiento. Antes del atlas aéreo, Cirilo enlaza en orden alas abiertas, elevación vertical e inclinación hacia delante, y mezcla la última pose durante 0,12 s con el primer aleteo; al cerrar, la cámara y el zoom continúan siguiendo al jugador sin retorno, sacudida ni recentrado. El cierre dinámico limpia cualquier marca heredada de retorno sin aplicarla: la posición final siempre es la posición jugable actual, incluso tras actualizar durante una partida. La presentación cinemática conserva su duración, arena física y puesta en escena original. En el laboratorio, un check compacto visible únicamente para Cirilo permite alternar ambas variantes antes de lanzar la carta R; desmarcado equivale a cinemática.

La carta R usa arte vertical propio. El sello acerca la cámara al cuerpo y a las manos reales conectadas; no usa recuadro ni manos espectrales independientes. Los espectadores se reparten en tres reacciones deterministas —miedo, celebración y protección— y el murmullo se limita a un pulso suave cada 1,45 s, separado del ciclo de Sandy. El sello normal dice `CULPABLE`; minijefes y jefes reciben respectivamente `CONDENA MAYOR` y `SENTENCIA FIRME`, con mayor tamaño y onda dorada. En cooperativo el dueño queda a −115 unidades del centro y el aliado a +135, ambos en la franja frontal y fuera del estrado, y una elipse celeste marca al aliado sin dibujarse sobre su sprite.

En móvil el zoom del tribunal baja hasta 0,38 para mantener la arena completa dentro del ancho disponible. La introducción es una presentación limpia de 4,6 s: oculta las capas DOM, centra un único texto por fase, acerca manos y rostro, abre el plano durante la transformación y acompaña el descenso mientras ascienden suelo, paredes, gradas y estrado. Cirilo alterna alas plegadas, abiertas, extendidas y abiertas a 8 fps, con estelas y una oscilación vertical de 9 unidades. Sandy se recorta desde seis celdas de un atlas 1536×512 y se presenta a 205 unidades de altura. El sello usa barrido lateral, dos acercamientos y un golpe de cámara en la sentencia. La construcción se divide en suelo agrietado, paredes/gradas y estrado, con rayos y píxeles ascendentes; la salida ejecuta una sentencia final, onda dorada, ruptura radial y disolución sobre el mapa restaurado. Los temblores solo aparecen en sello, materialización, martillazo y ruptura, y se desactivan con movimiento reducido. La selección de mejoras permanece bloqueada durante toda la Audiencia, y todo enemigo creado durante ella se incorpora a una plaza libre y queda confinado al interior del tribunal.

### Herramienta admin de balance
El Centro de balance separa **Causas** y **Enemigos**, muestra la revisión global y cuenta cuántos elementos poseen ajustes. Por personaje permite editar vida (25–2000), daño base (1–300), velocidad (50–500), recarga (0,15–5 s), alcance (0,25–3×) y ratings avanzados. No concede progresión ni cambia la rareza.

Los enemigos se filtran como minions, dinosaurios, minijefes y jefes. Cada ficha modifica mediante multiplicadores la vida (0,25–5×), daño (0,25–5×), velocidad (0,25–3×), defensa física (0,25–3×), defensa especial (0,25–3×), recarga de habilidades (0,25–3×), radio de áreas (0,5–2×) y duración de áreas/estados (0,5–2×). En recarga, un multiplicador mayor produce ataques menos frecuentes. Radio modifica la geometría visible y efectiva de peligros; duración se limita a peligros persistentes y no alarga el vuelo de proyectiles ordinarios. El valor neutral es 1× y mantiene el escalado dinámico por tiempo, dificultad y cantidad de jugadores. El ajuste afecta solo a apariciones nuevas: no cura, debilita ni cambia retroactivamente una entidad que ya está en el mapa.

Todo guardado exige revisión previa, admite restauración al catálogo original y deja auditoría con autor. En cooperativo se fija desde el servidor al iniciar la sala, conservando una versión durante toda la partida. Los coeficientes particulares de ataques, charcos, vulnerabilidad, mordidas y fases no se editan aquí.

El muñeco del editor es una referencia visual de cálculo, sin partida ni progreso. Daño por impacto y por segundo se etiquetan como referencia de un proyectil/contacto básico (no toda una descarga). Defensa del objetivo igual para ambos tipos, atributo neutral, distancia configurable; fuera de alcance muestra cero. El administrador decide aparte si publica el borrador mediante el guardado global existente.

### Jefes aleatorios del portal
Partida rápida y Supervivencia del Caos sortean entre Chosicano, Gabinete, Guardián, Gallinazo y Fujimori. Los escenarios de temporada sustituyen al jefe equivalente por su variante temática. No se repite el último jefe afrontado; los portales de una misma partida usan elecciones distintas mientras queden candidatos. El sorteo queda fijado por portal y no cambia al cancelar el diálogo o reintentar la carga. En dúo decide el servidor y conserva el último jefe al jugar la revancha. Minijefes y pruebas de laboratorio siguen ligados a la selección explícita.

### Portal por contacto y niebla
Solo el núcleo de 30 unidades activa la entrada; pasar por el borde visual no transporta. En individual, una transición de niebla de .45 s envuelve al jugador y revela la arena; pausa congela la transición y el reloj del mapa no avanza. En dúo basta el toque de un jugador vivo: el servidor transporta a ambos aunque el compañero esté lejos. Se conserva la vida del compañero caído, sin resucitarlo, y cada uno recupera su posición original al salir. Se oculta el botón E; el acceso manual existente queda como compatibilidad. El portal mezcla niebla oscura, energía violeta y brasas doradas con movimiento reducido y partículas visuales acotadas.

# HUD general de ataques

- Toda causa muestra el mismo selector inferior de tres slots durante juego, pausa y elección de mejora.
- El slot 1 representa el ataque principal actual; refleja rango y evolución.
- Los slots 2 y 3 dicen `RESERVA` hasta que existan variantes jugables reales. Una reserva no responde a las teclas ni simula contenido inexistente.
- Kingteka es la primera implementación con tres armas intercambiables y conserva 1–3 como controles de selección.
- Q (ulti) y R (expansión de dominio) permanecen como cartas independientes del selector de ataques.
- Al alcanzar 100 % y quedar disponible, el marco `fire` se enciende con una frontera irregular: las llamas ganan altura por tramos alternados y convergen arriba antes del pulso estable. Las capas trasera y frontal comparten geometría y fase para no descuadrarse. Al activar o perder disponibilidad, el fuego se recoge hacia la base. Cada slot es una unidad y eleva carta y efectos juntos. Al levantar una carta con arte, un reflejo holográfico diagonal recorre una sola vez su superficie; no aparece en reservas vacías ni se repite constantemente. El centro queda libre y nada sustituye ni modifica la barra amarilla.
- El registro de temas de carta es parte del contrato jugable: `fire` para ultis; `domain-demon`, `domain-royal`, `domain-cosmic` y `domain-steam` para Cirilo, Makanaky, Sideral y Chamelín. Cirilo ya posee presentación propia: la base infernal prende primero, las alas laterales se abren después y los cuernos superiores culminan el ascenso; mantienen libre el centro, enlazan con un pulso estable y se cierran al gastar la habilidad. Los otros dominios pueden compartir fuego mientras no exista su marco, pero nunca pierden su identificador semántico ni crean un HUD paralelo.
- Inventario, selector y cartas forman un dock inferior común. Ninguna zona puede invadir otra: escritorio usa tres columnas y móvil coloca inventario/cartas sobre el selector.
- No se dibuja una segunda franja informativa detrás del dock: nombre, ataque y escenario aparecen una sola vez en sus zonas vigentes.
- Dominios, cinemáticas y arenas que reemplazan el combate normal ocultan el selector.
- No se admiten HUD de armas exclusivos por personaje: las diferencias se modelan como datos y comportamiento dentro del componente compartido.
## Pasiva de Makanaky: Racha de la Realeza

Puño, cabezazo y sus evoluciones generan como máximo una GA por lanzamiento, aunque golpeen a varios. Almacenar GA ×10 prepara el siguiente ataque elegible como Golpe Real. El Puño Real aplica ×1,35 de daño y ×1,40 de empuje a todo su arco; el Cabezazo Real aplica ×1,60 y garantiza aturdimiento contra enemigos normales. El remate consume todo y puede coincidir con un crítico natural. Fallar resta dos GA. Tras 2,5 s sin acertar pierde una GA por segundo; recibir daño no las elimina. GAA, objetos, campos, Q y dominio no cargan Respeto ni generan GA, salvo que Q concede exactamente una GA por su combo completo.

El HUD muestra el contador compacto `GA ×n / 10` y el tiempo hasta empezar a decaer. La ficha de Causas expone activación, acumulaciones, remate y reinicio. El estado es parte del jugador serializable: en cooperativo solo la simulación del servidor lo modifica y los clientes se limitan a representarlo. El Makanaky minijefe usa su catálogo propio y no recibe la pasiva.

La ficha de cada causa prioriza cinco stats esenciales y presenta tres piezas de kit antes de los datos técnicos. La pasiva ocupa una pieza `ÚNICA` separada; si todavía no existe, se muestra como «Pasiva por definir» y no inventa efectos. Al seleccionar una pieza se reemplaza su explicación sin cambiar de pantalla. Los canales, defensas y stats avanzados permanecen en `Stats detallados`. El retrato principal usa respiración, balanceo y gesto mínimo a 25 FPS como máximo; se inmoviliza con la preferencia de movimiento reducido.

## Vestíbulo principal

La portada de menú funciona como centro de navegación: presenta al causa seleccionado con dos compañeros cosméticos y ofrece accesos directos a partida, colección, Gacha, tienda, mejoras, cooperativo, opciones, laboratorio de jefes y Wiki. Abrir una sección no inicia ni modifica una partida. La Wiki empieza con una portada de siete secciones grandes: **Objetos, Enemigos, Jefes, Personajes, Mundo, Mecánicas y Coleccionables**. En escritorio se distribuyen cuatro arriba y tres centradas abajo para conservar la jerarquía visual de una enciclopedia, no una rejilla de botones pequeños. Así no mezcla de inmediato todas las entradas y permite entender qué clase de información se va a consultar. Dentro de una sección usa ficha grande a la izquierda, cuadrícula compacta al centro y filtros contextuales a la derecha; en móvil las secciones y fichas se apilan. Enemigos separa Minions y Dinosaurios; Jefes separa Minijefes y Jefes. Cada ficha de combate muestra stats base, habilidades o ataques, pasivas o mecánicas y una guía rápida. Los personajes enlazan a su ficha extensa; los jefes practicables conservan «Probar jefe». Las amenazas estacionales sin prueba aislada permanecen informativas y no inventan un combate alternativo.

Objetos reutiliza los suministros y el botín registrados por Mochila y Loot, incluido su origen y uso. Mundo documenta tanto los cinco mapas públicos como los cinco escenarios secretos obtenidos tras los jefes, pero no permite elegir públicamente uno secreto. Mecánicas explica el ciclo del día, clima, eventos aleatorios, portales, cofres y Extinción con reglas breves tomadas del comportamiento vigente. Estas tres secciones son informativas: sus botones delegan en Mochila o Preparar partida y nunca conceden recursos ni fuerzan estados de juego.

Los seis dinosaurios de Extinción se documentan desde el mismo catálogo que define su vida, velocidad y radio al aparecer. La Wiki explica sus señales visuales y cooperación: furia del Velociraptor, guardia del Anquilosaurio, rescate del Pterosaurio, veneno del Dilofosaurio, curación y reanimación del Parasaurio y embestida con esquiva del Triceratops. Tirano del Cráter y Triceratops Fósil aparecen como jefes con sus ventanas de agotamiento, tormenta, placas, pilares y vulnerabilidades. Las cifras mostradas son valores base antes del escalado por grupo, tier o sala.

La sección **Coleccionables** reúne en un mismo álbum las cartas de ultis, los dominios y las skins cosméticas desbloqueables; no existe una pestaña global separada para «Cartas». Su vista principal es un álbum denso de piezas verticales, inspirado en la claridad de los juegos de colección pero sin incorporar mazos antes de que exista esa mecánica. Seleccionar una pieza abre un visor aislado: puede inclinarse dentro de un ángulo limitado, girarse para leer su reverso y recentrarse; el reflejo responde a la orientación para comunicar material holográfico sin distraer del arte. Flechas laterales, teclado, miniaturas y gesto horizontal recorren únicamente el filtro activo, con contador y retorno directo a la pieza de origen. Cada personaje conserva una edición base y admite variantes futuras con arte, nombre, color o marco propios; las habilidades viven en su registro común y las skins proceden del catálogo cosmético. Esta vitrina es de presentación: no entrega habilidades, no altera progresión y no inicia una partida.

El hub amplía esa navegación con cinco bibliotecas coherentes. **Causas** mantiene la colección, rareza, estadísticas y siluetas bloqueadas sin revelar su identidad; la **Wiki** añade la guía transversal de personajes y amenazas. **Objetos** cataloga los suministros de preparación y el botín activo o pasivo con sus descripciones reales. **Jefes** separa las amenazas de portal, sus fases, ataques, arenas, práctica y récords locales. **Opciones** agrupa sonido, gráficos, juego, controles y accesibilidad; los ajustes visuales no cambian la simulación. **Progreso** resume partidas, victorias, enemigos, colección, récords de jefe y cinco misiones acumulativas. Seleccionar una ficha de la Wiki produce una transición corta, sin pausar ni alterar el estado jugable.

Primera ampliación de profesiones: Pablo astronauta desde 0:30, Tyrone bombero desde 0:45 y Uniqua chef desde 1:05. Reemplazan el 35 % de los nacimientos de su tipo. En Halloween, Tasha momia desde 1:50; en Navidad, Austin duende desde 2:50, con probabilidad del 60 % para su tipo. No alteran el roster por etapa ni añaden enemigos. Se mantienen los rangos por nacimiento (veteranos 2:05, élites 3:35); comparten vida/daño/velocidad de rango, más defensa física/especial ×1/1,12/1,28 y escala visual 0,92/1/1,08. No son invulnerables.
Ataques: astronauta, pulso lunar circular de 65/75/85; bombero, chorro corto en cono de 105/115/125; chef, sartenazo en arco de 70/77/84; momia, azote de vendas de 80/90/100; duende, uno o dos regalos bloqueables. Cada ataque tiene al menos 0,95 s de preparación, daño una vez por impacto, aviso de alcance, cobertura y los cupos de peligro existentes. Los sonidos reutilizan el mezclador limitado. Los 45 cuadros nuevos integran ropa y accesorios: seis pasos, preparación, impacto y derrota por profesión; no se dibujan nombres encima.
Policía y arquitecto amplían el catálogo sin aumentar nacimientos. Policía (tipo 5) desde 3:35, cuando se incorpora su tipo al roster: golpe físico de escudo en sector, radio 72/82/92, preparación 1,1 s. Arquitecto (Pablo, tipo 0) desde 1:30: escuadra lanzada bloqueable, una por disparo normal/veterano y dos en élite, preparación mínima 1,1 s y alcance de adquisición 110–360. Comparten los rangos y defensas de las otras profesiones. Cuando varias profesiones están disponibles para el mismo tipo, se reparten uniformemente el 35 % reservado a profesiones, sin desplazar a las primeras; en el tipo 0 conviven astronauta y arquitecto. Sus 18 cuadros adicionales son cuerpos completos: seis pasos, preparación, impacto y derrota. Sin nombres encima.
# Vestíbulo completo

El vestíbulo presenta siete áreas conectadas a los sistemas reales del juego:

1. Gacha: probabilidades, garantías, tiradas de una o diez, historial, duplicados y ascensos.
2. Cooperativo: sala privada para dos, código, personaje, mapa, estado listo, invitaciones y reconexión.
3. Mejoras y habilidades: proyección antes de comprar, cinco rangos permanentes y ramas de evolución en partida.
4. Preparar partida: causa, escenario, modo, dificultad dinámica y suministros equipados.
5. Perfil: favorito, colección, partidas, victorias, rivales, jefes, monedas y récords.
6. Misiones: objetivos generales y recompensas diarias/semanales en forma de insignias cosméticas.
7. Ayuda y créditos: controles, reglas, atribución del proyecto, Discord y apoyo.

Los botones sociales se muestran desde el inicio, pero no navegan hasta que se configuren enlaces oficiales. Esto evita promocionar servidores o cuentas incorrectos.

## Diseños de rango de profesiones
Cada profesión tiene tres atlas distintos: normal, veterano y élite. Las catorce láminas nuevas añaden 126 cuadros completos (seis pasos, preparación, impacto y derrota por variante), sin accesorios superpuestos ni nombres. Astronauta: traje plateado reforzado / comandante lunar azul y dorado; bombero: capitán de rescate / traje aluminizado; chef: chaqueta azul y delantal / jefe de cocina burdeos y dorado; momia: guardián de tumba / faraón; duende: mensajero rojo / guardián navideño; policía: equipo táctico / armadura antidisturbios; arquitecto: chaleco técnico / maestro de obra reforzado. El equipo de cada rango se conserva también al atacar y morir. La escala y los efectos existentes son señales adicionales. El cambio es visual: se mantienen las reglas de aparición, daño, defensa, vida, alcance y cadencia actuales.

## Combate táctico de minions
Exploración usa diez identidades tácticas: musculoso (1/2/3 puñetazos, último gancho), obrero (pala y grieta desde veterano), abanderado (barrido y regreso en élite), policía (escudo frontal y avance corto élite), arquitecto (escuadra recta, dos lanzamientos veteranos y retorno fijo élite), bombero (chorro sostenido y barrido lento élite), chef (1/2/3 sartenazos), astronauta (salto a punto fijado y onda anular élite), momia (venda que ralentiza y dos líneas con hueco central en élite), duende (regalo con mecha; dos separados en rangos altos). Se mantienen los oficios, nacimientos y rangos previos.
Los avisos duran al menos 1,05 s, fijan dirección/posición al iniciar y coinciden con la geometría dañina; los combos separan golpes 0,82 s y el segundo barrido 0,95 s. Tras terminar hay al menos un segundo inmóvil y vulnerable. No hay daño por contacto durante el ataque ni la recuperación. La pala no cruza coberturas. El salto no da invulnerabilidad. Las vendas ralentizan un 25 % durante 0,7 s sólo tras daño real, sin acumular intensidad. Los regalos no dañan durante su mecha de 0,9 s. Cada amenaza sólo puede golpear una vez a cada jugador. La muerte o interrupción cancela amenazas pendientes del dueño.
La densidad de las oleadas no aumenta por estas reglas. Los cupos por las ocho etapas pasan a 0/1/2/2/3/3/4/4 atacantes simultáneos y 0/6/10/12/16/18/22/24 amenazas; como máximo dos atacantes tácticos a distancia y uno del mismo patrón (dos en las últimas etapas), con 0,38 s entre inicios. La recuperación también ocupa un turno. Las profesiones normales siguen vulnerables durante su preparación; el escudo del policía veterano/élite reduce 30/45 % sólo desde el frente y deja la espalda y recuperación sin esa protección. Los pesados conservan su resistencia de carga existente. Todos los avisos son formas y colores, sin nombres sobre los sprites.

## Combos dibujados y ritmo de partida
Puños, bandera, chef, arquitecto y duende tienen atlas propios de seis cuerpos completos: preparación, primer golpe, recuperación intermedia, segundo golpe, carga/remate y recuperación final según el patrón. Chef, arquitecto y duende mantienen los tres trajes de rango. Son 11 láminas y 66 cuadros nuevos; no se cortan brazos ni se superponen accesorios. El índice de imagen sigue el reloj y los eventos del ataque: la animación no cambia sus colisiones ni crea daño adicional. Caminar y morir siguen usando sus atlas completos anteriores.
Después del primer minuto hay un respiro fuerte en los últimos seis segundos de cada ciclo de 30 (primer respiro a 1:24): como máximo dos atacantes y uno a distancia, con 0,65 s entre inicios. No cancela ataques ya iniciados. Fuera de esa ventana se mantienen los cupos tácticos previos. Los dos regalos se separan 0,65 s para que cada lanzamiento tenga preparación visible. Se conservan vida, daño, defensa, velocidad, XP y cantidad de enemigos.
La comparación reproducible de 20 pares de partidas está en minion-combo-balance-audit.json: seis personajes y los tres mapas habituales, más Kingteka en Halloween y Navidad; semilla 831, 30 Hz y hasta 330 s. Mantiene las nueve victorias observadas y el primer minuto idéntico; el daño táctico de la muestra pasa de 514,68 a 406,02. Es una prueba automatizada de mecánicas, no demuestra diversión o equilibrio perfecto de todos los personajes. Kingteka sigue siendo un caso que requiere una revisión específica del personaje.

### Wiki de minions
El archivo de amenazas incluye 13 fichas de minions: seis diseños base y siete profesiones. Cada ficha explica su patrón de exploración, cómo esquivarlo y sus tres rangos; los rangos se consultan aunque aún no aparezcan en la partida. Los multiplicadores de vida, velocidad y daño son relativos al mismo enemigo y no sustituyen sus estadísticas variables por tiempo, peso o rol. El alcance mostrado es de activación, no el área de impacto. Las fichas no inician partidas de laboratorio.



## Mundos heredados de los jefes

En Supervivencia del Caos, vencer a un jefe de portal transforma el mundo de exploración. El jugador reaparece en un escenario infinito inspirado en la arena derrotada y conserva nivel, experiencia, vida, poder, equipo, monedas, llaves, tiempo y progreso de portales. Los enemigos, proyectiles, gemas y obstáculos del mundo anterior se retiran para evitar mezclar coordenadas entre escenarios. El cofre del jefe nace en el nuevo mundo.

Los destinos son: Última Parada para El Chosicano, Distrito del Gabinete para El Gabinete Infinito, Santuario de la Niebla para el Guardián, Azoteas de Lima para el Gallinazo y Archivo del Expediente para Fujimori. Son mapas de descubrimiento y no aparecen para jugadores normales en la selección previa a la partida. Los administradores pueden abrirlos desde el selector Escenario de Preparar partida para jugar una partida completa, o desde el Laboratorio para iniciar una prueba sin premios ni récords. Conservan clima, eventos, minijefes, botín, rutas y los portales posteriores. Partida rápida mantiene el retorno al mapa elegido.

Cada destino usa una gramática ambiental propia. Última Parada forma avenidas con paraderos, barreras y llantas; Distrito del Gabinete combina patios rígidos, archivadores y puestos de control; Santuario de la Niebla reutiliza la piedra tallada y las terrazas de Machu Picchu bajo un perfil de viento más frío; Azoteas de Lima construye recorridos con parapetos, antenas, ventilación y tanques; Archivo del Expediente genera corredores entre estantes, gabinetes, cajas y luces de alerta. Sus trazados, paletas y ambientes sonoros también son distintos.
Última Parada, Distrito del Gabinete, Azoteas de Lima y Archivo del Expediente tienen atlas ilustrados independientes de seis piezas. El recorrido procedural mezcla las seis siluetas propias de cada destino y conserva un respaldo geométrico únicamente durante la carga. Santuario de la Niebla comparte deliberadamente el atlas de piedra y terrazas de Machu Picchu.

## Evento mayor · Extinción

Extinción amplía el impacto cinematográfico del meteorito en Supervivencia del Caos. El minievento de meteoritos existente conserva su comportamiento y frecuencia; **Extinción completa** puede iniciarse sin espera desde los controles de ambiente del Laboratorio.

La secuencia jugable es **impacto → invasión prehistórica → tres fragmentos → jefe obligatorio → portal opcional**. El impacto se elige cerca de un jugador vivo, limpia únicamente los minions dentro de su radio inmediato y crea un cráter persistente con fuego, ceniza y terreno destruido. En cooperativo se elige al azar uno de los jugadores vivos como referencia visual, sin causar una muerte inevitable durante la cinemática.

Desde el cráter nacen dinosaurios terrestres pequeños, perseguidores veloces y criaturas voladoras. Los nacimientos deben mantenerse cerca del área transformada y respetar el presupuesto global de enemigos. Tres fragmentos rodean el cráter: cada uno fortalece la invasión mientras permanece activo y los tres bloquean el avance de la etapa. Destruirlos es un objetivo obligatorio, con señales de borde y distancia para impedir que el jugador pierda el punto de impacto.

El último fragmento libera una criatura prehistórica mutada. El combate ocurre en una arena temporal alrededor del cráter; saltos, embestidas y proyectiles permiten que el jefe recupere presión si el jugador intenta mantenerse lejos. La arena debe conservar espacio para esquivar y no cerrarse sobre el personaje. La progresión y el reloj del evento se reanudan solamente después de derrotarlo.

La victoria abre un portal opcional a una mazmorra prehistórica corta. Entrar transporta a los jugadores a un mapa de dinosaurios con enemigos y recompensa propios; rechazarlo continúa la partida normal. La recompensa permite elegir una reliquia: **Corazón fósil**, que aumenta vida y regeneración; **Colmillo del depredador**, que concede daño y velocidad temporal después de derrotar enemigos; o **Fragmento celeste**, que puede añadir meteoritos pequeños a los ataques.

La implementación contiene las tres fases verificables: (1) cráter, invasión y fragmentos; (2) jefe, arena y condición obligatoria de victoria; (3) portal, mazmorra y reliquias. En cooperativo el servidor sincroniza toda la secuencia. Al tocar el portal, la sala se pausa y ambos jugadores votan: solo entran si los dos aceptan; un rechazo cierra el portal. Al completar la mazmorra ambos votan una reliquia compartida; si eligen opciones distintas, prevalece el voto del anfitrión. La misma reliquia se aplica a los dos jugadores y sus efectos se calculan de forma independiente por propietario.

## Identidades, versiones y apariencias

### Lectura visual de estados

Los estados del personaje deben entenderse sin abrir un panel. Toda recuperación de vida genera cruces verdes sobre el actor y marca temporalmente la barra; veneno usa burbujas verdes, ralentización flechas azules hacia abajo, escudo o coraza un contorno dorado y las mejoras ofensivas flechas naranjas hacia arriba. La barra de vida muestra simultáneamente chips con el nombre de cada estado activo. Las señales permanecen estáticas cuando el usuario prefiere movimiento reducido y son solo informativas: no cambian duración, magnitud ni autoridad del efecto.

Los nombres de los personajes no se dibujan bajo sus pies durante el combate. La identidad continúa visible en la barra principal, selección, Wiki y resultados. En cooperativo, el aliado conserva una barra de vida compacta y la marca `CAÍDO`, pero no un rótulo permanente que tape el arte o el terreno.

Los nombres se presentan como **Identidad · Versión**. En las tarjetas de Causas, la identidad ocupa la primera línea y la versión completa una segunda línea, sin instrucciones redundantes de interacción. Un reflejo suave cruza periódicamente el frente usando el color de la rareza; también aparece en la inspección ampliada y se desactiva con movimiento reducido. El catálogo vigente incluye **Cuy Supremo · El Oráculo de la Tómbola**, **Paloma del Centro · El Almuerzo del Pueblo**, **Alan García · Los Balconazos**, **Alberto Fujimori · ¡Soy Inocente!**, **Keiko Fujimori · País Rico**, **Ollanta Humala · Cosito en Campaña**, **Makanaky · La Realeza**, **Sideral · Espantaminions**, **Chamelín · Trovo** y **Kingteka · Amor a los animales**. Cada versión puede tener estadísticas, arma, evolución y rareza de causa propias. Una identidad futura puede recibir otra versión sin mezclar su progreso ni sus skins compatibles.

Los periodos se guardan como información de ficha, sin formar parte del título corto: Los Balconazos (1985–1990), ¡Soy Inocente! (2007), Cosito en Campaña (2011) y País Rico (2021). La ficha de Keiko conserva «No más pobres en un país rico» como lema descriptivo. Las rarezas permanecen separadas del nombre: Cuy y Paloma son C; Alan y Ollanta son SR; Alberto y Keiko son SSR.

Las skins forman una colección cosmética aparte. Sus rarezas son Común, Rara, Épica, Legendaria y Especial, y no aumentan estadísticas. Cada skin declara con qué versión puede usarse. La apariencia Base siempre viene equipada; una skin solo puede seleccionarse después de obtenerla en el gacha de skins. **Cerdito VTuber** es una skin legendaria exclusiva de Kingteka · Amor a los animales y no se entrega automáticamente. Al equiparla cambia al personaje y su escopeta, representa las balas como cerditos, colorea los impactos, transforma visualmente la bandada de la ulti en pequeños cerditos voladores con alas y reemplaza la carta Q por su ilustración porcina. La cantidad de proyectiles, daño, cadencia, alcance y duración permanecen iguales a los de Kingteka.

## Kingteka · Amor a los animales (UR)

Kingteka pasa a rareza **UR · Supremo** y conserva la ulti Gallinazo en Q. Su Expansión de Dominio se activa por separado con R usando la misma carga, por lo que el jugador elige cuál de las dos habilidades consumir.

**Santuario del Reino Animal** dura nueve segundos tras una entrada de 2,6 s. El escenario recibe un círculo de bosque andino verde y dorado. Cóndores, pumas, osos de anteojos y cuyes espirituales cruzan el área en oleadas: dañan y empujan a los enemigos dentro del santuario, mientras recuperan una fracción moderada de la vida de los aliados vivos. El cierre produce una última oleada más intensa. La expansión no modifica permanentemente daño, vida, velocidad, arma ni estadísticas de Kingteka; la rareza UR sí aplica el crecimiento normal de colección ×1,12.

## Evento mundial Extinción: oleadas, jefes y mazmorra

Extinción reemplaza temporalmente la presión normal de la partida por una secuencia cerrada y legible:

1. La cinemática del meteorito pausa el reloj. El impacto elimina todos los minions comunes presentes, transforma el terreno y sella los cofres hasta terminar o rechazar el evento.
2. La invasión escala en tres oleadas de 3, 4 y 5 dinosaurios. La última reúne los cinco roles y no se añaden minions ordinarios mientras esté activa.
   - Oleada 1: Anquilosaurio tanque y dos Velociraptores de daño.
   - Oleada 2: Pterosaurio de apoyo, Dilofosaurio debilitador y dos Velociraptores.
   - Oleada 3: Anquilosaurio, Velociraptor, Pterosaurio, Dilofosaurio y Parasaurolophus sanador.
3. La tormenta se centra en el cráter y reduce su radio de 650 unidades durante las oleadas a 560 durante los fragmentos y 480 contra el Tirano. Salir no teletransporta: causa por segundo 1,5 %, 3 % o 5 % de la vida máxima según la distancia exterior. Los meteoritos telegrafiados caen también dentro de la zona cada 3,2 s, aceleran a 2,4 s en fase II y a 1,5 s fuera de la tormenta. El centro inflige daño, el borde ralentiza y nunca hay más de tres avisos simultáneos.
4. Tras destruir los tres fragmentos aparece el **Tirano del Cráter**, un T-Rex de gran escala. Alterna embestida/mordida, rugido interruptor, onda de pisotón y meteorito que desactiva cobertura durante siete segundos. Al 50 % de vida acelera sus patrones; cada tercer ataque abre una ventana de agotamiento.
5. Al derrotarlo se abre el portal prehistórico. En cooperativo, el contacto de cualquiera inicia la decisión compartida; ambos deben aceptar.
6. La Era Perdida contiene tres salas de cinco dinosaurios. Entre salas se elige curación, daño temporal o riesgo con mejor botín. Al terminar aparece el **Triceratops Fósil**: dos placas absorben golpes, después expone el cristal y sus cargas contra los pilares lo aturden. La reliquia solo se ofrece después de derrotarlo.

El exterior comparte un reloj de 240 s desde la primera oleada hasta el Tirano; al aparecer el jefe se garantiza un mínimo de 90 s. Hay avisos a 60 y 30 s. La Era Perdida empieza con 180 s, pausa durante las decisiones y garantiza 150 s al aparecer el Triceratops Fósil. El evento falla cuando expira o cae todo el equipo. El retorno restaura el terreno temporal y concede seis segundos sin nuevas apariciones. Las repeticiones aumentan 12 % la vida y 3,5 % la velocidad por grado, con un límite de tres grados, sin añadir más proyectiles.

El balance de grupo no duplica la vida: con dos jugadores, los dinosaurios y fragmentos reciben +40 %, el Tirano +60 % y el Triceratops Fósil +50 %. Así el equipo conserva una ventaja real sin convertir los objetivos en papel. Para que el desgaste de una fase no decida automáticamente la siguiente, superar las dos primeras oleadas recupera 8 % de vida, cada fragmento 4 % y la aparición del Tirano 12 %. Estas recuperaciones solo alcanzan la vida máxima y no resucitan jugadores.

### Fijación manual de objetivo

Clic izquierdo sobre una entidad hostil fija la prioridad del ataque automático. La fijación no ignora alcance, visibilidad ni cobertura; si el blanco queda temporalmente fuera de condiciones, el arma vuelve al objetivo válido más cercano y recupera la prioridad cuando reaparece. Un segundo clic sobre el mismo blanco, o su derrota, elimina la fijación. Sirve para minions, fragmentos, minijefes y jefes. Cada jugador cooperativo posee una fijación independiente.

Roles de los dinosaurios:

- **Anquilosaurio / tanque:** 175 PV, 45 u/s, Fuerza y daño físico; DEF 115/105 y 30 % de resistencia de estado. Recibe 48 % de frente y 130 % por la espalda. Si un aliado próximo cae bajo 55 % o es presionado, corre a interponerse y le concede 45 % de reducción durante 2,5 s; la reacción recarga en 7 s.
- Los avisos lineales de embestida comparten velocidad y duración con el desplazamiento real. En terreno libre, el centro visual del dinosaurio termina exactamente en el extremo marcado; una colisión con cobertura puede detenerlo antes y activa la reacción de choque correspondiente.
- El aviso de embestida es un carril rectangular del ancho del atacante y termina en una punta de flecha. Durante el aviso solo informa; cuando empieza la carga aparecen púas y polvo, y permanecer dentro ralentiza 18 % hasta salir del carril. El veneno conserva su ralentización superior de 28 % y ambas fuentes usan únicamente la mayor penalización.
- Las embestidas pesadas del Anquilosaurio, Triceratops y jefes abren un evento rápido durante los últimos 0,45 s del aviso si el jugador sigue dentro del carril. `Espacio` ejecuta un dash lateral de 0,18 s hacia el lado libre más cercano, con 0,26 s de protección y 4 s de recarga personal. La trayectoria completa se valida contra cobertura; si un lado está bloqueado prueba el opuesto y, si ambos lo están, no consume la esquiva. El Velociraptor no ofrece este evento rápido.
- En pantallas táctiles, esa misma ventana muestra un botón circular **ESQUIVAR**. Comparte exactamente la validación, recarga y resolución autoritativa de `Espacio`; fuera de la ventana permanece oculto.
- Las acciones cambian la postura del sprite antes de resolver: los atacantes bajan el cuerpo para cargar, el Dilofosaurio recoge el cuello antes de escupir, el Pterosaurio gana altura al rescatar, el Parasaurolophus pulsa al curar y el Anquilosaurio se planta al proteger. Son animaciones visuales y no alteran hitboxes, tiempos ni estadísticas.
- Los estados de la manada son legibles sin abrir paneles: los raptores ganan hasta tres flechas y un aura amarilla/naranja/roja según su presión; la interposición une al Anquilosaurio con su protegido y dibuja un escudo semicircular; el impulso del Pterosaurio añade anillos de viento y plumas, y su rescate enlaza y marca al aliado; el veneno usa burbujas verdes; las curas del Parasaurolophus usan pulsos, cruces y cantidades, mientras su reanimación levanta una columna turquesa; el Triceratops ilumina los cuernos y muestra estrellas al chocar. Con movimiento reducido, los mismos símbolos permanecen estáticos.
- **Velociraptor / daño:** 82 PV, 88 u/s, Técnica y daño físico; DEF 85/80. Su salto causa 17 de daño base, gana 20 % contra jugadores ralentizados y su contacto escala con el tiempo hasta 65 %.
- **Pterosaurio / apoyo:** 68 PV, 94 u/s, Técnica y daño físico; DEF 75/90 y 10 % de resistencia. Acelera 24 % a aliados durante 2,8 s. Una vez por oleada puede canalizar 0,7 s y transportar durante 0,55 s a un aliado ligero bajo 25 % hacia el centro de la formación.
- **Dilofosaurio / debilitador:** 88 PV, 70 u/s, Ingenio y daño especial; DEF 85/110 y 15 % de resistencia. Predice 72 u hacia la dirección de movimiento, fija allí una marca verde durante 0,45 s y luego dispara dos venenos de 12 en abanico y deja una nube de 8 durante 3,8 s. La marca no persigue al jugador: el 28 % de ralentización solo se aplica al recibir un proyectil o mientras se permanece dentro de la nube. La nube puede dañar una vez a cada jugador; si atacan al sanador o apoyo, cubre su retirada. Tras disparar conserva 3,1 s de recarga.
- **Parasaurolophus / sanador:** 105 PV, 61 u/s, Ingenio y daño especial; DEF 90/120 y 20 % de resistencia. Cura 12 % a aliados cercanos, solicita la interposición del tanque y puede reanimar una vez con 38 % de vida.
- **Triceratops joven / rompefilas:** 122 PV, 55 u/s, Fuerza y daño físico; DEF 110/85 y 25 % de resistencia. Su carga causa 25, empuja al jugador y queda aturdido al chocar. Aparece en Era Perdida.

La formación rota hacia el jugador: tanque al frente, raptores en los flancos, apoyo y debilitador en segunda línea y sanador atrás. Los apoyos regresan a su posición si se separan, el tanque no abandona al sanador y los atacantes pueden romper la formación durante sus habilidades. Sin tanque la manada se abre; sin sanador adopta presión ofensiva. En cooperativo los raptores se reparten objetivos y la protección se orienta al jugador que amenaza al sanador.

El Tirano tiene Fuerza, 125/115 de ataque físico/especial, DEF 115/105 y 40 % de resistencia de estado. Mordida 22, embestida 24, pisotón físico 18, rugido especial 15 y meteorito 18/24. El Triceratops Fósil tiene Fuerza, DEF 120/110 y 55 % de resistencia; cada placa equivale al 14 % de su vida y el aturdimiento contra pilares multiplica por 1,6 el daño recibido.

El T-Rex es el jefe del mundo exterior. El Triceratops Fósil es el jefe final de la mazmorra; separar ambos encuentros conserva un clímax antes del portal y otro antes de la recompensa.

### Fluidez del cooperativo
La simulación cooperativa mantiene pasos de 40 ms. Las conexiones lentas descartan estados visuales intermedios en lugar de acumularlos; la siguiente actualización contiene el mundo actual completo. Se conservan enemigos, ataques, avisos, animaciones y resultados. Estos ajustes de transporte no se aplican al modo solitario.

### Indicador de FPS y ping
Opciones → Gráficos → FPS y ping activa el cuadro durante la partida y conserva la preferencia en este navegador. En cooperativo muestra el último RTT real en ms, medido cada dos segundos; durante la conexión o con una muestra de más de seis segundos muestra «midiendo», y durante reconexión lo indica. En solitario el ping no aplica.

### Vestíbulo en celular
Hasta 760 px, el menú principal organiza perfil, presentación del causa, dos filas de accesos con nombres, preparación de partida y herramientas en filas de altura natural. En pantallas bajas se desplaza verticalmente, sin estirar ni superponer tarjetas ni desbordar a los lados. Las rutas y acciones de los botones se conservan.
