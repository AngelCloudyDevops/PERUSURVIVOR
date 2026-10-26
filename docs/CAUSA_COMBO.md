# Combo del Causa: Caos, Aguante y Hazaña

Las tres cartas se reúnen automáticamente durante el combate. Al completar las tres, Q o el botón activa la ulti; se pueden guardar sin caducar y se consumen juntas al usarla. Se reinician en cada partida. No hay cartas aleatorias ni gestión manual de inventario. Se aplica a Kingteka, Alberto, Cuy y Paloma, que son quienes tienen ulti actualmente.

## Carga y ritmo

- **Aguante:** 45 segundos acumulados de combate visible. Impone el mínimo, aunque se maten cientos de enemigos.
- **Caos:** avanza con el combate; las bajas normales aportan una pequeña reserva con tope de 1 punto y consumo máximo de 0,5 puntos por segundo. No hay +5 % instantáneo por baja.
- **Hazaña:** avanza con el combate normal y acelera ligeramente al causar daño efectivo, especialmente a pesados, minijefes y jefes. Golpear fases invulnerables no cuenta. No depende del daño bruto ni del número de perdigones.

Sin bajas ni golpes, Caos y Hazaña se completan en 52 segundos de combate visible: es posible cargar contra un jefe solo o con armas lentas. Con actividad, el tiempo de carga queda entre 45 y 52 segundos. Durante la ulti se detiene la carga; al añadir sus 5–8 s de duración, el ciclo queda aproximadamente en 50–60 s. El Tribunal pausa su reloj de partida durante la escena: sus 4,7 s de presentación no aparecen en el intervalo de tiempo de juego. La pausa, las pantallas de mejora, la muerte y los ratos sin enemigos visibles no aportan tiempo. No es una recarga fija por tiempo de pared.

## Evitar la autorrecarga

Las bajas y golpes durante la ulti no generan progreso. Los proyectiles principales y de apoyo, los combos de apoyo y los campos persistentes creados durante ella conservan una marca serializable: si impactan después de terminar, tampoco aportan Caos ni Hazaña. Los disparos originales de Kingteka con la marca ultimate también se excluyen. El Tribunal no recibe carga por su sentencia y los pulsos/remates animales tampoco recargan. La carga nueva requiere combate posterior.

La barra porcentual existente se deriva de las cartas y solo llega a 100 cuando las tres están completas. Cada jugador cooperativo tiene su mano en ultimate.combo y el servidor decide la carga/activación; el cliente no puede adelantarla enviando Q. Reconexion recibe la mano del servidor. Práctica y laboratorio mantienen la recarga gratuita para probar habilidades.

## Pruebas

Pruebas controladas de las cuatro ultis: horda masiva, combate lento, jefe solo, cartas guardadas, pausa, ausencia de enemigos, muerte, reinicio, fuentes tardías, apoyos, Tribunal y manos cooperativas independientes. Se conservan las pruebas anteriores de daño y animaciones; se actualiza la expectativa antigua de veinte bajas.

Además se ejecutaron doce partidas locales completas del motor normal (cuatro personajes por tres mapas), semilla 707, 30 Hz, con el mismo bot de movimiento/mejoras y activación de cada ulti cuando está lista. Sin modificar enemigos, daño, XP ni otorgar poderes. Base del motor antes del cambio: `a0e3b032b59a66df462a908b9ae2f3199edb15f8`. La evidencia guarda cada preparación y uso en causa-combo-runs.json.

| Personaje | Primera preparación, segundos de partida | Preparaciones medidas | Intervalo desde el uso previo hasta estar lista, reloj de partida | Victorias |
|---|---:|---:|---:|---:|
| kingteka | 48.63–51.47 | 18 | 53.00–55.70 s | 3/3 |
| alberto | 48.50–49.07 | 18 | 44.96–45.84 s | 2/3 |
| cuy | 48.73–49.80 | 18 | 50.00–54.57 s | 3/3 |
| paloma | 47.97–51.30 | 18 | 51.00–57.50 s | 3/3 |

Los intervalos incluyen el tiempo de combate en que la ulti está activa, pero no las escenas que detienen el reloj de partida. El redondeo y el orden del tick explican valores de 44,96–44,97 s alrededor del mínimo de 45. Estas partidas verifican la mecánica y el ritmo con una estrategia automatizada; no son una tasa de victoria humana ni una prueba de FPS.

## Interfaz y rendimiento

Tres cartas con porcentajes, barras y marca de completado, junto al botón de ulti. Aviso al completar la mano. En móvil se colocan en una fila. No se añaden partículas, sprites ni temporizadores; las tres barras solo cambian al variar su porcentaje entero. El cálculo usa tiempo de simulación y una búsqueda acotada de enemigos visibles.

Reproducción: `node scripts/causa-combo-audit.cjs` y `node scripts/summarize-causa-combo.cjs`. Las herramientas y la evidencia permanecen fuera de dist.
