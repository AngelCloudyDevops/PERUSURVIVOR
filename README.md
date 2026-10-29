# PERUSURVIVOR — Causas del Caos

Cooperativo: R activa el dominio; G confirma el combo compartido (también disponible por botón). Las partidas activas no caducan a los 45 min; ese plazo limpia salas de espera/resultados inactivos. Se cancelan entradas pendientes al desconectar o recuperar un socket, y no se admiten entradas mientras falta un compañero. La misma pestaña conserva una credencial efímera de recuperación en sessionStorage, renovada durante la partida y pagehide; al recargar, espera la comprobación de cuenta y solicita recuperar el grupo dentro de los 30 s del servidor. Salir, vencer el plazo o cambiar de cuenta elimina la recuperación; no se guarda en localStorage ni se sincroniza entre pestañas.

Cooperativo sin barrera de separación: cada jugador puede explorar libremente; el servidor conserva sectores y colisiones alrededor de ambos, alterna el foco de aparición sin duplicar enemigos y reutiliza dos mapas de navegación. Una flecha señala al compañero lejano. Los dominios de Makanaky, Sideral y Chamelín se solicitan al servidor sin activarse localmente. Las pulsaciones breves de dominio, ulti, golpe y salto se conservan entre mensajes hasta el siguiente paso de simulación y se consumen una vez.

Supervivencia peruana con dieciocho personajes, cinco mapas, encuentros opcionales y objetos de Dota 2 adaptados como cartas de equipo evolutivo durante cada partida.

Estabilidad cooperativa: paquetes WebSocket de más de 1 KiB usan compresión rápida negociada, sin retener contexto, con dos tareas concurrentes como máximo; el límite de entrada de 2 KiB sigue aplicándose tras descomprimir. una excepción se limita a su sala y queda registrada; salud muestra errores y coste de tick/serialización agregados. Reconectar con el token válido sustituye la conexión anterior sin perder el grupo. El cliente procesa el último estado por fotograma, conserva el resultado final y evita recargarse automáticamente mientras tiene sala. Scripts VM compilados se reutilizan, manteniendo una VM independiente por sala. Las publicaciones solicitan reinicio al quedar el servidor sin salas: las partidas existentes no se cierran por cambiar de release (un reinicio forzado del contenedor sigue interrumpiéndolas). El backend puede permanecer temporalmente en la release anterior hasta quedar libre.

Cooperativo: señales Aquí/Peligro/Ayuda/Cofre desde el botón Señales, posición validada por servidor, 5 s de duración, una por jugador y recarga de 2 s. Ayuda funciona al estar caído. La escolta de la combi se desbloquea a los 90 s: acérquense y pulsen Iniciar escolta. Ambos vivos a 200 unidades; dos paradas de 6 s despejadas de enemigos. Vida 150, límite 100 s, reintento 20 s; premio único +50 monedas compartidas y 25% de vida a cada superviviente. Se suspende durante arenas, escenas, mejoras y desconexiones; no coincide con la defensa doble. Backend Escort/Signals serializados en activities; CoopExtras dibuja vehículo, avisos y controles sin autoridad sobre premios.

## Contrato general de personajes: estadísticas, pasiva y habilidades

Esta es la estructura obligatoria para diseñar, mostrar y balancear cada causa. Una ficha no debe enseñar una estadística que todavía no tenga efecto real en el combate. Los valores base significan **rango 1, una estrella, sin mejoras permanentes, objetos ni bonificaciones de la partida**.

1. **Identidad:** nombre, rareza de colección, rol, atributo (`Fuerza`, `Técnica` o `Ingenio`), canal principal (`Físico` o `Especial`), fortaleza y debilidad.
2. **Estadísticas base:** vida máxima, daño base por impacto, intervalo entre ataques, alcance, velocidad de movimiento y radio de recogida.
3. **Índices de combate:** ATQ físico, ATQ especial, DEF física y DEF especial. Son índices para la fórmula de daño; un índice 100 no equivale a 100 puntos de daño.
4. **Pasiva única:** nombre, condición, efecto, límite, reinicio y señal visual. Siempre debe cambiar una decisión de juego; no puede ser solamente un aumento permanente sin condición.
5. **Kit:** ataque principal automático, habilidad especial si existe, ulti Q, Expansión de Dominio R si corresponde y evolución del ataque.
6. **Progresión:** estrellas y mejoras permanentes antes de jugar; rangos, evoluciones, pactos y objetos únicamente durante la partida.
7. **Validación:** daño por impacto, daño por segundo de referencia, supervivencia, corto/medio alcance, grupos, jefe móvil, obstáculos y cooperativo.

### Cómo se interpretan los stats

| Grupo | Stat | Significado |
|---|---|---|
| Supervivencia | Vida máxima | Daño que puede recibir antes de caer. |
| Ofensiva | Daño base | Presupuesto del ataque antes de coeficientes, crítico, atributo y defensa rival. |
| Ofensiva | Intervalo | Segundos entre intentos de ataque; un número menor significa mayor cadencia. |
| Espacio | Alcance | Distancia nominal del ataque antes del multiplicador de alcance. |
| Movilidad | Velocidad | Unidades recorridas por segundo. |
| Utilidad | Recogida | Radio para atraer experiencia y botín. |
| Canales | ATQ/DEF Físico y Especial | Ajustan el daño del canal correspondiente mediante `2A/(A+D)`. |
| Atributo | Fuerza/Técnica/Ingenio | Ciclo Fuerza → Técnica → Ingenio → Fuerza: +15% con ventaja y −10% con desventaja. |
| Resumen | Poder estimado | Índice informativo de progreso del mismo personaje; no causa daño ni debe comparar roles diferentes. Base = 100. |

El poder estimado actual pondera vida 30%, daño 35%, eficiencia de recarga 20%, velocidad 10% y recogida 5%. No incluye pasiva, alcance, defensas, forma del ataque, control, perforaciones múltiples, ulti ni dominio; por eso no es una “clase de combate” absoluta.

El contrato se aplica a **personajes jugables, minions normales y pesados, minijefes y jefes**. Todos comparten los cuatro índices de canal y los stats avanzados: perforación, resistencia de estado, regeneración, probabilidad y daño crítico, resistencia y defensa crítica, recuperación y robo de vida. Los valores sin fuente comienzan neutrales —cero, excepto daño crítico 150% y recuperación 100%— para conservar el balance anterior. Los controles de Balance pueden configurarlos y las pruebas automáticas verifican sus límites. Crítico, regeneración y recuperación ya se conectan además con los objetos existentes; resistencia de estado modifica la duración del miedo y perforación reduce la defensa efectiva del canal.

La diferencia entre categorías está en sus valores y kit, no en el formato: un minion puede tener menos campos relevantes para la interfaz, pero internamente usa las mismas fórmulas que un personaje, minijefe o jefe. Así una pasiva futura puede afectar un stat sin crear una excepción nueva.

### Fuentes y orden de cálculo

La ficha debe poder separar `Base → estrellas → mejoras permanentes → mejoras de partida → objetos → efectos temporales`. La rareza decide disponibilidad y crecimiento de colección; no aumenta por sí sola el daño. Las estrellas y mejoras permanentes afectan el modo individual según sus reglas actuales; cooperativo conserva el balance autoritativo de la sala. Los porcentajes deben indicar si se suman o multiplican y nunca modificar silenciosamente el catálogo base.

### Plantilla de ficha para todas las causas

```text
NOMBRE · RAREZA · ROL
Atributo / canal principal / fortaleza / debilidad

STATS BASE
Vida · Daño · Intervalo · Alcance · Velocidad · Recogida
ATQ físico/especial · DEF física/especial · Poder estimado

PASIVA ÚNICA
Nombre · condición · acumulaciones o recarga · efecto · reinicio · indicador

KIT
Ataque principal · Habilidad especial · Ulti Q · Dominio R · Evolución

PROGRESIÓN Y PRUEBAS
Estrellas · mejoras permanentes · rangos de partida · casos de balance
```

### Vocabulario cerrado de identidad y combate

Cada causa debe usar los identificadores centrales de `P.CharacterProfiles`; no se crean roles o etiquetas nuevos directamente en la interfaz. La identidad se compone de **raza/especie**, **atributo**, rol principal, rol secundario opcional, alcance, clase de daño, etiquetas funcionales y dificultad.

- **Raza/especie:** Humano, Animal, Criatura / meme, Sobrenatural o Constructo. Una transformación, evolución o skin no cambia la raza base salvo que su diseño lo declare expresamente.
- **Roles:** Vanguardia, Tirador, Hostigador, Controlador, Guardián, Apoyo y Especialista.
- **Alcance:** Cuerpo a cuerpo, Corto, Medio, Largo o Variable.
- **Clase de daño del kit:** Físico, Especial o Híbrido. `Daño fijo` es una etiqueta de una habilidad concreta, no un tercer canal de ataque.
- **Etiquetas funcionales:** Ráfaga, Daño sostenido, Área, Perforación, Retorno, Control, Movilidad, Curación, Resistencia, Invocación, Evolución, Alto riesgo, Daño fijo, Arsenal intercambiable y Daño continuo.
- **Dificultad:** Fácil, Intermedia o Avanzada.

El atributo siempre se muestra aparte del rol: Fuerza vence a Técnica, Técnica vence a Ingenio e Ingenio vence a Fuerza. El daño fijo omite ATQ/DEF físico y especial y el ciclo de atributos, pero todavía puede recibir modificadores externos como escudos o reducciones de una fase. Por eso la interfaz debe llamarlo **daño fijo**, no daño puro absoluto.

Kingteka es la referencia del formato: **Humano · Fuerza · Vanguardia / Controlador · alcance variable · daño híbrido**. Sus etiquetas son Arsenal intercambiable, Ráfaga, Control, Movilidad, Curación y Daño fijo. Escopeta y golpe son físicos, Gallinazo es especial, Q conserva el canal del arma equipada y R usa daño fijo. Su pasiva **Instinto de manada** se activa al cambiar realmente entre armas desbloqueadas: recupera 2,5 % de vida máxima y prepara durante 4 s un único ataque con +12 % de daño; después entra en recuperación durante 7 s. Cambiar repetidamente durante esa recuperación no cura ni acumula daño.

La cobertura real de los tres ataques, Q, R, pasivas e ilustraciones de cada causa se mantiene en [Auditoría de kits de personajes](docs/CHARACTER_KIT_AUDIT.md). La Causapedia diferencia `Implementado`, `Planeado` y `Reservado`: un concepto o espacio futuro nunca se presenta como una habilidad funcional.

## Primera ficha completa: Makanaky · La Realeza

**Estado:** ficha activa. Los stats, ataque, evolución, dominio y la pasiva descritos abajo funcionan tanto en individual como bajo autoridad del servidor cooperativo. La variante minijefe conserva su propio balance y no hereda esta pasiva.

| Campo | Base actual |
|---|---:|
| Rareza / rol | UR · Supremo / Luchador de presión |
| Atributo / canal | Fuerza / Físico |
| Vida máxima | 125 |
| Daño base por golpe | 32 |
| Intervalo de ataque | 0,56 s |
| Alcance base | 100 u |
| Velocidad | 200 u/s |
| Recogida | 90 u |
| ATQ físico / especial | 100 / 85 |
| DEF física / especial | 105 / 95 |
| Poder estimado base | 100 |

Fortaleza: presión cuerpo a cuerpo, movilidad alta y golpes que cubren un arco. Debilidad: debe permanecer cerca y una falla rompe su ritmo.

### Pasiva propuesta — Racha de la Realeza

- Un ataque principal que dañe al menos a un rival concede una marca de **GA**, hasta cuatro.
- Cada marca reduce 5% el intervalo del siguiente ataque y aumenta 3% su alcance. Máximo: 20% de cadencia y 12% de alcance.
- Al conectar con cuatro marcas, ese impacto se convierte en **Golpe Real**: +35% de daño y +40% de empuje; después consume todas las marcas.
- Fallar el ataque o pasar 1,8 s sin conectar elimina la racha. Recibir daño no la borra automáticamente.
- Solo el ataque principal y su evolución generan marcas. Ulti, dominio, objetos y apoyos no las generan ni consumen.
- La ficha de Causas muestra la pasiva como una pieza `ÚNICA` independiente con icono `GA`, descripción interactiva y cuatro marcas; el retrato tiene una animación de reposo sutil y respeta movimiento reducido.
- El HUD de partida muestra cuatro segmentos `GA`; el cuarto enciende un contorno rosado y el Golpe Real muestra una corona breve sobre el impacto.
- En cooperativo la sala/servidor es autoritativa. La pasiva no debe ejecutar dos veces un impacto ni confiar en el contador visual del cliente.

La intención es que Makanaky busque una ruta segura para mantenerse cerca, encadene cuatro golpes y decida si arriesgarse a buscar el remate. No es un bono permanente: apuntar mal o abandonar el combate corta la ventaja. Sus mejoras permanentes y estrellas escalan vida, daño y recarga mediante el sistema general; la pasiva multiplica el valor resultante sin crear una segunda progresión oculta.

### Kit de Makanaky

- **Ataque principal — Puño de la Realeza:** arco físico de 120°, alcance 100, empuje 24 y recarga base de 0,56 s.
- **Evolución — Combo de la Realeza:** arco de 150°, alcance 135, daño ×1,35 y empuje 42.
- **Habilidad especial:** espacio reservado; no se mostrará como disponible hasta tener comportamiento y controles reales.
- **Ulti Q:** espacio reservado actualmente.
- **Dominio R — ¡BÓTAME TU GA!:** carga con 35 bajas; entrada de 3 s, combate de 9 s y salida de 1,35 s. Su combo interno y la racha del dominio son sistemas separados de la pasiva del ataque normal.

La pasiva se valida con los mismos escenarios base y con la racha activa: enemigo cercano, grupo frontal, jefe móvil, falla deliberada, pérdida de objetivo, evolución, pausa, movimiento reducido y dos jugadores. El objetivo no es que Makanaky gane todas las pruebas, sino que su ventaja aparezca cuando mantiene el combo y desaparezca cuando no consigue conectar.

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

Juego de supervivencia y parodia peruana para navegador: diecinueve personajes, Backyardigans y policías ficticios como rivales, cinco mapas y encuentros opcionales. HTML, CSS y Canvas 2D, sin dependencias de ejecución.

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

### HUD general de ataques
Todos los personajes usan el mismo HUD compacto de tres slots en la parte inferior. El slot 1 muestra el ataque principal activo, su rango y su evolución; los slots 2 y 3 permanecen visibles como `RESERVA` mientras el personaje no tenga variantes intercambiables reales. No se inventan ataques ni se habilitan controles sin comportamiento. Kingteka conserva el mismo diseño, pero sus tres slots representan su arsenal real y las teclas 1–3 cambian entre las armas desbloqueadas. Las cartas Q de ulti y R de expansión de dominio siguen separadas. Al llegar una habilidad al 100 %, su slot reúne carta, fuego trasero, llamas frontales de borde y brasas en una sola pieza: todo el conjunto sube unido al revelar la carta, sin halo rectangular ni fuego desconectado. Un reflejo holográfico diagonal recorre una vez el arte al levantarlo y queda limitado a la carta; los slots vacíos no brillan. Inventario, selector de ataques y cartas comparten un dock responsive con zonas independientes: forman una fila en escritorio y dos niveles compactos en móvil, sin montarse entre sí. La antigua franja redundante de personaje, ataque y mapa ya no se renderiza detrás del dock. El HUD de ataques se oculta durante dominios y cinemáticas. Cualquier personaje que reciba un arsenal futuro debe reutilizar este componente en lugar de crear un panel exclusivo; el arte en cartas se evaluará como una evolución posterior del diseño.

Al subir de nivel aparecen tres cartas boca abajo. Revela las tres con un clic para comparar poderes, rangos, rareza y cambios de atributos; recién entonces puedes escoger una. La rareza cambia la probabilidad de que una mejora salga y su marco visual, pero no multiplica su efecto: el poder depende de la mejora descrita y del rango. Los pactos también ocupan uno de los tres espacios. En teclado, 1–3 revela la carta correspondiente; después de revelar las tres, 1–3 selecciona.

En teléfonos, las tres cartas mantienen el frente ilustrado, el marco de rareza y la franja de texto inferior como en escritorio; se apilan para poder tocarlas y el modal permite desplazarse si la pantalla es baja. El arte completo de ataques está disponible para las tres armas de Kingteka; las demás mejoras usan su sprite e icono, y los objetos de Dota conservan sus imágenes oficiales.

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
  maps/          Tres fondos base y sus prompts; dos temas estacionales procedurales
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

Las pruebas cubren los ataques de los dieciocho personajes, oleadas, mejoras, pausa, bumerán, daño del jefe, los cinco mapas, portales y sus recompensas, colisiones, cajas y rutas enemigas. También comprueban los recursos compilados y el servidor HTTP. La lógica corre en un entorno simulado; estas pruebas no sustituyen la revisión visual en navegador.

GitHub Actions ejecuta las mismas comprobaciones en cada push y pull request. La CI publica en el VPS únicamente tras un push a main y después de superar todas las pruebas.

## Publicación

El destino principal es https://perusurvivor.michitech.tech, en el VPS de Hostinger srv2060131.hstgr.cloud (179.236.77.159). Nginx (perusurvivor-web) sirve /opt/perusurvivor/live/current detrás de Caddy. Un push a main despliega automáticamente dist/ después de CI; las ramas y PR no publican. Véase docs/DEPLOYMENT.md. El sitio de ChatGPT configurado en .openai/hosting.json es una copia separada: publicarlo no actualiza el dominio principal.

Esta es una versión de un jugador, sin cuentas, pagos, multijugador ni voces de figuras reales. El récord se guarda en el navegador. Las figuras públicas aparecen como caricaturas de parodia con habilidades inventadas; no existe afiliación.

## Terreno continuo
El mapa principal ahora continúa sin bordes mediante sectores deterministas. Conserva los cinco temas, obstáculos y cajas destruibles; las arenas de portales siguen cerradas. El terreno de combate usa texturas de suelo de los fondos, no mosaicos de la ilustración completa. Código en src/systems/chunks.js; build generado con npm run build. Las pruebas verifican viaje a coordenadas lejanas, caché acotada, cámara libre y persistencia de cajas destruidas.

## Mapas estacionales

**Noche de Halloween** es un cementerio-parque: cruces y diagonales estrechas, anillos de lápidas, casona embrujada, criptas, cercas, filas de velas, calabazas, bruma y murciélagos. **Navidad Peruana** es una feria de plaza: explanadas, pasillos de puestos, recorridos radiales, nacimiento, arcos de luces, carrito de cacao, pinos, regalos, nieve y destellos festivos. Sus miniaturas también son composiciones propias; no son filtros del Campo de Marte.

Ambos conservan cartoon pixel art, mundo procedural infinito, colisiones, cajas, portales, jefe final y salas cooperativas. El suelo jugable se genera con paletas y manchas propias sin muestrear la ilustración de Campo de Marte. Cada temporada usa un atlas transparente WebP 4×3 cargado bajo demanda: Halloween incluye casona, criptas, árboles, tumbas, calabazas, cercas, velas, faroles y portón; Navidad incorpora árbol principal, dos pinos, muñeco con chullo, regalos, puesto, carrito de chocolate, nacimiento, arco, farol y mesa de panetón. Las primitivas anteriores son el respaldo de carga. Caminos, zonas y tablas de objetos cambian por escenario. Bruma, murciélagos, copos y luces se limitan a la ventana visible, no crean entidades y respetan pausa y movimiento reducido para cuidar los FPS.

Halloween usa a El Fiscalizador como minijefe de superficie y el portal «La Procesión de Medianoche»; Navidad alterna La Paloma Brava/Makanaky y abre «El Grinch del Cercado». Sus ventanas del modo Caos están desplazadas respecto de los mapas existentes para conservar variedad. El clima, la iluminación y el ambiente sonoros respetan pausa, silencio y arenas separadas.

## Estilo visual obligatorio

Toda contribución debe respetar la dirección artística elegida por el usuario. La referencia obligatoria es **cartoon (caricaturesco) en pixel art**, tomando los personajes actuales como guía de dibujo. El entorno conserva su sencillez, césped con textura y caminos claros, pero comparte contornos oscuros y sombras de pocos tonos con los personajes. No sustituir este estilo por una variante más detallada sin aprobación expresa del usuario.

- **Personajes y enemigos:** caricaturas pixel art legibles, proporciones coherentes con los sprites actuales, contornos oscuros definidos y colores agrupados. Conservar identidad, vestuario y escala entre reposo, caminata y ataque. No mezclar personajes realistas, 3D o ilustraciones suavizadas con los sprites existentes.
- **Ilustraciones de cartas de Causa:** una fotografía entregada por el usuario sirve únicamente para copiar pose, expresión y rasgos reconocibles; nunca define el acabado. El sprite vigente manda en identidad, vestuario, silueta y paleta. La carta de **Makanaky · La Realeza** es la referencia maestra del dibujo: caricatura humana exagerada, cabeza, manos y calzado grandes, contorno negro marcado, sombreado gráfico y textura de píxel fino. Todas las cartas deben parecer obra del mismo artista y pertenecer al mismo álbum; la rareza regula color, iluminación, efectos y complejidad del fondo. Evitar tanto el sprite chibi agrandado como el retrato realista o semirrealista: sin anatomía fotográfica, poros, músculos realistas, render 3D ni pintura suavizada. Antes de aprobar, comparar simultáneamente la foto de pose, el sprite del personaje y las cartas aprobadas de su nivel visual.
- **Paleta visual por rareza:** **C · Común** usa gris acero (`#aeb7c2`), luz cotidiana, fondo sencillo y pocos efectos; **R · Raro** usa verde esmeralda (`#5fd17a`), color más vivo y pequeños acentos de energía; **SR · Súper raro** usa azul eléctrico (`#5ca9ff`), pose dinámica, iluminación marcada y efectos de habilidad; **SSR · Ultra raro** usa amarillo dorado (`#f4c84a`), escena elaborada, contraste fuerte y efectos abundantes; **UR · Supremo** usa magenta/violeta neón (`#ff5bd8`), máxima intensidad, detalle y puesta en escena. El color identifica el nivel, pero no reemplaza la paleta propia del personaje.
- **Formato obligatorio de cartas de Causa:** lienzo vertical **2:3 (1024 × 1536)**, personaje dominante y legible en miniatura, cuerpo o pose completos dentro del encuadre y fondo peruano narrativo. La iluminación y el nivel de espectáculo siguen la paleta de rareza; solo UR exige el neón intenso de Makanaky, Sideral y CiriloTV. El archivo full art no incluye marco, nombre, rareza, estrellas, logotipo ni texto: todo eso lo añade la interfaz. La cara frontal muestra la ilustración; al pasar el puntero se gira y muestra el sprite pixel art vigente. Exportar fuente PNG y versión WebP optimizada, con nombres `id-character-fullart-vN.png` y `.webp`.
- **Orden obligatorio de referencias para una carta:** (1) **Makanaky, Sideral y CiriloTV aprobados** fijan el acabado UR; para C, R, SR y SSR se conserva el mismo dibujo reduciendo o aumentando iluminación, efectos y complejidad según la tabla de rareza; (2) el **sprite vigente** fija identidad, ropa, accesorios, cuerpo y paleta; (3) la **fotografía** fija solamente pose, expresión y contexto solicitado. Una foto jamás autoriza anatomía o acabado realista. Si las referencias entran en conflicto, prevalece este orden.
- **Control de calidad antes de integrar una carta:** debe parecer parte del mismo álbum al verla junto a Makanaky y Sideral; usar facciones simplificadas y sombreado en bloques; exagerar cabeza, manos o calzado sin convertir el cuerpo en un sprite chibi; conservar contorno oscuro uniforme y textura de píxel fino. Rechazar cualquier resultado con piel fotográfica, anatomía naturalista, dientes o músculos realistas, acabado 3D, aerógrafo suave, píxel grueso o texto generado dentro de la imagen.
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

## Cartas de ulti y expansión de dominio

Las nueve habilidades actuales usan un patrón HUD compartido: arte full art vertical, marco y placa inferior legible, tecla visible (Q para ulti y R para dominio), barra dorada que recorre el borde superior con la carga y un tema visual registrado. Mantener Q durante 180 ms revela cualquier carta de ulti; un toque activa la habilidad lista. Las expansiones conservan su activación con R y comparten estructura, carga y estado listo. Al alcanzar 100 %, el fuego común nace por franjas irregulares desde la base y alterna alturas en sus costados antes de entrar en un pulso estable; al gastar o perder la habilidad se recoge hacia abajo. Cirilo reemplaza ese fuego por un marco demoníaco real: prende la base, se abren las alas y los cuernos culminan el recorrido de abajo hacia arriba antes de entrar en un pulso suave. Al elevar una carta con arte, un brillo holográfico diagonal la recorre una sola vez; marco, brasas y carta se trasladan juntos. El diseño respeta `prefers-reduced-motion`.

| Personaje | Habilidad | Arte de carta |
| --- | --- | --- |
| Kingteka | Modo Gallinazo | `kingteka-gallinazo-ultimate-fullart-v2.webp` |
| Alberto | Tribunal de Fujimori | `alberto-tribunal-ultimate-fullart-v1.webp` |
| Cristorata | Dragón | `cristorata-dragon-ultimate-fullart-v1.webp` |
| Cuy | Estampida | `cuy-stampede-ultimate-fullart-v1.webp` |
| Paloma | Bandada | `paloma-bandada-ultimate-fullart-v1.webp` |
| Makanaky | Habitación del Lagarto | `makanaky-domain-fullart-v1.webp` |
| Sideral | Habitación del Lagarto | `sideral-domain-fullart-v1.webp` |
| CiriloTV | Audiencia de Medianoche | `cirilo-audiencia-domain-fullart-v1.webp` |
| Chamelín Trovo | Baño de Trovo | `chamelin-domain-fullart-v1.webp` |

`P.AbilityCards.frames` es el registro obligatorio de temas. Las ultis actuales usan `fire`; Cirilo usa `domain-demon` con `visual:'demon'` y el recurso `cirilo-domain-demon-frame-v1.webp`. Los temas `domain-royal` (Makanaky), `domain-cosmic` (Sideral) y `domain-steam` (Chamelín) conservan el fuego probado en el HUD, pero Causapedia usa su `futureVisual` para mostrar desde ahora un borde Royal, Cósmico o Vapor propio. Tanto el álbum como el visor ampliado deben renderizar el marco registrado y mantenerlo centrado desde el 50% de la carta; nunca se ajusta con desplazamientos independientes por lado. Para habilitar una habilidad futura, registra primero su tema, agrega `frame` y arte a `P.AbilityCards.entries` (`src/systems/ability-cards.js`) y conecta su HUD/activación con `P.AbilityCards.apply(button,id,kind,charge,ready,active)`. Para un dominio, registra también `state` y `label`. Q y R mantienen sus manejadores de juego; los espacios sin habilidad usan `none` y siguen como reserva gris. Conserva los PNG fuente y registra sus WebP en `docs/asset-optimization.json` con `scripts/optimize-assets.py`.

La pestaña **Cartas** de la Causapedia convierte este mismo registro en un álbum visual, sin mantener un segundo catálogo. La cuadrícula principal muestra seis cartas verticales por fila en escritorio, baja a cinco o cuatro en anchos intermedios y a dos en celular; permite filtrar ultis o dominios y abre cualquier carta en un visor dedicado. El visor conserva marco, reflejo holográfico y reverso informativo, permite inclinar, voltear y centrar la carta, y recorre el filtro vigente mediante botones laterales, flechas del teclado, miniaturas inferiores o deslizamiento táctil. Incluye contador y cierre con `Esc`. Las imágenes cargan de forma diferida, la inclinación agrupa cada movimiento en un único `requestAnimationFrame` y la animación del archivo de amenazas se detiene mientras esta pestaña está abierta. Para una variante futura, añade a la entrada de la habilidad `variants:[{id,edition,art,frame?,title?,description?,color?}]`; el álbum la descubrirá automáticamente y mantendrá la edición base.

## Kingteka: ulti y sonido
La ulti se carga con 20 bajas y se activa con Q o el botón táctil: ocho segundos de gallinazos animados, velocidad ×1,5 y cadencia ×2; rivales normales reciben ×2 daño. Incluye aleteo, escopeta reforzada, efectos pixel art y sello DENUNCIADO con golpe sincronizado. La carta Q usa un full art exclusivo de la ulti: Kingteka de espaldas apunta a un gallinazo lejano mientras otros rivales se transforman sobre el atardecer limeño. Es distinto al arte del ataque de escopeta; su archivo optimizado mide 512×768, usa WebP calidad 60 y figura en el informe de activos para respetar el límite de despliegue de 64 MiB. La secuencia cinematográfica de la ulti conserva su arte independiente y se sirve en WebP calidad 85. Una línea dorada recorre el borde superior según la carga; al completarse, las llamas suben desde la base y las capas trasera y frontal continúan sincronizadas alrededor del marco sin tapar el centro. Mantener Q durante 180 ms despliega como una sola pieza la carta, el fuego y las brasas, y activa un barrido holográfico breve; soltarla solo la oculta. Un toque breve en Q activa la ulti cuando está lista. El efecto se reduce con `prefers-reduced-motion`; el botón táctil y el hover siguen disponibles. El botón Sonido permite silenciar. La recarga instantánea y el selector de pruebas son utilidades locales y no se publican.

## Sonido y música
Música retro original por mapa, tema de jefe y efectos sintetizados mediante Web Audio. El botón Sonido recuerda el silencio. Requiere una interacción inicial y se pausa fuera de la partida. No descarga grabaciones externas.

## Cofres al explorar
Los cofres se distribuyen por sectores de 768 unidades con posiciones y una semilla nuevas por partida. Cada sector tiene un 60% de posibilidad de contener uno; el sector de inicio garantiza un común en posición aleatoria segura. Entre cofres fuera del inicio: común 72%, raro 26%, legendario 2%; los legendarios requieren estar a 1800 unidades del punto de aparición. Un sorteo legendario cercano se convierte en raro. Se generan al explorar y se conservan las aperturas al regresar, sin repetir premios. Se comprueban obstáculos, fuente y portal. Las arenas no generan cofres normales; el cofre de jefe conserva su recompensa.

## Gallinazo del Caos
Nuevo jefe opcional de pixel art detallado en los Techos de Lima. Portal desde las 3:00 o acceso directo en Desarrollo → Probar jefes. Picadas señalizadas, plumas bloqueables, bandadas y furia con doble picada bajo el 50 % de vida.

### Estructura actual de jefes y minijefes

Reglas implementadas: el portal opcional abre a los **3:00**. Su jefe permanece oculto hasta cruzar; dentro se pausa el reloj del mapa. En partida rápida corresponde al jefe del mapa. En Supervivencia del Caos, las tres ventanas rotan sin repetir entre el jefe local, Gallinazo y Fujimori. ElZeein aparece obligatoriamente al final. Aviso → ataque → recuperación constituye el ciclo habitual.

| Jefe | Patrones de ataque | Fases y ulti |
| --- | --- | --- |
| Combi Final · Campo de Marte | 1: trayectoria avisada y embestida | Sin segunda fase ni ulti propia. |
| Gabinete Infinito · Plaza de Armas | 1: abanico de 9 proyectiles | Ataca más seguido bajo el 50%; sin ulti. |
| Guardián de la Niebla · Machu Picchu | 1: anillo de 12 proyectiles con orientación alterna | Ataca más seguido bajo el 50%; sin ulti. |
| Fujimori · El Expediente Final | 2: abanico de expedientes y sello sobre marca fija | Al 50% aumenta de 5 a 7 expedientes y amplía el sello. No tiene ulti de jefe; la ulti del Alberto jugable es independiente. |
| Gallinazo del Caos · Techos de Lima | 3 en fase 1 y 3 en fase 2 | Furia bajo el 50%; ulti única al 30% y transformación permanente. |
| ElZeein · final obligatorio | 1: persecución y abanico de 5 proyectiles cada 2,7 s | Sin segunda fase ni ulti propia diferenciada. |

**Gallinazo:** fase 1 alterna picada, abanico de plumas e invocación de pequeños gallinazos. En furia encadena dos picadas y aumenta plumas/invocaciones. Al 30% activa una vez: tarjeta base → despegue → transformación lunar → caída sobre la posición fijada del jugador → impacto → dos ráfagas rápidas y una pesada. En fase 2 conserva la picada y sustituye los otros ataques por dos abanicos de plumas serpiente y tormenta de tres impactos marcados. El ala carga plumas visibles antes de las ráfagas; la tormenta muestra plumas grandes cargadas que caen, se clavan y levantan polvo. Sus objetos visuales no añaden daño ni alteran los avisos.

La cámara de Techos de Lima encuadra al jugador y la silueta completa del Gallinazo con reserva superior para el reloj y el HUD. La forma II usa un tamaño de arena 15 % menor y poses separadas de reposo, vuelo, carga y disparo. La tarjeta presenta **ECLIPSE CARROÑERO**, oculta la copia de la arena durante su entrada y hace cruzar plumas por el marco. Los avisos usan sectores estrechos con carriles legibles y rótulos apartados del panel derecho; las plumas rotan, dejan una estela morada acotada y explotan al tocar el piso. Partículas, estelas, escombros y polvo tienen cupos reducidos para evitar picos de render.

Los cuatro jefes de portal mantienen una ruta corta alrededor de las coberturas, la recalculan si cambia la posición del jugador o quedan bloqueados y validan el ancho completo de su cuerpo. No inician un ataque con una cobertura entre ambos; primero buscan una línea de ataque libre.

| Minijefe | Dos patrones normales |
| --- | --- |
| Fiscalizador | Embestida y conos. |
| Paloma Brava | Plumas y acometida de picotazo. |
| Huaco Renegado | Golpe de suelo y fragmentos radiales. |
| Makanaky · La Realeza | Gritos/pulsos y explosión cercana. |

Los minijefes aparecen en superficie a intervalos de 60–90 s, entran en furia al 50%, encadenan su ataque principal y ofrecen ventanas de recuperación para contraatacar. No tienen ulti cinematográfica. El Gallinazo es actualmente el único jefe con ulti cinematográfica completa.

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
Los rivales dejan experiencia (fama). Al llenar la barra, subes de nivel y eliges una de tres mejoras, con el mundo pausado; cada cuatro niveles aparece una cuarta opción de pacto. La curva pide 6 XP para el primer nivel y luego crece ×1,22 + 1 (redondeado), para que las primeras mejoras lleguen antes sin borrar el escalado tardío. El exceso de XP se conserva y encadena elecciones. Las tres cartas no se repiten: una reserva una mejora disponible del arma y aparece en una posición aleatoria; las otras dos se sortean con peso extra para armas. Las cartas de arsenal de Kingteka también entran al sorteo, así que sus desbloqueos y rangos no son automáticos ni siguen una secuencia fija. El arma inicial puede subir hasta rango 5; se ofrecen desbloqueos de Onda causa (área), Tarjetas del caos (perforantes) y Escudo de bandas (área cercana), con un máximo de dos apoyos. Cada poder tiene cinco rangos. A partir de nivel 8, los poderes de rango 5 pueden evolucionar mediante una elección especial: el arma gana daño, alcance, proyectiles y perforación; los apoyos duplican daño y amplían alcance. Las parejas arma + onda y tarjetas + escudo habilitan combos legendarios. Las mejoras de atributos tienen cinco rangos y no ocupan espacios de poderes. Los minions conservan el aviso y daño de sus ataques, pero sus proyectiles viajan con más claridad y velocidad, con trazos pixel legibles incluso en rangos base. El HUD muestra XP, poderes, rangos y estrellas de evolución. Todo se reinicia al empezar otra partida.

P.Progression centraliza opciones, rarezas, comparaciones, combos, pactos, aplicación, efectos automáticos y resumen. El servidor cooperativo pausa la sala y genera tres o cuatro ofertas por jugador; valida ID de elección y aplica cada mejora una sola vez. Espera a ambos y encadena niveles pendientes. Los rangos, combos y tiempos de los apoyos se serializan con cada jugador. No se cambian las ultis ni se requieren compras para evolucionar.
## Vegetación reactiva y palomas
Los arbustos de Campo de Marte y las matas de Machu Picchu se sacuden brevemente al pasar cerca; las palomas de la Plaza levantan vuelo y vuelven al suelo. Mantener el estilo cartoon con acabado pixel, masas redondeadas y sombras ancladas al suelo. Son decoración local: no afectan combate, colisiones ni sincronización. Máximo seis palomas y 32 plantas reactivas del grupo visible, detección limitada a 30 Hz y estado descartado al salir de cámara. El reloj de mapa respeta pausa y arenas; movimiento reducido desactiva reacciones y vuelo.

## Campo de Marte reactivo
Campo de Marte responde durante toda la partida, no solamente al desenlace de ElZeein. Un estado visual local combina progreso del reloj, amenazas a menos de 520 unidades, vida baja, entrada de minijefes o jefe final y activación de la ulti. Esa intensidad acelera suavemente hojas y vegetación; las entradas importantes producen una onda breve que sacude únicamente arbustos cercanos. El sistema no cambia colisiones, daño, aparición de rivales ni estado cooperativo. Examina como máximo 80 enemigos, mantiene entre seis y diez ráfagas visibles, reutiliza los arbustos existentes y se desactiva con movimiento reducido, menú, prácticas y arenas separadas.


## Evoluciones propias y menú de habilidades
Cada uno de los 18 personajes conserva su arma inicial y tiene una evolución exclusiva, disponible mediante elección con rango 5 y nivel 8. «Habilidades y evoluciones» en la selección y «Habilidades» en la partida permiten recorrer personajes, consultar cinco rangos, requisitos, efectos y apoyos. Verde indica rangos obtenidos en la partida actual. La consulta pausa el individual; en cooperativo detiene únicamente la entrada local y avisa que la sala continúa. Escape y Cerrar vuelven al estado previo; las elecciones del servidor tienen prioridad.

### Prototipo de arsenal de Kingteka
Kingteka empieza con una escopeta corta de cuatro perdigones; su caída de daño mantiene el impacto cerca. En nivel 2 puede desbloquear Gallinazo, que lanza dos plumas especiales guiadas y perforantes; en nivel 4 puede desbloquear el golpe de cuerpo, físico y frontal, con empuje y cadencia pausada. `1`, `2` y `3` cambian de arma durante la partida, también desde los botones del HUD. Durante una subida de nivel, esas teclas siguen escogiendo tarjeta. Los rangos son independientes por arma, mejoran daño, alcance y cadencia y tienen requisitos escalonados; el arma activa recibe la tarjeta de arsenal cada dos niveles. La Escopeta Contra requiere rango 5 y nivel 14. El cambio funciona en cooperativo con autoridad del servidor. Las cartas de poderes y mejoras usan escenas con el sprite del personaje elegido y un motivo del poder o estadística. Las cartas de objetos muestran su icono oficial como arte central, sin el sprite del personaje. Solo las tres armas distintivas de Kingteka usan ilustraciones full art dedicadas. La cara ilustrada ocupa todo el marco al revelarse; categoría, efecto y comparación quedan en una placa inferior, y la rareza conserva su destello. El paquete usa WebP y conserva los PNG fuente; algunos recursos seleccionados tienen compresión con pérdida para caber en el límite de 64 MiB. El manifiesto registra calidad, tamaños y hashes en [asset-optimization.json](docs/asset-optimization.json); prompts de cartas: [Kingteka card art](docs/kingteka-card-art-prompts.json). Balance de las tres armas y partidas completas: [KINGTEKA_ARSENAL_BALANCE](docs/KINGTEKA_ARSENAL_BALANCE.md).

El kit de Kingteka se considera cerrado cuando conviven sus tres armas, la ulti Q, la expansión R y la pasiva **Instinto de manada**. La pasiva no sustituye ataques ni evoluciones: premia una decisión de arsenal y muestra su preparación y recuperación en un HUD compartido con las demás pasivas.

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
- cirilo (UR): **Glucosa Maldita** — dispara vómito tóxico desde la boca y exclama, con 25% cada una, «¿ME ENTIENDES O NO?», «FACTOS», «ME DAS RISA» o «FULL MALDAD». En nivel 10 obtiene Deterioro II (+25% área y ralentización); en nivel 20 pasa a Deterioro III con silla de ruedas (+25% movilidad). Su primera caída en Deterioro III lo revive una vez como Cirilo Infernal, restaura sus extremidades, cambia el vómito por fuego y gana +50% daño. Su Expansión de Dominio «Audiencia de Medianoche» dura 9 s: Sandy, Fiscal de la Noche, golpea el martillo cada 3 s y renueva +50% daño, +50% velocidad y +80% alcance. Prueba directa de administrador: `/?practice=cirilo`.
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

Cada personaje tiene cinco rangos de Vitalidad (+8 vida/rango), Fuerza (+4% daño base/rango), Reflejos (3% menos de recarga/rango), Zapatillas (+3% velocidad base/rango) e Imán (+12% recogida base/rango), antes del crecimiento por rareza. C/R/SR/SSR/UR multiplican las ganancias por ×1,00/×1,03/×1,06/×1,09/×1,12; velocidad y recarga usan la mitad de esa diferencia. El coste es base × (rango actual + 1): 40, 50, 55, 35 y 35. Se aplica una sola vez al comenzar el individual; cooperativo conserva sus atributos de servidor.

P.Meta valida esquema, identificadores, rangos y saldo. Compra y premio escriben un único documento; las operaciones releen el estado y usan Web Locks cuando está disponible. Los cambios de otras pestañas se reflejan por storage. Una lectura corrupta o un fallo de escritura no confirma gasto ni premio: conserva el guardado y muestra estado y reintento. No se utiliza el monedero local como autoridad de combate cooperativo.

La pantalla Mejoras reúne rol, fortaleza, debilidad, rareza, crecimiento y los valores permanentes efectivos de vida, daño por impacto, recarga, velocidad e imán. Cada tarjeta compara el valor actual con el siguiente rango antes de gastar. El poder estimado es un índice de progreso relativo: 100 representa a ese mismo personaje a 1★ y sin rangos; sirve para medir su avance, no para prometer DPS ni sustituir las diferencias de alcance, área o perforación. Las proyecciones 1★/3★/5★ reutilizan los rangos actuales. Los jugadores pueden reiniciar los cinco rangos recuperando el 70% entero de las monedas invertidas y conservan estrellas, colección e historial. En una cuenta administradora, «Restablecer a Base» deja rangos en 0 y estrellas en 1★; el cambio se guarda. El perfil admin ya no vuelve a maximizar los rangos ni las estrellas al leer el progreso.

La interfaz de Mejoras prioriza decisiones sobre explicación: saldo y selector comparten una barra, las reglas extensas están dentro de «¿Cómo funciona?», cada estadística agrupa su etiqueta con su valor y las estrellas usan una fila compacta. El historial, las proyecciones y los rangos tienen títulos diferenciados. El HUD Combo del Causa se oculta por completo en el vestíbulo para no cubrir la navegación; continúa visible durante las partidas.

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

P.Gacha resuelve cargo, devolución, desbloqueo, garantías e historial en una sola P.Meta.transaction. El resultado se guarda antes de la animación y se puede consultar de nuevo sin pagar; cerrar o recargar no vuelve a tirar. La animación comparte el bucle de dibujo, se detiene al salir/ocultar pestaña y se revela inmediatamente con movimiento reducido. La rareza no modifica los stats base: mejora únicamente las ganancias de estrellas y mejoras permanentes en individual.
## Acabado de caminos
Los [caminos](docs/PATH_FINISH.md) conservan sus rutas y texturas aprobadas, con bordes de pasto en Campo, juntas de pavimento en Plaza y desgaste sutil en Machu. Acabado de dos unidades por píxel, detalles deterministas y composición cacheada por sector. Sin imágenes adicionales ni cambios de colisiones; hasta 96 grupos de pasto en los bordes, fuera del corredor.


## Ambiente sonoro de los mapas
Campo tiene hojas y aves discretas; Plaza, agua que aumenta al acercarse a la pileta; Machu, viento grave y suave. Síntesis original con dos fuentes de ruido compartidas, sin descargas de audio, y ajustes a 10 Hz. Respeta el botón de sonido, pausa, menú y pestaña oculta; se retira durante jefes, arenas y pruebas. Los trinos son espaciados y ceden prioridad a los efectos del combate.


## Invocación ×10
El menú Gacha permite una tirada por 60 monedas o diez por 600. Se requiere el saldo completo antes de comenzar, sin descuento adicional. Las diez se resuelven en orden con las mismas probabilidades, garantías y devoluciones por repetidos. Si la colección se completa dentro del lote, se terminan las diez tiradas; una colección ya completa impide iniciar otra compra. El resumen muestra cada causa, rareza, nuevo/repetido, devolución total y coste neto. La animación se puede saltar y respeta movimiento reducido. El último lote se recupera al recargar sin volver a cobrar.

## Historial, copias y estrellas
Gacha incorpora pestañas Invocar, Historial y Estrellas. El historial guarda las últimas 200 tiradas con personaje, rareza, nuevo/repetido y fecha/hora local; incluye filtros y páginas de 20. Las tiradas antiguas disponibles se conservan como «Fecha no registrada» y no se recuperan registros que el límite anterior ya había descartado.

Los repetidos mantienen su devolución de monedas y añaden una copia del mismo personaje hasta 5★. Todos empiezan a 1★; ascender manualmente a 2★/3★/4★/5★ consume 2/3/4/5 copias respectivamente, sin monedas adicionales. Cada estrella suma 3% de vida y daño multiplicado por el crecimiento de su rareza: a 5★ va de +12% C a +13,44% UR. Solo se aplica en individual; no altera cooperativo ni prácticas. Puedes seguir invocando con la colección completa para obtener copias, hasta tener todos a 5★.
### Balance de los 18 causas
Comparación reproducible de ataques base y evolucionados contra blancos cercanos, medios, jefe móvil, filas y enemigos alrededor. Se moderan bumeranes, ráfagas y nubes dominantes y se refuerzan Cristorata, Cuy, Alberto y Cerdito. Consulta [los valores y motivos](docs/ROSTER_BALANCE.md). El catálogo base conserva el balance por rol; la rareza multiplica solamente el progreso permanente posterior. Las fichas muestran el catálogo actualizado.


### Validación con partidas completas
El [informe de partidas automatizadas](docs/FULL_RUN_BALANCE.md) compara los 18 causas en los tres mapas, con tres semillas por mapa. Usa el motor individual normal, enemigos móviles, daño recibido, colisiones, experiencia y mejoras obtenidas jugando. Conserva trazas, victorias, derrotas, límites de tiempo y minijefes no abatidos. Es evidencia de simulación local, no una tasa de victoria humana ni una prueba de FPS.

Resultado de la muestra inicial: 160/162 sobreviven a 300 s, 143 victorias finales, 9 derrotas y 10 límites con vida; 526/529 minijefes abatidos. Sustento y Charles siguen destacando por rapidez contra minijefes. Se conserva el balance actual hasta contrastar estos datos con otras estrategias o jugadores; no se equipara esta muestra con una tasa de victoria humana.

## Celebración de ascensos y colección
Tras guardar un ascenso se abre una celebración con el retrato, la estrella recién obtenida, el rango anterior/nuevo, las copias consumidas/restantes y el cambio de bonificación. Se puede cerrar con Continuar o Escape, o saltar directamente a la colección. Movimiento reducido elimina la animación. Las tarjetas y la ficha de colección muestran estrellas y porcentajes actuales de vida/daño; la ficha añade copias y siguiente coste, indicando que se aplican solo en individual. Los atributos base de la ficha siguen identificados como base.
## Tribunal legendario de Fujimori
La sentencia conserva 340 u y añade grietas y onda doradas, expedientes «CASO ARCHIVADO» sobre los minions eliminados y escudo Expediente de 3 s para los jugadores vivos. Jefes alcanzados reciben 8 % de vida máxima (tope 200, no letal) y +20 % de daño recibido durante 5 s. Respeta fases invulnerables de entrada y la ulti del Gallinazo. No acumula vulnerabilidad ni recarga por sus propias bajas. Prueba: Ajustes → Probar ulti de Fujimori → Q; Recargar ulti y Reponer objetivos permiten repetir.
Práctica de Fujimori: incluye ElZeein de entrenamiento, inmóvil y sin ataques, con 1800 PV persistentes. El panel muestra vida, último daño efectivo, daño de la ulti y vulnerabilidad restante. Volver a invocar jefe reemplaza únicamente ese actor, restaura su vida y limpia disparos pendientes; no recarga la ulti. Reponer objetivos conserva el jefe y su vida. Ambos controles se bloquean durante el Tribunal. Su derrota no termina la práctica ni concede bajas, botín o recarga. Se usa el combate y la sentencia reales, sin estado de QA externo.

## Filtros de colección y etiquetas
La colección permite combinar rareza, estrellas exactas (1–5) y Solo listos para ascender. Las tarjetas listas muestran marca verde y copias/coste; los bloqueados no cumplen filtros de estrellas o ascenso y los de 5★ no aparecen como listos. Limpiar filtros restaura la vista completa. Filtrar no cambia el personaje seleccionado: si queda fuera del filtro, la ficha lo indica. Los filtros duran durante la sesión y se actualizan tras ascender o recibir cambios de progreso en otra pestaña.

Etiquetas de colección: C · Común, R · Raro, SR · Súper raro, SSR · Ultra raro y UR · Supremo. SR corresponde al antiguo Épico y SSR al antiguo Legendario. Las estrellas siguen siendo progreso separado, pero su ganancia usa el multiplicador de crecimiento de la rareza.

### Personajes base y versiones

La colección distingue entre una **causa base** y sus **versiones o skins**. Una versión puede conservar sprites, ataques y evoluciones propios, pero no ocupa otra entrada del gacha: comparte desbloqueo, rareza, copias y estrellas con su causa base. La identidad canónica se registra en `P.Gacha.variants`; los menús nuevos deben consultar `P.Gacha.canonical(id)` en vez de contar una versión como otro personaje.

- **Kingteka · Amor a los animales** es una causa **UR · Supremo**.
- **Cerdito VTuber** (`cerdito`) es una versión/skin jugable de Kingteka (`kingteka`). Mantiene su presentación y habilidades propias, pero comparte con Kingteka el desbloqueo y la progresión permanente.
- Los guardados antiguos que contengan `cerdito` siguen siendo reconocidos mediante la resolución canónica; no se elimina su progreso.

## Ultis del Cuy y la Paloma
Cuy Supremo: Estampida Suprema (5 s, daño de área y coraza del 50 %). Paloma del Centro: Bandada del Centro (6 s, espiral de palomas y remate de área). Carga con 20 bajas; pulsa Q o el botón. En Ajustes están las dos prácticas gratuitas, con recarga y cambio directo de personaje. Conservan los sprites cartoon pixel art actuales.

## Ordenar la colección
El selector Ordenar colección permite rareza, estrellas o copias disponibles, de mayor a menor. En los tres casos van primero los personajes listos para ascender; los empates conservan el orden del catálogo. Orden y filtros se combinan y duran durante la sesión. Limpiar filtros mantiene el orden elegido. Cambiar de orden no cambia la selección, los personajes ni el progreso; tarjetas, retratos y navegación por teclado siguen el mismo orden visible.
Validación integrada adicional: 54 partidas sobre b10eef1 (18 causas × 3 mapas, semilla 404), con coberturas revisadas y nuevas ultis de Cuy/Paloma. Sobreviven 54/54 a 300 s: 47 victorias, 4 derrotas y 3 límites; 169/169 minijefes abatidos. Las dos muestras quedan separadas por versión y política de habilidades; sus tasas no se mezclan. G5 y Fuzo fueron los más rápidos en esta validación, sin que eso pruebe superioridad universal.


Makanaky · La Realeza está disponible como causa jugable y conserva su aparición como minijefe en Plaza de Armas.

### Ajuste fino de G5, Fuzo y Cerdito
G5 conserva vida, movilidad y arco: recarga 0,62 → 0,68 s y multiplicador evolucionado 0,65 → 0,58. Fuzo conserva alcance y perforación: impacto 0,85 → 0,80 y evolución 0,65 → 0,58. Cerdito mantiene siete perdigones y alcance 400: impacto 0,50 → 0,56, inicio de caída 140 → 165 u y evolución 0,65 → 0,70. Consulta [la comparación emparejada](docs/TRIO_BALANCE.md), con partidas antes/después en los mismos mapas y semillas. Las fichas se derivan de los valores nuevos.

En 54 partidas emparejadas, la mediana de minijefe cambia de 5,8 → 9,1 s para G5, 5,4 → 7,5 s para Fuzo y 13,5 → 12,8 s para Cerdito. Las 27 posteriores sobreviven cinco minutos: 26 victorias y un límite con vida. Se conservan los resultados completos, incluidos minijefes no abatidos, y los límites de una sola estrategia automatizada.

# Cuentas y guardado en el VPS

El vestíbulo incluye **Cuenta / Login**: registro, acceso, recuperación con código privado y guardado por cuenta en Hostinger. Jugar como invitado sigue disponible. El progreso incluye monedas, colección, estrellas, mejoras e inventario; se conserva separado del invitado y detecta conflictos entre dispositivos. No guarda partidas a medio jugar ni proporciona un ranking verificado.

La activación del backend requiere el volumen persistente y la ruta `/api/` del juego; el formulario por sí solo no activa la base de datos. Consulta [cuentas, esquema, instalación, backup y límites de confianza](docs/ACCOUNTS.md). **Este repositorio se trata como público**: nunca subir claves, `.env`, bases de datos, usuarios o backups. Los datos reales viven fuera de la carpeta pública y de las releases.

La pantalla de entrada ofrece **Iniciar sesión**, **Crear cuenta** o **Jugar como invitado**. El acceso utiliza los paneles azules y botones dorados del juego. Registro y recuperación tienen formularios separados; elegir invitado conserva su guardado local.

### Combo del Causa · carga de ultis
Las ultis de Kingteka, Alberto, Cuy y Paloma requieren tres cartas automáticas: Caos, Aguante y Hazaña. Se completan en 45–52 s de combate; con la duración de la habilidad, el ciclo ronda 50–60 s. Q consume las tres y puedes guardarlas hasta necesitarlas. Las propias bajas, proyectiles tardíos y nubes de la ulti no recargan. Funciona contra un jefe solo y respeta pausa/cooperativo; práctica y laboratorio conservan recarga gratis. Consulta [reglas, mediciones y límites](docs/CAUSA_COMBO.md).

En el laboratorio, «Minions al morir» permite dejarlos normales, hacer que reaparezcan a los 0,8 s o volverlos inmortales con un mínimo de 1 PV. Estas reglas solo afectan minions comunes de la prueba; los jefes y objetivos especiales mantienen su funcionamiento.

En móvil, «Entrar a la prueba» responde desde el primer toque. Si todavía faltan sprites de caminata, el botón muestra «Preparando sprites…», bloquea dobles pulsaciones y abre la prueba automáticamente cuando termina la carga. El aviso de carga o error se dibuja por encima del panel moderno. «Probar evento» permanece desactivado antes de entrar porque los eventos necesitan una partida de laboratorio activa; se habilita dentro de la prueba.

El laboratorio de administrador incluye «Supervivencia · oleadas reales» para jugar con un personaje nivel 1 y su arma base, sin estrellas ni mejoras permanentes. El ascenso de nivel dentro de esa partida sigue habilitado. El perfil local permite volver a Base o configurar multiplicadores de vida, daño, velocidad, cadencia, imán, alcance y atributos físicos/especiales (×0,5 a ×10), con un botón de buff global ×2. La casilla «Aplicar también al modo de juego normal» activa ese perfil al iniciar desde Jugar, con oleadas y niveles habituales; la sesión no guarda récords ni premios permanentes. Los ajustes se guardan en el navegador, separados del progreso de cuenta.

**Mi perfil** muestra usuario, monedas, colección y estadísticas. Invitados nuevos comienzan con cuatro causas; el resto se desbloquea jugando. El rol administrador se concede únicamente desde el VPS a una cuenta existente, nunca durante el registro ni desde el navegador.



**Panel admin:** exclusivamente la cuenta `reysuperior` con rol admin puede consultar usuarios, entregar 1–100.000 monedas por operación, desbloquear personajes y conceder o retirar acceso al Laboratorio. El permiso de laboratorio se guarda en el servidor y no convierte al jugador en administrador: no habilita control de cuentas ni balance global. Incluye búsqueda, paginación, confirmación e historial auditable. No permite cambiar roles ni ver contraseñas.

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

El acceso Cooperativo del vestíbulo abre siempre la interfaz moderna: los controles reales de sala, código, amigos e invitaciones se montan dentro de esa vista, y cualquier llamada antigua a `Lobby.show('coop')` se redirige a `coop-hub`. Así no reaparecen el panel lateral ni el menú heredado; en móvil, los controles se reorganizan en una sola columna. Mejoras también compra y reinicia rangos dentro de su panel moderno, mientras que Ajustes tiene una única entrada y abre la vista moderna desde el engranaje superior.

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

### CiriloTV UR · Audiencia de Medianoche

Cirilo usa un atlas propio de cuatro etapas y cuatro acciones. Cada celda conserva únicamente la silueta conectada del personaje para impedir que aparezcan brazos, zapatos o fragmentos de cuadros vecinos. Su Expansión de Dominio comienza con una cinemática de 4,6 s a pantalla completa: la cámara se acerca a sus manos reales, Cirilo forma el sello y transforma progresivamente brazos, piernas, terno, cuernos y alas antes de declarar **EXPANSIÓN DE DOMINIO · AUDIENCIA DE MEDIANOCHE**, aparecen rayos rojos y Sandy dicta la sentencia. Después, el mapa queda totalmente cubierto por un tribunal pixel art con estrado, público, suelo en perspectiva y Cirilo suspendido en primer plano. Sandy utiliza un atlas pixel art de seis poses: espera, levanta hombro y codo, alza el mazo, baja el brazo, golpea y retrocede. El primer martillazo cae a los 1,45 s y luego se repite cada tres segundos; cada impacto añade grietas, polvo, destello, sacudida localizada y dos ondas judiciales que recorren la audiencia. Los minions del público reaccionan al golpe y cada enemigo realmente dañado recibe papeles giratorios y un sello rojo **CULPABLE**. El golpe renueva durante tres segundos daño +50 %, velocidad +50 % y rango +80 %. Movimiento reducido elimina la sacudida, estabiliza al público y reduce partículas sin cambiar tiempos ni combate.

La Audiencia puede activarse con la carga completa en cualquier nivel. Antes de la resurrección definitiva, Cirilo adopta temporalmente su cuerpo demoníaco, fuego, cuernos y alas durante el dominio, y al salir recupera exactamente su forma anterior: normal, Deterioro II o silla de ruedas. Si muere después de alcanzar el nivel 20, revive una vez como demonio permanente y desde entonces ya no revierte al terminar futuras audiencias.

La entrada temporal usa un atlas propio de doce cuadros: forma el sello con las manos reales, reconstruye brazos y piernas con píxeles de fuego, materializa el terno, desarrolla cuernos, despliega las alas, asciende y desciende mientras nace el tribunal. El demonio permanente omite la regeneración y reproduce solamente cuernos, apertura de alas y rugido para que las activaciones posteriores sean más directas.

Durante la audiencia Cirilo vuela a una altura legible sobre una sombra independiente. Alterna cuadros de alas con balanceo vertical continuo y movimiento reducido elimina el vaivén sin modificar su posición jugable. Su Aliento infernal forma una llamarada ancha de tres capas —borde oscuro, fuego rojo y núcleo amarillo— y cada impacto real deja 1,8 s de incendio residual con pulsos visuales acotados; el propio incendio no puede renovarse a sí mismo.

La entrada de Cirilo parte de su forma real al activar: de pie, con brazos vendados o en silla según su nivel, y solo reconstruye las etapas que faltan. Usa un atlas transparente 4×3 de doce cuadros, devuelve la forma previa al terminar y acompaña sello, reconstrucción, rugido, aleteo limitado, fuego, martillazos y ruptura con una mezcla sintetizada. Su dominio vive en la carta **R · AUDIENCIA**; la carta **Q · ULTI · PRÓXIMAMENTE** permanece visible pero no puede activar la expansión.

El sello usa un acercamiento al cuerpo completo y a las manos conectadas del propio sprite; desaparecen el recuadro flotante y las manos espectrales independientes. La carta de Audiencia usa una ilustración vertical exclusiva del tribunal. Entre martillazos el público murmura con volumen bajo y alterna miedo, celebración y protección; los minijefes reciben **CONDENA MAYOR** y los jefes **SENTENCIA FIRME**. En cooperativo, Cirilo y su aliado aparecen en posiciones opuestas del frente, con una marca celeste detrás del segundo jugador para que Sandy, las gradas y el vuelo nunca lo oculten.

La revisión móvil usa un encuadre mínimo de 0,38× para mostrar los 920 píxeles del tribunal completos, sin dejar rivales fuera de cámara. Durante los 4,6 s de activación se oculta el HUD, el estrado se reconstruye desde abajo y el título queda centrado y contenido incluso en pantallas angostas. El vuelo alterna cuatro fases visibles de ala a 8 cuadros por segundo, añade estelas laterales y duplica el balanceo vertical. Sandy usa un atlas RGBA de 1536×512: seis poses nítidas con brazo, mano y mazo unidos, dibujadas a una altura más contenida para no invadir el combate. La activación encadena barrido, acercamiento al sello y golpe de cámara; el suelo, paredes, gradas y estrado emergen en fases entre grietas, rayos y píxeles. Toda mejora queda pendiente hasta que termina el dominio, y los minions nuevos son trasladados y confinados dentro de la sala. La salida añade sentencia final, temblor, onda dorada y destrucción radial antes de revelar el mapa original.

La audiencia es una arena física de 920 × 600 unidades: traslada temporalmente a jugadores, enemigos, cofres, botín, tienda y evento cercano, añade cuatro paredes sólidas y conserva movimiento, ataques, recogida y reanimación. Al terminar, el tribunal se fragmenta durante 0,9 s, muestra **SE LEVANTA LA AUDIENCIA**, reconstruye gradualmente el mapa original y recién entonces devuelve cada elemento a sus coordenadas anteriores. La práctica `/?practice=cirilo` mantiene sus controles por encima del panel general del laboratorio e incluye un botón grande **RECARGAR Y LANZAR DOMINIO** que fuerza la forma demoníaca, llena la carga y activa la audiencia en un solo paso. Los botones secundarios permiten revisar Forma I, Deterioro II, silla de ruedas y demonio sin acumular estadísticas.

- **Partida rápida:** conserva el recorrido original de 5 minutos, un portal opcional y ElZeein al final.
- **Supervivencia del Caos:** recorrido individual de 30 minutos en el mapa elegido, dividido en seis etapas de cinco minutos.
- En Supervivencia aparecen minijefes cada 4–6 minutos y tres ventanas de portal. El reloj se pausa dentro de cada arena y ElZeein aparece al minuto 30.
- Cada etapa puede añadir un solo obstáculo destructible y seguro: ramas en Campo de Marte, barricadas en Plaza de Armas y derrumbes pequeños en Machu Picchu.
- Las seis etapas cambian el tono del terreno con una transición breve; al vencer a un jefe de portal, el mapa responde con otro pulso visual. El escenario elegido no cambia de forma arbitraria.
- La iluminación cambia cada cinco minutos: mañana, mediodía, tarde, atardecer, noche y tormenta final. El HUD muestra un emoji, el clima activo y la cuenta hasta el siguiente ambiente; garúa, reflejos y niebla siguen visibles con movimiento reducido usando una versión estática y ligera.
- La horda conserva un máximo de 80 en Partida rápida. En Supervivencia crece gradualmente hasta 100; durante un minijefe se mantiene el 85 % del presupuesto (85 al final), en lugar de caer a 56.
- Desde 2:45 aparece un minievento opcional aproximadamente cada 2:45. Solo hay uno activo: meteoritos, picnic y cometas en Campo; garúa, palomas y faroles en Plaza; cóndor, viento y terrazas en Machu. Cada evento avisa 7 s, dura 45 s y ofrece hasta 25 monedas; no causa daño ni modifica colisiones.
- A los 12 minutos se ofrece una vez un minijuego opcional por mapa: cinco señales en 60 s y hasta 50 monedas. Se aplaza si coincide con jefes o portales.
- Los eventos dibujan hasta cinco señales y un marcador con primitivas, sin añadir enemigos ni partículas persistentes, para cuidar los FPS.
- Cooperativo y las pruebas de desarrollo permanecen temporalmente en Partida rápida para conservar el protocolo autoritativo actual.

### Evento mayor · Extinción

El impacto cinematográfico del meteorito puede iniciar un evento mayor de Supervivencia del Caos. No sustituye al minievento de meteoritos que ya existe y puede forzarse desde **Laboratorio → Ambiente y eventos → Extinción completa**.

1. **Impacto:** el meteorito cae cerca de uno de los jugadores vivos, elimina los minions dentro del área inmediata y deja un cráter grande con fuego, ceniza y terreno destruido. El ambiente se oscurece durante el evento.
2. **Invasión prehistórica:** huevos y grietas del meteorito generan dinosaurios pequeños, veloces y voladores. Sus nacimientos se concentran alrededor del cráter para mantener el conflicto cerca del impacto.
3. **Tres fragmentos:** aparecen tres núcleos alrededor del cráter. Mientras quede alguno, fortalecen la invasión y bloquean el avance de la etapa. El jugador debe regresar al impacto y destruirlos.
4. **Jefe obligatorio:** al romper el último fragmento emerge una criatura prehistórica mutada. Una arena temporal contiene el enfrentamiento; el jefe usa saltos, embestidas y ataques a distancia para impedir que un mapa grande permita ignorarlo. Vencerlo reanuda la progresión normal.
5. **Portal prehistórico opcional:** la victoria abre una entrada a una mazmorra corta de dinosaurios con enemigos, escenario y recompensa exclusivos. Rechazarla permite continuar la partida sin alargar obligatoriamente el recorrido.

En cooperativo, tocar el portal pausa la sala y muestra la decisión a ambos jugadores. Los dos deben aceptar para entrar juntos; si cualquiera elige continuar, el portal se cierra y la partida sigue. Al completar la mazmorra ambos votan una reliquia compartida; si los votos difieren, decide el anfitrión y el mismo efecto se aplica a todo el equipo.

La recompensa de la mazmorra ofrece una elección entre **Corazón fósil** (+35 de vida máxima y regeneración), **Colmillo del depredador** (+25 % de daño y +18 % de velocidad durante cinco segundos después de derrotar un enemigo) y **Fragmento celeste** (un meteorito pequeño golpea a los enemigos cercanos cada pocos segundos). El evento detiene el reloj de la etapa hasta vencer al Tirano del Cráter; el portal posterior sí puede rechazarse para continuar la partida.

El HUD superior agrupa nombre, nivel, XP y vida en una sola tarjeta izquierda; tiempo, rivales y etapa ocupan el centro. El contador de ElZeein aparece al comenzar cada etapa y durante el último minuto, sin repetir nivel o experiencia. Los portales no publican su horario exacto: diez segundos antes anuncian una anomalía y, al abrir, una flecha de borde señala dirección y distancia hasta acercarse. El jefe se revela al cruzar y recibe una barra superior propia con nombre, fase, PV reales y aviso de reloj pausado. En móvil el panel de audio se abre como una bandeja inferior y los controles conservan áreas táctiles separadas.

Chamelín: sello encadenado con pausa y pisotón, giro con arrastre visual, chorro de pulsos/gotas y salpicaduras, tuberías y charcos animados. Al cerrar la boca las baldosas se desprenden y revelan el mapa original; quedan huellas y vapor 2 s sin daño extra. Se conservan el baño jugable, las duraciones y protección solo de entrada/mordida; respeta movimiento reducido.

Balance de Chamelín: el impacto del emoji usa 15 % del daño base del arma; el charco conserva su daño independiente de 30 % del daño base por segundo durante 4 s. Ralentiza 20 % a normales y 10 % a jefes/minijefes. Las zonas superpuestas no suman daño ni ralentización. Solo el chorro del dominio reduce ambas defensas; la mordida conserva sus multiplicadores y potencia anteriores.
Las cartas de todos los objetos Dota muestran su imagen original grande como arte principal, igual que el catálogo y el inventario. No usan una reinterpretación generada ni el fondo de personaje con franjas. Se conserva el respaldo local si falla la imagen remota.

### Balance global de personajes (solo admin)
En el vestíbulo, **Balance de personajes** permite seleccionar un causa con su retrato y ajustar vida, daño base, velocidad, recarga, alcance y ATQ/DEF físicos y especiales. Muestra originales y cambios antes de guardar. El servidor valida el rol admin, límites y revisión; conserva auditoría y permite restaurar cada personaje. Todos los admins pueden balancear; las entregas siguen reservadas a ReySuperior.
Los ajustes persisten en SQLite, sin editar archivos ni redesplegar. Afectan nuevas partidas individuales/prácticas y salas cooperativas, nunca entidades en una partida activa. El lobby consulta al abrir, volver al menú, recuperar foco y cada 15 s; recarga la página para recibirlos inmediatamente. No modifica estrellas, inventario, progresión ni coeficientes exclusivos de ultis. Un cambio de daño base sí escala habilidades que dependen de ese valor.
Las imágenes originales de objetos Dota en cartas se reducen 28 %, se centran con margen y se acompañan del sprite del causa actual. Al elegir, la confirmación usa la misma imagen original y un efecto por familia (regeneración, filo, movilidad, cargas o Blink), sin icono genérico. Movimiento reducido aplica la elección inmediatamente.

El editor de balance usa tarjetas con sprites y rareza como Causas: selector con búsqueda a la izquierda y ficha compacta editable a la derecha. Cambiar de tarjeta solo renueva la ficha, conservando el desplazamiento de la colección. En móvil la ficha aparece debajo.

Balance incluye «Probar en el muñeco»: un visor visual de cálculo con los valores sin guardar del formulario. Muestra referencia por proyectil/contacto, cadencia, alcance, caída por distancia y defensa configurable del muñeco; Chamelín incluye referencia del charco. Volver conserva exactamente el formulario. No inicia ni modifica partidas, no publica valores y no guarda progreso. El cálculo no sustituye una medición de combate completo: excluye colisiones, críticos, objetos, estrellas, ultis y efectos secundarios.

### Extinción: versión completa

El evento mundial de Extinción sigue esta ruta: meteorito → tres oleadas con roles → fragmentos → T-Rex **Tirano del Cráter** → portal cooperativo → Era Perdida → **Triceratops Fósil** → reliquia compartida. Durante el evento se detienen los minions normales y los cofres quedan sellados. Alejarse del combate activa meteoritos telegrafiados; el T-Rex entra en fase II al 50 % de vida.

El bestiario del evento incluye Velociraptor (daño), Anquilosaurio (tanque), Pterosaurio (apoyo), Dilofosaurio (debilitador) y Parasaurolophus (sanador). El atlas visual versionado está en `public/assets/enemies/extinction-dinosaurs-v4.webp`.

La revisión mecánica organiza las oleadas como 3/4/5 rivales: tanque con dos atacantes, apoyo/debilitador con dos atacantes y, finalmente, los cinco roles juntos. El Anquilosaurio protege aliados cercanos, el Pterosaurio acelera sus recargas, el Dilofosaurio deja veneno, el Velociraptor se enfurece con el tiempo y el Parasaurolophus puede reanimar una sola vez. El evento falla si cae todo el equipo o vence su reloj. El T‑Rex combina mordida/embestida lateral, rugido interruptor, onda de pisotón y meteoritos que inutilizan coberturas durante siete segundos; después de tres ataques queda agotado y recibe daño adicional.

La Era Perdida se divide en tres salas de cinco. Entre las dos primeras se elige curación, +20 % de daño temporal o una sala más difícil con +35 % de recompensa. El Triceratops Fósil tiene dos placas que absorben daño; después expone el cristal y puede aturdirse al embestir los dos pilares de la arena. Al terminar o fallar, el regreso restaura terreno y posiciones y bloquea nuevas apariciones durante seis segundos para evitar una emboscada inmediata.

En cualquier combate se puede hacer clic izquierdo sobre un enemigo, jefe o fragmento para fijarlo. El ataque automático lo prioriza mientras esté vivo, visible, con línea de tiro y dentro del alcance; hacer clic otra vez lo libera. En cooperativo cada jugador mantiene su propio objetivo y el servidor valida únicamente su identificador, nunca posiciones ni daño enviados por el cliente.
