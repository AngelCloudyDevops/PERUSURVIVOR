# CiriloTV · kit de riesgo, taxi y maldiciones

Contrato funcional 9/9: tres ataques, tres evoluciones, Persistencia maldita, ¡FULL MALDAD! Q y Audiencia R. La lógica de las transformaciones permanece en `cirilo-ur.js`; el tribunal, sus presentaciones y retornos permanecen en `cirilo-arena.js`. Esos dos archivos no se modifican.

## Identidad y base

UR · Supremo; Humano, Ingenio, Especialista / Controlador, daño híbrido y dificultad avanzada. Se conservan 135 PV, velocidad 165, poder base 24, recogida 90 y los índices de canal existentes (ATQ físico/especial 100/85, DEF 100/100). Son valores de partida sin estrellas, equipo, progresión ni ajustes administrativos. No se afirma que esta primera implementación tenga balance definitivo.

## Arsenal

Teclas 1/2/3 o botones táctiles alternan la técnica activa. La segunda se ofrece por carta desde nivel 2 y la tercera desde nivel 4. Cada una tiene rangos 1–5 propios: +14 % de daño, +5 % de alcance y multiplicador 0,96 al intervalo por rango adicional. Los rangos 2–5 exigen niveles 6/8/10/12. Evolución: rango 5 de esa técnica y nivel 14. Consultar la ficha no concede poderes; el progreso de dos jugadores es independiente.

| Técnica | Intervalo base | Alcance base | Comportamiento y evolución |
|---|---:|---:|---|
| Vómito tóxico | 0,82 s | 520 u antes de etapas | Mantiene el ataque original desde la boca, ralentización, nubes y Aliento infernal según forma. Glucosa Maldita conserva su identidad visual y agrega ×1,15 a la técnica, además de sus rangos. |
| Taxi de Cirilo | 3,8 s | 240 u | Arranque, embestida y regreso por la ruta recorrida. Carrera de ida y vuelta aumenta el alcance a 300 u y permite daño reducido en reversa. |
| Eco maldito | 1,75 s | 430 u | Proyectil especial que marca un rival. Maldad contagiosa propaga hasta dos marcas débiles, sin propagación recursiva. |

El aliento demoníaco conserva el perfil original de CiriloUR, incluido su intervalo nominal 0,66 s y modificadores de etapa/dominio. Los multiplicadores normales de equipo y cadencia siguen aplicándose. La mejora genérica de proyectiles conserva su comportamiento existente.

## Taxi: ida, resistencia y reversa

- Cirilo aparece dentro de un vehículo completo con ruedas, ventanas, conductor, faros y luces de reversa. El coche mantiene su orientación al retroceder; las ruedas animan por distancia y el brillo azul identifica la protección parcial.
- Arranque de 0,18 s, ida a 550 u/s y reversa a 440 u/s. El alcance efectivo tiene tope de 420 u.
- Daño físico de ida: 1,8× poder de la técnica; máximo un impacto por rival durante todo ese recorrido. La versión básica no daña al volver.
- Evolución: la reversa puede golpear una vez a cada rival con 55 % del daño de ida. No se vuelve a aplicar daño cada cuadro de contacto.
- Dentro del taxi reduce **40 % del daño recibido**, conservando el +10 % de riesgo original, las defensas y los fotogramas de protección normales al ser golpeado. No concede invulnerabilidad, curación ni una resurrección adicional.
- Colisión de terreno con radio 27 y subpasos de hasta 10 u, evitando atravesar paredes a alta velocidad. La reversa sigue los puntos libres guardados; si aparece un obstáculo, se detiene en el último punto libre alcanzado, sin teletransportarse al origen.
- El movimiento manual no arrastra el coche y no se superpone con la esquiva de Extinción. No puede combinarse con Q ni iniciar Audiencia durante el recorrido. Una muerte, resurrección o cambio de escena cancela el vehículo.
- Al salir conserva la forma humana, de deterioro o demoníaca que tenía. El taxi no escribe vida máxima, poder permanente, etapa ni el indicador de resurrección.

## Eco maldito

El disparo inicial hace 0,25× el coeficiente de la técnica y coloca una marca si causa daño y el rival sigue vivo. Tras 0,75 s estalla con coeficiente 1,25 en rango 1, en un radio base de 90 u (tope 150). La marca sigue al objetivo; si cae antes, conserva su última posición para la explosión. Los sólidos bloquean tanto el disparo como el daño del área.

Maldad contagiosa transmite hasta dos marcas secundarias a rivales vivos y visibles desde la explosión a 160 u. Detonan tras 0,45 s, con 50 % del poder y 80 % del radio originales; no propagan otras marcas. Máximo seis marcas activas por Cirilo. Cambiar de escena las cancela. Las marcas son verdes en humano y cálidas en demonio; esto no cambia las transformaciones ni añade efectos al dominio.

## Persistencia maldita: formalizar las reglas existentes

La pasiva registra y explica las mecánicas que ya funcionaban, sin crear otra barra ni otra vida:

- Recibe 10 % más daño según la regla original.
- Niveles 10 y 20 conservan los deterioros y bonificaciones existentes.
- Desde la etapa avanzada puede resucitar una sola vez con 40 % de vida, convertirse en demonio y recibir el multiplicador de poder original.
- Audiencia puede usar la transformación temporal que ya tenía y regresar a la forma anterior; no consume la resurrección por hacerlo.

El HUD indica etapa, forma demoníaca y disponibilidad/consumo de resurrección. Las condiciones, multiplicadores y métodos originales se mantienen. La simulación autoritativa aplica esas mismas etapas a Cirilo al avanzar su combate.

## Q · ¡FULL MALDAD!

Q usa `ultimate.ciriloCharge`, separado del depósito `ultimate.charge` que conserva Audiencia. Cada baja propia normal/pesada/minijefe/jefe concede 5/8/20/30 puntos, con máximo 100. No recarga con sus propios proyectiles ni durante su ejecución.

Durante 1,95 s reemplaza al ataque personal por tres abanicos a los 0 / 0,65 / 1,30 s. Cada uno lanza tres proyectiles con separación angular de 0,16 rad, velocidad 600 u/s, alcance base 450 u, un impacto por proyectil y coeficiente 1,05. La escala se fija al activar: 1 + 0,14 por cada rango sobre 1 de su técnica más avanzada, multiplicada por 1,15 si existe al menos una evolución personal; no suma rangos ni evoluciones.

Permite caminar, sigue las colisiones y utiliza descarga verde en humano o fuego cálido en demonio. No modifica poder, vida, forma, resurrección, duración ni multiplicadores de Audiencia. No cura ni vuelve invulnerable, y no se inicia durante taxi o dominios.

La carta Q usa el arte exclusivo `assets/cards/cirilo-full-maldad-ultimate-fullart-v1.webp`: Cirilo con su aspecto demoníaco existente, traje negro, camisa roja y tres descargas verdes con bordes de fuego, sobre una calle limeña nocturna. Comparte el pixel art detallado, luces violetas y composición vertical 2:3 de las otras cartas. Es una representación visual de ¡FULL MALDAD!, no activa una transformación al pulsar Q. Conserva el marco de fuego y el arte independiente de Audiencia. Se guardan la fuente PNG y el prompt junto al WebP optimizado; el prompt queda fuera de la distribución.

## Integración y verificación

`cirilo-kit.js` se carga después de CiriloUR y las pasivas; `cirilo-kit-art.js` observa estados y dibuja sin decidir daño. Arsenal, taxi/ruta/hits, marcas y temporizadores de Q viven en cada jugador y viajan en snapshots normales. El cliente solo pide cambios de arma, Q o movimiento; el servidor resuelve posiciones, impactos, protección, marcas y cargas. No se añade un protocolo de daño ni controles de QA al juego distribuido.

Pruebas nuevas en `tests/cirilo-kit.test.cjs`: contrato completo y catálogo inmutable, progresión independiente, regreso exacto, límites de impactos, paredes en ambos sentidos, resistencia parcial, marcas con demora y propagación acotada, Q con tres abanicos y cargas separadas, resurrección original, estado cooperativo y ralentización original sin heredar estados del arsenal de Makanaky. La batería ahora incluye explícitamente las 41 pruebas existentes de `cirilo-ur.test.cjs`.

El [balance medido](../balance/CIRILO_BALANCE.md) incluye 60 ejecuciones de partidas y 40 duelos, con evidencia antes/después y resultados mixtos explícitos. Taxi, Eco y Q anticipan de forma limitada al lanzar, sin perseguir después; Eco conserva su explosión si el primer impacto mata al blanco. Pendiente: validación con jugadores y más compañeros, móvil y movimiento reducido antes de fijar un balance final.
