# Balance medido de Sideral · 29 de octubre de 2026

Se corrigen dos defectos: los huevos acertaban a blancos quietos pero fallaban al moverse, y la Q no acompañaba el crecimiento del arsenal. No cambian vida, velocidad, poder, rareza, Mirada, Colazo, Sangre fría ni la implementación del dominio R.

## Método y límites

Son **ejecuciones automáticas locales del motor real**, sin servidor público: `Game.update` en individual y `Simulation` autoritativa con dos Sideral en cooperativo. No se regalaron niveles, vida, objetos, carga, inmunidad ni bajas. Se usaron las cartas efectivamente ofrecidas, daño, colisiones, aparición de enemigos, reanimación y relojes normales. El controlador toma decisiones cada 0,2 s y la simulación avanza a 30 Hz. Usa R antes que Q para evitar gastar ambas a la vez. No solicita portales opcionales.

- Serie principal: Campo de Marte, Plaza de Armas y Machu Picchu, semillas 101/202/303; nueve intentos por modo, antes y después. Cambia entre técnicas según distancia y prioriza curación si baja del 60 % de vida. Límite 360 s de simulación.
- Estilos: una semilla en Campo de Marte, cuatro preferencias de ataque por modo, antes y después. Incluye dos repeticiones por fase de la configuración adaptativa para comprobar consistencia.
- Cierre: Mirada como técnica preferida, Campo de Marte/semilla 101, ambos modos, antes y después. Al aparecer ElZeein lo fija como objetivo mediante la intención normal `lockedTarget`/`lockTarget`; límite 600 s para permitir terminar el jefe, sin adelantar el reloj.
- En total: 56 ejecuciones, incluidas cuatro repeticiones, más 32 mediciones controladas de DPS. Una derrota es una partida terminada; `timeout` significa que no se resolvió antes del límite y no cuenta como victoria.

Estos datos **no son una tasa de victoria humana**, ni una prueba de FPS, ping o capacidad del VPS. No cubren Supervivencia de 30 minutos, todos los objetos, mapas estacionales, portales, otros compañeros o jugadores expertos. El controlador y las ofertas cambian el resultado; incluso una corrección de puntería altera la secuencia posterior de bajas y cartas.

## Resultados de las partidas

Serie principal adaptativa, nueve intentos por fila:

| Modo | Mediana de duración antes → después | Mediana de bajas antes → después | Llegan al minuto 5 antes → después | Victorias antes → después |
|---|---:|---:|---:|---:|
| Individual | 210,13 → 207,43 s | 240 → 242 | 0 → 1 | 0 → 0 |
| Cooperativo | 275,43 → 307,50 s | 345 → 384 | 1 → 5 | 0 → 0 |

No se observa una mejora general de supervivencia individual en esta serie. En cooperativo aumenta el tiempo de supervivencia, pero el controlador adaptativo no logra cerrar al jefe. Por eso **no se declara cerrado el balance general** ni se compensan estos resultados inflando todos los coeficientes.

La comprobación de cierre, con objetivo fijado y límite suficiente, sí termina:

| Modo | Antes | Después |
|---|---|---|
| Individual | Derrota a 334,73 s | Victoria a 335,70 s; 27,12 PV restantes |
| Cooperativo | Victoria a 400,60 s; 29,32 / 26,06 PV | Victoria a 342,53 s; 24,71 / 21,32 PV |

Son cuatro partidas concretas, no una muestra para estimar porcentajes. Muestran que el kit ajustado puede completar la partida rápida y derrotar al jefe en ambos modos sin excepciones de daño ni protección.

## Cambios respaldados por las mediciones

### Huevos: dirección al abrir

Antes, el huevo conservaba el ángulo del lanzamiento humano durante el vuelo y la incubación. En el duelo con un blanco a 200 u moviéndose en círculo a 0,8 rad/s produjo **0 DPS**, aunque hacía 26,24 DPS con el mismo blanco quieto.

Ahora elige una sola dirección al abrir: conserva su objetivo si sigue vivo, a 240 u del huevo y sin cobertura; si no, elige el rival válido más cercano. Usa una anticipación limitada a 0,34 s y velocidad estimada de hasta 260 u/s. Después del lanzamiento no gira ni busca nuevos objetivos. El mismo duelo móvil produce **26,24 DPS** en rango 1 y **45,03 DPS** en rango 5, igual al control quieto.

En los estilos de partida centrados en Huevo, los huevos lanzados que expiraron sin impacto bajan de **27/77 a 4/74** en individual y de **66/151 a 6/119** en cooperativo. El denominador incluye todos los lanzamientos, también los que puedan seguir activos al terminar; no debe interpretarse como probabilidad exacta de impacto. La supervivencia de esos intentos no mejora: 248,93 → 216,73 s y 240,07 → 193,90 s respectivamente. Mejor puntería no demuestra por sí sola que ese estilo tenga mejor supervivencia.

Se conservan coeficientes, vuelo de 0,35 s, incubación normal de 0,8 s, incubación preparada de 0,25 s, velocidad/duración de embestida, tres huevos activos, cantidad de lagartitos y máximo de dos impactos del nido evolucionado. Las paredes siguen deteniéndolos.

### Q: crecimiento y cadencia

Antes, Q hacía **43,89 DPS** tanto con arsenal de rango 1 como de rango 5 en el control descrito abajo. Mirada de rango 5 alcanzaba 44,66 DPS: transformarse no daba un crecimiento ofensivo acorde a su progreso y retiraba el miedo.

Q ahora fija al activar la escala `1 + 0,14 × (mayor rango desbloqueado − 1)`; una evolución personal conseguida añade un multiplicador 1,15. No suma los tres rangos ni obliga a cambiar de arma para potenciarla. Cambiar rango durante la transformación no recalcula esa escala hasta la siguiente Q.

También se conserva el vencimiento programado entre pulsos, en lugar de sumar siempre 0,24 s al fotograma que llegó tarde. La prueba verifica **25 pulsos en seis segundos tanto a 25 Hz como a 30 Hz**; antes se medían 23 a 30 Hz. El nuevo DPS controlado es **47,71 en rango 1 y 74,43 en rango 5**, sin evolución. Son 40,50 / 63,18 de presupuesto bruto antes de stats; con evolución, 72,66 bruto.

El blanco de referencia tiene atributo Fuerza y DEF especial 100; Sideral conserva Ingenio y ATQ especial 105, por lo que las cifras medidas incluyen ventaja de atributo y fórmula de defensa. La cifra bruta no debe confundirse con daño final universal.

Se conservan los seis segundos, alcance, cono, giro limitado, carga por baja, depósito separado de R, ausencia de invulnerabilidad y suspensión del ataque personal mientras dura el aliento.

### Mirada, Colazo y Sangre fría

No cambian. Colazo conserva la función de abrir espacio; medirlo contra un blanco quieto reduce su DPS porque lo empuja fuera del alcance, no porque se haya suprimido el golpe. La pasiva se consumió 74 → 67 veces en los nueve intentos individuales y 246 → 253 veces entre ambos jugadores de los nueve cooperativos. Se comprueba que ocurre en combate real y conserva límites; esos recuentos, con duraciones distintas, no justifican un aumento numérico.

La mejora genérica «Uno más para el combo» ya convierte el proyectil adicional en +12 % de daño para ataques de área. Se conserva esa conversión; no se retira la carta.

## Evidencia y reproducción

Base: `ce2ffb4a6722dbbc2a1e0d2951f4815cd8410bd3`. Los JSON distinguen el SHA base y las huellas SHA-256 normalizadas de los archivos medidos. Las huellas de `sideral-domain.js` coinciden antes/después.

- [Serie antes](datos/sideral-balance-before-domain.json) / [serie después](datos/sideral-balance-after-domain.json).
- [Estilos antes](datos/sideral-balance-before-pilot-domain.json) / [estilos después](datos/sideral-balance-after-pilot-domain.json).
- [Cierre antes](datos/sideral-balance-before-boss-domain.json) / [cierre después](datos/sideral-balance-after-boss-domain.json).
- [Duelos antes](datos/sideral-duels-before.json) / [duelos después](datos/sideral-duels-after.json).

Desde el checkout candidato:

```sh
node scripts/sideral-balance-audit.cjs --after --domain
node scripts/sideral-balance-audit.cjs --after --pilot --domain
node scripts/sideral-balance-audit.cjs --after --finish-boss --domain
node scripts/sideral-combat-measure.cjs --after
```

Para repetir la comparación anterior, el auditor acepta `--source-root RUTA` a un checkout separado de la base (misma lista de módulos), omitiendo `--after`. No cambia archivos del checkout medido. Los scripts y controles viven fuera de `src/` y no se incluyen en `dist/`.

Pruebas de regresión: blanco móvil y trayectoria fija del lagartito, cobertura y límite de impactos, escala de Q fijada al activar, igualdad de pulsos a 25/30 Hz, depósitos Q/R separados y todas las pruebas existentes del dominio. Siguiente validación: partidas con jugadores y más estilos/compañeros, especialmente la supervivencia individual y el uso del Colazo; no se confunde este cierre mecánico con equilibrio definitivo.
