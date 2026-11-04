# Guía de progresión: cartas, apoyos, modificaciones y fusiones

Fecha: 2026-11-03. Base revisada: `7d3b780883a1459c1067dc35314a0296c8bb0289`.

**Estado: implementación validada automáticamente, preparada para producción.**

Indicación vigente del usuario (2026-11-03): publicar en producción tras CI y comprobar allí la partida pública, sin exigir configurar acceso de staging. El intento de prueba de staging fue rechazado por HTTP 401 antes de jugar y no cuenta como validación de combate. La comprobación visual final quedó pendiente al detenerse el control del navegador.
La sección siguiente fija las decisiones abiertas para esta primera versión. El resto conserva el razonamiento y la base anterior de la conversación. El código es la fuente del comportamiento vigente.

## Implementación inicial · 2026-11-03

| Regla | Implementación |
|---|---|
| Subida de nivel | Cuatro ofertas ponderadas, elegir una; filtros y límite de dos apoyos. Se mantiene la oportunidad de desarrollar el kit personal, sin garantizar una fusión. |
| Cofres y objetos | Sin cambios: tres opciones de equipo y monedas, cuatro espacios Dota separados. |
| Fusiones | Apoyo de rango 3, nivel 8 en Caos o 6 en Rápida, destino desbloqueado. Una por apoyo; destinos distintos; máximo dos. No exige evolucionar primero. |
| Traducción | Se conserva el rango y la evolución; el apoyo fusionado no ataca ni dibuja órbita automática. Sigue ocupando su espacio y puede seguir mejorándose. |
| Selección | En combate: arrastrar apoyo sobre técnica compatible, o seleccionar ambos por clic/toque/teclado. Aplica al soltar, sin pausa ni confirmación, conservando requisitos y cupos. La oferta de nivel anterior continúa como alternativa con confirmación. |
| Modificación | Una personal por partida, disponible desde nivel 4. Las alternativas incompatibles o ya equipadas salen del pool. |
| Rerolls | Recurso por jugador y partida: 1 base; 2 con maestría 5; 3 con maestría 10. Renovar no da otra recompensa ni aumenta el nivel. |
| Maestría | Partidas registradas de ese personaje (`characters[id].runs`), con límite 10. No se suman estrellas, compras o nivel temporal. No se crea otra versión del guardado ni se modifica el historial. |
| Cooperativo | El servidor obtiene la maestría del guardado de la cuenta al iniciar; invitado = 0. Intenciones con ID de elección y revisión por jugador. Doble clic, revisión anterior y saldo agotado se rechazan. La ruta directa usa el mismo validador y recibe la maestría fijada por la sala. |
| Tiempo límite | Se conservan los 15 s de la elección cooperativa; renovar no los reinicia. La elección automática usa la revisión vigente y prefiere una mejora sin fusión para no imponer un sacrificio. |
| Compatibilidad | Directo viral y Prensa blindada dejan de aparecer en las nuevas ofertas. Si una partida ya los tenía, conservan su efecto y bloquean fusiones de sus apoyos implicados. El laboratorio conserva su comparación heredada. |

### Recetas habilitadas

Sideral admite los tres apoyos en **Colazo** y **Huevo**, siempre en destinos distintos. Los personajes de básico convencional tienen una receta con `primary`; los demás arsenales conservan sus controles y esperan recetas propias. No se inventa una conversión automática de todos los personajes ni destinos Q/R.

| Apoyo | Colazo | Huevo | Básico convencional |
|---|---|---|---|
| Onda causa | Onda especial al lanzar | Onda especial al abrir | Onda especial en el objetivo al atacar |
| Tarjetas del caos | Disparo perforante al lanzar | Disparo una vez al abrir | Disparo adicional al atacar |
| Escudo de bandas | Zona fija de bandas de 2,4 s | Zona de 2,4 s al abrir | Zona de bandas en el objetivo |

Onda y Tarjetas usan el daño del apoyo con factor inicial 2,2 en técnicas manuales y 1,5 en básico. Bandas emite hasta tres pulsos con factor 0,8; conserva los bonos de rango/evolución. Cada apoyo mantiene el canal **especial**; fusionar con Colazo no convierte el golpe físico del Colazo en especial. Son valores iniciales para contrastar con la alternativa automática.

### Modificaciones habilitadas

- **Colazo abierto:** arco ×1,45 y alcance ×0,85.
- **Mirada panorámica:** arco ×1,45 y alcance ×0,85.
- **Eclosión rápida:** espera 0,2 s y daño ×0,8; también adelanta el disparador de la fusión.
- **Nido de presión:** al abrir deja una zona especial de 2 s, hasta tres pulsos de 0,22× el poder.
- Básicos convencionales: **Eco de impacto** (un estallido especial de 0,45× tras 0,25 s) o **Rastro de combate** (zona de 2 s, hasta tres pulsos de 0,22×).

Mirada y Colazo modifican solo su geometría original; no ensanchan silenciosamente la onda de un apoyo. Nido y Bandas pueden compartir centro, con límite conjunto de cuatro zonas por jugador. Cada huevo dispara sus efectos una vez al abrir, independientemente de sus fragmentos. Los efectos derivados no activan otras fusiones.

Límites: cuatro zonas activas por jugador, tres pulsos por zona, máximo 180 proyectiles al emitir tarjetas y 290 efectos visuales al añadir una onda. Morir o entrar en un dominio limpia zonas pendientes. Una pausa no avanza ni daña con ellas. Los estados se reinician con el jugador de la nueva partida.

### Validación y publicación

`npm run check` y `npm test` cubren ofertas, daño real, propiedad de apoyos, herencia, cancelación, revisiones, timeout, conexión directa y reinicio. `node scripts/card-build-audit.cjs` produce evidencia local de partidas normales en `output/` (no se distribuye). Las mediciones de lógica sin renderizado no se presentan como FPS del navegador.

Evidencia inicial en [auditoría de progresión](../balance/datos/card-build-progression-audit.json): Caos automático llegó a nivel 19 y murió a 934,8 s; Caos con dos fusiones (Tarjetas→Colazo, Bandas→Huevo) llegó a nivel 18 y murió a 874,4 s; Rápida alcanzó 300 s y nivel 12 sin fusión. Son semillas diferentes, no una comparación A/B ni prueba de equilibrio completo de 30 minutos. Confirman recorridos distintos y sin bloqueos; queda ampliar el muestreo y revisar la frecuencia de fusiones en Rápida.

La publicación sigue la indicación vigente del usuario: PR directo a **main**, CI verde, despliegue automático y Public cooperative E2E en producción sobre el SHA publicado. El flujo de prueba espera a que termine CI con su despliegue; no compite con él ni valida silenciosamente la versión anterior. La comprobación visual local puede usar una escena temporal externa; nunca añadir manipuladores de estado al juego distribuido.

## Referencia de la conversación y base anterior

## 1. Objetivo y alcance

Queremos partidas diferentes al volver a jugar: elegir una dirección y descubrir interacciones que permitan cambiarla. La referencia de cartas es visual y de lectura (7DS); la referencia de variedad es descubrir combinaciones durante una partida (Isaac). Son referencias de diseño: aquí se conserva el combate de supervivencia en tiempo real.

La progresión se diseña principalmente para Supervivencia del Caos de **30 minutos**. También existe Partida rápida de **5 minutos**; sus requisitos y ritmo se validarán por separado. No se supone que ambos modos ofrecen el mismo número de subidas ni que una partida deba desbloquearlo todo.

**Última decisión: conservar los tres apoyos actuales, sus nombres e identidad.** No sustituirlos por trompos, parlantes ni aviones de papel. Esas alternativas se descartaron para este trabajo. Una mejora de arte futura se puede estudiar aparte.

## 2. Base anterior a esta implementación

| Sistema | Comportamiento de la base revisada |
|---|---|
| Kit personal | El contrato prevé tres ataques y sus evoluciones, pasiva propia, Q y R. No todos los personajes usan el mismo control ni tienen todas sus piezas implementadas. |
| Sideral | Mirada automática; Colazo y Huevo manuales con recarga; Sangre fría; Q Despertar del Lagarto; R Habitación del Lagarto. La rueda no activa sus técnicas. |
| Apoyos | `pulse` Onda causa, `cards` Tarjetas del caos y `orbit` Escudo de bandas. Hasta dos apoyos junto al ataque principal en el flujo normal. |
| Rangos de apoyo | Cinco rangos. La evolución actual se ofrece con rango 5 y nivel de partida 8; aumenta daño y alcance. No es la nueva fusión. |
| Subida de nivel | Tres ofertas, se elige una. Hay mejoras personales, apoyos, estadísticas, pactos y combinaciones existentes. |
| Mejoras generales | Daño, intervalo, vida, velocidad, imán, alcance y proyectiles/bonificación de área. Las cartas `stat:` tienen rangos y no ocupan espacios de apoyo. |
| Combinaciones existentes | Directo viral (`combo:direct`) y Prensa blindada (`combo:press`). Sus efectos actuales no equivalen al sistema de fusión propuesto. |
| Equipo Dota | 39 objetos/variantes y cuatro espacios. Se obtiene en cofres y tiendas, con pasivos o activas según el objeto. Evolucionar conserva el espacio de su familia. |
| Laboratorio | Permite elegir equipo, probar activas, cargas, recargas y tipos de daño. Es el lugar de comprobación mecánica, separado de la progresión normal. |
| Cuatro ofertas, rerolls y fusiones nuevas | No implementados. Tampoco hay que dar por existente una maestría de personaje que conceda rerolls. |

### Los apoyos que conservamos

| ID | Nombre | Función actual |
|---|---|---|
| `pulse` | Onda causa | Pulsos automáticos de daño especial alrededor del personaje. |
| `cards` | Tarjetas del caos | Proyectiles especiales dirigidos a un enemigo, con perforación. |
| `orbit` | Escudo de bandas | Bandas visibles orbitando y pulsos de daño especial cercano. El nombre no implica absorción de daño ni un escudo defensivo real. |

Resistencia física/especial y regeneración se comentaron como posibles cartas generales. No deben presentarse como cartas ya disponibles sin comprobar el catálogo real. Una bonificación de un objeto, una pasiva personal y una mejora `stat:` son sistemas distintos.

## 3. Estructura acordada para el rediseño

| Capa | Función y límites |
|---|---|
| Kit del personaje | Básico propio, técnicas personales, pasiva, Q y R según su contrato. Sideral es el piloto del esquema básico automático + dos técnicas manuales. No convertir todo el roster de golpe. |
| Apoyos generales | Dos espacios por partida. Los apoyos elegidos atacan automáticamente con su recarga mientras permanezcan sin fusionar. |
| Mejoras pasivas generales | Mejoran estadísticas sin ocupar los dos espacios de apoyo. Mantienen límites explícitos por carta. |
| Modificaciones | Cambian el comportamiento de una técnica, no solo su daño. Pueden interactuar con apoyos y fusiones compatibles. |
| Fusiones | Una por cada apoyo: **máximo dos**. Son opcionales y deben tener una alternativa automática útil. |
| Objetos | Cuatro espacios Dota, con adquisición en cofres/tiendas. No se mezclan con los espacios de apoyo ni con sus fusiones. |

Los demás sistemas existentes —colección, mascotas, suministros, burlas, mapas y progreso de cuenta— se conservan. Esta guía no autoriza cambios ajenos a la progresión aquí descrita.

## 4. Ciclo de un apoyo y regla de fusión

1. Al subir de nivel, eliges una carta de apoyo elegible. Ocupa uno de los dos espacios y comienza a funcionar automáticamente; no entrega un número limitado de usos.
2. Nuevas elecciones mejoran ese apoyo durante la partida. El crecimiento continúa aunque todavía no tengas una fusión.
3. Cuando cumpla los requisitos, puede ofrecerse una carta de fusión compatible. Elegirla prepara la vinculación, no sustituye silenciosamente otra carta.
4. Durante la elección pausada, arrastras el apoyo sobre una técnica compatible iluminada. En móvil y teclado existe una alternativa equivalente: seleccionar apoyo y después destino.
5. Antes de confirmar, se muestra en una frase qué deja de hacer y qué hará la habilidad. Se permite cancelar la vinculación pendiente y escoger otro destino válido; no se pierde la recompensa por soltar fuera de una carta.
6. Tras confirmar, **el apoyo deja de ejecutar su ataque automático y su efecto pasa a la técnica elegida**. Conserva el rango y las mejoras invertidas, con la traducción de efectos que declare esa receta.
7. El apoyo fusionado sigue ocupando su espacio: no libera un tercer apoyo ni concede daño automático además del efecto fusionado. Cada apoyo se vincula a un destino por partida.

No se fusionan cartas únicamente por compartir icono, rareza o rango. Hace falta una receta compatible. Q y R no son destinos por defecto; el piloto se limita a técnicas personales con una receta definida. No se añaden teclas para los apoyos automáticos; el efecto fusionado usa la activación de su técnica destino.

Las combinaciones posibles de la partida son: dos apoyos automáticos; uno automático y uno fusionado; o dos fusionados. Fusionar no debe ser siempre la decisión superior: se intercambia autonomía y cobertura constante por una acción concentrada y controlable.

### Ejemplo de explicación al jugador

**Ejemplo propuesto, no efecto existente:** «Escudo de bandas deja de orbitar. Colazo libera bandas durante 3 s».

Los 3 s son una cifra inicial para probar, no un requisito aprobado de balance. El apoyo mantiene su identidad de bandas; su potencia debe traducirse a la nueva frecuencia de uso para evitar que una recarga larga lo vuelva inútil o una corta lo multiplique sin límite.

## 5. Modificaciones y descubrimiento de combinaciones

Una modificación cambia geometría, trayectoria, ritmo, control o zona de efecto de una técnica. Ejemplos de conversación: Huevo que abre antes, deja una zona o se fragmenta; Mirada más ancha; onda de Colazo con rebote. **Ninguno se considera implementado por aparecer en esta guía.**

La dirección acordada combina dos decisiones:

- Elegir apoyos/fusiones da una estrategia reconocible.
- Encontrar modificaciones y objetos ofrece oportunidades para cambiar de rumbo.

Una fusión puede aprovechar modificaciones compatibles de su destino. Cada receta declara disparador, canal físico/especial, daño, área, duración, recarga y límites. Cada interacción debe declararse y probarse; no se heredan automáticamente todos los multiplicadores ni se inventa una variante para cada pareja de cartas.

Ejemplo de diseño: Bandas + Huevo, con una modificación de zona persistente, podría concentrar las bandas alrededor de esa zona. Si existe fragmentación, hay que decidir explícitamente si actúa una vez por lanzamiento o por fragmento, y fijar un máximo. Un efecto derivado no vuelve a activar la misma fusión ni genera una cadena infinita.

El límite de modificaciones sigue pendiente. Se propuso una por ataque y después se sugirió empezar con **una modificación personal por partida** para reducir complejidad. Para el piloto, usar esta última como hipótesis de prueba; no escribirla como regla definitiva ni desplegar un árbol completo por cada ataque.

## 6. Subidas de nivel y control del azar

Objetivo propuesto: **cuatro ofertas, elegir una**. Son cuatro opciones de recompensa, no cuatro espacios equipables. Este plan no cambia las tres opciones de los cofres ni sus monedas. El cambio debe aplicarse de forma coherente a individual, cooperativo, teclado, móvil y laboratorio.

Las ofertas pueden incluir mejoras personales, apoyos, pasivas generales, modificaciones y fusiones disponibles. Antes de sortear se filtran requisitos, rangos máximos, espacios y compatibilidad. Si falta una categoría, se completa con otra recompensa válida; no se muestran opciones inútiles para rellenar casillas.

Se propuso una oferta personal, una de apoyo, una compatible con la combinación y una libre. Es una referencia inicial, **no una obligación de repetir esas cuatro categorías en todos los niveles**. La decisión posterior fue mezclar continuidad con sorpresa: mejorar lo elegido sin garantizar siempre la misma receta ni forzar una ruta completa.

- Inicio: oportunidades claras para desarrollar el kit y elegir apoyos.
- Desarrollo: mejoras de lo llevado y primeras especializaciones.
- Tramo avanzado: evoluciones y fusiones que realmente cumplan sus requisitos.
- Al llenar ambos espacios, aumenta la presencia de mejoras compatibles; no aparecen nuevos apoyos imposibles de equipar.
- Las oportunidades de cambiar de rumbo deben seguir existiendo. Un eventual reemplazo de apoyo necesita reglas propias: no se presupone disponible ni gratuito.

Antes de fijar puertas de fusión, medir cuántas subidas se alcanzan realmente en 30 minutos, cómo se reparten y cuántas elecciones compiten con el kit. La meta es completar una estrategia principal y parte de otra, sin exigir desbloquearlo todo. La versión rápida requiere una curva propia comprobada.

## 7. Rerolls y progreso del personaje

Dirección propuesta: rerolls limitados, vinculados al progreso permanente o maestría del personaje. Un reroll renueva las ofertas de una elección pendiente sin conceder una segunda recompensa ni gastar otra subida de nivel.

Cifras comentadas como **hipótesis pendiente de validación**:

| Progreso | Rerolls iniciales por partida |
|---|---:|
| Base | 1 |
| Maestría 5 | 2 |
| Maestría 10 | 3 |

No asumir que el nivel permanente o la maestría ya existen con esa semántica, ni confundirlos con nivel de partida, estrellas, rareza o rangos de ataques. Antes de implementarlo se definen origen del progreso, umbrales, reserva, consumo y reinicio. No se acumulan rerolls sin límite entre partidas como consecuencia de esta tabla.

En cooperativo, las renovaciones pertenecen a cada jugador. El servidor valida elección pendiente, saldo, consumo único y nuevas ofertas. Recargar, reconectar o pulsar dos veces no devuelve el gasto ni permite elegir una oferta anterior. Cualquier guardado o migración se trata como una fase independiente y pasa por staging.

## 8. Interfaz y lectura

- Mantener posiciones de 1/2/3/Q/R y respetar controles particulares del personaje. Sideral es la excepción documentada: `[AUTO] · [2][3] · [Q][R]`; AUTO reemplaza visualmente al antiguo ataque `1` sin consumir tecla.
- Mostrar dos espacios pequeños de apoyo, distinguiendo automático, preparado para vincular y fusionado.
- Una técnica fusionada lleva un icono pequeño del apoyo y un borde reconocible; no añade otra carta completa encima.
- La ficha de elección comunica beneficio, sacrificio, destino y requisito en texto breve. Detalles extensos quedan en Info.
- Compatibles iluminadas; incompatibles con motivo concreto. Arrastre, toque y teclado tienen el mismo resultado.
- La fusión se resuelve en la elección pausada. No invocar una pausa local unilateral en cooperativo: coordinarla con la elección autoritativa existente.
- Confirmar una vez; cancelar o soltar fuera no consume la elección. Las cuatro ofertas siguen siendo accesibles con teclado; el mapeo exacto se valida con los controles existentes.
- Movimiento reducido conserva avisos, iconos y estados sin exigir partículas o animaciones para entender el resultado.

## 9. Orden para implementarlo

Cada etapa tiene su PR, reglas, pruebas y comprobación visual. La primera versión implementa el recorrido funcional descrito al inicio; esta tabla conserva el orden de trabajo y los criterios de validación. Las pruebas de equilibrio y variedad siguen requiriendo partidas, no solo presencia de código.

| Etapa | Trabajo | Criterio para avanzar |
|---|---|---|
| 0 · Referencia | README, esta guía y enlace desde diseño general. | Actualidad, acuerdos e hipótesis están separados; se conservan los apoyos actuales. |
| 1 · Modelo | Catálogo explícito de apoyos, modificaciones y recetas; dos espacios y estados automático/fusionado. Separar procedencia de efectos y validación de compatibilidad. | Consultar ofertas no muta al jugador. No hay tercer apoyo, duplicados ni recetas inválidas. |
| 2 · Oferta | Cuatro opciones elegibles y elección única. Actualizar presentación, teclado y autoridad cooperativa de forma coordinada. | Misma regla en individual y cooperativo; ningún cliente impone resultados. Pasar por staging por tocar el protocolo de elección. |
| 3 · Piloto | Sideral + Escudo de bandas + una receta propuesta con Colazo. Una modificación personal como hipótesis inicial. | La versión automática y la fusionada son útiles, sin aplicar ambos ataques ni duplicar daño. Revisión en escritorio y móvil. |
| 4 · Variedad | Añadir recetas para Onda/Tarjetas, segundo espacio fusionable e interacciones declaradas. | Máximo dos fusiones; cada receta conserva límites y no rompe otros personajes. |
| 5 · Rerolls | Recurso de partida, después fuente de progreso permanente definida y migración si corresponde. | Consumo autoritativo, reconexión y persistencia comprobados en staging. |
| 6 · Partidas | Medir progresión y combinaciones en 30 minutos y en modo rápido. Ajustar pesos, puertas, sacrificios y tiempos. | Se alcanzan rutas distintas y coherentes; no se declara variedad o equilibrio solo por pruebas de daño. |

La etapa 1 puede ser un modelo puro, sin cambiar la partida publicada. La transición a las nuevas reglas se hace en un corte coherente; no activar cuatro cartas solo en el cliente ni retirar el ataque automático de un apoyo sin haber conectado su receta y sus estados.

### Puntos de entrada actuales

- [`src/systems/progression.js`](../../src/systems/progression.js): pool, selección, aplicación, rangos, efectos y combinaciones compartidas.
- [`src/data/catalog.js`](../../src/data/catalog.js) y [`src/data/powers.js`](../../src/data/powers.js): estadísticas generales y ataques base.
- [`src/systems/sideral-kit.js`](../../src/systems/sideral-kit.js): técnicas piloto, pasiva y activaciones de Sideral.
- [`src/ui/screens.js`](../../src/ui/screens.js), [`src/ui/attack-hud.js`](../../src/ui/attack-hud.js), [`src/ui/loot-choices.js`](../../src/ui/loot-choices.js): elecciones y presentación. Verificar sus envoltorios antes de editar.
- [`backend/activities.cjs`](../../backend/activities.cjs), [`backend/simulation.cjs`](../../backend/simulation.cjs) y [`src/network/cooperative.js`](../../src/network/cooperative.js): elecciones, estado de sala y replicación.
- [`src/development/test-bench.js`](../../src/development/test-bench.js) y [`src/development/equipment-bench.js`](../../src/development/equipment-bench.js): controles de laboratorio; objetos y apoyos siguen siendo configuraciones diferentes.

Preservar `P`, el orden de scripts y cambios de otros chats. Los campos de estado nuevos aún no están definidos: se diseñan en la etapa 1, se reinician por partida y se serializan según su dueño. No reutilizar un indicador de `p.combos` para dos reglas distintas sin una transición explícita. No apagar un básico personal que comparta dibujo con un apoyo (por ejemplo, bandas o tarjetas) al desactivar el apoyo fusionado. Conservar partidas activas durante cambios de release según el flujo operativo existente.

## 10. Comprobación mínima por etapa jugable

- Dos apoyos como máximo; un apoyo fusionado sigue ocupando su espacio.
- Una elección o renovación se aplica una sola vez; los requisitos se vuelven a validar al confirmar.
- Antes de fusionar, el apoyo ataca automáticamente; después solo produce el efecto declarado en su destino.
- Se conservan rangos y modificaciones compatibles, con límites globales por lanzamiento/blanco y sin recursión.
- Una modificación incompatible se rechaza o se explica; no pierde su efecto silenciosamente.
- Objetos, mascotas y básicos similares no se confunden con la procedencia del apoyo.
- Cambiar partida, personaje, morir o volver del dominio no deja órbitas, temporizadores ni fusiones duplicadas.
- La selección funciona con ratón, toque, teclado y movimiento reducido.
- La autoridad cooperativa rechaza intenciones caducadas o imposibles y conserva el estado al reconectar.
- Efectos, proyectiles y búsqueda de blancos tienen límites; comprobar FPS con una escena comparable, no inferirlos del daño.
- Ejecutar `npm run check` y `npm test` antes de subir cambios. Las pruebas públicas prolongadas usan Public cooperative E2E y comparten `perusurvivor-production` con el despliegue; no se publican pruebas auxiliares que manipulen el estado.

## 11. Decisiones que estaban abiertas en la conversación

Las reglas de la primera versión quedan fijadas al inicio. Se conserva esta lista como origen de las decisiones y de las tareas de balance; los cambios a Sangre fría o a los sellos de R siguen fuera de alcance.

1. Puertas de acceso a modificaciones y fusiones; relación con la evolución actual de rango 5/nivel 8.
2. Límite definitivo de modificaciones y alternativas por técnica.
3. Recetas concretas, compensación de perder el automático y traducción de rangos/bonos.
4. Si dos apoyos pueden fusionarse con la misma técnica o deben usar destinos diferentes. No se acordó esta restricción.
5. Pesos, protección frente a malas ofertas y ritmo de progresión en cada duración de partida.
6. Qué significa maestría, cómo se obtiene y cuáles son los rerolls reales que concede.
7. Cómo conviven o se sustituyen Directo viral y Prensa blindada; no sumar silenciosamente todos los sistemas.
8. Tratamiento de ofertas insuficientes, reemplazos de apoyo y compatibilidad con partidas guardadas o activas, si corresponde.
9. Tiempo de elección y confirmación de fusión en cooperativo, respetando la política existente de elecciones con tiempo límite.
10. Qué ajustes de Sangre fría o sellos de R se desean realmente. Reservar escamas para manuales y cargar R por impactos fueron ideas propuestas, no cambios aprobados del kit.

## Referencias

- [Diseño general vigente](GAME_DESIGN.md)
- [Kit actual de Sideral](SIDERAL_KIT.md)
- [Catálogo de objetos Dota](DOTA_ITEM_CATALOG.md)
- [Arquitectura existente](../arquitectura/ARCHITECTURE.md)
- [Flujo de colaboración y publicación](../operacion/CONTRIBUTING.md)
