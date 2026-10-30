# Cristorata · movilidad, retornos y sellos

Contrato funcional 9/9: tres ataques, tres evoluciones, De ida y de vuelta, Q original del dragón y R El Coliseo del Dragón. Base conservada: 95 PV, velocidad 205, poder 18 y atributo/canales/rareza actuales. No se editan `dragon-ultimate.js`, `dragon-art.js` ni `dragon-epic.js`.

## Arsenal personal

Teclas 1/2/3 y botones táctiles. Derrape se ofrece desde nivel 2 y Garra desde nivel 4, mediante las cartas normales. Cinco rangos independientes por técnica: +14 % daño, +5 % alcance y ×0,96 al intervalo por rango adicional. Rangos 2–5 requieren niveles 6/8/10/12; evolución, rango 5 y nivel 14. Cambio mínimo cada 0,3 s; no se puede cambiar durante un derrape o la Q original.

| Técnica | Base | Evolución |
|---|---|---|
| Clip de ida y vuelta | Conserva el micrófono perforante que vuelve al jugador, intervalo 0,9 s y alcance nominal 520 u. El giro de retorno existente ocurre a los 0,55 s: el alcance nominal no garantiza recorrer esa distancia. | **Directo encadenado:** conserva dos micrófonos y los enlaces de sonido existentes. |
| Derrape del directo | Intervalo 2,6 s, avance 165 u a 620 u/s; coeficiente físico 1,35. Un golpe por enemigo en el recorrido, empuje de 10 u. Paredes y obstáculos detienen el avance. | **Derrape encendido:** estela de 1,6 s con radio 31 u, coeficiente especial 0,18 del poder del derrape por pulso de 0,4 s. |
| Garra del dragón | Intervalo 1,35 s, alcance 145 u, arco frontal 130°, coeficiente físico 1,25 y empuje de 22 u. No invoca una montura. | **Doble garra:** segundo zarpazo a los 0,24 s, 55 % del daño inicial y empuje de 10 u, con orientación cruzada ligeramente distinta. |

El avance tiene tope de 260 u y subpasos de hasta 8 u para evitar atravesar paredes o enemigos. No permite iniciar una esquiva simultánea, no concede invulnerabilidad ni resistencia al daño. El jugador puede recibir daño durante el recorrido.

La segunda garra conserva posición, dirección y poder del lanzamiento original; no persigue al enemigo ni se teletransporta al jugador si este se mueve. La cobertura bloquea ambos golpes. Los jefes reciben daño de Garra sin empuje. Cada zarpazo puede dañar una vez a cada rival en su arco.

La estela tiene un límite de 24 segmentos por jugador y solo aplica el segmento más fuerte por enemigo y pulso. Superponer segmentos no multiplica daño. Morir, cambiar de escena o activar Q limpia la estela y los golpes diferidos. La mejora genérica de proyectiles sigue añadiendo micrófonos; en Derrape/Garra se convierte en +12 % de daño por proyectil adicional.

## Pasiva · De ida y de vuelta

Se gana una carga al dañar al mismo enemigo con la ida y el regreso de un micrófono. Máximo una carga por lanzamiento, compartido entre todos sus micrófonos, aunque atraviesen muchos enemigos. No cuenta acertar a un enemigo en la ida y a otro distinto en el regreso. Tampoco cuentan Q, sellos, estela ni enlaces de sonido.

Con tres cargas, el siguiente ataque personal válido consume las tres y obtiene **+20 % de daño y +15 % de alcance**. El beneficio se fija en sus proyectiles, derrape o garra/segundo golpe. No tener objetivo ni poder lanzar conserva la preparación. No cura ni concede invulnerabilidad. La presión y el progreso del arsenal son personales y no modifican el catálogo. Morir limpia la preparación.

## Q · Dragón existente

Se conservan su depósito `ultimate.charge`, Combo del Causa, elección/ruleta, controles de palanca, montura, movimiento, despegue/aterrizaje, daño, duración, variantes Jade/Brasa/Trueno y variante secreta Tricéfalo del Caos. No se añade otra transformación ni se sustituye su animación.

Mientras Q está activa, el motor utiliza el perfil original de micrófono y el comportamiento existente de combate/montura. No se disparan Derrape ni Garra ni se consume la preparación pasiva. Un adaptador conserva la cadencia original del micrófono durante Q si se activó desde otra arma y recupera la cadencia personal al terminar; las mejoras de cadencia se conservan proporcionalmente. Activar Q limpia derrape, estela y segunda garra pendientes. Las pruebas existentes del dragón siguen cubriendo todas sus variantes y presentación.

## R · El Coliseo del Dragón

Dominio táctico sobre el terreno actual: **círculo de radio 360 u, ocho segundos y tres sellos** alrededor del punto de activación. No teletransporta, encierra con paredes, cura, ejecuta enemigos ni pausa sus ataques. El jugador debe moverse para aprovecharlo; los enemigos mantienen su combate normal. Salir a más de 400 u del centro termina el dominio.

Cada sello se coloca aproximadamente a 170 u del centro, con búsqueda acotada de posiciones sin obstáculos y rutas accesibles. Si no hay lugar para los tres, la activación falla y no gasta carga. Los sellos están separados al menos 80 u. El anillo y los símbolos del suelo señalan área, disponibilidad y descarga.

Entrar en un sello de radio 34 u dispara desde él una descarga especial al objetivo válido de hasta 500 u del propietario. Velocidad 620 u/s, vida 1,2 s, coeficiente 1,30 y hasta dos impactos contra enemigos diferentes. No sigue al objetivo; las paredes bloquean el proyectil. Un sello necesita **1,5 s de recuperación y una nueva entrada** para activarse otra vez: permanecer encima no repite disparos. Un sello se consume temporalmente también si se atraviesa sin objetivo.

Usa `ultimate.cristorataDomainCharge`, separado de Q. Las bajas propias normales/pesadas/minijefes/jefes conceden 4/8/20/30 puntos, máximo 100, fuera de dominios y sin bajas de Q. No se recarga con sus propias descargas. Solo el propietario dispara al atravesar sellos; los aliados pueden combatir dentro sin consumirlos.

No se superpone con Q ni otros dominios; no se cambia la carga de Q al activar R. Termina por tiempo, muerte del propietario, cambio de escena, salida del área, menú o fin de partida. Los ocho segundos usan el reloj de simulación y se detienen al pausar. Se puede cambiar de arma y atacar normalmente dentro del Coliseo. La carta R usa de momento la ilustración existente de personaje; la carta Q mantiene su arte exclusivo original.

## Animaciones y cooperativo

`cristorata-kit.js` resuelve arsenal, impactos, preparación, avance, estela y dominio. `cristorata-kit-art.js` dibuja zarpazos espectrales, estela, sellos y descargas. La caminata utiliza cuadros completos de las láminas existentes; el derrape inclina la figura completa sin cortar extremidades. Daño, muerte y montura delegan en sus renderizadores existentes. Se respeta movimiento reducido.

El servidor valida inputs de arma/R, calcula movimiento con colisiones y resuelve todos los impactos. `cristorataArsenal`, `cristorataPassive`, `cristoDash`, `cristoTrails`, `cristoSecond` y campos de recuperación de cadencia viajan en los snapshots normales del jugador. `cristorataDomain` viaja como estado compartido; las descargas se guardan en el conjunto de proyectiles de su propietario incluso cuando el motor está procesando al compañero. El cliente solo solicita acciones; no envía posiciones, impactos ni cargas.

El nuevo estado de dominio participa en las exclusiones/progresión y en la limpieza de sala. Los inputs existentes `weapon`/`domain` y los controles táctiles se conservan; no se crea un protocolo de daño del cliente.

## Verificación y trabajo pendiente

Pruebas en `tests/cristorata-kit.test.cjs`: contrato/base/catálogo, progreso independiente, colisiones e impactos únicos, estela sin acumulación, demora/arco/cobertura de Garra, pareja real de impactos de micrófono, límite por lanzamiento y consumo pasivo, carga/sellos/recuperación/cancelación de R, Q original y restauración de cadencia, movimiento y propiedad de proyectiles en cooperativo, snapshots y muerte.

Se mantienen las 32 pruebas existentes de `dragon-ultimate.test.cjs`. Las regresiones genéricas de rangos/HUD siguen usando un personaje sin arsenal especializado; las pruebas de Cristorata y cooperativo verifican sus cartas nuevas. La revisión visual se hace en una copia local, sin salas públicas ni utilidades de QA dentro de la distribución.

Pendientes: balance medido de partidas completas, pruebas con jugadores y distintos compañeros, móvil y una ilustración exclusiva para R. Este cierre de reglas/contrato no es una afirmación de balance definitivo.

El despliegue mantiene el límite de archivo de 64 MiB. La carta Q de Chamelín conserva la misma ilustración y fuente PNG de 1024×1536; su copia WebP de ejecución se optimiza a 512×768 para dejar margen al paquete tanto en Windows como en Linux, sin cambiar habilidades ni animaciones.
