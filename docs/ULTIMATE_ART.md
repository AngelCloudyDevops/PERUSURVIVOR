# Contrato visual de entradas de ulti

Regla obligatoria para nuevas tarjetas, incluidas las expansiones UR: usar la composición de Kingteka y conservar el cartoon pixel art del README.

- Ancho: 40 % del viewport; alto: 82 %; inicio vertical: 8 %. Borde izquierdo en x = 0, sin margen de centrado del escenario. Geometría compartida: P.UltimateComic.layout. La diagonal termina al 64 % del ancho en la base.
- Duración: 1,3 s. En Makanaky la tarjeta completa aparece sobre el mapa original antes del callejón; no se habilitan golpes durante esa entrada.
- Marco oscuro visible, borde interior de color y filo claro. Tipografía de cómic con contorno oscuro. El color depende del personaje; la silueta y jerarquía se conservan.
- Retrato dedicado de cintura arriba, con cabeza, hombros y puños completos. Animación propia; no ampliar un sprite de cuerpo entero ni cortar brazos en límites de celda.
- Dibujar el panel y los retratos directamente a resolución de pantalla con imageSmoothingEnabled=false. No pasarlos por el lienzo de 640 × 360 del dominio ni añadir sus márgenes.
- Tercera persona: sprite completo de espalda con anatomía y vestuario del personaje, sombra al pie y seis poses de boxeo. No usar muñecos geométricos ni puños separados encima del sprite. Render nativo tras componer el callejón.
- Movimiento reducido fija las poses y los efectos decorativos. Cámara, daño, carga y autoridad cooperativa conservan sus reglas.

## Assets de Makanaky

Referencia: public/assets/characters/makanaky-motion-v2.png. Generados con image_gen integrado, con transparencia y conservando el dibujo de referencia.

- makanaky-domain-portrait-v1.png / .webp: guardia, preparación, uppercut y recuperación; cuatro retratos de cintura arriba.
- makanaky-domain-back-v1.png / .webp: guardia, jab izquierdo, jab derecho, cruzado, uppercut y recuperación; seis sprites completos de espalda.
- Los JSON correspondientes guardan procedencia, prompt resumido, SHA-256 y límites de las figuras. Los límites se detectan sobre alfa, no se cortan celdas nominales si el puño las atraviesa.

Prompts: preservar identidad, proporciones chibi, pelo verde, gafas negras, camiseta rosa, joyas doradas, pantalón negro y zapatillas blancas; contornos oscuros y sombras agrupadas, sin fondos, texto ni efectos pintados. Para espalda: atlas 3 × 2 con seis poses completas y puños conectados al hombro. Para retrato: atlas 2 × 2 de cintura arriba con guardia, anticipación, uppercut y recuperación.
