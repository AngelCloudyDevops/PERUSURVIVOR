# Segunda pasada: acumulación de perdigones y minijefes

La primera pasada redujo alcance y cadencia, pero cinco perdigones seguían sumando daño completo sobre el mismo blanco. Esta pasada mantiene el primer impacto y reduce los siguientes de la misma descarga contra ese enemigo: 100 %, 35 %, 15 %, 15 %… A corta distancia los cinco de Kingteka suman 30,24 de daño base en lugar de 84; dos suman 22,68, menos que los 28 de vida de un minion inicial.

La regla se aplica a las escopetas de Kingteka y Cerdito, incluidas sus evoluciones. Cada enemigo lleva su cuenta independiente: atravesar varios rivales no consume el daño completo del primero sobre los demás. Una descarga posterior vuelve a empezar y dos jugadores con el mismo personaje no comparten la cuenta. Otros ataques, áreas y la ulti no reciben este descuento. Se conserva la caída por distancia de la primera pasada.

Combat.hitDamage utiliza una WeakMap privada por enemigo con un máximo de 16 descargas recientes. Los proyectiles solo añaden un identificador serializable formado por slot, personaje y número de disparo. El cálculo se aplica tanto al barrido hasta el cañón como al vuelo; no añade bucles por toda la horda, entidades ni trabajo de dibujo. Las cajas mantienen el comportamiento anterior.

## Salud de minijefes al aparecer

Multiplicador de tiempo: `1 + clamp((mapTime - 45) / 75, 0, 2.6)`. Para dos jugadores se multiplica por 1,65, conservando cierta ventaja cooperativa. Se usa el tamaño del grupo al crear el minijefe, no la vida restante del compañero. El máximo se fija al nacer; subir de nivel, cambiar equipo o dejar pasar tiempo no le aumenta la vida durante la pelea. Pausa y arenas ya detienen mapTime. El laboratorio mantiene la salud base.

| Fiscalizador | Antes | Individual | Dos jugadores |
|---|---:|---:|---:|
| 1:15 | 460 | 644 | 1063 |
| 2:30 | 460 | 1104 | 1822 |
| 3:45 | 460 | 1564 | 2581 |

La Paloma Brava y el Huaco conservan sus proporciones de vida base. El multiplicador temporal se limita a 3,6 desde 4:00; el calendario existente no genera minijefes nuevos tras el jefe final. No se cambia la salud base de minions, pesados, veteranos o élites ni la de los jefes de arena/finales. Entradas, furia, avisos, recuperación vulnerable y recompensas se conservan.

## Medición

`node scripts/shotgun-miniboss-audit.cjs` compara los 18 personajes con y sin descuento, y las evoluciones de ambas escopetas. Son blancos inmóviles, sin ataques enemigos, en igualdad de rangos; el informe `shotgun-miniboss-audit.json` declara distancia, radios y condiciones. Es daño agregado por segundo; no mide supervivencia ni tiempo real de una pelea móvil.

| Kingteka | Primera pasada | Segunda |
|---|---:|---:|
| Cercano, rango inicial | 105,0 | 37,8 |
| Media distancia, rango inicial | 53,4 | 26,7 |
| Evolucionado, blanco de jefe | 445,6 | 222,8 |
| Evolucionado, fila de ocho | 594,1 | 371,3 |

La auditoría anterior permanece como registro de la primera pasada. Las pruebas cubren descargas nuevas, enemigos distintos, dos jugadores, memoria acotada, suma real de impactos, escalado por mapa/grupo, salud fija durante la pelea y laboratorio.
