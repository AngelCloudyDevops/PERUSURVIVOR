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

El HUD usa un marco verde propio abrazado por un lagarto: cabeza y espinas en la esquina superior, cuerpo en el borde y cola bajo la tarjeta. Las tres escamas se encienden por separado. El marco respira mientras progresa, apaga su color sin rivales cercanos, ilumina ojos y escamas cuando la siguiente técnica está potenciada y reacciona en rojo al perder concentración por daño. Se ubica bajo la vida para asociarse con Sideral y no competir con el minimapa; con movimiento reducido conserva todos los estados sin animación.

Cada 2 s con un rival vivo a 300 u obtiene una escama, hasta tres. Alejarse reinicia solo el progreso hacia la siguiente; Q y dominios suspenden la generación. Recibir daño efectivo resta una escama y reinicia el progreso. Daño bloqueado no resta escamas.

Con tres escamas, el siguiente lanzamiento personal válido consume las tres:

- Mirada alcanza a un único rival adicional hasta 70 u más allá del cono normal. La mirada es un cono, por lo que esta extensión sustituye la noción de «perforar» un proyectil.
- Colazo gana 30 % de amplitud angular.
- Huevo abre tras 0,25 s de espera en lugar de 0,8 s; conserva el vuelo de 0,35 s.

Objetos, apoyos y aliento Q no consumen escamas. Tres marcas a los pies y el HUD indican la preparación.

## Q · Despertar del Lagarto

La entrada empieza con **cuatro segundos de huevo rodante** controlable. Durante esa fase la velocidad efectiva se multiplica por 1,25 y el cascarón bloquea por completo el daño físico; el daño especial sigue afectando a Sideral y ninguna protección continúa durante la eclosión o el aliento. El huevo usa cuatro cuadros de rotación ligados a la distancia recorrida. Su empuje escala exclusivamente con el rango de Mirada Sideral: 48/58/68/78/88 u contra enemigos normales y 26/32/38/44/50 u contra pesados, con 0,42 s de espera por objetivo. Cada contacto desplaza al minion mediante un vuelo visible de 0,34 s y le impide actuar hasta aterrizar; la sombra de destino y el anillo de caída hacen legible el empuje incluso dentro de una horda. No causa daño y no desplaza minijefes ni jefes. Después, una secuencia exclusiva de ocho cuadros transforma progresivamente cascarón, cuerpo, rostro, manos y cola durante 0,66 s hasta formar al Lagarto. Recién entonces comienzan los seis segundos de figura reptiliana completa, auriculares y camiseta de Sideral. Ninguna fase bloquea movimiento ni cámara. La subida de nivel obtenida durante Q queda pendiente sin consumir experiencia y se presenta apenas termina. Al finalizar, ambas figuras se funden durante 0,32 s sin cambiar posición ni dirección.

El Lagarto usa un atlas exclusivo de ocho figuras completas —reposo, tres pasos, eclosión, preparación, aliento e impacto— basado en el arte de la carta, y no la anterior construcción geométrica provisional. Conserva movimiento, rango y técnica equipada. El aliento sustituye temporalmente al ataque automático: cono animado de 310 u y 0,48 rad, núcleo amarillo-verde, bordes verdes, partículas e impactos legibles; pulso de daño especial 0,36× cada 0,24 s y giro máximo 2,4 rad/s. El primer pulso espera a que la mandíbula se abra y tanto el cono de daño como el efecto visual nacen del mismo punto del hocico del cuadro activo. Al activar mira al objetivo válido cercano; después debe girar para seguirlo. No empuja ni inmoviliza, no mueve la cámara y no concede invulnerabilidad ni vida. Al activar fija una escala de 1 + 0,14 por cada rango sobre 1 de la técnica más avanzada; tener una evolución personal añade ×1,15. No suma los tres rangos. El daño bruto de referencia es 40,5 por segundo en rango 1, 63,18 en rango 5 y 72,66 con evolución, antes de stats y defensas, sin sumar ataques automáticos personales durante Q. Mantiene 25 pulsos en los seis segundos tanto a 25 como a 30 Hz.

Carga Q separada `ultimate.sideralCharge`: normal +5, pesado +10, minijefe +20, jefe +35 por baja propia; no recarga durante la transformación. R conserva exactamente su depósito anterior `ultimate.charge`. Q no consume ni rellena R y no puede iniciarse dentro de dominios. Los huevos lanzados previamente pueden completar su ataque. Al finalizar vuelve a la técnica anterior sin perder rangos ni evolución.

La carta Q usa ilustración exclusiva de la transformación: `assets/cards/sideral-lagarto-ultimate-fullart-v1.webp` (1024×1536, WebP de 428332 bytes). Conserva el marco `fire` de las otras ultis; muestra cuerpo reptiliano, cola, auriculares y camiseta roja, aliento verde y Lima nocturna. El atlas jugable `assets/characters/sideral-breath-motion-v3.webp` contiene ocho poses corporales distintas de inhalación, apertura de mandíbula, expulsión, apoyo alterno, retroceso y recuperación; `sideral-transform-motion-v2.webp` cubre la mutación. Los atlas anteriores quedan como maestros históricos y no se distribuyen. El origen del cono sigue el hocico cuadro por cuadro; partículas e impactos permanecen como capas reactivas para respetar dirección y movimiento. Movimiento reducido elimina partículas secundarias sin cambiar daño ni tiempos.

Durante el aliento se usa un ciclo continuo de ocho cuadros sincronizado con cada pulso de 0,24 s; ya no vuelve a reposo entre pulsos. Incluye apoyos alternos de las piernas, pecho que se infla, mandíbula articulada y retroceso, por lo que disparar avanzando no reutiliza una simple caminata ni parece deslizar al Lagarto. El cono nace en el hocico visible y los impactos permanecen como capas reactivas separadas para conservar dirección, alcance y lectura del daño. Huevo sospechoso ahora comunica vuelo, giro, grietas, sombra y dirección previa a la eclosión; Mirada y Sangre fría reciben avisos propios sin modificar sus reglas.

**Mirada Sideral** usa `assets/characters/sideral-fear-motion-v3.webp` como una sola figura completa cuando está quieto y `sideral-fear-walk-motion-v3.webp` cuando avanza. Ambos atlas toman `sideral-ur-v1.webp` como contrato de identidad: figura baja y redondeada, rostro afeitado, cabello alto con reflejos azules, gafas anchas, camiseta negra, jean azul, zapatillas redondeadas, muñequeras y lata roja en la misma mano. Conservan ocho tiempos y detalle completo; el segundo alterna apoyo, zancada y peso de las piernas para que el actor camine en vez de deslizarse. Alcanza el marco, baja progresivamente los lentes, sostiene la mirada y vuelve a cubrirlos sin superponer otro cuerpo debajo. El gesto dura 0,72 s; el daño, el miedo y el cono se liberan juntos a los 0,28 s, cuando los ojos quedan descubiertos, y el cono nace en su posición visual. Cada rival afectado tiembla en dirección opuesta, conserva un aviso de miedo sobre la cabeza y distingue con un aro adicional la evolución **Rostro prohibido**. `sideral-egg-motion-v3.webp` usa pixel art de contorno oscuro y comparte ocho cuadros entre rodamiento, vuelo, impacto, grieta y cascarón abierto; Huevo sospechoso dibuja arco, estela y sombra, y el lagartito reutiliza el atlas reptiliano detallado. Los atlas anteriores quedan como fuentes históricas. Estas señales son visuales y sonoras, no alteran daño, resistencia ni duración del control.

Las tres técnicas mantienen lectura de piernas al desplazarse: Mirada y Coletazo recorren láminas corporales completas con cambios de apoyo, mientras Huevo conserva la caminata base y superpone el lanzamiento. Ningún ataque puede sustituir el ciclo por una pose fija que se deslice sobre el suelo.

## Cobertura visual del arsenal

Las cartas de subida de nivel ya no usan la composición genérica. `P.UI.upgradeArt` resuelve una ilustración vertical para cada técnica y cambia a la versión evolucionada únicamente en la carta de evolución:

| Técnica | Carta base | Carta evolucionada |
|---|---|---|
| Mirada Sideral | `sideral-fear-fullart-v1.webp` | `sideral-forbidden-face-fullart-v1.webp` |
| Colazo del Lagarto | `sideral-tail-fullart-v1.webp` | `sideral-ancestral-tail-fullart-v1.webp` |
| Huevo sospechoso | `sideral-egg-fullart-v1.webp` | `sideral-forbidden-nest-fullart-v1.webp` |

Cada WebP tiene PNG maestro y `.prompt.txt` versionado. El arte conserva cabello negro corto, gafas oscuras, camiseta negra, jeans azules y Lima nocturna; la evolución se distingue por el patrón real —cono ampliado, onda larga o tres lagartitos— y no por un recolor. El ataque Colazo usa seis figuras completas con la cola unida a la espalda (`sideral-tail-attack-v2.webp`), y Q añade los atlas `sideral-transform-motion-v2.webp` y `sideral-breath-motion-v2.webp`. Conforme al [contrato visual](VISUAL_CONTRACT.md), quedan como mejora futura los seis cuadros exclusivos de reacción/derrota de Sideral.

## Validación

`tests/sideral-kit.test.cjs` cubre contrato, stats, puertas de progresión, evoluciones independientes, arco frontal, cobertura, demora, límite de impactos y huevos, daño a la pasiva, Q/R independientes y snapshots cooperativos. Las pruebas existentes de `sideral-domain.test.cjs` siguen protegiendo R. La batería completa cubre los demás personajes y el modo solitario. La medición de 56 ejecuciones automáticas locales, los duelos, ajustes y límites se documentan en [SIDERAL_BALANCE.md](../balance/SIDERAL_BALANCE.md). Hay cierres con victoria en ambos modos; la muestra general no acredita equilibrio definitivo y necesita validación con jugadores.
