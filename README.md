# PERUSURVIVOR — Causas del Caos
Supervivencia y parodia peruana con HTML, CSS, JavaScript y Canvas 2D. Código y recursos originales; no incorpora código ni sprites de PokéSurvivor.

## Jugar
Abre dist/index.html o ejecuta `node server.cjs` y visita http://127.0.0.1:4173.
WASD / flechas: movimiento. Ataques automáticos. Esc: pausa. En móvil, arrastra el dedo. Recoge fama y elige mejoras.

## Selección actual
Cristorata, Cuy Supremo, Paloma del Centro, Alan García, Alberto Fujimori, Keiko Fujimori, Ollanta Humala, Kingteka, Shakadoto, Najasor, CiriloTV, Fuzo, Charles y Axel Benba.
ElZeein es el jefe final de ficción, aparece a los cinco minutos y lanza ráfagas de cinco proyectiles.
Los nombres de figuras públicas se usan en caricaturas de parodia. Habilidades y situaciones son inventadas; no existe afiliación. Los parecidos son diseños iniciales sujetos a ajuste.

## Arte y animación
Dos hojas PNG transparentes, generadas con la herramienta integrada image_gen:
- dist/assets/sprites/causas-atlas-v1.png: ocho filas y cuatro poses, incluye el sprite de ElZeein.
- dist/assets/sprites/streamers-atlas-v1.png: siete filas y cuatro poses.
- atlas.json y streamers-atlas.json: prompts completos y metadatos de generación.

Cada fila tiene reposo, dos poses de caminata y ataque. El motor recorta cada celda usando alfa, conserva el ancla de los pies, desactiva el suavizado e invierte horizontalmente según dirección. No hay animaciones independientes de ocho direcciones.
Los emotes, micrófonos, teclados, teléfonos, abanicos, plumas, ondas y bandas tienen efectos animados, estelas e impactos. Los enemigos comunes son Pablo, Tyrone, Uniqua, Tasha, Austin y policías ficticios de la PNP, con dos poses de caminata en rivales-atlas-v1.png. Se alternan los seis diseños al aparecer.

## Estructura
- dist/js/data.js: personajes, ataques, jefe, escenario y mejoras.
- dist/js/core.js: controles, estado compartido, tamaño del lienzo y récord local.
- dist/js/sprites.js: carga, recorte y reproducción de atlas.
- dist/js/enemy-art.js: carga y animación de los seis diseños de rivales.\n- dist/js/fx.js: dibujo de proyectiles, estelas, ondas e impactos.
- dist/js/entities.js: creación de entidades, daño y fallback de retratos.
- dist/js/combat.js: comportamientos de ataque y proyectiles hostiles.
- dist/js/systems.js: oleadas, movimiento, fama y mejoras.
- dist/js/world.js: escenario y dibujo ordenado por profundidad.
- dist/js/ui.js: selección animada, HUD y menús.
- dist/js/game.js: ciclo principal y transiciones.

El escenario se repite por sectores. La fuente bloquea al jugador; los puestos y jardines son decorativos. Los módulos comparten P y el orden de carga está en index.html.

## Comprobaciones
`node check.cjs`: daño de los catorce personajes, pausa, mejoras, bumerán, fuente, simulación de cinco minutos, victoria, derrota y ráfaga del jefe. Comprobación visual adicional en navegador para sprites y efectos.

## Referencias visuales consultadas
- ElZeein / Andynsane: https://www.planeta.pe/noticias/actualidad/streamer-peruano-elzeein-mas-espectadores-en-twitch-103373/
- Cristorata: https://www.infobae.com/peru/2025/07/21/quien-es-cristorata-el-streamer-peruano-que-desafia-las-redes-con-humor-irreverente-y-entrevistas-polemicas/
- Kingteka: https://x.com/Kingtekaboss
- Lista adicional: captura compartida por el usuario.
- Charles y Axel Benba: búsqueda visual facilitada por el usuario, https://www.google.com/search?udm=2&q=CHARLES+AXELBENBA
- Referencias del grupo: https://www.google.com/search?udm=2&q=shakadoto+najasor+cirilotv+fuzo
Las fotos de referencia no se distribuyen con el juego.

Versión de un jugador. Sin cuentas, pagos ni voces de figuras reales. El récord permanece en el navegador.

## Mapas y fondos
Selector de tres escenarios antes de la partida: Campo de Marte (Lima), Plaza de Armas de Lima y Machu Picchu (Cusco). Son interpretaciones de pixel art para el juego, no planos geográficos exactos.

Cada escenario es una arena finita de 2400 × 1600 unidades, con límites transitables específicos, punto de aparición, miniatura y ambientación. La cámara se detiene en los bordes del fondo. La fuente de Plaza de Armas tiene colisión elíptica; los bordes arquitectónicos de los demás mapas son decorativos y quedan fuera del área transitable. El sistema de oleadas y las habilidades se mantienen.

- dist/js/maps.js: catálogo, selección, carga del arte, límites y colisión.
- dist/assets/maps/campo-v1.png: césped, senderos y monumento estilizado.
- dist/assets/maps/plaza-v1.png: fuente, balcones y edificios coloniales.
- dist/assets/maps/machu-v1.png: terrazas, ruinas y paisaje andino.
- dist/assets/maps/prompts.json: prompts completos, generados con image_gen integrado.

Las pruebas de check.cjs cubren selección, puntos de aparición, límites, eliminación de la fuente en Campo de Marte y persistencia de la colisión de la fuente en Plaza de Armas.

## Desarrollo desde GitHub
Repositorio: https://github.com/AngelCloudyDevops/PERUSURVIVOR

Requiere Node.js 20 o superior. No hay dependencias que instalar: ejecuta npm start para abrir el servidor en http://127.0.0.1:4173 y npm test para comprobar el juego.
