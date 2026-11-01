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

## Huaco Renegado v2

`public/assets/minibosses/huaco-v2.png` toma de la fotografía aportada la estatua antropomorfa de cerámica rojiza: cabeza cilíndrica, rostro tallado, cuerpo sentado, base geométrica y objeto tubular frontal. Conserva el acabado cartoon/pixel del juego y las cuatro poses completas exigidas por `P.Minibosses` —reposo, movimiento, ataque y derrota— sobre transparencia real. El navegador carga `huaco-v2.webp`; `huaco-v1` permanece como respaldo histórico y el prompt reproducible está junto al atlas.

## Compresión de activos
Los PNG originales se conservan como fuentes. El navegador y el build usan copias WebP; el build omite los PNG que tienen una copia WebP para evitar duplicar el paquete. scripts/optimize-assets.py (Pillow con soporte WebP) genera WebP sin pérdida por defecto; para artes seleccionados puede registrar compresión con pérdida mediante `--quality`. Ejecutar con `--check` verifica las copias y el manifiesto sin regenerarlas. docs/arte/auditorias/asset-optimization.json guarda dimensiones, calidad, tamaños y SHA-256 de fuentes, salidas y píxeles cuando aplica. Los mapas completos y atlas mantienen su resolución; Campo de Marte usa calidad 95 y los demás fondos conservan los píxeles exactos. Las miniaturas del selector se limitan a 384×256. Las ilustraciones de cartas y la secuencia cinematográfica de Kingteka usan calidad WebP registrada para conservar detalle y mantenerse dentro del límite de despliegue de 64 MiB.

Para añadir una imagen sin regenerar los demás recursos, ejecutar `python scripts/optimize-assets.py --only public/assets/ruta/archivo.png`; agrega su WebP lossless y actualiza el manifiesto existente. El control integral continúa siendo `python scripts/optimize-assets.py --check`.

## Terreno de Halloween
`public/assets/environment/halloween-terrain-atlas-v1.png` es la fuente transparente de un atlas 4×3 generado con la herramienta integrada image_gen. Contiene casona embrujada, cripta, dos árboles secos, dos tumbas, calabazas, cerca, velas, farol, sembrío y portón. El navegador carga su copia WebP optimizada a calidad 88 y recorta celdas de 256×256 con filtrado desactivado. `docs/arte/auditorias/halloween-terrain-art-audit.json` conserva distribución, prompt resumido, tamaños y hashes. Las primitivas anteriores permanecen como respaldo durante la carga o ante un error del recurso.

## Terreno de Navidad
`public/assets/environment/christmas-terrain-atlas-v1.png` es la fuente transparente del atlas navideño 4×3 generado con image_gen y alineado al estilo del atlas de Halloween. Contiene árbol principal, dos pinos, muñeco con chullo, dos grupos de regalos, puesto de panetón, carrito de chocolate, nacimiento, arco de luces, farol y mesa de panetón. El navegador carga una única copia WebP calidad 88 solo al entrar a Navidad; `docs/arte/auditorias/christmas-terrain-art-audit.json` registra celdas, prompt, tamaños y hashes. Las formas geométricas anteriores se conservan como respaldo de carga.

## Cartas full art de Kingteka
`public/assets/cards/` conserva las ilustraciones full art PNG maestras y sus copias WebP a calidad 88 para las cartas de escopeta, Escopeta Contra, Gallinazo y golpe de cuerpo. Escopeta Contra tiene arte propio con cinco esferas rojas y prompt versionado junto al PNG. La compresión con pérdida moderada mantiene el tamaño del paquete dentro del límite de despliegue; el arte llena el frente de la carta y una placa inferior mantiene legibles el nombre y el efecto. Generar o verificar estos recursos con `python scripts/optimize-assets.py --quality 88 --only public/assets/cards/kingteka-shotgun-fullart-v1.png public/assets/cards/kingteka-contra-fullart-v1.png public/assets/cards/kingteka-gallinazo-fullart-v1.png public/assets/cards/kingteka-golpe-fullart-v1.png` y añadir `--check` para verificar hashes y dimensiones. Prompts y poses: `docs/arte/prompts/kingteka-card-art-prompts.json` y `public/assets/cards/kingteka-contra-fullart-v1.prompt.txt`.

El ataque Gallinazo usa `public/assets/attacks/kingteka-gallinazo-attack-v2.webp` en Base y `public/assets/attacks/cerdito-gallinazo-attack-v2.webp` con la skin Cerdito: ambas contienen seis figuras completas 3×2 con la misma proporción corporal de Golpe de cuerpo. La secuencia enlaza guardia, acumulación de plumas, liberación del gallinazo y recuperación; los efectos permanecen unidos a las manos para que el recorte automático no los asigne a otro cuadro. Los atlas v1 se conservan como fuente histórica, pero el cargador usa v2.

Gallinazo separa ataque y desplazamiento para no deslizar al personaje entre disparos. `kingteka-gallinazo-walk-v1.webp` y `cerdito-gallinazo-walk-v1.webp` contienen seis contactos de pie equivalentes a la marcha de Escopeta, con una corona de plumas compacta y estable en las manos. Al disparar, el render cambia temporalmente al atlas de ataque v2 y luego vuelve a la marcha equipada.

## Full arts de personajes
Las cartas de Causa usan fuentes PNG verticales y copias WebP registradas entre calidad 76 y 88; Chamelín usa 512×768 para respetar el límite del paquete de publicación y las demás conservan 1024×1536. Cristorata conserva la pose de paso al frente y mano al pecho de la referencia aportada, pero mantiene la identidad vigente del sprite: cabello negro, camiseta negra, cadena, pantalón gris, zapatillas y micrófono. Cuy Supremo adopta el primerísimo primer plano con hocico ampliado de su referencia, conservando el pelaje marrón, la franja blanca, el pañuelo rojo y su cuerpo de cuy. Paloma del Centro recrea la composición humorística entre dos panes, sostenida con una mano y sin daño, mientras conserva su plumaje gris, cuello verde-morado, ojo ámbar y pico naranja. Cuy y Paloma comparten el acabado ilustrado del juego: contornos marcados, formas simplificadas y sombras de cel shading, sin textura fotográfica. Como cartas C · Común, las tres escenas usan luz natural o cálida, gris acero y pocos efectos. Kingteka · Amor a los animales toma de la foto únicamente la pose sentada y la sonrisa: el sprite vigente conserva cabello, camiseta negra, tatuajes, pantalón azul y zapatillas blancas, mientras el acabado UR usa facciones simplificadas, contorno negro, sombras en bloques, textura de píxel fino y luces magenta, violeta, azul y dorado. Una mano alimenta al cuy y la otra acaricia al perro; la bolsa queda sobre la banca para mantener las manos legibles. Chamelín Trovo recrea el primer plano con la lengua afuera de su referencia y conserva su chullo, casaca azul con detalles andinos, pantalón oscuro y zapatillas blancas; como carta UR, combina magenta, violeta y cian neón con agua mágica dorada, vapor y una lengua de acabado caricaturesco. El navegador carga `cristorata-character-fullart-v1.webp`, `cuy-character-fullart-v1.webp`, `paloma-character-fullart-v1.webp`, `kingteka-character-fullart-v1.webp` y `chamelin-character-fullart-v1.webp`; cada personaje conserva un foco vertical propio para mantener rostro y pose dentro del recorte de la carta, y `docs/arte/auditorias/asset-optimization.json` registra fuentes, salidas, calidad, dimensiones y hashes.

### Cartas de ulti y dominio
Las cartas HUD Q/R reutilizan el patrón de `src/systems/ability-cards.js`: ilustración vertical, placa inferior del botón, progreso dorado y marco temático cuando está lista. Artes propias (PNG fuente 512×768 y WebP registrado a calidad 60): Alberto/Tribunal, Cristorata/Dragón, Cuy/Estampida, Paloma/Bandada, Makanaky/Dominio, Sideral/Dominio y Chamelín/Baño de Trovo. Kingteka conserva su arte full art existente. Cirilo añade `assets/ui/cirilo-domain-demon-frame-v1`: fuente PNG transparente 256×384, WebP de ejecución calidad 88 y prompt versionado; el centro conserva alfa cero y las capas CSS recortan cuernos, alas y base sin duplicar descargas. Para sumar una ulti futura, registra personaje y ruta WebP en `P.AbilityCards.entries` y conecta su HUD a `apply`; para un dominio, registra también `state`, `label` y un tema en `P.AbilityCards.frames`. Todas las fuentes y optimizaciones constan en `docs/arte/auditorias/asset-optimization.json`.

Gallinazo del Caos: public/assets/bosses/gallinazo-atlas-v1.png, seis poses en tres columnas y dos filas, fondo alfa. Techos de Lima: public/assets/arenas/rooftops-v1.png y su versión nocturna coherente public/assets/arenas/rooftops-night-v2.png / .webp. La versión nocturna fue creada con image_gen integrado tomando la azotea original como geometría y el panorama de Lima como referencia cromática; conserva la perspectiva elevada y evita edificios debajo del piso jugable. El panorama experimental permanece como fuente archivada y no se distribuye. Se conserva el dibujo de los jefes anteriores.

## Caminatas completas v1
`public/assets/walks/` contiene 26 láminas originales PNG y sus WebP sin pérdida; seis poses completas por lámina (156 cuadros). Generadas mediante la herramienta integrada image_gen con fondo transparente y los atlas existentes como referencia de identidad. Las especificaciones y prompts completos por ID están en `docs/arte/prompts/walk-art-prompts.json`. `docs/arte/auditorias/walk-art-audit.json` registra tamaño, SHA-256 y verificación de igualdad exacta RGBA tras codificar WebP. El build omite los PNG duplicados y sirve los WebP. Son imágenes nuevas; los atlas de reposo, ataque y muerte originales se conservan. El runtime aísla figuras completas para evitar que una celda corte manos, pies o plumas.

## Minijefes de superficie
`public/assets/minibosses/{fiscalizador,paloma,huaco}-v1.png`: cuatro poses transparentes por personaje, generadas con la herramienta integrada image_gen. Prompts completos y procedencia en `public/assets/minibosses/prompts.json`. El motor aísla cada figura por alfa; conserva el sprite entero para reposo, marcha, ataque y derrota.





### Sideral · Despertar del Lagarto Q
Arte exclusivo `public/assets/cards/sideral-lagarto-ultimate-fullart-v1.webp`, con PNG fuente y `.prompt.txt` reproducible en la misma carpeta. Generado con imagegen integrado; estilo pixel art detallado, Lima nocturna, transformación reptiliana, auriculares, camiseta roja y aliento verde. Mantiene el marco y formato vertical de las otras cartas. El build excluye automáticamente el PNG cuando existe WebP y excluye los prompts.

### Sideral · cartas del arsenal
Las seis ilustraciones de Mirada, Colazo, Huevo y sus evoluciones viven en `public/assets/cards/sideral-*-fullart-v1.{png,webp}`. Cada una conserva un `.prompt.txt` reproducible. Los PNG 1024×1536 son maestros; los WebP de ejecución usan calidad 10 porque se muestran dentro de una carta pequeña y el paquete completo debe respetar el límite real de 64 MiB. La revisión visual a resolución completa conserva silueta, color y acción. Solo los WebP se conectan por `P.UI.upgradeArt`; el build y sus pruebas impiden distribuir maestros o prompts y verifican que las seis copias de ejecución lleguen íntegras.

### Marciano · arsenal, Q y dominio
Ocho fuentes `marciano-*-fullart-v1.png` cubren Polvito cósmico, Caja decomisada, Reflector del operativo, sus tres evoluciones, Treinta intervenidos Q y Disco-Bar Manhattan R. Fueron generadas con image_gen y revisadas visualmente; cada fuente conserva un `.prompt.txt` con modo y restricciones de identidad. Los maestros son 1024×1536. El runtime usa WebP 288×432 de calidad baja controlada porque estas ilustraciones se muestran dentro de cartas y el paquete debe permanecer bajo 64 MiB. Regeneración selectiva: `python scripts/optimize-assets.py --quality 5 --max-width 288 --max-height 432 --only <ocho PNG>`. El full art general del Marciano conserva su maestro y usa una copia 512×768 calidad 30 para el visor.
