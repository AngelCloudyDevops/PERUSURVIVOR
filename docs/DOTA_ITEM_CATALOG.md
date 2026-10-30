# Catálogo de 39 objetos Dota — PERUSURVIVOR

Estado: 39 objetos implementados. Los 19 originales y las 20 incorporaciones aparecen en el catálogo, cofres y tiendas según elegibilidad y rareza. Las cifras son adaptaciones propias sujetas a balance con partidas reales.

Los nombres sirven de inspiración; los efectos, rarezas y rutas de evolución se adaptan a PERUSURVIVOR. Las rutas aquí documentadas no representan las recetas oficiales de Dota 2. No se introduce maná.

## Cómo se clasifica cada objeto

| Campo | Qué significa |
|---|---|
| Categoría | Qué aporta a la combinación: daño, cadencia, defensa, resistencia, recuperación, movilidad, control o economía. |
| Funcionamiento | Pasivo permanente, automático con condición o activo que requiere pulsación. |
| Rareza | Común, rara, épica o legendaria. Es independiente de la categoría y del funcionamiento. |
| Familia | Grupo de versiones alternativas; evolucionar reemplaza el objeto previo en el mismo espacio. |
| Estado | Implementado: funciona en la versión actual. Los 39 objetos de este catálogo están implementados. |

La subida de nivel desarrolla habilidades y mejoras pasivas del personaje. Los objetos son equipo temporal de cuatro espacios, obtenido en cofres y tiendas. Un objeto pasivo no ocupa una opción permanente de la subida de nivel: se equipa y funciona mientras lo lleves.

## Los 19 objetos implementados

Los efectos se definen en `dota-items.js`, `dota-equipment.js` y `dota-actives.js`. Las activaciones manuales sustituyen los disparadores automáticos correspondientes.

| Objeto | Categoría | Rareza | Funcionamiento y efecto actual |
|---|---|---|---|
| Boots of Speed | Movilidad | Común | Pasivo: +5% de velocidad. |
| Phase Boots | Movilidad | Rara | Pasivo: +12% de velocidad. Activo: +20% y evita contacto durante 3 s; recarga 15 s. No atraviesa paredes. |
| Power Treads | Cadencia / movilidad | Rara | Pasivo: +5% de velocidad y 10% menos de intervalo entre ataques. |
| Tranquil Boots | Recuperación / movilidad | Rara | Automático: +8% de velocidad y curación tras 5 s sin recibir daño. |
| Arcane Boots | Cadencia / movilidad | Épica | Pasivo: +6% de velocidad y 8% menos de intervalo entre ataques. |
| Boots of Travel | Movilidad / recolección | Épica | Pasivo: +14% velocidad y +20% recolección. Activo: viaja al compañero tras 2 s; daño cancela. Recarga 60 s. Solo: marca y regresa. |
| Magic Stick | Recuperación | Común | Acumula hasta 5 cargas al recibir daño. Activo: gasta todas y cura 2% de vida máxima por carga; recarga 8 s. |
| Magic Wand | Recuperación | Rara | Hasta 10 cargas. Activo: gasta todas y cura 2,5% de vida máxima por carga; recarga 8 s. |
| Ring of Health | Recuperación | Común | Pasivo: +3% de vida máxima y 0,55 de vida/s. |
| Ring of Tarrasque | Recuperación | Rara | Pasivo: +7% de vida máxima y 1,1 de vida/s. |
| Heart of Tarrasque | Recuperación | Épica | Pasivo: +12% de vida máxima y 1,6 de vida/s. |
| Blades of Attack | Daño | Común | Pasivo: +5% de daño. |
| Broadsword | Daño | Rara | Pasivo: +10% de daño. |
| Crystalys | Daño / crítico | Épica | Pasivo: +12% de daño; 10% de probabilidad de crítico de 1,5×. |
| Daedalus | Daño / crítico | Legendaria | Pasivo: +15% de daño; 18% de probabilidad de crítico de 1,75×. |
| Blink Dagger | Movilidad | Rara | Activo E: salto dirigido de hasta 145 unidades, respeta obstáculos; recarga 18 s. |
| Swift Blink | Movilidad | Épica | Activo E: salto de hasta 235 unidades y velocidad breve; recarga 14 s. |
| Arcane Blink | Movilidad / cadencia | Épica | Activo E: salto de hasta 165 unidades y adelanta el siguiente ataque; recarga 16 s. |
| Overwhelming Blink | Movilidad / control | Épica | Activo E: salto de hasta 165 unidades y empuje al aterrizar; recarga 18 s. |

Rutas actuales: Boots of Speed permite escoger una de sus cinco versiones mejoradas; Magic Stick → Magic Wand; Ring of Health → Ring of Tarrasque → Heart of Tarrasque; Blades of Attack → Broadsword → Crystalys → Daedalus; Blink Dagger permite escoger uno de sus tres Blink mejorados. Las alternativas de una misma familia no se acumulan.

## Las 20 incorporaciones

### Cadencia: atacar más seguido

| ID | Objeto | Rareza | Efecto implementado | Evolución |
|---|---|---|---|---|
| `gloves-haste` | Gloves of Haste | Común | Pasivo: reduce 5% el intervalo del ataque principal. No afecta Q/R. | Base de familia Cadencia. |
| `blitz-knuckles` | Blitz Knuckles | Rara | Pasivo: reduce 10% el intervalo del ataque principal. | Desde Gloves of Haste. |
| `moon-shard` | Moon Shard | Legendaria | Pasivo: reduce 15% el intervalo; cada 8 ataques válidos añade un golpe adicional de 35% de potencia. | Desde Blitz Knuckles. |

El golpe adicional se aplica al blanco original y no genera otro efecto secundario. Respetar el mínimo de intervalo del motor; no aumentar la velocidad de simulación ni el número de ticks.

### Defensa física: aguantar golpes

| ID | Objeto | Rareza | Efecto implementado | Evolución |
|---|---|---|---|---|
| `ring-protection` | Ring of Protection | Común | Pasivo: reduce 5% el daño físico recibido. | Base de familia Armadura. |
| `chainmail` | Chainmail | Rara | Pasivo: reduce 9% el daño físico recibido. | Desde Ring of Protection. |
| `blade-mail` | Blade Mail | Épica | Pasivo: −10% daño físico. Activo: refleja 20% de daño físico perdido durante 4 s, máx. una devolución/2 s; recarga 25 s. | Rama desde Chainmail. |
| `assault-cuirass` | Assault Cuirass | Legendaria | Pasivo: reduce 14% el daño físico propio y 7% el del compañero a 180 unidades. La misma aura no se acumula. | Rama alternativa desde Chainmail. |

La devolución no activa críticos, robo de vida ni otras devoluciones. Los jefes reciben como máximo 0,15% de su vida máxima por devolución. La reducción total de daño por equipo tiene un límite de 35% para reducciones Dota, aplicado al final de sus combinaciones.

### Robo de vida: recuperarse atacando

| ID | Objeto | Rareza | Efecto implementado | Evolución |
|---|---|---|---|---|
| `morbid-mask` | Morbid Mask | Rara | Pasivo: cura 2% del daño efectivo del ataque principal, con máximo de 0,5% de vida máxima por segundo. | Base de familia Robo de vida. |
| `mask-madness` | Mask of Madness | Épica | Pasivo: conserva robo de vida. Activo: −15% intervalo y +10% daño recibido durante 4 s; recarga 20 s. | Rama desde Morbid Mask. |
| `satanic` | Satanic | Legendaria | Pasivo: robo de vida 3%, máx. 1% de vida/s. Activo: robo 8% durante 4 s, máx. 3% de vida/s; recarga 30 s. | Rama alternativa desde Morbid Mask. |

Solo cuenta el daño realmente quitado al enemigo en el primer impacto elegible de cada ataque. No cuentan Q/R, daño reflejado, daño de minions, daño a cajas ni cadenas secundarias. Un golpe de área usa un único presupuesto de curación, sin multiplicarlo por todos sus blancos. No revive a jugadores caídos.

### Resistencia: responder al daño especial y al control

| ID | Objeto | Rareza | Efecto implementado | Evolución |
|---|---|---|---|---|
| `cloak` | Cloak | Común | Pasivo: reduce 5% el daño especial recibido. | Base de familia Resistencia. |
| `glimmer-cape` | Glimmer Cape | Épica | Pasivo: −9% daño especial. Activo: escudo especial individual de 6% de vida máxima durante 3 s; recarga 20 s. Apunta al aliado cercano o protege al portador. | Rama desde Cloak. |
| `pipe-insight` | Pipe of Insight | Legendaria | Pasivo: −12% daño especial. Activo: escudo especial de 6% de vida máxima durante 4 s para aliados a 180 u; recarga 25 s. | Rama alternativa desde Cloak. |
| `black-king-bar` | Black King Bar | Legendaria | Pasivo: −9% daño especial. Activo: limpia lentitud, reduce 50% la nueva lentitud y 20% adicional de daño especial durante 4 s; recarga 35 s. | Rama alternativa desde Cloak. |

BKB no da inmunidad ni evita mecánicas obligatorias de jefes. Glimmer no concede invisibilidad. Glimmer y Pipe solo absorben daño especial: el físico quita vida sin gastarlos. No se acumulan ni renuevan mientras quede un escudo especial de equipo vigente; si todos los blancos ya están protegidos no se consume recarga.

### Impacto y control: cambiar cómo golpeas

| ID | Objeto | Rareza | Efecto implementado | Evolución |
|---|---|---|---|---|
| `javelin` | Javelin | Rara | Automático: cada 5 impactos directos del ataque principal añade 20% de su daño como daño especial al mismo blanco. | Base de familia Impacto. |
| `maelstrom` | Maelstrom | Épica | Automático: cada 6 impactos válidos lanza una cadena de hasta 3 enemigos a 120 unidades entre saltos; cada salto causa 20% del daño del ataque principal. Recarga interna 1 s. | Rama desde Javelin. |
| `mjollnir` | Mjollnir | Legendaria | Automático: cadena a 4 enemigos, 25% de potencia, recarga interna 1 s. Activo: aura eléctrica 4 s; perder vida dispara hasta 3 rayos especiales a 180 u, máx. una descarga/s; recarga 25 s. | Desde Maelstrom. |
| `skull-basher` | Skull Basher | Épica | Automático: cada 8 impactos válidos aturde al blanco 0,35 s; recarga interna 3 s. | Rama alternativa desde Javelin. |
| `abyssal-blade` | Abyssal Blade | Legendaria | Activo: golpe físico de 25% de potencia y aturde 0,55 s a 180 u; recarga 20 s. Jefes: lentitud de 10% durante 0,5 s, sin afectar transiciones. | Desde Skull Basher. |

Cada ataque emitido suma como máximo un impacto al contador, aunque tenga varios proyectiles o blancos. Los efectos secundarios no activan otros efectos secundarios. Las cadenas no golpean dos veces al mismo enemigo. Los jefes no se aturden: reciben una ralentización de 10% durante 0,5 s, si su fase permite ralentización. Máximo cuatro blancos y una cadena visual por activación.

### Economía: sacrificar un espacio por crecimiento

| ID | Objeto | Rareza | Efecto implementado | Evolución |
|---|---|---|---|---|
| `hand-midas` | Hand of Midas | Épica | Pasivo: +10% monedas sueltas, acumulando fracciones. Activo: convierte un enemigo normal a 240 u en 8 monedas de partida; recarga 45 s. Sin experiencia adicional por contadores. | Familia Economía independiente. Sin evolución inicial. |

No aumenta premios de cofres, ventas, eventos, compras ni monedas permanentes. En cooperativo, el bonus usa solo las monedas recogidas por el portador; dos Midas no multiplican el mismo premio. No paga por cajas, invocaciones ni enemigos recreados para pruebas.

## Distribución

Se mantiene la economía publicada: cofres comunes/raro/legendario conceden 15/35/80 monedas, además de tres opciones para elegir una. Si faltan objetos elegibles, se completa con suministros. Las evoluciones respetan la versión previa; un cofre mejor no regala una fase final incompatible.

| Fuente | Catálogo |
|---|---|
| Cofre común | Bases comunes: botas, stick, anillo de vida, hoja, guantes, protección física o capa. |
| Cofre raro | Bases raras y evoluciones raras compatibles; completa con comunes si faltan candidatos. |
| Cofre legendario | Prioriza legendarios compatibles; después épicos, raros y comunes elegibles. |
| Ambulante | Cuatro productos: curación, dos bases comunes rotativas y llave rara. |
| El Hueco | Cada tercera visita: llave legendaria y hasta tres objetos raros o evoluciones compatibles. |

Se conservan como referencia los precios actuales: base común 35, raro 70, épico 120 y legendario 180; curación 20, llave rara 40 y legendaria 100. Probar especialmente el precio de Midas y el tiempo de retorno de su inversión. No ampliar los catálogos simultáneos de las tiendas al aumentar la base total.

Para las nuevas familias, nivel mínimo de evolución: rara 5, épica 8 y legendaria 11. Las bases raras no requieren poseer otra versión. Las alternativas de familia son excluyentes durante esa partida. Los cambios de rama, ventas y reemplazos voluntarios necesitan diseño posterior; no están habilitados.

## Combinaciones de ejemplo

| Estilo | Cuatro objetos finales de ejemplo | Decisión que propone |
|---|---|---|
| Críticos rápidos | Power Treads + Daedalus + Moon Shard + Satanic | Más ataque y recuperación; poca mitigación. |
| Resistente | Heart of Tarrasque + Assault Cuirass + Pipe of Insight + Magic Wand | Aguantar y apoyar al compañero, con menor daño. |
| Limpiar hordas | Boots of Travel + Mjollnir + Moon Shard + Glimmer Cape | Golpear varios blancos y escapar, con curación limitada. |
| Controlar y moverse | Swift Blink + Abyssal Blade + Power Treads + Ring of Tarrasque | Posición y control; el jefe conserva sus mecánicas. |
| Crecer temprano | Boots of Speed + Hand of Midas + Morbid Mask + Chainmail | Invierte un espacio y monedas para mejorar el resto de la partida. |

Son ejemplos de destino de una combinación, no lotes garantizados ni recomendaciones de balance definitivo.

## Límites de ejecución

Los efectos comparten eventos de impacto y daño, y una identidad de ataque por portador. Solo el primer impacto elegible de cada descarga cuenta para robo de vida y contadores, aunque tenga varios proyectiles o blancos. Se excluyen Q/R y efectos secundarios. Los últimos 64 ataques conservan su marca para evitar dobles activaciones por proyectiles que regresan o impactos retrasados. Cadenas y golpes adicionales no generan otros efectos de equipo ni robo de vida genérico.

Las cadenas buscan como máximo cuatro blancos al activarse; no recorren enemigos por fotograma. Las auras consultan únicamente a los jugadores vivos. Escudos, contadores y recargas pertenecen a cada portador y se serializan en cooperativo; un escudo puede proteger a un compañero sin objetos. Los estados temporales se muestran en el HUD.

BKB actúa sobre las ralentizaciones temporales de tácticas, extinción, zonas dinámicas y Fiscalizador. No cancela viajes, escenas, veneno, daño ni mecánicas obligatorias. Moon Shard aplica un golpe adicional al blanco, sin crear un proyectil nuevo. Midas excluye práctica, desarrollo, enemigos invocados y premios de cofres/eventos.

## Decisiones pendientes de balance

- Confirmar si se mantiene el máximo de cuatro espacios antes de diseñar venta o sustitución voluntaria.
- Definir cómo se presentan visualmente las categorías y los requisitos de evolución.
- Probar si cadencia/críticos/robo de vida dominan a defensa/control; ajustar límites y porcentajes con resultados de partida.
- Medir el uso de los activables y ajustar recargas con partidas reales.
- Medir frecuencia de cofres, monedas y ofertas para que una partida permita completar combinaciones sin garantizar todos los legendarios.


## Activables implementados
Un objeto conserva sus bonos pasivos y añade una acción manual cuando corresponde. La tabla anterior describe los valores implementados. Los tiempos siguen sujetos a balance.

| Objeto | Acción propuesta | Límite inicial |
|---|---|---|
| Daga | Salto hacia el cursor | Mantener alcance, terreno y recarga actuales |
| Botas de viaje | Teletransportarse junto a un compañero vivo | Canalizar 2 s; daño cancela; llegada segura; 60 s. En solitario: regreso a un punto marcado seguro |
| Botas de fase | Acelerón y atravesar enemigos | 3 s / 15 s; no atraviesa paredes |
| Varita mágica | Gastar cargas para curarse | Sin sobrecuración; conservar límite de cargas |
| Blade Mail | Devolver parte del daño recibido | 4 s / 25 s; límite contra jefes |
| Satanic | Gran robo de vida temporal | 4 s / 30 s; requiere acertar golpes |
| Pipe of Insight | Escudo especial para aliados cercanos | 4 s / 25 s; no acumular escudos |
| Glimmer Cape | Escudo especial propio o de un aliado | 3 s / 20 s; sin invisibilidad total |
| Black King Bar | Reducir control y daño especial | 4 s / 35 s; no anula mecánicas de jefe |
| Mask of Madness | Más velocidad de ataque a cambio de recibir más daño | 4 s / 20 s |
| Hand of Midas | Convertir un enemigo normal en monedas | 45 s; excluye élites, jefes e invocaciones |
| Abyssal Blade | Golpe que aturde al objetivo | 20 s; duración reducida en jefes |
| Mjollnir | Aura que responde con rayos especiales al perder vida | 4 s / 25 s; límite de descargas |

Controles: E usa el objeto seleccionado, F cambia la selección y cada icono permite usar su objeto directamente. Clic también lo selecciona para E. No se añaden teclas por objeto. Las activaciones manuales sustituyen los disparadores automáticos de varita, Blade Mail, Satanic, Madness, Glimmer, Pipe, BKB y Abyssal. Mjollnir conserva la cadena de impactos y añade el aura manual.
