> La muestra A de 162 partidas corresponde a la versión anterior a la integración. La muestra B al final verifica los 18 con las reglas nuevas. Las tasas se presentan por separado.

# Partidas completas automatizadas de los 18 causas

## Método

Se ejecutaron 162 partidas locales, nueve por personaje: Campo de Marte, Plaza de Armas y Machu Picchu con semillas 101, 202 y 303. Código evaluado: `0fd62bf64a06f4a34db255852624f061979a6e61`. Cada partida usa una VM aislada y el motor individual normal `P.Game.update` a 30 Hz, hasta victoria, derrota o 360 segundos de reloj de juego. Sin blancos de prueba, invulnerabilidad, reapariciones, poderes gratuitos ni modificación de enemigos, daño, experiencia, colisiones o calendario de minijefes. Las partidas no consumen progreso de usuarios ni usan el servidor público.

El bot decide cada 0,2 s: recoge botín cercano, se aproxima a enemigos visibles según alcance del rol, rodea rivales y evita colisiones/proyectiles. Elige entre las mejoras realmente ofrecidas, sin repetir el sorteo: evolución, subida de rango, desbloqueo y después estadísticas. Se permiten los apoyos y objetos que consiga durante la partida. Kingteka activa su ulti cargada con un minijefe a menos de 300 u. Se omiten portales opcionales, tienda, eventos y la activación manual del Tribunal de Alberto. Sin mejoras permanentes, mochila preparada ni estrellas de colección. La rareza no concede poder automático.

El bot es idéntico para todos salvo la distancia por tipo de arma y la habilidad específica de Kingteka. Las mismas semillas no producen enemigos idénticos tras divergir las bajas/recogidas, porque el juego consume números aleatorios con sus acciones. El generador aleatorio se aísla y se fija solo para reproducibilidad. La presentación DOM se sustituye por captura de opciones y las elecciones ejecutan sus callbacks normales. No se ejecutan rasterizado, cámara suavizada ni audio; la selección de objetivos conserva los límites de la vista de escritorio de reserva del motor. No es una prueba humana, gráfica, de FPS, ni cooperativa.

## Resultados por personaje

| Personaje | Sobrevive 300 s | Victorias finales | Derrotas | Límite 360 s | Bajas mediana | Nivel mediano | Daño recibido mediano | Minijefes abatidos/aparecidos | Tiempo mediano de minijefe s |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| Alan García | 9/9 | 9/9 | 0 | 0 | 434 | 11 | 44 | 31/31 | 8 |
| Alberto Fujimori | 8/9 | 7/9 | 2 | 0 | 425 | 11 | 126.6 | 27/28 | 11.6 |
| Axel Benba | 9/9 | 9/9 | 0 | 0 | 426 | 11 | 62 | 28/28 | 8.7 |
| Cerdito VTuber | 9/9 | 8/9 | 0 | 1 | 426 | 11 | 106.2 | 30/30 | 12.9 |
| Cevichero | 8/9 | 8/9 | 1 | 0 | 443 | 11 | 121 | 27/27 | 8.8 |
| Charles | 9/9 | 8/9 | 0 | 1 | 447 | 11 | 104.7 | 31/31 | 5.2 |
| CiriloTV | 9/9 | 6/9 | 2 | 1 | 435 | 11 | 120 | 29/29 | 10.9 |
| Cristorata | 9/9 | 6/9 | 3 | 0 | 442 | 12 | 138 | 30/30 | 10.3 |
| Cuy Supremo | 9/9 | 9/9 | 0 | 0 | 431 | 11 | 40.6 | 31/31 | 7.3 |
| Fuzo | 9/9 | 8/9 | 0 | 1 | 435 | 11 | 44 | 28/29 | 6.2 |
| La G5 | 9/9 | 9/9 | 0 | 0 | 413 | 11 | 42.2 | 28/28 | 7.2 |
| Keiko Fujimori | 9/9 | 8/9 | 0 | 1 | 427 | 11 | 123 | 30/30 | 9.9 |
| Kingteka | 9/9 | 8/9 | 1 | 0 | 441 | 11 | 86.5 | 30/30 | 6.6 |
| Najasor | 9/9 | 9/9 | 0 | 0 | 429 | 11 | 88.2 | 30/30 | 8.9 |
| Ollanta Humala | 9/9 | 7/9 | 0 | 2 | 469 | 11 | 32 | 27/27 | 10.5 |
| Paloma del Centro | 9/9 | 7/9 | 0 | 2 | 425 | 11 | 114.2 | 29/29 | 14.3 |
| Shakadoto | 9/9 | 9/9 | 0 | 0 | 417 | 11 | 116.8 | 31/32 | 11.9 |
| Sustento | 9/9 | 8/9 | 0 | 1 | 444 | 11 | 34.3 | 29/29 | 5.1 |

## Cómo interpretar los datos

Sobrevivir 300 s no equivale a ganar: el jefe final aparece entonces. Límite significa vivo sin victoria al cortar a 360 s, no derrota. El tiempo de minijefe incluye entrada, desplazamiento, furia, cobertura y combate desde su aparición; los no abatidos se mantienen en el denominador y no se inventa un tiempo de muerte. La mediana de tiempo solo considera abatidos y tiene sesgo de supervivencia. Bajas incluye todos los rivales. Más daño recibido puede compensarse con curación o más vida.

Nueve partidas por personaje y una única política no bastan para declarar equilibrio universal ni para inferir tasas de victoria humanas. El bot favorece algunos estilos y no usa todas las opciones estratégicas. Deben revisarse supervivencia, progresión y minijefes juntos antes de cambiar estadísticas: no se iguala el daño bruto ni se penaliza un rol por un mal pilotaje.

## Reproducción

`node scripts/full-run-audit.cjs` ejecuta las 162 partidas con tres workers locales. `node scripts/summarize-full-runs.cjs` genera el resumen. `--pilot` ejecuta tres partidas iniciales sin reemplazar la evidencia completa. full-run-audit.json conserva trazas cada 15 s, mejoras elegidas, daño recibido y aparición/muerte de cada minijefe. Son herramientas de desarrollo, no se incluyen en dist.

## Desglose por mapa

| Mapa | Partidas | Sobrevive 300 s | Victorias | Derrotas | Límite | Minijefes abatidos/aparecidos | Tiempo mediano de minijefe s |
|---|---:|---:|---:|---:|---:|---:|---:|
| campo | 54 | 52 | 45 | 4 | 5 | 176/178 | 8 |
| plaza | 54 | 54 | 47 | 3 | 4 | 174/174 | 8.3 |
| machu | 54 | 54 | 51 | 2 | 1 | 176/177 | 10.3 |

## Lectura del balance y decisión

160/162 sobrevivieron a 300 s; 143 victorias finales, 9 derrotas y 10 límites con vida. Se abatieron 526/529 minijefes. Hubo 2 derrotas antes de aparecer el jefe final.

Los más rápidos contra minijefes fueron Sustento: 5.1 s; Charles: 5.2 s; Fuzo: 6.2 s. El más lento fue Paloma del Centro: 14.3 s. Es una diferencia de ritmo real en esta política, aunque no equivale a superioridad en todos los aspectos.

Alberto y Cevichero tuvieron una derrota temprana cada uno en Campo. Cristorata y Cirilo ganaron 6/9 y sus derrotas ocurrieron después de 300 s: el foco de seguimiento es la pelea final, no aumentarles daño contra minions por defecto. Kingteka ganó 8/9 y abatió los 30 minijefes aparecidos, con mediana de 6,6 s usando su ulti disponible; esta muestra no lo muestra como ganador universal.

La supervivencia de superficie es parecida, pero no se declara balance definitivo: Sustento y Charles conservan una ventaja de rapidez contra minijefes y la tasa de abatidos global es muy alta para este bot. Antes de endurecer minijefes o reducir otra vez esos personajes, conviene contrastar con otra política y partidas humanas que incluyan esquiva y lectura de avisos. No se ajustaron estadísticas en esta entrega: se publica la evidencia completa y los puntos concretos de seguimiento.

## Muestra B: validación tras integrar cambios de combate

Se ejecutaron 54 partidas adicionales (una por personaje y mapa, semilla 404) sobre `b10eef1c1ec612546514b1fa868ed2321b662559`. Esta versión incluye coberturas revisadas para minijefes y las nuevas ultis de Cuy y Paloma. Se usa la misma política de movimiento y mejoras; además activa las ultis cargadas de Kingteka, Cuy y Paloma cuando hay un minijefe a menos de 300 u. Tribunal de Alberto sigue sin activarse manualmente. No se mezclan estas tasas con la muestra A: cambian versión y política de habilidades.

54/54 sobrevivieron a 300 s; 47 victorias, 4 derrotas y 3 límites con vida. Minijefes: 169/169 abatidos.

| Personaje | Sobrevive 300 s | Victorias | Derrotas | Límite | Minijefes abatidos/aparecidos | Mediana minijefe s |
|---|---:|---:|---:|---:|---:|---:|
| Alan García | 3/3 | 3/3 | 0 | 0 | 9/9 | 8.7 |
| Alberto Fujimori | 3/3 | 2/3 | 1 | 0 | 9/9 | 14 |
| Axel Benba | 3/3 | 3/3 | 0 | 0 | 10/10 | 9.4 |
| Cerdito VTuber | 3/3 | 2/3 | 0 | 1 | 10/10 | 14.6 |
| Cevichero | 3/3 | 2/3 | 0 | 1 | 10/10 | 8.5 |
| Charles | 3/3 | 3/3 | 0 | 0 | 11/11 | 6.1 |
| CiriloTV | 3/3 | 1/3 | 1 | 1 | 9/9 | 13.2 |
| Cristorata | 3/3 | 2/3 | 1 | 0 | 9/9 | 11.2 |
| Cuy Supremo | 3/3 | 3/3 | 0 | 0 | 9/9 | 5.7 |
| Fuzo | 3/3 | 3/3 | 0 | 0 | 9/9 | 5 |
| La G5 | 3/3 | 3/3 | 0 | 0 | 10/10 | 4.9 |
| Keiko Fujimori | 3/3 | 3/3 | 0 | 0 | 10/10 | 8.9 |
| Kingteka | 3/3 | 2/3 | 1 | 0 | 9/9 | 6 |
| Najasor | 3/3 | 3/3 | 0 | 0 | 9/9 | 9.2 |
| Ollanta Humala | 3/3 | 3/3 | 0 | 0 | 9/9 | 7.4 |
| Paloma del Centro | 3/3 | 3/3 | 0 | 0 | 9/9 | 13.6 |
| Shakadoto | 3/3 | 3/3 | 0 | 0 | 9/9 | 12 |
| Sustento | 3/3 | 3/3 | 0 | 0 | 9/9 | 6.7 |

En esta validación, los más rápidos fueron La G5 (4.9 s) y Fuzo (5 s); el más lento fue Cerdito VTuber (14.6 s). No se atribuye el cambio de orden exclusivamente a las reglas: también cambian semilla y habilidades disponibles. La supervivencia y los minijefes abatidos no muestran un personaje inviable, pero la rapidez de abatir todos los minijefes sugiere revisar dificultad global con jugadores humanos antes de otro ajuste individual.

Esta segunda muestra comprueba que los 18 se pueden jugar con las reglas integradas; tres partidas por personaje no demuestran equivalencia ni validan por sí solas los efectos de las ultis. La tabla de 162 partidas anterior conserva su versión histórica y sus límites. Reproducción: `node scripts/full-run-audit.cjs --validation`; después ejecutar este resumen. La evidencia adicional está en full-run-validation.json.
