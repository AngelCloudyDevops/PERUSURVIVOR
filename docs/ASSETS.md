# Arte y procedencia

Los recursos se conservan sin recomprimir ni redibujar en esta reorganización.

| Carpeta | Contenido |
|---|---|
| public/assets/characters/ | Dos hojas de personajes y los JSON de prompts |
| public/assets/enemies/ | Hoja de Backyardigans y policía ficticio de la PNP, con su prompt |
| public/assets/maps/ | Campo de Marte, Plaza de Armas y Machu Picchu, con prompts |
| public/assets/audio/ | Reservada, sin archivos de audio implementados |

El arte fue creado con la herramienta integrada image_gen. Los JSON mantienen las instrucciones de generación, el orden de filas y las poses. Los recortes y anclas permanecen en los módulos rendering/sprites.js y rendering/enemy-art.js.

Los retratos son caricaturas iniciales, no fotografías ni representaciones oficiales. Las figuras públicas tienen habilidades inventadas. Los personajes y marcas de terceros conservan su titularidad original; este documento no declara una licencia sobre ellos. No se incorpora código ni sprites de PokéSurvivor.

Referencias visuales consultadas durante la creación:
- https://x.com/Kingtekaboss
- https://www.google.com/search?udm=2&q=CHARLES+AXELBENBA (facilitada por el usuario)
- https://www.google.com/search?udm=2&q=shakadoto+najasor+cirilotv+fuzo
Las fotografías de referencia no se distribuyen con el juego.

## Jefes y fondos de portal
public/assets/bosses/boss-atlas-v1.png contiene los tres jefes en seis poses. public/assets/arenas contiene combi-v1.png, cabinet-v1.png y guardian-v1.png. Son imágenes originales generadas con image_gen integrado; los prompts completos y el orden de las poses están en public/assets/bosses/prompts.json. Los escenarios de fantasía no pretenden reproducir edificios o deidades reales.

## Apariencias de los poderes
public/assets/characters/powers-atlas-v1.png: nueve caricaturas con poses de reposo, dos de movimiento y ataque. Arte original generado con image_gen integrado. Los prompts completos, nombres de filas y poses están en powers-atlas.json. Los proyectiles adicionales se dibujan como píxeles mediante Canvas.
### Jefes y arenas: estilo geométrico
La Combi, el Gabinete y el Guardián se dibujan mediante rectángulos en una retícula de 3 unidades, con contornos oscuros y paletas cortas. Conservan las fases de reposo, movimiento, aviso, ataque y recuperación. Las arenas usan suelos discretos, caminos claros y bordes simples; las coberturas conservan sus colisiones. Los PNG detallados anteriores permanecen archivados y no se usan en el dibujo del combate. Implementación en src/rendering/boss-art.js.
