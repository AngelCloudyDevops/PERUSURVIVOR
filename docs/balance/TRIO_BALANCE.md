# Ajuste fino: G5, Fuzo y Cerdito

## Cambios

- G5: recarga de patada 0,62 → 0,68 s; escala de evolución 0,65 → 0,58. Conserva vida 135, velocidad 195, arco de 145° y alcance.
- Fuzo: daño por tarjeta ×0,85 → ×0,80; escala de evolución 0,65 → 0,58. Conserva dos tarjetas, alcance 850 y perforación de tres objetivos; la evolución conserva cinco tarjetas y perforación de ocho.
- Cerdito: impacto ×0,50 → ×0,56; inicio de caída 140 → 165 u; escala de proyectil evolucionado 0,65 → 0,70. Conserva vida 130, velocidad 170, recarga 0,72 s, siete perdigones, alcance 400 y daño mínimo lejano del 35 %. Se mantiene el descuento por impactos de una misma descarga (100 %, 35 %, después 15 %).

No se añade resistencia especial a minijefes ni se igualan las armas. G5 sigue siendo de arco cercano, Fuzo perfora filas a distancia y Cerdito cubre el frente con una escopeta corta. Los otros quince personajes, apoyos y enemigos conservan sus parámetros. Las fichas del selector usan los valores nuevos.

## Partidas emparejadas

54 partidas: nueve antes y nueve después por personaje, cruzando los tres mapas con semillas 404, 505 y 606. Motor de referencia: `b07696b3f9ed097a2d76320cd02e9b3be8248eb0`; las definiciones exactas antes/después están en trio-balance-runs.json. En la condición anterior solo se restauran las definiciones de personaje, arma y evolución guardadas; el motor, enemigos, coberturas, XP y física son los mismos. No se compara contra las cifras de versiones viejas con enemigos distintos.

Se usa Game.update individual a 30 Hz, hasta victoria, derrota o 360 s, con movimiento, daño recibido, botín y mejoras normales. Sin mochila, estrellas ni mejoras permanentes. Mismo bot y prioridades, sin inventar elecciones ni conceder curación. Los tres carecen de ulti manual en esta versión; no se añade ninguna. Como las bajas y el botín consumen azar, compartir semilla inicial no garantiza encuentros idénticos después. Son partidas locales automatizadas, sin renderizado: no miden FPS ni victoria humana.

| Personaje | Mediana minijefe antes → después (s) | Sobrevive 300 s antes → después | Victorias antes → después | Minijefes abatidos antes → después |
|---|---:|---:|---:|---:|
| La G5 | 5.8 → 9.1 | 9/9 → 9/9 | 9/9 → 8/9 | 31/31 → 28/29 |
| Fuzo | 5.4 → 7.5 | 9/9 → 9/9 | 9/9 → 9/9 | 28/28 → 28/28 |
| Cerdito VTuber | 13.5 → 12.8 | 8/9 → 9/9 | 7/9 → 9/9 | 29/29 → 31/32 |

Después del ajuste sobreviven a 300 s 27/27 partidas; hay 26 victorias, 0 derrotas y 1 límite con vida. La relación entre el mayor y el menor tiempo mediano baja de 2.5 a 1.7 en esta muestra. Cerdito gana algo de ritmo cercano mientras G5 y Fuzo conservan su función; los resultados no prueban igualdad universal.

El tiempo se cuenta desde la aparición, incluida entrada, desplazamiento y fases; solo tienen tiempo de abatido los minijefes derrotados. Los vivos siguen en el denominador. Límite vivo no equivale a derrota.

## Comprobación aislada de daño

Mismo blanco de radio 40 moviéndose en círculo a 100 u durante 20 s, sin enemigos adicionales, terreno, apoyos ni ulti. Evolución con cuatro rangos y nivel 8. Daño agregado por segundo, no una pelea real con avisos.

| Personaje | Base antes → después | Evolucionado antes → después |
|---|---:|---:|
| La G5 | 57.6 → 52.2 | 518.9 → 423.6 |
| Fuzo | 53 → 49.9 | 454.9 → 384.3 |
| Cerdito VTuber | 39.5 → 44.2 | 247.5 → 261.4 |

## Lectura y límites

La comprobación aislada confirma la dirección de los cambios sin confundirla con variaciones de botín. Las partidas evalúan que siga siendo posible progresar y derrotar minijefes con las armas distintas. Nueve partidas por condición y una sola política no prueban igualdad universal. Se conservan derrotas, límites, daño recibido y trazas cada 15 s. No se ajustan enemigos para forzar el resultado.

## Reproducción

`node scripts/trio-balance-audit.cjs` ejecuta las 54 partidas en tres workers. `node scripts/summarize-trio-balance.cjs` regenera este informe. Baseline en trio-balance-baseline.json; evidencia en trio-balance-runs.json. Son herramientas locales fuera de dist. El reporte anterior de los 18 conserva sus parámetros históricos mediante una referencia explícita.
