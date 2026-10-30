# Contrato visual de personajes

Este contrato define cuándo un personaje puede considerarse **visualmente completo**. Kingteka es la referencia de cobertura; no obliga a copiar su estética, sino su claridad, cantidad de estados y conexión real con el juego.

## Lista obligatoria

1. **Identidad:** full art principal, paleta reconocible y una referencia estable de rostro, cuerpo, ropa y accesorios. La apariencia no puede cambiar accidentalmente entre cartas.
2. **Movimiento:** reposo y caminata legibles en las direcciones usadas por el juego. Los pies comparten ancla y escala; ningún cuadro hace crecer o encoger el cuerpo.
3. **Tres ataques:** cada técnica muestra preparación, ejecución e impacto. Si cambia arma, postura o silueta, usa una secuencia propia; una estela genérica no reemplaza esa lectura.
4. **Tres evoluciones:** conservan el ataque de origen y añaden una diferencia visual que comunica su cambio mecánico: geometría, cantidad, alcance, control o prioridad.
5. **Pasiva:** el estado, sus acumulaciones y el momento de consumo se reconocen en el actor o HUD sin depender solo del color.
6. **Ulti Q:** carta full art cuando cambia identidad o forma, además de entrada, estado activo y salida. No mueve la cámara salvo que su diseño aprobado sea cinematográfico.
7. **Dominio R:** carta, presentación, escenario, señales de peligro y salida segura. El modo dinámico conserva cámara, coordenadas y combate según la regla general de dominios.
8. **Daño y derrota:** como objetivo final, tres cuadros de impacto y tres de caída completos, anclados a los pies y sin alterar invulnerabilidad o resolución.
9. **Cartas de arsenal:** una técnica distintiva recibe full art propio; su evolución recibe otro cuando cambia el patrón o identidad. `P.UI.upgradeArt` conecta cada ID jugable con su WebP.
10. **Accesibilidad y rendimiento:** movimiento reducido conserva información, los avisos coinciden con la colisión y los adornos no ocultan amenazas. El render no decide daño, posiciones ni autoridad cooperativa.

## Entrega de recursos

- Ilustraciones verticales: PNG maestro, WebP de ejecución y `.prompt.txt` reproducible con el mismo nombre y versión.
- El arte no contiene marcos, títulos ni logotipos: la interfaz los compone y localiza.
- El build distribuye WebP y archiva PNG/prompts cuando existe la versión optimizada.
- Los tests verifican presencia, dimensiones, firma, distribución e integración de rutas.
- Un efecto dibujado en canvas cuenta como arte final cuando tiene diseño intencional, fases completas y lectura equivalente a un atlas. No cuenta un placeholder, recolor sin motivo o efecto genérico prestado.

## Criterio de cierre

Un personaje solo pasa a **visual completo** cuando la lista aplicable está conectada al flujo real y probada. `N/A` necesita una razón de diseño escrita; no sirve para ocultar trabajo pendiente. La revisión debe registrar qué está completo y qué falta en la ficha específica del personaje.

Sideral cumple ahora identidad, movimiento, tres ataques y evoluciones con efectos propios, pasiva, Q, R y seis cartas de arsenal. Sus reacciones exclusivas de daño/derrota continúan como mejora visual futura y no se presentan como terminadas.
