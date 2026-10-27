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

## Compresión de activos
Los PNG originales se conservan como fuentes. El navegador y el build usan copias WebP; el build omite los PNG que tienen una copia WebP para evitar duplicar el paquete. scripts/optimize-assets.py (Pillow con soporte WebP) genera WebP sin pérdida por defecto; para artes seleccionados puede registrar compresión con pérdida mediante `--quality`. Ejecutar con `--check` verifica las copias y el manifiesto sin regenerarlas. docs/asset-optimization.json guarda dimensiones, calidad, tamaños y SHA-256 de fuentes, salidas y píxeles cuando aplica. Los mapas completos y atlas mantienen resolución y píxeles; las miniaturas del selector se limitan a 384×256. Las ilustraciones de cartas y la secuencia cinematográfica de Kingteka usan calidad WebP registrada para conservar detalle y mantenerse dentro del límite de despliegue de 64 MiB.

Para añadir una imagen sin regenerar los demás recursos, ejecutar `python scripts/optimize-assets.py --only public/assets/ruta/archivo.png`; agrega su WebP lossless y actualiza el manifiesto existente. El control integral continúa siendo `python scripts/optimize-assets.py --check`.

## Cartas full art de Kingteka
`public/assets/cards/` conserva las ilustraciones full art PNG maestras y sus copias WebP a calidad 88 para las cartas de escopeta, Gallinazo y golpe de cuerpo. La compresión con pérdida moderada mantiene el tamaño del paquete dentro del límite de despliegue; el arte llena el frente de la carta y una placa inferior mantiene legibles el nombre y el efecto. Generar o verificar estos recursos con `python scripts/optimize-assets.py --quality 88 --only public/assets/cards/kingteka-shotgun-fullart-v1.png public/assets/cards/kingteka-gallinazo-fullart-v1.png public/assets/cards/kingteka-golpe-fullart-v1.png` y añadir `--check` para verificar hashes y dimensiones. Prompts y poses: `docs/kingteka-card-art-prompts.json`.

### Cartas de ulti y dominio
Las cartas HUD Q/R reutilizan el patrón de `src/systems/ability-cards.js`: ilustración vertical, placa inferior del botón, progreso dorado y resplandor cálido cuando está lista. Artes propias (PNG fuente 512×768 y WebP registrado a calidad 60): Alberto/Tribunal, Cristorata/Dragón, Cuy/Estampida, Paloma/Bandada, Makanaky/Dominio, Sideral/Dominio y Chamelín/Baño de Trovo. Kingteka conserva su arte full art existente. Para sumar una habilidad futura, registra personaje, tipo y ruta WebP en `P.AbilityCards.entries`; las funciones HUD llaman `P.AbilityCards.apply`. Los huecos aún sin habilidad permanecen como reserva gris. Las siete nuevas fuentes y sus optimizaciones constan en `docs/asset-optimization.json`.

Gallinazo del Caos: public/assets/bosses/gallinazo-atlas-v1.png, seis poses en tres columnas y dos filas, fondo alfa. Techos de Lima: public/assets/arenas/rooftops-v1.png y su versión nocturna coherente public/assets/arenas/rooftops-night-v2.png / .webp. La versión nocturna fue creada con image_gen integrado tomando la azotea original como geometría y el panorama de Lima como referencia cromática; conserva la perspectiva elevada y evita edificios debajo del piso jugable. El panorama experimental permanece como fuente archivada y no se distribuye. Se conserva el dibujo de los jefes anteriores.

## Caminatas completas v1
`public/assets/walks/` contiene 26 láminas originales PNG y sus WebP sin pérdida; seis poses completas por lámina (156 cuadros). Generadas mediante la herramienta integrada image_gen con fondo transparente y los atlas existentes como referencia de identidad. Las especificaciones y prompts completos por ID están en `docs/walk-art-prompts.json`. `docs/walk-art-audit.json` registra tamaño, SHA-256 y verificación de igualdad exacta RGBA tras codificar WebP. El build omite los PNG duplicados y sirve los WebP. Son imágenes nuevas; los atlas de reposo, ataque y muerte originales se conservan. El runtime aísla figuras completas para evitar que una celda corte manos, pies o plumas.

## Minijefes de superficie
`public/assets/minibosses/{fiscalizador,paloma,huaco}-v1.png`: cuatro poses transparentes por personaje, generadas con la herramienta integrada image_gen. Prompts completos y procedencia en `public/assets/minibosses/prompts.json`. El motor aísla cada figura por alfa; conserva el sprite entero para reposo, marcha, ataque y derrota.
