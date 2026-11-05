# Diseño de interfaz: «afiche chicha»

La interfaz en DOM (menús, hub, HUD, modales) imita los afiches chicha de Lima: fondo negro,
bloques planos de color fosforescente y letras de bloque con contornos de colores superpuestos.
El mundo del juego es pixel art; la interfaz lo acompaña con una fuente pixel para el texto
corrido y una fuente de rótulo para los títulos.

## Principios
- **Plano e impreso.** Nada de vidrio, desenfoque, brillos, degradados decorativos ni sombras
  difusas. La profundidad la dan franjas de color y contornos, como en una serigrafía.
- **Color por función, no por adorno.** Cada color dice qué hace el elemento (ver tabla).
- **Bloques, no tarjetas.** Esquinas rectas (`border-radius:0`). Separación por bloques de color
  o por espacio, no por bordes finos de 1 px.
- **Sin etiquetas encima de los títulos** ni números de sección. El título se basta solo.
- **Iconos dibujados** (SVG pixel, un solo grosor), nunca caracteres Unicode ni emoji.

## Tipografía
| Uso | Fuente | Notas |
|---|---|---|
| Títulos, botones grandes, números del HUD | `Luckiest Guy` (Google Fonts, `--fuente-titulo`) | Letra de rótulo de dibujos animados, solo mayúsculas visuales, un único peso (400); mínimo 12 px; igual que el título del logo |
| Texto corrido, etiquetas, descripciones | `Nunito` 700/800 (Google Fonts, `--fuente-texto`) | Mínimo 12 px; con tildes y ñ; 800 para etiquetas pequeñas |
| Datos tabulares (tiempos, contadores) | `Nunito` con `font-variant-numeric:tabular-nums` | |
| Textos del canvas (daño, rótulos, jefes, cartas) | `P.Font.title(px)` = Luckiest Guy; `P.Font.text(px)` = Nunito 800 para frases largas | Las mismas fuentes que la interfaz; el canvas pinta con el respaldo hasta que carguen |

El título del juego es un SVG de bloques (`P.Wordmark` en `src/ui/lobby.js`): KICK y PERU en `--kick-verde`, ALL STARS en hueso, sin contorno ni sombra.

Sin `monospace` genérico, sin Barlow ni DM Sans en la interfaz rediseñada.

## Paleta (`:root`)
| Token | Valor | Función |
|---|---|---|
| `--chicha-negro` | `#0c0a10` | Fondo de paneles |
| `--chicha-tinta` | `#1b1622` | Fondo secundario, pistas vacías |
| `--chicha-hueso` | `#fff4dc` | Texto principal |
| `--chicha-gris` | `#b9adc4` | Texto secundario (≥4.5:1 sobre negro) |
| `--chicha-amarillo` | `#ffe02e` | Acción principal (JUGAR, confirmar) |
| `--chicha-rosa` | `#ff2e88` | Peligro, vida, gacha |
| `--chicha-verde` | `#2ee86a` | Cooperativo, éxito, curación |
| `--chicha-naranja` | `#ff7a1a` | Énfasis, rareza rara, avisos |
| `--chicha-cian` | `#2ed6ff` | Información, XP, enlaces |
| `--kick-verde` | `#53fc18` | Color de marca, solo para el logotipo «KICK PERU» (`P.Wordmark`); plano, sin contorno ni sombra |

Texto sobre bloques de color: siempre `--chicha-negro`.

## Componentes
- **Botón principal:** bloque amarillo, texto negro en Luckiest Guy, sin borde; al pasar o enfocar,
  franja inferior de 4 px en rosa. Deshabilitado: tinta con texto gris.
- **Botón secundario:** fondo tinta, texto hueso, franja inferior del color de su función.
- **Panel:** fondo negro plano; la cabecera es una franja de color de lado a lado con el título
  en negro.
- **Foco de teclado:** contorno de 3 px amarillo con 2 px de separación, visible en todo fondo.
- **Táctil:** objetivos de 44 px como mínimo.

## Movimiento
Un solo momento por pantalla (p. ej. el título entra con los contornos desplazándose). Con
`prefers-reduced-motion` o `P.Motion.reduced()` el estado final aparece sin animación.

## Estilo logo (arcade-cartoon 3D) — sistema vigente para recompensas y títulos
Sustituye al estilo plano «afiche chicha» descrito arriba: ya lo usan las pantallas de `#overlay` (mejora, fin de partida, botín y tienda), la fase A (menús, hub, paneles y diálogos) y la fase B (HUD de partida y textos del canvas). Referencia: el logo de inicio (Luckiest Guy gruesa, contorno oscuro, degradado vertical, extrusión hacia abajo, brillo superior y estrellas doradas).

Tokens (`:root` al final de `src/ui/styles.css`): `--logo-oro-1/-2`, `--logo-naranja`, `--logo-borde` (marrón rojizo), `--logo-oro-canto`, `--logo-verde-1/-2/-borde/-canto`, `--logo-violeta-1/-2/-borde/-canto`, `--logo-panel`, `--logo-panel-2`, `--logo-panel-borde`, `--logo-estrella` y `--logo-estrella-img` (SVG de estrella).

Clases reutilizables:
- `.logo-text` (+ `.logo-text--verde`): degradado recortado al texto, `-webkit-text-stroke` de .1em y extrusión con `drop-shadow` apilado (no `text-shadow`, que taparía el relleno transparente). Respaldo de color sólido sin `background-clip:text`. En `#overlay` todos los `h2` ya lo llevan.
- `.logo-panel`: esquinas de 20 px, borde de 4 px oscuro, degradado vertical, bisel interior y sombra sólida de caída. `#overlay` lo aplica directamente.
- `.logo-btn` (+ `--oro`, `--verde`; por defecto violeta): cara con degradado, canto sólido de 5 px que se hunde al pulsar, foco visible blanco. En `#overlay` lo heredan `.upgrade-primary` (oro), `.upgrade-auxiliary` y `.merchant-close` (violeta), `.merchant-buy` y `.loot-option-pick` (oro).
- `.logo-star`: estrella SVG con destello suave (solo `transform`); quieta con movimiento reducido.

Títulos de la fase A (paneles, diálogos, nombre del hub): relleno dorado sólido (`#ffd84a`) con `-webkit-text-stroke` marrón y extrusión con `drop-shadow`, sin `background-clip:text`, que otras reglas de fondo podían anular dejando solo el contorno. El degradado queda solo en `#overlay` (mejora, fin de partida).

Fase A (menús, aplicada): bloque `/* Estilo logo · menús (fase A) */` al final de `src/ui/styles.css`. Pantallas: bienvenida (`#lobby-splash`: Iniciar sesión oro, Crear cuenta verde, invitado violeta); hub (barra superior, rieles con medallón de color de función, tarjeta central, pestañas Solo/Cooperativo, mochila, «CAMBIAR DIBUJO», JUGAR oro con texto 3D, Discord/Apóyame/Ayuda y Herramientas); cabecera fija (audio como botón pequeño); carcasa de `.reference-panel` y `.lobby-pane` (panel morado, título 3D sin franja, volver redondo, raíles y pestañas como píldoras, tarjetas internas con marco del color de rareza/función, interruptores y deslizadores de Opciones); diálogos de cuenta, social, administración y balance. Los botones se generan con variables `--btn-*` (violeta por defecto; oro y verde por selector); texto blanco solo sobre violeta oscuro (`--m-v1/--m-v2`, contraste ≥ 4,5:1) y texto oscuro sobre oro/verde. Movimiento reducido: las variables `--press`, `--lift` y `--tr` se anulan (sin hundido, elevación ni transiciones). Pendiente de restilizar: contenido interno de administración y balance, `#inbox-dialog`, `#profile-dialog`, `.cause-collectible-card` (tiene inclinación 3D propia) y el botón de pausa de la cabecera.

Logo 3D real (bienvenida y título del hub, `src/ui/logo-3d.js`): sustituye a la extrusión CSS por geometría three.js. «KICK PERÚ» en verde lima (degradado vertical, laterales y bisel verde oscuro) y «ALL STARS» más grande debajo en dorado→naranja (laterales rojo-marrón), letras extruidas con bisel redondeado y contorno oscuro (segunda extrusión mayor detrás), estrellas doradas extruidas con destellos aditivos. Luz de relleno hemisférica, luz principal arriba-izquierda y luz de contorno cálida. Se anima con los mismos parámetros que `P.Wordmark.motion` (balanceo, seguimiento del puntero con muelle, rebote al clic, entrada girando); el bucle solo corre en el menú, con la pestaña visible y el logo en pantalla. Sin WebGL, sin three.js o con movimiento reducido (una sola imagen estática 3D) queda la imagen. La cabecera pequeña sigue con la imagen.

Tarjetas de mejora: marco con degradado del color de rareza (común gris-lila, rara cian, épica rosa/morado, legendaria dorada), medallón redondo con aro dorado para el icono, chapa dorada de tecla, nombre blanco con contorno, rareza en píldora, comparación en píldora dorada y sello verde «NUEVO». Al pasar o enfocar se elevan y brillan (sin elevación con movimiento reducido). Texto mínimo 12 px.

Fase B (HUD de partida, aplicada): bloque «Estilo logo · HUD de partida» al final de `src/ui/styles.css`. Solo cambia el aspecto, no posiciones ni tamaños: el grosor del borde sale de sombras (`--hud-aro` exterior, `--hud-bisel` e insets interiores). Reloj y rivales en píldora oscura con cifras 3D doradas; XP con relleno cian a lima y brillo; chip de monedas, audio y ping en píldoras; pausa redonda violeta; objetos, pasiva, combo, ataques, apoyo, burlas y aviso en paneles cartoon con casillas degradadas (activo dorado) y chapas de tecla como monedas doradas; las cartas Q/R conservan su arte con marco marrón. Los marcos ilustrados de Sideral (pasiva y cartas de ataque) no se tocan. Canvas: chapa de nivel dorada y barra de vida rosa con degradado y brillo (`P.PlayerStatus.grad`, degradados en caché), brújula con aro dorado y avisos flotantes con contorno marrón.
