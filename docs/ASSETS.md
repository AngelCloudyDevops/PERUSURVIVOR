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
## Botín animado
public/assets/loot/loot-atlas-v1.png: atlas original generado con image_gen, fondo alfa, 4 columnas por 4 filas: caja intacta/agrietada/rotura/escombros; cofre común cerrado/entreabierto/abriendo/abierto; cofre dorado equivalente; emoliente/imán/chaleco/batería. Prompt en public/assets/loot/prompts.json.

public/assets/loot/chest-rarities-v1.png: hoja original de cofres comunes, raros y legendarios, 4 poses por fila y transparencia, creada con image_gen; prompt en rarity-prompts.json.

Gallinazos: public/assets/enemies/gallinazos-atlas-v1.png, cuatro poses originales generadas con image_gen integrado. Prompt en gallinazos-atlas.json. Recortes con ancla de cuerpo fija y escala nearest-neighbor; sombra añadida en runtime.

### Jefes y arenas: estilo geométrico
La Combi, el Gabinete y el Guardián se dibujan mediante rectángulos en una retícula de 3 unidades, con contornos oscuros y paletas cortas. Conservan las fases de reposo, movimiento, aviso, ataque y recuperación. Las arenas usan suelos discretos, caminos claros y bordes simples; las coberturas conservan sus colisiones. Los PNG detallados anteriores permanecen archivados y no se usan en el dibujo del combate. Implementación en src/rendering/boss-art.js.

## Coberturas de jefe detalladas
public/assets/arena-cover/cover-atlas-v1.png: atlas original generado con image_gen integrado, tres columnas por dos filas, versiones largas y cortas de barrera de concreto, jardinera colonial y muro inca. Prompt y distribución en prompts.json. El dibujo recorta la silueta alfa y conserva las colisiones anteriores.

## Compresión sin pérdida
Los PNG originales se conservan como fuentes. El navegador y el build usan copias WebP lossless; el build omite los PNG que tienen una copia WebP para evitar duplicar el paquete. scripts/optimize-assets.py (Pillow con soporte WebP) regenera las copias y compara cada byte RGBA, incluidas transparencias. Ejecutar con --check verifica las copias sin regenerarlas. docs/asset-optimization.json guarda tamaños y SHA-256 de fuentes, salidas y píxeles. Los mapas completos y atlas mantienen resolución y píxeles; únicamente las miniaturas del selector tienen una versión de 384×256, suficiente para su tamaño de presentación.

Gallinazo del Caos: public/assets/bosses/gallinazo-atlas-v1.png, seis poses en tres columnas y dos filas, fondo alfa. Techos de Lima: public/assets/arenas/rooftops-v1.png. Arte original creado con image_gen integrado; prompts completos en gallinazo-prompts.json. Se conserva el dibujo de los jefes anteriores.

## Caminatas completas v1
`public/assets/walks/` contiene 26 láminas originales PNG y sus WebP sin pérdida; seis poses completas por lámina (156 cuadros). Generadas mediante la herramienta integrada image_gen con fondo transparente y los atlas existentes como referencia de identidad. Las especificaciones y prompts completos por ID están en `docs/walk-art-prompts.json`. `docs/walk-art-audit.json` registra tamaño, SHA-256 y verificación de igualdad exacta RGBA tras codificar WebP. El build omite los PNG duplicados y sirve los WebP. Son imágenes nuevas; los atlas de reposo, ataque y muerte originales se conservan. El runtime aísla figuras completas para evitar que una celda corte manos, pies o plumas.

## Minijefes de superficie
`public/assets/minibosses/{fiscalizador,paloma,huaco}-v1.png`: cuatro poses transparentes por personaje, generadas con la herramienta integrada image_gen. Prompts completos y procedencia en `public/assets/minibosses/prompts.json`. El motor aísla cada figura por alfa; conserva el sprite entero para reposo, marcha, ataque y derrota.
