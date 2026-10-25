# PERUSURVIVOR — Causas del Caos

[![CI](https://github.com/AngelCloudyDevops/PERUSURVIVOR/actions/workflows/ci.yml/badge.svg)](https://github.com/AngelCloudyDevops/PERUSURVIVOR/actions/workflows/ci.yml)

Juego de supervivencia y parodia peruana para navegador: dieciocho personajes, Backyardigans y policías ficticios como rivales, tres mapas y encuentros opcionales. HTML, CSS y Canvas 2D, sin dependencias de ejecución.

## Desarrollo

Requiere Node.js 20 o superior. CI verifica Node 22 y 24 en Linux y Windows.

```sh
npm ci --ignore-scripts
npm start
```

Abre http://127.0.0.1:4173. El comando de inicio genera primero dist/. Para ver una edición nueva, vuelve a ejecutar npm run build y recarga el navegador; no hay recarga automática.

| Comando | Función |
|---|---|
| npm start | Genera dist/ y sirve el juego |
| npm run build | Copia fuentes y recursos a dist/ |
| npm run check | Comprueba la sintaxis de los módulos |
| npm test | Genera el juego y ejecuta todas las pruebas |
| node check.cjs | Compila y ejecuta las pruebas (comando histórico) |

WASD o flechas para moverse, ataque automático, Esc para pausar y E para entrar a un portal cercano. En móvil se arrastra el dedo y se usa el botón del portal.

## Estructura

```text
src/
  core/          Estado y controles
  entities/      Jugador, enemigos y daño
  systems/       Combate, progresión, portales y terreno
  data/          Catálogo y balance
  scenes/        Mapas y ciclo de partida
  rendering/     Sprites, efectos y dibujo
  ui/            Menús, HUD y estilos
  index.html
public/assets/
  characters/    Hojas de personajes y sus prompts
  enemies/       Hoja de rivales y su prompt
  maps/          Tres fondos y sus prompts
  audio/         Reservado; la ulti usa síntesis Web Audio
scripts/         Compilación y orden de carga
tests/           Regresión, compilación, HTTP y herramientas manuales
docs/            Diseño y arquitectura
.github/workflows/ci.yml
dist/            Generado, fuera del control de versiones
```

Edita src/ y public/, nunca dist/. Los scripts clásicos siguen compartiendo P; scripts/modules.cjs conserva su orden de carga. El servidor y los archivos compilados mantienen las rutas de JavaScript existentes.

## Documentación

- [Diseño del juego](docs/GAME_DESIGN.md): reglas actuales, personajes, habilidades, progresión y alcance.
- [Arquitectura](docs/ARCHITECTURE.md): responsabilidades, dependencias y flujo de datos.
- [Contribuir y validar](docs/CONTRIBUTING.md): procedimiento de cambios y CI.
- [Procedencia del arte](docs/ASSETS.md): hojas, prompts y referencias.
- [Registro de cambios](CHANGELOG.md).
- [Evidencia de la reorganización](docs/reorganization-baseline.json): hashes de las fuentes originales.

## Validación

Las pruebas cubren los ataques de los dieciocho personajes, oleadas, mejoras, pausa, bumerán, daño del jefe, los tres mapas, portales y sus recompensas, colisiones, cajas y rutas enemigas. También comprueban los recursos compilados y el servidor HTTP. La lógica corre en un entorno simulado; estas pruebas no sustituyen la revisión visual en navegador.

GitHub Actions ejecuta las mismas comprobaciones en cada push y pull request. La CI publica en el VPS únicamente tras un push a main y después de superar todas las pruebas.

## Publicación

El destino principal es https://perusurvivor.michitech.tech, en el VPS de Hostinger srv2060131.hstgr.cloud (179.236.77.159). Nginx (perusurvivor-web) sirve /opt/perusurvivor/live/current detrás de Caddy. Un push a main despliega automáticamente dist/ después de CI; las ramas y PR no publican. Véase docs/DEPLOYMENT.md. El sitio de ChatGPT configurado en .openai/hosting.json es una copia separada: publicarlo no actualiza el dominio principal.

Esta es una versión de un jugador, sin cuentas, pagos, multijugador ni voces de figuras reales. El récord se guarda en el navegador. Las figuras públicas aparecen como caricaturas de parodia con habilidades inventadas; no existe afiliación.

## Terreno continuo
El mapa principal ahora continúa sin bordes mediante sectores deterministas. Conserva los tres temas, obstáculos y cajas destruibles; las arenas de portales siguen cerradas. El terreno de combate usa texturas de suelo de los fondos, no mosaicos de la ilustración completa. Código en src/systems/chunks.js; build generado con npm run build. Las pruebas verifican viaje a coordenadas lejanas, caché acotada, cámara libre y persistencia de cajas destruidas.

## Estilo visual obligatorio

Toda contribución debe respetar la dirección artística elegida por el usuario. La referencia obligatoria es **cartoon (caricaturesco) en pixel art**, tomando los personajes actuales como guía de dibujo. El entorno conserva su sencillez, césped con textura y caminos claros, pero comparte contornos oscuros y sombras de pocos tonos con los personajes. No sustituir este estilo por una variante más detallada sin aprobación expresa del usuario.

- **Personajes y enemigos:** caricaturas pixel art legibles, proporciones coherentes con los sprites actuales, contornos oscuros definidos y colores agrupados. Conservar identidad, vestuario y escala entre reposo, caminata y ataque. No mezclar personajes realistas, 3D o ilustraciones suavizadas con los sprites existentes.
- **Entorno:** árboles de copas simples con contorno oscuro, troncos, bancas, cajas y arbustos caricaturescos. Las formas geométricas son una base de construcción, no un estilo distinto del cartoon de los personajes. Mantener el césped con textura de la referencia y caminos de color claro. Evitar follaje minucioso, edificios ornamentados, texturas realistas o exceso de ruido visual. Los elementos peruanos deben reconocerse mediante formas simples.
- **Coherencia del dibujo:** usar una escala de píxel compatible entre personajes y objetos; bordes nítidos, sin desenfoque ni suavizado al escalar el mundo. La perspectiva es suelo visto desde arriba y objetos de frente en tres cuartos. Mantener sombras discretas en las bases y orden de profundidad al pasar detrás de objetos.
- **Color y lectura:** reservar el mayor contraste para personajes, enemigos, ataques y objetos interactivos. El fondo acompaña el combate; no debe competir con él. Mantener espacio libre para desplazarse y distinguir peligros y recompensas.
- **Animación ambiental:** movimientos suaves y cortos de copas, arbustos y pasto, con ritmos distintos; pocas hojas y partículas, sin cubrir el combate. Respetar la pausa y la preferencia de movimiento reducido. Campo de Marte implementa esta referencia en src/rendering/ambient.js.
- **Ataques y efectos:** conservar el lenguaje pixel art de los personajes, con siluetas claras y colores que permitan distinguir impactos, proyectiles y avisos de peligro. No introducir efectos realistas que rompan la coherencia del dibujo.
- **Mapas y jugabilidad:** conservar la identidad de Campo de Marte, Plaza de Armas y Machu Picchu, el terreno infinito, los caminos variados y las colisiones. Una mejora visual no debe revertir estas funciones.
- **Revisión de arte nuevo:** comparar la propuesta con los personajes actuales dentro de una escena real, a escala de juego y también en móvil. Para cambiar la dirección artística, presentar primero una muestra con un personaje encima y obtener la elección del usuario antes de aplicarla al resto.

### Implementación de referencia

src/rendering/map-art.js mantiene simpleStyle activado: los atlas detallados de public/assets/environment/ se conservan como variantes archivadas, no como referencia visual vigente. El suelo se dibuja en src/systems/chunks.js y los objetos sencillos en src/systems/terrain.js. No reactivar los atlas detallados para una mejora rutinaria. La interfaz puede mantener su tipografía actual; estas reglas de píxel se aplican al dibujo del mundo, personajes y efectos.

La prueba de poderes respeta esta referencia: efectos de Kingteka rasterizados a píxeles de dos unidades, sin halo desenfocado, conservando globos de cómic y sello. Audio y controles de ulti se mantienen.

## Despliegue automático
La preparación y el estado de activación están documentados en [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md). Cada push a main publica el juego después de las pruebas, mediante la cuenta restringida del VPS y comprobación HTTPS con reversión automática.


## Fondos y objetos coherentes
El mundo y el fondo del menú usan el mismo dibujo sencillo con contornos oscuros y colores agrupados. Los atlas detallados de public/assets/environment/ quedan archivados y desactivados; no reactivarlos como arte vigente. Los props nuevos deben compararse con un personaje a escala de juego antes de incorporarlos. Evitar tanto el realismo de alta textura como los objetos planos sin el contorno y sombreado cartoon del elenco. Mantener las identidades de los tres mapas sin recargar su dibujo.

## Arte del botín
Cajas, cofres comunes y dorados y los cuatro objetos usan el atlas pixel art public/assets/loot/loot-atlas-v1.png. Conservan siluetas sencillas y contornos visibles; las tablas y herrajes añaden detalle. Los cofres animan la tapa antes de revelar el premio.

## Cofres por rareza
Común (madera, ●), raro (azul, ◆) y legendario (violeta/dorado, ★), con cuatro objetos mejorados por nivel. Las aperturas y el arte se distribuyen desde GitHub al hosting de producción https://perusurvivor.michitech.tech según docs/DEPLOYMENT.md. El sitio chatgpt.site es una copia independiente y no es el destino principal.

## Kingteka: ulti y sonido
La ulti se carga con 20 bajas y se activa con Q o el botón táctil: ocho segundos de gallinazos animados, velocidad ×1,5 y cadencia ×2; rivales normales reciben ×2 daño. Incluye aleteo, escopeta reforzada, efectos pixel art y sello DENUNCIADO con golpe sincronizado. El botón Sonido permite silenciar. La recarga instantánea y el selector de pruebas son utilidades locales y no se publican.

## Sonido y música
Música retro original por mapa, tema de jefe y efectos sintetizados mediante Web Audio. El botón Sonido recuerda el silencio. Requiere una interacción inicial y se pausa fuera de la partida. No descarga grabaciones externas.

## Cofres al explorar
Los cofres se distribuyen por sectores de 768 unidades con posiciones y una semilla nuevas por partida. Cada sector tiene un 60% de posibilidad de contener uno; el sector de inicio garantiza un común en posición aleatoria segura. Entre cofres fuera del inicio: común 72%, raro 26%, legendario 2%; los legendarios requieren estar a 1800 unidades del punto de aparición. Un sorteo legendario cercano se convierte en raro. Se generan al explorar y se conservan las aperturas al regresar, sin repetir premios. Se comprueban obstáculos, fuente y portal. Las arenas no generan cofres normales; el cofre de jefe conserva su recompensa.

## Cámara y visibilidad
En exploración la cámara debe mostrar caminos, obstáculos y enemigos con anticipación, conservando los personajes legibles. Se reduce el zoom del mundo de 1,7 a 1,3 en una pantalla de 1280 px (aprox. 24% menos acercamiento); el mínimo móvil es 0,95. Las arenas de jefe conservan su cámara propia. El HUD de exploración es compacto y evita repetir la habilidad: mantiene vida, tiempo, bajas, nivel, botín y objetivos. No volver a acercar la cámara global ni ampliar el panel sin comparar una partida en escritorio y móvil. La fórmula está en World.zoomFor y tiene regresión en tests/gameplay.test.cjs. Todo ajuste se guarda en una rama y commit de Git antes de publicarse.

Las jardineras deben reconocerse como macetas: volumen frontal, borde, tierra, follaje irregular y flores con pétalos. No usar una cuadrícula de puntos sobre un rectángulo como sustituto del dibujo. Conservar las colisiones al corregir el arte.
