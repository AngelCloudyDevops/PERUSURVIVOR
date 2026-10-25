# Causas del Caos
Juego de supervivencia y parodia peruana, construido con HTML, CSS y Canvas 2D. Implementación original; no incorpora código ni recursos de PokéSurvivor.

## Jugar
Abre dist/index.html o ejecuta `node server.cjs` y visita http://127.0.0.1:4173.
WASD / flechas para moverte, ataques automáticos, Esc para pausar. En móvil, arrastra el dedo. Recoge fama y selecciona mejoras. El Algoritmo aparece después de cinco minutos.

## Personajes
| Personaje | Ataque |
|---|---|
| La Causa Gamer (streamer ficticio) | Tres emotes en abanico |
| Don Clip (streamer ficticio) | Micrófono bumerán |
| Cuy Supremo (meme original) | Onda de área con empuje |
| Paloma del Centro (meme original) | Cinco plumas en abanico |
| Alan García (caricatura de parodia) | Cono de sonido |
| Alberto Fujimori (caricatura de parodia) | Tres bandas orbitales |

Escenario: Plaza del Causas, arena urbana que se repite por sectores. La fuente bloquea el movimiento del jugador; los puestos y jardines son decorativos. Los enemigos representan trolls ficticios. Las habilidades y situaciones son inventadas.

## Estructura
- dist/js/data.js: catálogo de personajes, ataques, escenario y mejoras.
- dist/js/core.js: controles, tamaño del lienzo, estado compartido y récord local.
- dist/js/entities.js: creación de entidades, daño, efectos y retratos procedurales.
- dist/js/combat.js: cinco comportamientos reutilizables de ataque.
- dist/js/systems.js: oleadas, movimiento, experiencia y mejoras.
- dist/js/world.js: terreno, fuente y dibujo del escenario.
- dist/js/ui.js: selección, HUD y menús.
- dist/js/game.js: arranque, ciclo principal y transiciones.
- dist/style.css: presentación y adaptación móvil.

Los módulos comparten el espacio P. El orden de carga está definido en index.html. Los datos de contenido no dependen del dibujo; el combate interpreta el campo kind de cada ataque. Añadir personajes consiste en agregar datos y un estilo de retrato. Nuevos comportamientos requieren implementar su ejecución en combat.js.

## Verificación
Ejecuta `node check.cjs`. Comprueba daño de los seis ataques, pausa, mejoras, bumerán, colisión de la fuente, una simulación de cinco minutos, victoria y derrota.
Es una versión inicial de un jugador. No hay cuentas, multijugador, pagos ni voces de figuras reales. El récord permanece en el navegador.
