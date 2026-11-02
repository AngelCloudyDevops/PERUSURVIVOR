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
| Títulos, botones grandes, números del HUD | `Bungee` (Google Fonts) | Letra de rótulo urbano; en títulos lleva contornos chicha con `text-shadow` apilado (salvo el logotipo del juego, que es un wordmark pixel plano) |
| Texto corrido, etiquetas, descripciones | `Pixelify Sans` (Google Fonts) | Mínimo 12 px; con tildes y ñ |
| Datos tabulares (tiempos, contadores) | `Pixelify Sans` con `font-variant-numeric:tabular-nums` | |

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
- **Botón principal:** bloque amarillo, texto negro en Bungee, sin borde; al pasar o enfocar,
  franja inferior de 4 px en rosa. Deshabilitado: tinta con texto gris.
- **Botón secundario:** fondo tinta, texto hueso, franja inferior del color de su función.
- **Panel:** fondo negro plano; la cabecera es una franja de color de lado a lado con el título
  en negro.
- **Foco de teclado:** contorno de 3 px amarillo con 2 px de separación, visible en todo fondo.
- **Táctil:** objetivos de 44 px como mínimo.

## Movimiento
Un solo momento por pantalla (p. ej. el título entra con los contornos desplazándose). Con
`prefers-reduced-motion` o `P.Motion.reduced()` el estado final aparece sin animación.
