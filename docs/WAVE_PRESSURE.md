# Auditoría de presión de oleadas

## Objetivo

La partida debe exigir movimiento desde el primer minuto sin convertir los primeros segundos en daño inevitable, sin alterar el sistema de Fuerza/Técnica/Ingenio y sin elevar los límites que protegen el rendimiento.

La vida y la velocidad ya son estadísticas de cada personaje y de cada perfil enemigo. Siguen dependiendo de su identidad y función —resistente, móvil, pesado o corredor—, no de la rareza de colección. Hacer que C/R/SR/SSR/UR aumente automáticamente esas dos cifras volvería obsoletos a los personajes comunes y mezclaría colección con equilibrio. Las estrellas y mejoras permanentes conservan sus bonificaciones separadas.

## Reglas implementadas

- 0:00–0:08: aparecen los tres atributos, pero solo existe daño por contacto.
- Cada ciclo de 30 s contiene un **EMPUJE** entre los segundos 8 y 20 (intervalo ×0,72) y un **RESPIRO** fuera de esa ventana (×1,05).
- 0:08 habilita un atacante especial; 0:30 habilita dos. Los avisos y coberturas existentes no se acortan.
- Uno de cada cinco minions no pesados nace corredor: 15 % menos vida y velocidad base 134–150. La infantería usa 90–110 y los pesados 65–80.
- La recompensa de fama se normaliza a 0,5 corredor, 0,75 infantería y 2,25 pesado para que la mayor densidad no regale niveles.
- Las apariciones quedan fuera de todas las cámaras, con 90 unidades de margen, al menos 230 unidades de cada jugador y nunca dentro de terreno sólido.
- Durante un minijefe se aplica cap ×0,70 e intervalo ×1,60 sin sumar nuevamente el EMPUJE.
- Se conserva una aparición máxima por tick, ocho intentos de posición, 80 enemigos, 40 peligros y 8 atacantes normales.

## Ensayo reproducible

Se ejecutaron 19 personajes en los tres mapas con semilla 920: 57 partidas del perfil anterior y 57 del nuevo. Ambas series usan el mismo motor de atributos, las mismas mejoras automáticas y el mismo bot de movimiento. El perfil anterior se restaura únicamente dentro de la VM de auditoría mediante `wave-baseline-profile.json`; no existe un interruptor de QA en el juego publicado.

| Métrica | Perfil anterior | Perfil nuevo |
|---|---:|---:|
| Partidas | 57 | 57 |
| Victoria / derrota / límite de 6 min | 41 / 11 / 5 | 44 / 7 / 6 |
| Enemigos visibles medios, primer minuto | 2,364 | 4,811 |
| Muestras con enemigo cercano, primer minuto | 31,3 % | 55,8 % |
| Daño medio recibido, primer minuto | 1,15 | 12,66 |
| Nivel medio al minuto | 4,81 | 5,00 |
| Bajas medias al minuto | 47,07 | 83,12 |
| Nivel final medio | 11,12 | 10,91 |
| Enemigos simultáneos máximos observados | 71 | 51 |
| Peligros simultáneos máximos observados | 34 | 29 |
| Derrotas antes de 1:00 | 0 | 0 |

La densidad y proximidad aumentan de forma clara, pero la fama normalizada mantiene el nivel al minuto prácticamente igual (+0,19) y el nivel final ligeramente por debajo. Las victorias no empeoran en este bot móvil; esta métrica no sustituye una prueba humana de dificultad.

## Control estacionario

Se repitieron 60 segundos sin mover seis personajes representativos. Con el perfil anterior murieron Cristorata y Paloma; con el nuevo murieron además Kingteka, G5 y Fuzo. Cuy sobrevivió ambos ensayos, pero recibió 127,8 de daño frente a 69. Los tiempos de caída de Cristorata y Paloma bajaron de 44,0/51,5 s a 26,3/28,5 s. El sistema castiga quedarse quieto sin producir una derrota forzada cuando el jugador sí se desplaza.

## Rendimiento y límites

La presión se consigue modificando datos de nacimiento y el intervalo ya existente. No se agregan partículas, texturas, búsquedas por cada frame ni temporizadores paralelos. La geometría de aparición se calcula una sola vez al crear el enemigo. En una verificación visual de escritorio, con nueve minions y tres proyectiles visibles durante el primer EMPUJE, el panel interno marcó 57–60 FPS y P95 de 16,8 ms. Es una observación local, no una garantía para todos los móviles.

Reproducción:

```text
node scripts/wave-audit.cjs --baseline
node scripts/wave-audit.cjs
node scripts/wave-stationary-audit.cjs
npm test
```

Datos: `wave-baseline.json`, `wave-runs.json` y `wave-stationary.json`.
