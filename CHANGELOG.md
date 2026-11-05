# HUD configurable: buffs y avisos sobre el personaje, objetos laterales y ping — 2026-11-02
- Los buffs y debuffs con duración (escudo, veneno, ralentización…) se ven como iconos pequeños encima de la cabeza del jugador, con una barra de tiempo restante; máximo 5 y «+N».
- Los avisos de evento y botín («Barril de dinamita…», recompensas) salen como texto flotante breve sobre el personaje en vez de arriba a la izquierda; sin movimiento con movimiento reducido.
- Los objetos pasan a una barra vertical en el borde de la pantalla. Opciones › Juego › «Barra de objetos: Derecha / Izquierda» (por defecto Derecha).
- Opciones › Gráficos separa «Mostrar FPS» de «Mostrar ping y pérdida de paquetes». El indicador junto al reloj muestra `PING 42 ms · PÉRDIDA 0 %` en cooperativo; la pérdida es el % de snapshots que no llegaron a tiempo en los últimos 5 s (`P.NetMeter`), no pérdida TCP real.
- Portadores y llaves raras/legendarias con tiempo límite: 45 s el raro y 60 s el legendario; la llave hereda el tiempo restante del portador (mínimo 12 s). Si expiran, desaparecen sin soltar llave.
- Nueva brújula junto al personaje (aguja de rareza, anillo de tiempo, segundos y distancia) que sustituye al texto «→ Portador raro · 440 m»: verde, amarillo, naranja y rosa según el tiempo, tiembla y late en los últimos 10 s y estalla en fragmentos al expirar; el objeto se desintegra en polvo. Con movimiento reducido solo cambia de color y parpadea el número.

# Logo de imagen y nueva frase de bienvenida — 2026-11-02
- El logo de imagen es 3D de verdad: extrusión CSS 3D con 10 copias decorativas (`aria-hidden`) de la misma imagen detrás de la cara frontal, a `translateZ` creciente (22 px de profundidad en la bienvenida, 9 px en el hub) y cada vez más oscuras (`brightness`); la cabecera no tiene extrusión; con movimiento reducido el logo queda plano. El balanceo sube a rotateY ±24° / rotateX ±9° (seguimiento ±32° / ±14°) para que se vea el canto.
- Tipografía unificada con la del logo: `Luckiest Guy` sustituye a `Bungee` en títulos, botones, reloj y números (`--fuente-titulo`) y `Nunito` 700/800 sustituye a `Pixelify Sans` en los textos (`--fuente-texto`); los títulos de 11 px suben a 12 px. El canvas sigue con la fuente del sistema (`monospace`), no usaba Bungee.
- Hub: la casilla de mascota vuelve a ir en la misma fila que las tres de la mochila (4 columnas en escritorio y móvil, la etiqueta puede partirse en 2 líneas) y la compactación de poca altura empieza en 800 px para cubrir 1366x768.
- Hub de escritorio con poca altura (≤ 740 px y ≤ 680 px): la tarjeta central se compacta (logo, escenario, tabs, ranuras de mochila) y la zona sobre JUGAR hace scroll si aún no cabe, así JUGAR ya no tapa «MOCHILA» ni la frase de modo.
- El logo de imagen se mueve como el título de Super Mario 64 (`P.Wordmark.start` en `src/ui/lobby.js`): balanceo 3D (rotateY ±18°, rotateX ±7°, rotateZ ±2°; periodos 3,1 / 4,3 / 5,3 s), inclinación hacia el puntero con muelle (hasta 25°/12°, vuelve al balanceo a los 1,5 s), aplastamiento con rebote al tocarlo y entrada girando 360° en 0,9 s en la bienvenida. En el hub la amplitud baja al 55 % y en la cabecera al 30 %. Solo `transform`/`opacity`; el bucle `requestAnimationFrame` solo corre en el menú con la pestaña visible; con movimiento reducido el logo queda quieto. Un brillo diagonal recorre las letras cada 4,5 s, recortado con la silueta del WebP (`mask-image`).
- La cabecera fija de las demás pantallas (Dibujitos, Jugar, Cooperativo…) usa el logo de imagen (40 px de alto en escritorio, 32 px en móvil) en lugar del wordmark pixel; se elimina el código de letras pixel de `P.Wordmark`.
- Mejoras con 4 ofertas: las cuatro tarjetas tienen la misma altura (300–340 px en escritorio; 156 px por fila en móvil, con desplazamiento dentro del panel) y el nombre ocupa hasta 3 líneas sin recortarse por arriba; la explicación ya no se corta. La línea de tipo dice «NUEVO PODER» (antes «NUEVA PODER» por una expresión regular con `s*` en vez de `s*`).
- El logo «KICK PERÚ · ALL STARS» entregado por el dueño del proyecto sustituye al wordmark pixel en la bienvenida, el título del hub y el menú legado (`public/assets/ui/logo-kick-peru-v1.webp`, 680x340, 78 KB; fondo negro eliminado y recortado). El header conserva el wordmark pixel en línea porque la imagen no se lee a 14–20 px.
- La bienvenida dice «Sobrevive con tu parásito de la sociedad.».
- El tope del paquete en `walk-art` sube de 64 a 72 MiB (el receptor acepta 96) porque el paquete ya estaba a 8 KB del límite; el logo se publica a 680 px.
- El minimapa de escritorio (> 760 px) recupera el tamaño de staging (190x126, abajo a la izquierda) y la pasiva compacta sube a `bottom:196px` para no pisarlo; en móvil sigue compacto (76x52, arriba a la derecha).

# Textos: baneo y dibujitos — 2026-11-02
- Al perder, la pantalla final dice «¡TE BANEARON DEL DISCORD!» (antes «Se cayó el directo.»).
- Los personajes pasan a llamarse «dibujo» / «dibujitos» en todo texto visible: «Elige tu dibujo», «Cambiar dibujo», panel «Dibujitos», «Combo del dibujo», saludos («¡DALE, DIBUJITO!», «¡Juntos, dibujitos!») y nombres de mejoras («Onda dibujo», «Escopeta dibujo», «Lonchera del dibujo», «Plaza de los Dibujitos»). El verbo «causar», las claves de guardado `causas-*`, ids, clases y nombres de assets no cambian.

# HUD mínimo de partida — 2026-11-02
- La vida pasa a una barra pequeña bajo el personaje (rosa sobre pista oscura, segmentada) con el nivel en una chapa amarilla a su lado; la comparten el jugador local y el compañero (`P.PlayerStatus.bar`/`bars`, última pasada del mundo). Sacudida y destello breves al recibir daño, apagados con movimiento reducido.
- Arriba solo quedan la barra de XP cian de 6 px, el reloj con rivales y, junto a pausa y audio, chips de monedas y llaves (la reliquia solo aparece como icono si hay una equipada). Se oculta el bloque de nombre/NV/vida (sigue en el DOM para lectores de pantalla).
- Etapa, hora y clima ya no son paneles fijos: salen 3 s como aviso temporal (`P.HudNotice`, `#hud-notice`) solo cuando cambian. La cuenta atrás del jefe queda en el último minuto.
- Pasiva única y Combo del Causa colapsados a tiras compactas; minimapa más pequeño y translúcido (120x80 en escritorio, 76x52 arriba a la derecha en móvil).
- Dock de escritorio sin cabeceras de color («OBJETOS», «ATAQUES · TECLAS 1–3») y combo encima de la barra de ataques sin pisarla.
- Tarjetas de mejora sin retrato del personaje ni arte de fondo: icono del poder una sola vez y grande, nombre, rareza · tipo, explicación y comparación alineada abajo; en móvil son filas compactas y las tres caben sin scroll.

# Nuevo nombre: KICK PERU: All Stars — 2026-11-02
- El juego pasa a llamarse «KICK PERU: All Stars» en la pestaña del navegador, la pantalla de carga, el header, la bienvenida, el hub, la cuenta, el perfil y las docs vivas. Las claves `perusurvivor-*` de los guardados, el nombre del repo y los dominios no cambian.
- Logotipo de letras pixel en bloque dibujado en SVG (`P.Wordmark`): «KICK PERU» en verde `#53fc18` y «ALL STARS» en hueso, con variantes apilada (bienvenida), compacta (hub) y en línea (header).
- El pie legal indica que el juego no está afiliado con Kick ni otras marcas.

# Interfaz: rediseño «afiche chicha» — 2026-11-01
- Nuevo sistema visual inspirado en los afiches chicha (documentado en `DESIGN.md`): fondo negro plano, bloques de color fosforescente por función (amarillo acción principal, rosa peligro y gacha, verde cooperativo, cian información, naranja énfasis), títulos en Bungee con contornos de colores y texto en Pixelify Sans.
- Fuera los paneles redondeados con vidrio, brillos y degradados, las etiquetas encima de los títulos y los números de sección.
- Iconos pixel dibujados en SVG (`P.Icons`) en lugar de caracteres Unicode y emoji: navegación del hub, audio, monedas, llaves, pausa, Wiki, diálogos y clima.
- Hub y bienvenida: título con contornos chicha, JUGAR en bloque amarillo, rieles con icono de color por función y pie legal discreto.
- HUD de partida: barra de vida rosa y de XP cian segmentadas, reloj grande, contadores con icono y paneles de pasiva, combo, objetos y ataques planos con franja de color.
- Modal de mejora, pantalla final, botín, vendedor, Opciones, diálogos y barra de jefe con el mismo sistema; los deslizadores de Opciones muestran su valor y «Silenciar todo» pasa a botón secundario.

# Daño legible, críticos diferenciados y DPS — 2026-11-02
- Los números normales ganan tamaño, peso y contorno oscuro; el daño físico permanece dorado y el especial usa cian.
- Los críticos muestran `CRÍT.`, crecen y cambian a rojo coral o magenta según su tipo, con una etiqueta física/especial.
- El panel opcional de FPS y ping incorpora DPS móvil de 2 segundos y el pico de la partida usando daño efectivo, sin contar sobre-daño.

# Campanillas de experiencia a volumen 120 — 2026-11-02
- La campanilla parte en 0,09 y alcanza un máximo estricto de 0,12 al subir la escala, quedando por encima de la mezcla musical sin cambiar otros efectos.
- El intervalo mínimo entre sonidos y el límite de voces siguen activos para impedir saturación al absorber grupos grandes.

# Mayor presencia para las campanillas de experiencia — 2026-11-02
- La fundamental de las gemas sube aproximadamente 75 % y el armónico gana presencia, sin modificar el volumen de los demás efectos.
- El límite máximo se mantiene en 0,06 para evitar distorsión cuando muchas gemas entran al imán a la vez.

# Gemas de experiencia compactas y campanillas ascendentes — 2026-11-02
- Las gemas de experiencia se dibujan 16 % más pequeñas y con un resplandor más contenido, sin reducir su alcance de imán ni su área de recogida.
- Cada recogida encadenada avanza por una escala pentatónica aguda con timbre de campanilla; la escala se reinicia tras medio segundo sin recoger experiencia.
- El sonido conserva un límite de frecuencia y de voces para que una acumulación de gemas no tape la música ni sature el audio.

# Huevo caricaturesco y defensa física de Sideral — 2026-11-02
- El huevo de la Q usa un atlas caricaturesco de contornos suaves, volumen redondeado y ocho cuadros de rodamiento, impacto y rotura; deja atrás el acabado pixelado por bloques.
- Durante los cuatro segundos de huevo rodante, Sideral se mueve 25 % más rápido y bloquea todo daño físico. El daño especial continúa entrando y el beneficio termina antes de la eclosión.
- La carta Q y la documentación explican la nueva defensa; el bloqueo muestra «CASCARÓN» sin conceder invulnerabilidad general.

# Identidad base restaurada en Mirada Sideral — 2026-11-02
- Los atlas de Mirada quieta y caminando vuelven al modelo visual exacto de `sideral-ur-v1`: rostro sin barba, proporciones redondeadas, mismo cabello, gafas, ropa, zapatillas y lata.
- Se conservan la nitidez, los ocho cuadros y el movimiento de piernas de la remasterización; no cambia ninguna regla de combate.

# Remaster pixel art de Mirada y Huevo de Sideral — 2026-11-02
- Mirada Sideral reemplaza sus dos atlas borrosos por figuras completas de alta definición pixelada, tanto quieto como caminando, con ocho cuadros compatibles con el gesto existente.
- Huevo sospechoso y la entrada de la Q usan un huevo redibujado con contorno oscuro, manchas legibles y cuadros propios de giro, impacto, rotura y apertura.
- Los recursos anteriores se conservan como historial; no cambian daño, tiempos, alcance, colisiones ni balance.

# Nitidez de los ataques de Sideral — 2026-11-02
- Mirada, huevo, transformación y Lagarto desactivan el suavizado de imagen y dibujan sus cuadros en coordenadas y dimensiones enteras.
- El cambio conserva tamaño, animación, daño y colisiones; evita que los sprites pierdan el borde pixel-art al atacar o al cambiar el zoom.
- Una prueba de render impide reactivar accidentalmente el suavizado en estas figuras.

# Interfaz: legibilidad, HUD móvil y accesibilidad — 2026-11-01
- HUD en móvil (≤760 px): vitales, monedas, etapa, pasiva, combo, cartas Q/R, objetos y ataques ya no se pisan y el centro queda libre; el minimapa pasa arriba a la derecha en tamaño compacto y en pantallas táctiles se oculta «Teclas 1-3».
- El modal de mejora y la pantalla final quedan por encima del dock de objetos y ataques.
- El panel de FPS/ping viene apagado por defecto; se activa en Opciones o con `?profile`.
- Ningún texto de menús ni HUD baja de 11 px (había textos de 6 a 9 px).
- «Texto grande» y «Contraste alto» de Opciones > Accesibilidad ahora afectan al HUD y a los menús, no solo al panel de Opciones.
- Pantalla final: velo detrás, «Otra partida» como botón primario y las monedas ganadas como texto, no como botón.
- Escape cierra Opciones.
- Móvil: pestañas Solo/Cooperativo, mochila, ajustes y audio miden al menos 44 px, y JUGAR queda fijo abajo en el hub.
- Hub: se quita el rótulo «PERÚSURVIVOR · Edición Perú» (el nombre es «Causas del Caos») y en móvil se oculta el logo superior junto al título.
- Mejora: «Elige una mejora» aparece una sola vez y las etiquetas de rareza son más grandes y legibles.

# Claridad e impacto visual del combate — 2026-11-01
- Los golpes físicos usan cortes cálidos y las técnicas especiales anillos, partículas y estelas luminosas; los críticos tienen una ráfaga mayor y una micro-sacudida acotada.
- La resistencia parcial de minions pesados y escudos tácticos muestra un arco azul con `BLOQ.` sin modificar el daño ni los tiempos de protección.
- Los proyectiles físicos y especiales reciben estelas diferentes y el fogonazo del arma añade rayos direccionales y humo breve desde la punta correcta.
- Los avisos de ataques de minions ganan borde oscuro, relleno progresivo y un reloj de carga. La geometría sigue siendo la misma que usa la colisión.
- Movimiento reducido limita partículas y puntos de estela; no elimina áreas, dirección ni tiempo de los avisos.

# Correcciones detectadas al documentar el vault — 2026-10-31
- Evoluciones de Fuzo y Paloma: el texto cuenta los rivales que realmente atraviesan (diez y cuatro; incluye los 2 que suma toda evolución). Sin cambio de balance.
- Puesto de emoliente: el aviso dice «recuperas 35% de vida máxima», que es lo que hace (cura; no sube el máximo).
- README: los compañeros con atlas de reacciones en el dominio de Makanaky son 17 (no 18); la fila `cerdito` del atlas es un alias, y Sideral, Chamelín y Marciano usan el dibujo de respaldo.
- Cooperativo: el servidor toma los personajes gratuitos de `P.Meta.blank()` (la misma lista que el cliente); una cuenta sin guardado ya puede entrar con Sideral.
- Cooperativo: la R del Marciano se envía al llenarse su carga de dominio (antes el cliente miraba la carga de la Q y la R no salía).
- Cooperativo en Caos: vencer al jefe del portal cambia de bioma y cuenta la ventana igual que en solitario (`Encounters.leave` compartido); antes el portal se reabría y el dúo volvía a entrar.
- Auditoría de assets en ejecución: solo `kingteka-gallinazo-attack-v1.webp` y `cerdito-gallinazo-attack-v1.webp` se publican sin uso (documentados en `vault/arquitectura/build.md`, no borrados).
- Protocolo 3: el test de tamaño exige que el snapshot adelgazado pese menos del 45 % del original (medido: 251,7 → 84,2 KB, 33 %).

# Cooperativo: tiempo límite para elegir y daño visible — 2026-10-31
- Las elecciones de equipo (subida de nivel, cofres, portales, Extinción) tienen 15 s de tiempo de simulación; al vencer, el servidor elige por quien no respondió (la opción segura de cada tipo) y la partida sigue. El plazo se congela mientras un compañero se reconecta.
- La pantalla de elección muestra «Se elige solo en N s» o «Esperando a tu compañero · N s», resaltado en los últimos 5 s y sin pulso con movimiento reducido.
- La viñeta y el sonido de daño ahora se disparan en cooperativo: el jugador se identifica por `slot` porque cada snapshot reemplaza su objeto.

# Servidor: borde de red, cooperativo y protocolo 3 — 2026-10-31
- Los límites de intentos usan la IP real del cliente (`X-Real-IP` solo desde proxies de `TRUSTED_PROXIES`); nginx envía ese encabezado en `/api/` y `/coop`.
- Los cuerpos lentos se cortan a los `BODY_TIMEOUT_MS` (408) y la ranura de scrypt se ocupa solo tras leerlos.
- Cooperativo: cierra sockets que inundan mensajes, agrupa los snapshots de actividad en el siguiente tick, limita salas por IP (`MAX_ROOMS_PER_IP`) y caduca lobbies sin iniciar (`LOBBY_IDLE_MS`); con sesión iniciada `guest:true` ya no salta la propiedad de personajes.
- Servidor de desarrollo: `nosniff`, tipo desconocido como `application/octet-stream`, `/backend` bloqueado y sin caída si un archivo desaparece.
- El backup diario registra inicio y código de salida en `/var/log/perusurvivor-backup.log`.
- Protocolo cooperativo 3: el snapshot omite campos que solo usa la simulación (balance de enemigos, estadísticas por defecto, campos internos de disparos); con 160 enemigos baja de 263 KB a 95 KB y la codificación de 2,1 a 1,1 ms.
- Un guardado que el servidor rechaza (400/422) deja de reintentarse y avisa conservando la copia local.

# Guardados: validación en el servidor, migraciones y copia local — 2026-10-31
- `PUT /api/save` pasa el progreso por `P.Meta.normalize` (las reglas del cliente) y guarda el resultado normalizado; lo malformado se rechaza con 400, también sin `giftSync`. Nuevo `backend/save-checks.cjs`: frente al guardado anterior se rechaza (422) `earned` a la baja o por encima de partidas y tiempo, `wallet` por encima de lo ganado más reembolsos, y personajes o skins sin tiradas o concesión admin que los expliquen. La primera sincronización (importación de invitado) solo recorta lo imposible y lo registra.
- `meta-progress.js`: las migraciones son una cadena `MIGRATE[v]` hasta `CURRENT` aplicada antes de validar; el resultado de los guardados v1..v5 no cambia y las versiones más nuevas se siguen rechazando.
- La transacción local conserva el valor anterior en `<clave>-bak`; si el principal está dañado se recupera esa copia con un aviso que no bloquea.

# Sensación de combate e IA de enemigos — 2026-10-31
- Cooperativo: cada enemigo mantiene su objetivo salvo que otro jugador esté claramente más cerca (histéresis 0,75×); el daño de eventos de mapa acredita al tirador real (`P.Attributes.owner`).
- Los minions se separan entre sí en vez de avanzar en fila y se deslizan al quedar atascados contra una pared; los enemigos ocupados se cuentan una vez por tick.
- `P.Juice`: sacudida central con trauma que decae, tope en pantalla, compensación de zoom y sin sacudida con movimiento reducido; la sacudida de la ulti se desvanece en vez de cortarse.
- Derrotar jefes y minijefes suma sacudida, chispas y un destello suave; la victoria del encuentro ya no borra esa explosión.
- Los efectos importantes (gritos, muertes, críticos) tienen prioridad sobre los golpes rutinarios; los números de daño se acumulan por enemigo y los críticos se ven más grandes y cálidos.
- Recoger experiencia suena con un tic ascendente y la barra de XP pulsa; ambos respetan silencio y movimiento reducido.
- Costo medido de la separación y los atascos: +0,3 ms por tick con 80 enemigos y +1 a 1,3 ms con 160.

# Rendimiento de la lógica del juego — 2026-10-31
- Nuevo `scripts/benchmark-game.cjs`: simulación real y determinista (solo 80/160 y cooperativo 160 enemigos) con ms por tick, llamadas, GC y costo del snapshot.
- Los enemigos reutilizan su dirección hasta ~0,15 s y solo recalculan la línea de visión al cambiar de objetivo, moverse más de 48 px, acercarse a menos de 100 px o cambiar el terreno; el mapa actual y las colisiones usan índices cacheados y claves numéricas.
- `Stats.step` limita las estadísticas en el sitio sin copiar objetos en cada tick.
- El servidor codifica los snapshots sin replacer por clave, con salida idéntica byte a byte.
- Mediana por tick medida: solo 80 enemigos 17,0 → 5,7 ms, solo 160 31,7 → 10,2 ms, cooperativo 160 30,8 → 11,3 ms; eventos de GC entre 3 y 4 veces menos.

# Cooperativo, guardado y movimiento reducido — 2026-10-31
- Cliente y servidor comparten el paso de cada enemigo (`P.Systems.stepEnemy`): en cooperativo vuelven el aviso del jefe final y su evento al 50 %, el aturdimiento de Makanaky detiene ataques y contacto, y el Gallinazo no golpea por contacto en la fase lunar.
- Un personaje o skin retirado ya no invalida el guardado: los identificadores desconocidos se descartan con aviso en consola; los datos corruptos siguen rechazándose.
- La sincronización de cuenta solo entra en conflicto ante un 409 real; los errores de red reintentan con espera creciente y al recuperar conexión, y una subida que sí llegó se reconcilia sin diálogo.
- La opción «Movimiento reducido» del juego también rige el canvas (`P.Motion.reduced()`): sin sacudida de dominio, destellos atenuados y parpadeo de invulnerabilidad estable.
- Recibir daño suena y muestra una viñeta roja breve proporcional al daño, también en cooperativo.

# Normalización de Kingteka y Cerdito VTuber — 2026-10-28
- Kingteka queda registrado como `UR · Supremo`, de acuerdo con la ficha publicada.
- Cerdito VTuber se declara como versión/skin de Kingteka y deja de ocupar una invocación SR independiente.
- Desbloqueo, rareza, copias y estrellas se resuelven mediante la identidad canónica de Kingteka sin invalidar guardados antiguos.
- El README documenta esta regla para futuras versiones de personajes.

# Ajuste del frente de las cartas ilustradas — 2026-10-26
- La cara de la carta vuelve a ocupar todo el marco al revelarse; la ilustración y los datos ya no quedan comprimidos arriba.
- Conserva el giro, el arte completo y las placas de información.

# Cambios

## Tarjetas de ulti y expansión de dominio en el HUD — 2026-10-26
- Separa Q (ulti) y R (expansión de dominio) en tarjetas compactas a la derecha de las armas; los objetos quedan a la izquierda.
- Las tarjetas suben para mostrar su arte al pasar el cursor o recibir foco; en pantallas táctiles se mantienen accesibles.
- Makanaky y Sideral muestran el dominio en R y un espacio Q gris reservado mientras no tengan ulti propia.
- Registra los controles y la distribución del HUD implementados.


## Iconos de objetos como arte de carta — 2026-10-26
- Las cartas de Blink Dagger, Magic Stick y demás objetos muestran su logo centrado como imagen principal, sin repetir el sprite del personaje.
- Las cartas de poderes y armas conservan sus escenas ilustradas.


## Cartas full art de Kingteka — 2026-10-26
- Reemplaza la franja pequeña por ilustraciones pixel art que llenan el frente, con poses distintas para escopeta, Gallinazo y golpe cuerpo a cuerpo.
- Superpone rareza, nombre, efecto y comparación en una placa legible; conserva el giro y los destellos por rareza.
- Añade PNG fuente, WebP lossless de runtime, prompts y manifiesto de optimización actualizado.

## Cartas ilustradas de Kingteka — 2026-10-26
- Añade viñetas pixel art propias para escopeta, Gallinazo y golpe de cuerpo en las cartas de mejora.
- Reutiliza el sprite cargado del personaje y canvas local; la viñeta solo anima mientras el panel está abierto y respeta movimiento reducido.
- Conserva rareza, efecto y comparación; documentado en README y guía de diseño.

## Catálogo de objetos en el menú — 2026-10-26
- Añade el acceso «Objetos de Dota» al menú Habilidades.
- Presenta objetos y evoluciones con sprites pixel art propios, efectos adaptados, rarezas y niveles de aparición.
- Permite volver a la ficha del personaje o cerrar el menú; no altera la partida ni el inventario.
- Conserva los combos ya desbloqueados entre las tres opciones aunque se mezclen cartas de objetos.

## Objetos de Dota 2 como cartas de equipo — 2026-10-26
- Añade Boots of Speed con cinco evoluciones, Magic Stick → Magic Wand y Blink Dagger con tres ramas.
- Cada partida dispone de cuatro espacios separados del equipo de cofres; las evoluciones sustituyen el objeto base y sus efectos.
- Integra los objetos en las tres cartas reveladas al subir de nivel y muestra el inventario en el HUD.
- Los efectos son adaptaciones propias; no se incorporan al cooperativo en esta primera versión.

## Destellos de rareza al revelar cartas — 2026-10-26
- Rareza rara revela un barrido turquesa, épica uno violeta y legendaria un destello dorado de izquierda a derecha con pulso de marco.
- Los brillos son breves, cosméticos y compatibles con movimiento reducido; no cambian el poder de la mejora.
- Documentadas las señales visuales en README y guía de diseño.

## Cartas revelables al subir de nivel — 2026-10-26
- El menú de progreso presenta tres cartas boca abajo y exige revelar las tres antes de permitir una elección.
- Las cartas comparan habilidad, rango, rareza y efecto; funcionan con ratón, teclado y cooperativo.
- Rareza informa el aspecto y la probabilidad de aparición, sin escalar el poder de la mejora. Los pactos compiten por uno de los tres espacios.
- Añadidas animación/sonido de revelación, presentación adaptable y documentación de las reglas.

## Reorganización del proyecto — 2026-10-25
- Código editable en src/, separado por responsabilidad.
- Recursos originales en public/assets/characters, enemies, maps y audio.
- dist/ pasa a ser una salida generada e ignorada.
- Documento de diseño, arquitectura, procedencia del arte y guía de desarrollo.
- Pruebas de regresión conservadas en tests/, más comprobaciones de compilación y HTTP.
- GitHub Actions para Node 22/24 en Linux y Windows.
- Conservados los portales y el terreno ya presentes al iniciar la reorganización.
- Sin cambios en balance, controles, gráficos, reglas ni guardado del juego.

## Jefes animados y escenas del portal
- Atlas original de tres jefes y seis poses por jefe, con anticipación y recuperación sincronizadas.
- Tres escenarios completos y exclusivos para los encuentros, con límites propios.
- Regreso al mapa de origen y cámara vertical compatible con móvil.
- Pruebas de selección de escena, exclusión del mapa anterior y fases de animación.
