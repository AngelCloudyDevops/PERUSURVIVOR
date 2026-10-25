# Guardianes del Bosque

Prototipo original de supervivencia en navegador. Elige Brasa, Musgo o Bruma y sobrevive cinco minutos para enfrentarte al jefe de la niebla. Los ataques son automáticos; recoge cristales y selecciona mejoras al subir de nivel.

## Jugar

Abre `dist/index.html` directamente en el navegador o ejecuta `node server.cjs` y visita http://127.0.0.1:4173.

WASD o flechas: movimiento. Esc: pausa. En pantallas táctiles, arrastra el dedo sobre la arena. El récord se guarda en el navegador.

## Editar

- `dist/game.js`: criaturas, combate, oleadas, mejoras y dibujo de la arena.
- `dist/style.css`: diseño adaptable y menús.
- `dist/index.html`: estructura y textos.

Sin dependencias de ejecución. Las fuentes web tienen alternativas locales. Comprueba la lógica con `node check.cjs`.

Esta primera versión es de un jugador y usa ilustraciones procedurales originales. No incluye cuentas ni multijugador.
