# Cambios

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
