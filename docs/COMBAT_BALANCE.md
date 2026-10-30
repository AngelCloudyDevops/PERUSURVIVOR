# Primera pasada de equilibrio y selección de objetivos

El autoataque exige que el objetivo esté dentro del alcance del arma y que su círculo de colisión toque la pantalla, sin el margen usado para descartar dibujos. Prioriza enemigos y usa cajas destructibles como alternativa. Las cartas de apoyo y la búsqueda de proyectiles también respetan pantalla; las balas ya lanzadas siguen volando y pueden impactar fuera de ella. No se cambian colisiones ni el daño de áreas ya activadas.

Los minions solo comienzan ataques a distancia cuando están visibles para el jugador al que persiguen. Avisos, ráfagas y disparos ya iniciados continúan. Los jefes mantienen sus patrones, salud y calendario; no se sube la vida global para compensar armas demasiado fuertes.

## Escopetas

Kingteka: alcance base 860 → 480, intervalo 0,65 → 0,78 s y escala por perdigón 0,65 → 0,60. Conserva cinco perdigones y el abanico. Daño completo hasta 180 unidades, descenso gradual hasta el 35 % en el alcance máximo. Las mejoras de alcance amplían ambas distancias.

Escopeta Contra: cinco esferas arcade rojas, dos impactos máximos por esfera, velocidad 720, dispersión 0,17 y escala individual 0,75. La descarga completa mantiene un presupuesto cercano al diseño anterior gracias al rendimiento decreciente de perdigones sobre un mismo blanco, pero cubre un abanico mayor y sacrifica penetración profunda. Conserva caída de daño y alcance corto/medio.

Cerdito: mantiene el daño cercano, siete perdigones y cadencia. Alcance 760 → 400; daño completo hasta 140 y descenso gradual al 35 %. Así las dos escopetas comparten la regla de corta distancia.

## Comparación reproducible

`node scripts/balance-audit.cjs` guarda las mediciones de los 18 personajes en `balance-audit.json`. Son 20 segundos por caso, sin movimiento, mejoras ni ulti en la tabla principal; blancos individuales de radio 30 a 90/250 unidades, una fila de ocho blancos de radio 13 y un blanco de radio 40 a 180 como aproximación geométrica de jefe. Otra sección aplica a Kingteka cuatro rangos y evolución al nivel 8. Los blancos no atacan, tienen vida alta y no se desplazan al recibir empuje. El escenario anterior restaura los parámetros previos y la selección sin límites. Mide daño agregado por segundo, no supervivencia, victorias ni equilibrio definitivo.

| Kingteka | Antes | Después |
|---|---:|---:|
| Blanco cercano, rango inicial | 136,5 | 105,0 |
| Blanco a media distancia | 81,9 | 53,4 |
| Blanco de jefe, evolucionado | 599,3 | 445,6 |
| Fila de ocho, evolucionado | 812,1 | 594,1 |

Se conserva el resto de estadísticas y patrones para medir partidas reales antes de otra pasada. El daño bruto no incluye las ventajas de área, empuje, movilidad, resistencia ni dificultad de colocación.

## Cooperativo y rendimiento

El cliente envía semiancho, semialto y desplazamiento de cámara relativos a su jugador en los mensajes de movimiento existentes. El servidor valida números finitos y límites (80–600 de semiancho, 80–500 de semialto, desplazamiento máximo 600); las distancias del arma siguen siendo autoritativas. Se conserva la última vista válida durante mensajes sin cámara y hay un encuadre estándar para clientes anteriores. Cada jugador utiliza su propia vista; la sala no usa la cámara global del servidor.

La vista se calcula una vez por búsqueda y por avance de proyectiles, no por candidato. La selección usa distancias al cuadrado. Las pruebas cubren pantalla/alcance, impactos fuera de pantalla, caída de daño, cámaras cooperativas, límites y avisos enemigos; las pruebas de anclajes ahora colocan sus objetivos dentro del alcance, manteniendo sus comprobaciones geométricas.

Esta página registra la primera pasada. La regla actual de acumulación de perdigones y salud temporal de minijefes se documenta en [COMBAT_BALANCE_2.md](COMBAT_BALANCE_2.md). El script histórico fija el daño sin descuento por descarga para conservar su comparación original.
