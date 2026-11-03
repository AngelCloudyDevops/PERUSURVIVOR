# Evento raro: el cautivo

## Aparición e interacción

- Solo aparece en partidas individuales normales, fuera de arenas y pruebas de rendimiento.
- El motor intenta una aparición cada 30 segundos hasta que ocurre una. La probabilidad por intento crece linealmente de 5 % al empezar a 20 % al minuto 3.
- El cautivo aparece amarrado y muestra un globo `HELP` cuyo color pulsa. Se libera como un cofre: el jugador permanece quieto a su lado durante 1,8 segundos mientras avanza la barra visible. Moverse o alejarse reinicia el progreso.
- Solo puede aparecer una vez a la vez. Reiniciar la partida limpia por completo el encuentro.

## Resultados

| Probabilidad | Resultado |
| --- | --- |
| 30 % | Acompañante celeste: Hadoken especial cada 4 s, daño igual al 50 % del poder actual del jugador. |
| 30 % | Acompañante morado: Hadoken especial cada 6 s; al impactar abre durante 1,8 s un pequeño vórtice que atrae minions y causa daño especial reducido. |
| 30 % | Premio: muestra tres tickets en la mano y entrega 10 tickets dorados persistentes en la cuenta. Cada ticket reemplaza 60 monedas en una tirada de Gacha. |
| 10 % | Huida: se aleja de puntitas, lanza una bomba de humo ninja y no entrega nada. |

El acompañante no forma parte de la lista de enemigos, no tiene vida ni colisión y nunca puede ser seleccionado. Permanece hasta que el jugador recibe daño efectivo; los bloqueos e invulnerabilidad que reduzcan el daño a cero no lo despiden.

## Prueba de administrador

En el Laboratorio aparece `Probar cautivo` únicamente para una cuenta con rol `admin`. Cada uso prepara el siguiente resultado en el orden celeste, morado, tickets y huida. Los tickets mostrados dentro de una partida de desarrollo no se guardan.

## Arte

El atlas `public/assets/events/captive-companion-v2.webp` contiene 24 cuadros 6×4: tres poses amarradas, tres de liberación, seis de caminata, tres por cada Hadoken, dos de tickets, tres de huida y una de humo. La caminata y la huida avanzan según la distancia realmente recorrida, por lo que los pies no se deslizan cuando cambia la velocidad. Los ataques separan anticipación, carga y lanzamiento; el proyectil nace al llegar al cuadro de extensión.

El PNG fuente y el prompt reproducible se conservan junto al WebP; el build público distribuye únicamente la versión optimizada.
