# Correcciones detectadas al documentar el vault — 2026-10-31
- Evoluciones de Fuzo y Paloma: el texto cuenta los rivales que realmente atraviesan (diez y cuatro; incluye los 2 que suma toda evolución). Sin cambio de balance.
- Puesto de emoliente: el aviso dice «recuperas 35% de vida máxima», que es lo que hace (cura; no sube el máximo).
- README: los compañeros con atlas de reacciones en el dominio de Makanaky son 17 (no 18); la fila `cerdito` del atlas es un alias, y Sideral, Chamelín y Marciano usan el dibujo de respaldo.
- Cooperativo: el servidor toma los personajes gratuitos de `P.Meta.blank()` (la misma lista que el cliente); una cuenta sin guardado ya puede entrar con Sideral.
- Cooperativo: la R del Marciano se envía al llenarse su carga de dominio (antes el cliente miraba la carga de la Q y la R no salía).

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
