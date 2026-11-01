# Contrato visual de entradas de ulti

Regla obligatoria para nuevas tarjetas, con excepción expresa del dominio de Makanaky: usar la composición de Kingteka y conservar el cartoon pixel art del README.

- Ancho: 40 % del viewport; alto: 82 %; inicio vertical: 8 %. Borde izquierdo en x = 0, sin margen de centrado del escenario. Geometría compartida: P.UltimateComic.layout. La diagonal termina al 64 % del ancho en la base.
- Duración: 1,3 s. Makanaky usa la excepción de cinemática descrita abajo; no se habilitan golpes durante su entrada.
- Marco oscuro visible, borde interior de color y filo claro. Tipografía de cómic con contorno oscuro. El color depende del personaje; la silueta y jerarquía se conservan.
- Retrato dedicado de cintura arriba, con cabeza, hombros y puños completos. Animación propia; no ampliar un sprite de cuerpo entero ni cortar brazos en límites de celda.
- Dibujar el panel y los retratos directamente a resolución de pantalla con imageSmoothingEnabled=false. No pasarlos por el lienzo de 640 × 360 del dominio ni añadir sus márgenes.
- Tercera persona: actor de espalda articulado con anatomía y vestuario del personaje, sombra al pie, pasos y brazos continuos. El atlas modular conserva cabeza/torso, brazos superiores, antebrazos con puños y piernas; hombros y codos comparten exactamente sus anclajes. No alternar figuras completas para simular el golpe ni superponer manos sueltas. Render nativo tras componer el callejón.
- Movimiento reducido fija las poses y los efectos decorativos. Cámara, daño, carga y autoridad cooperativa conservan sus reglas.

## Assets de Makanaky

Referencia: public/assets/characters/makanaky-motion-v2.png. Generados con image_gen integrado, con transparencia y conservando el dibujo de referencia.

- makanaky-domain-portrait-v1.png / .webp: guardia, preparación, uppercut y recuperación; cuatro retratos de cintura arriba.
- makanaky-domain-back-v1.png / .webp: guardia, jab izquierdo, jab derecho, cruzado, uppercut y recuperación; seis sprites completos de espalda.
- Los JSON correspondientes guardan procedencia, prompt resumido, SHA-256 y límites de las figuras. Los límites se detectan sobre alfa, no se cortan celdas nominales si el puño las atraviesa.

Prompts: preservar identidad, proporciones chibi, pelo verde, gafas negras, camiseta rosa, joyas doradas, pantalón negro y zapatillas blancas; contornos oscuros y sombras agrupadas, sin fondos, texto ni efectos pintados. Para espalda: atlas 3 × 2 con seis poses completas y puños conectados al hombro. Para retrato: atlas 2 × 2 de cintura arriba con guardia, anticipación, uppercut y recuperación.

## Boxeo continuo y avance

MakanakyBoxing anima los dos brazos mediante hombro, codo y puño, con preparación, extensión, contacto, retroceso y guardia. El ciclo es jab izquierdo, jab derecho, cruzado izquierdo y uppercut derecho. Los tiempos son 0,34 / 0,34 / 0,46 / 0,60 s; mantener clic o Espacio encadena los cuatro. El daño se resuelve al 40 % del golpe, con una microparada de 45 ms también en los brazos.

La cámara cercana usa `makanaky-domain-back-v2.webp`: seis figuras completas vistas desde atrás. Hombros, codos y puños permanecen unidos y los antebrazos se dibujan por delante de la silueta, apuntando al rival. No separar brazos del cuerpo ni ocultar su nacimiento bajo la cabeza.

Los rivales mantienen una coordenada fija de ruta; profundidad = ruta − avance del jugador. Pasos, polvo y suelo siguen el mismo avance, mientras los rivales dejan de reproducir una caminata de aproximación. La cámara acompaña al jugador, con desplazamiento y zancada visibles. Los tiempos globales, posiciones de retorno y autoridad cooperativa se conservan.

Asset actual: public/assets/characters/makanaky-boxing-rig-v1.png / .webp; origen y prompt en makanaky-boxing-rig-v1.json. Creado con image_gen integrado a partir del atlas de espalda. El atlas anterior de seis poses permanece en Git como referencia y no se publica.

Mantener el botón recorre el ciclo completo también al golpear al aire. Fallar reinicia únicamente la racha de aciertos GA; el indicador sigue identificando el golpe actual. El botón apunta al frente para evitar que su posición en pantalla desvíe la puntería.

## Primera persona y paso lateral

Primera persona usa los segmentos raster del mismo atlas, con codo compartido y cuatro trayectorias continuas; se dibuja directamente a resolución de pantalla y se recorta al área del callejón. La perspectiva lateral afecta a paredes, suelo, rivales y proyectiles por igual. Una inclinación leve y el balanceo de brazos refuerzan el paso; movimiento reducido estabiliza esos adornos.

En tercera persona el lateral de la cámara queda fijo: se mueve Makanaky por la pantalla, con inclinación del cuerpo y zancada, y su compañero lo sigue cuando observa desde el refugio. La mira se desplaza con la posición del actor; no simular el paso moviendo únicamente los minions.

## Excepción solicitada: expansión de Makanaky
Entrada a pantalla completa de 3 s, render nativo sin panel diagonal. Ocho poses completas de cintura arriba muestran subida de manos, unión de palmas, sello y apertura de brazos con grito de cómic «¡BÓTAME TU GAAAA!». Grietas, polvo, postes, rejas y fachadas se construyen por fases desde el suelo; después se presenta EL CALLEJÓN DE LA REALEZA y empieza el combate existente. Movimiento reducido fija el gesto y elimina sacudidas y partículas móviles. Asset: makanaky-domain-activation-v1.png/.webp; metadata y prompt en su JSON y docs/arte/prompts/makanaky-domain-cinematic-prompts.json. Generado mediante image_gen integrado.
