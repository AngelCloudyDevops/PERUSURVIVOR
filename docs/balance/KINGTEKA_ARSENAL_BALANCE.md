# Auditoría del arsenal de Kingteka

## Qué se cambió

La primera medición mostró que el golpe de cuerpo concentraba casi todo el daño a minijefes, mientras que Gallinazo apenas contribuía. Se ajustaron las tres armas para conservar funciones distintas:

- **Escopeta:** conserva el límite de daño por perdigón y reduce ligeramente su intervalo; sigue siendo la opción física de alcance medio, con caída de daño a distancia.
- **Gallinazo:** más potencia y las plumas perforan hasta dos rivales. Sigue siendo una opción especial guiada y de cadencia lenta.
- **Golpe de cuerpo:** menor daño y recuperación más pausada. Conserva el empuje y la ventaja de corto alcance, con mayor exposición al acercarse.

Los números de perfiles están en `src/systems/kingteka-arsenal.js`; las reglas de progresión están en `docs/diseno/GAME_DESIGN.md`.

## Método

Se corrieron partidas completas con el motor real del juego a 30 actualizaciones por segundo, en Campo de Marte, Plaza de Armas y Machu Picchu, con tres semillas fijas por estrategia. El límite fue de seis minutos por partida. El bot eligió mejoras y cambió de arma según una política fija. El reporte legible por máquina está en `kingteka-arsenal-baseline.json` y `kingteka-arsenal-audit.json`; el script reproducible es `scripts/kingteka-arsenal-audit.cjs`.

La pasada posterior contiene 27 partidas de arma fija (nueve por arma) y nueve partidas con cambio adaptativo entre las tres armas. Daño a minijefes se suma por arma; la mediana de tiempo se calcula solo entre minijefes derrotados.

## Resultados: estrategia de arma fija

| Arma | Antes: minijefes derrotados | Después: minijefes derrotados | Daño a minijefes, antes → después | Duración media, antes → después | Bajas medias, antes → después |
|---|---:|---:|---:|---:|---:|
| Escopeta | 3/12 (25 %) | 7/16 (44 %) | 3.452 → 5.880 | 205,5 s → 210,3 s | 215 → 240 |
| Gallinazo | 0/9 (0 %) | 18/25 (72 %) | 878 → 19.999 | 238,0 s → 278,8 s | 235 → 381 |
| Golpe de cuerpo | 17/19 (89 %) | 11/15 (73 %) | 17.756 → 10.856 | 216,3 s → 176,0 s | 300 → 247 |

El tiempo mediano para derrotar un minijefe fue: escopeta 58,8 s → 67,1 s; Gallinazo, sin derrotas → 34,5 s; golpe 19,3 s → 25,6 s. El golpe conserva la mayor rapidez de remate a corta distancia, pero acumula bastante menos daño total y las partidas de esa estrategia terminaron antes.

## Cambio adaptativo

Con la política que prioriza golpe a 115 unidades, Gallinazo para minijefes visibles y objetivos lejanos, y escopeta a distancias intermedias, el bot derrotó 9 de 16 minijefes, hizo 10.088 de daño agregado a minijefes y sobrevivió una media de 232,4 segundos. Las nueve partidas acabaron en derrota.

## Cómo interpretar estos datos

La comparación apoya el objetivo de diferenciar las armas: Gallinazo ya puede contribuir contra minijefes y la escopeta mejora modestamente; el golpe conserva una ventaja de ráfaga cercana con el costo de combatir a corta distancia. Los datos no demuestran un equilibrio final: son partidas de un único bot determinista, en tres semillas por mapa, sin decisiones humanas ni cooperativo. Las 36 partidas posteriores terminaron en derrota antes del límite de seis minutos. Conviene validar el ajuste jugando con personas antes de ajustar otra vez.

## Reproducir

```sh
node scripts/kingteka-arsenal-audit.cjs
node scripts/kingteka-arsenal-audit.cjs --adaptive
```

Las simulaciones son herramientas locales de balance y no alteran registros ni datos de jugadores.
