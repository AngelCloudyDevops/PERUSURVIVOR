# Sideral · El Lagarto

Kit funcional 9/9: tres técnicas, tres evoluciones, Sangre fría, Despertar del Lagarto Q y Habitación del Lagarto R. La implementación de R permanece intacta: presentación elegida, duración de 8 s, carga de 35 bajas, inmunidades y retorno existentes.

## Identidad y estadísticas base

UR · Supremo, Humano, Ingenio, Controlador / Especialista, alcance medio, daño híbrido, dificultad avanzada. La transformación no altera su especie de colección. La rareza conserva sus probabilidades y crecimiento existentes, sin bonificación directa al daño.

| Estadística | Base sin progreso |
|---|---:|
| Vida | 120 |
| Velocidad | 195 u/s |
| Daño base | 27 |
| Recogida | 90 u |
| ATQ físico / especial | 95 / 105 |
| DEF física / especial | 100 / 105 |
| Crítico / daño crítico | 0 % / 150 % |
| Regeneración / robo de vida | 0 / 0 % |

Los otros stats avanzados conservan sus valores neutrales. Frente al catálogo anterior solo se ajustan ATQ físico 85 → 95 y ATQ especial 100 → 105 para soportar el arsenal híbrido. No cambian vida, velocidad, poder, defensas, rareza, colección ni dominio. Debilidad: colazo lento, huevo con daño retrasado, aliento vulnerable y sin control duro sobre jefes.

## Técnicas y progresión

Teclas 1/2/3 o botones táctiles cambian la técnica activa, con recuperación de cambio de 0,3 s. Solo la activa dispara automáticamente. La segunda se ofrece desde nivel 2 y la tercera desde nivel 4 mediante cartas; no se desbloquean por consultar la ficha. Cada una tiene cinco rangos independientes: por rango adicional +14 % daño, +5 % alcance y multiplicador 0,96 al intervalo. Los rangos 2–5 exigen nivel 6/8/10/12. Evolución: rango 5 y nivel 14, sin consumir el progreso de las otras técnicas.

| Técnica | Intervalo | Alcance | Daño bruto de rango 1 | Evolución |
|---|---:|---:|---:|---|
| Mirada Sideral | 1,35 s | 270 u, arco 1,55 rad | 27 especial | Rostro prohibido: 340 u, arco 2,05 rad, coeficiente 1,15 y miedo normal de 1,25 s |
| Colazo del Lagarto | 1,65 s | 125 u, arco 135° | 33,75 físico | Latigazo ancestral: 145 u, coeficiente 1,45 y onda estrecha de 280 u, coeficiente 0,65, hasta tres rivales |
| Huevo sospechoso | 2,1 s | 340 u | 44,55 especial por embestida | Nido prohibido: tres lagartitos en abanico, coeficiente 1,2 por impacto; máximo dos impactos por rival y huevo |

Son presupuestos previos a crítico, atributo, defensas y reducciones. Mirada conserva resistencia de 2,5 s al miedo repetido y duración menor en pesados y jefes. El colazo empuja 34 u, o 40 u evolucionado; barrido y onda pueden golpear al mismo rival. Cada lagartito embiste una vez durante 0,38 s a 580 u/s; desaparece después y frena contra sólidos. No hay mascotas permanentes. Al abrir, el huevo elige una sola dirección hacia un rival vivo y visible desde su posición a 240 u, con anticipación limitada a 0,34 s y 260 u/s; la embestida no vuelve a girar. El lanzamiento dura 0,35 s y el huevo espera otros 0,8 s antes de abrir. Máximo tres huevos activos por jugador; los obstáculos limitan el destino. Los impactos respetan cobertura y autoridad del servidor.

## Sangre fría

Cada 2 s con un rival vivo a 300 u obtiene una escama, hasta tres. Alejarse reinicia solo el progreso hacia la siguiente; Q y dominios suspenden la generación. Recibir daño efectivo resta una escama y reinicia el progreso. Daño bloqueado no resta escamas.

Con tres escamas, el siguiente lanzamiento personal válido consume las tres:

- Mirada alcanza a un único rival adicional hasta 70 u más allá del cono normal. La mirada es un cono, por lo que esta extensión sustituye la noción de «perforar» un proyectil.
- Colazo gana 30 % de amplitud angular.
- Huevo abre tras 0,25 s de espera en lugar de 0,8 s; conserva el vuelo de 0,35 s.

Objetos, apoyos y aliento Q no consumen escamas. Tres marcas a los pies y el HUD indican la preparación.

## Q · Despertar del Lagarto

Transformación de seis segundos con figura reptiliana completa, auriculares y camiseta de Sideral. Al activarla, un huevo gigante escamoso envuelve al personaje durante 0,66 s: rueda según el desplazamiento real del jugador, se balancea si permanece quieto, se agrieta y rompe sin bloquear movimiento, apuntado, daño ni cámara. La transición forma parte de los seis segundos y no concede invulnerabilidad. Al finalizar, ambas figuras se funden durante 0,32 s sin cambiar posición ni dirección.

El Lagarto usa un atlas exclusivo de ocho figuras completas —reposo, tres pasos, eclosión, preparación, aliento e impacto— basado en el arte de la carta, y no la anterior construcción geométrica provisional. Conserva movimiento, rango y técnica equipada. El aliento sustituye temporalmente al ataque automático: cono animado de 310 u y 0,48 rad, núcleo amarillo-verde, bordes verdes, partículas e impactos legibles; pulso de daño especial 0,36× cada 0,24 s y giro máximo 2,4 rad/s. Al activar mira al objetivo válido cercano; después debe girar para seguirlo. No empuja ni inmoviliza, no mueve la cámara y no concede invulnerabilidad ni vida. Al activar fija una escala de 1 + 0,14 por cada rango sobre 1 de la técnica más avanzada; tener una evolución personal añade ×1,15. No suma los tres rangos. El daño bruto de referencia es 40,5 por segundo en rango 1, 63,18 en rango 5 y 72,66 con evolución, antes de stats y defensas, sin sumar ataques automáticos personales durante Q. Mantiene 25 pulsos en los seis segundos tanto a 25 como a 30 Hz.

Carga Q separada `ultimate.sideralCharge`: normal +5, pesado +10, minijefe +20, jefe +35 por baja propia; no recarga durante la transformación. R conserva exactamente su depósito anterior `ultimate.charge`. Q no consume ni rellena R y no puede iniciarse dentro de dominios. Los huevos lanzados previamente pueden completar su ataque. Al finalizar vuelve a la técnica anterior sin perder rangos ni evolución.

La carta Q usa ilustración exclusiva de la transformación: `assets/cards/sideral-lagarto-ultimate-fullart-v1.webp` (1024×1536, WebP de 428332 bytes). Conserva el marco `fire` de las otras ultis; muestra cuerpo reptiliano, cola, auriculares y camiseta roja, aliento verde y Lima nocturna. El atlas jugable transparente `assets/characters/sideral-lagarto-motion-v2.webp` (768×384) traslada ese diseño a ocho poses completas; su PNG maestro y prompt reproducible quedan archivados pero no se distribuyen. Huevo, grietas, rodamiento, aliento, partículas e impactos se dibujan como capas reactivas para respetar dirección y movimiento, sin fragmentar ni estirar el atlas humano. Movimiento reducido elimina oscilación, giro cosmético y partículas secundarias sin cambiar daño ni tiempos.

Durante el aliento, desplazarse conserva siempre los cuadros de caminata del Lagarto; la pose corporal completa de disparo se reserva para cuando está quieto. El cono y los impactos comunican el ataque mientras avanza, evitando congelar las patas y producir deslizamiento visual. La marcha alterna ambos apoyos mediante cuadros de contacto intermedios y completa un ciclo cada `3π` de fase recorrida, la misma cadencia por distancia del atlas general.

## Cobertura visual del arsenal

Las cartas de subida de nivel ya no usan la composición genérica. `P.UI.upgradeArt` resuelve una ilustración vertical para cada técnica y cambia a la versión evolucionada únicamente en la carta de evolución:

| Técnica | Carta base | Carta evolucionada |
|---|---|---|
| Mirada Sideral | `sideral-fear-fullart-v1.webp` | `sideral-forbidden-face-fullart-v1.webp` |
| Colazo del Lagarto | `sideral-tail-fullart-v1.webp` | `sideral-ancestral-tail-fullart-v1.webp` |
| Huevo sospechoso | `sideral-egg-fullart-v1.webp` | `sideral-forbidden-nest-fullart-v1.webp` |

Cada WebP tiene PNG maestro y `.prompt.txt` versionado. El arte conserva cabello negro corto, gafas oscuras, camiseta negra, jeans azules y Lima nocturna; la evolución se distingue por el patrón real —cono ampliado, onda larga o tres lagartitos— y no por un recolor. Conforme al [contrato visual](VISUAL_CONTRACT.md), quedan como mejora futura los seis cuadros exclusivos de reacción/derrota de Sideral.

## Validación

`tests/sideral-kit.test.cjs` cubre contrato, stats, puertas de progresión, evoluciones independientes, arco frontal, cobertura, demora, límite de impactos y huevos, daño a la pasiva, Q/R independientes y snapshots cooperativos. Las pruebas existentes de `sideral-domain.test.cjs` siguen protegiendo R. La batería completa cubre los demás personajes y el modo solitario. La medición de 56 ejecuciones automáticas locales, los duelos, ajustes y límites se documentan en [SIDERAL_BALANCE.md](../balance/SIDERAL_BALANCE.md). Hay cierres con victoria en ambos modos; la muestra general no acredita equilibrio definitivo y necesita validación con jugadores.
