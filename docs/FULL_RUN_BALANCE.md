# Partidas completas automatizadas de los 18 causas

## Método

Se ejecutaron 162 partidas locales, nueve por personaje: Campo de Marte, Plaza de Armas y Machu Picchu con semillas 101, 202 y 303. Código evaluado: `0fd62bf64a06f4a34db255852624f061979a6e61`. Cada partida usa una VM aislada y el motor individual normal `P.Game.update` a 30 Hz, hasta victoria, derrota o 360 segundos de reloj de juego. Sin blancos de prueba, invulnerabilidad, reapariciones, poderes gratuitos ni modificación de enemigos, daño, experiencia, colisiones o calendario de minijefes. Las partidas no consumen progreso de usuarios ni usan el servidor público.

El bot decide cada 0,2 s: recoge botín cercano, se aproxima a enemigos visibles según alcance del rol, rodea rivales y evita colisiones/proyectiles. Elige entre las mejoras realmente ofrecidas, sin repetir el sorteo: evolución, subida de rango, desbloqueo y después estadísticas. Se permiten los apoyos y objetos que consiga durante la partida. Kingteka activa su ulti cargada con un minijefe a menos de 300 u. Se omiten portales opcionales, tienda, eventos y la activación manual del Tribunal de Alberto. Sin mejoras permanentes, mochila preparada ni estrellas de colección. La rareza no concede poder automático.

El bot es idéntico para todos salvo la distancia por tipo de arma y la habilidad específica de Kingteka. Las mismas semillas no producen enemigos idénticos tras divergir las bajas/recogidas, porque el juego consume números aleatorios con sus acciones. El generador aleatorio se aísla y se fija solo para reproducibilidad. La presentación DOM se sustituye por captura de opciones y las elecciones ejecutan sus callbacks normales. No se ejecutan rasterizado, cámara suavizada ni audio; la selección de objetivos conserva los límites de la vista de escritorio de reserva del motor. No es una prueba humana, gráfica, de FPS, ni cooperativa.

## Resultados por personaje

| Personaje | Sobrevive 300 s | Victorias finales | Derrotas | Límite 360 s | Bajas mediana | Nivel mediano | Daño recibido mediano | Minijefes abatidos/aparecidos | Tiempo mediano de minijefe s |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| alan | 9/9 | 9/9 | 0 | 0 | 434 | 11 | 44 | 31/31 | 8 |
| alberto | 8/9 | 7/9 | 2 | 0 | 425 | 11 | 126.6 | 27/28 | 11.6 |
| axelbenba | 9/9 | 9/9 | 0 | 0 | 426 | 11 | 62 | 28/28 | 8.7 |
| cerdito | 9/9 | 8/9 | 0 | 1 | 426 | 11 | 106.2 | 30/30 | 12.9 |
| cevichero | 8/9 | 8/9 | 1 | 0 | 443 | 11 | 121 | 27/27 | 8.8 |
| charles | 9/9 | 8/9 | 0 | 1 | 447 | 11 | 104.7 | 31/31 | 5.2 |
| cirilo | 9/9 | 6/9 | 2 | 1 | 435 | 11 | 120 | 29/29 | 10.9 |
| cristorata | 9/9 | 6/9 | 3 | 0 | 442 | 12 | 138 | 30/30 | 10.3 |
| cuy | 9/9 | 9/9 | 0 | 0 | 431 | 11 | 40.6 | 31/31 | 7.3 |
| fuzo | 9/9 | 8/9 | 0 | 1 | 435 | 11 | 44 | 28/29 | 6.2 |
| g5 | 9/9 | 9/9 | 0 | 0 | 413 | 11 | 42.2 | 28/28 | 7.2 |
| keiko | 9/9 | 8/9 | 0 | 1 | 427 | 11 | 123 | 30/30 | 9.9 |
| kingteka | 9/9 | 8/9 | 1 | 0 | 441 | 11 | 86.5 | 30/30 | 6.6 |
| najasor | 9/9 | 9/9 | 0 | 0 | 429 | 11 | 88.2 | 30/30 | 8.9 |
| ollanta | 9/9 | 7/9 | 0 | 2 | 469 | 11 | 32 | 27/27 | 10.5 |
| paloma | 9/9 | 7/9 | 0 | 2 | 425 | 11 | 114.2 | 29/29 | 14.3 |
| shaka | 9/9 | 9/9 | 0 | 0 | 417 | 11 | 116.8 | 31/32 | 11.9 |
| sustento | 9/9 | 8/9 | 0 | 1 | 444 | 11 | 34.3 | 29/29 | 5.1 |

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
