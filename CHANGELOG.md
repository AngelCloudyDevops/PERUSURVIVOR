# Ajuste del frente de las cartas ilustradas — 2026-10-26
- La cara de la carta vuelve a ocupar todo el marco al revelarse; la ilustración y los datos ya no quedan comprimidos arriba.
- Conserva el giro, el arte completo y las placas de información.

# Cambios

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
