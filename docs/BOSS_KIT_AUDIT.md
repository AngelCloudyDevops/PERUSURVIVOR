# Auditoría de kits de bosses

Esta auditoría aplica a las amenazas mayores el mismo principio usado en las causas: mostrar solamente mecánicas reales y dejar cada hueco como **Por definir**. No concede ataques, pasivas o fases; tampoco modifica balance. La fuente ejecutable es `P.EnemyContract` y la Wiki deriva sus espacios de los catálogos jugables.

## Contrato común

| Categoría | Ataques | Habilidades de rol | Pasivas | Fases |
|---|---:|---:|---:|---:|
| Minijefe | 3 | 0 | 1 | 2 |
| Jefe | 4 | 0 | 2 | 2 |

Además del kit, cada ficha debe declarar rol, atributo, canal de daño y debilidad. Esos campos se mantienen como **Por definir** o **Desconocido** mientras no exista una fuente mecánica real.

## Jefes de portal

| Boss | Ataques implementados | Pasivas | Fases | Falta definir |
|---|---|---|---|---|
| El Chosicano · Última Parada | Embestida de ruta; Bocinazo; Lluvia de boletos; La familia es primero | Fase II al 50 % | 2/2 | Segunda pasiva; rol, atributo y canal explícitos |
| El Gabinete Infinito | Abanico ministerial; Embestida de gabinete | Fase II al 50 % | 2/2 | Ataques 3–4; segunda pasiva; rol, atributo y canal |
| El Guardián de la Niebla | Anillo de niebla; Golpe pétreo | Fase II al 50 % | 2/2 | Ataques 3–4; segunda pasiva; rol, atributo y canal |
| La Procesión de Medianoche | Anillo de niebla; Golpe pétreo | Fase II al 50 % | 2/2 | Identidad mecánica propia o declaración explícita de variante; ataques 3–4; segunda pasiva; rol, atributo y canal |
| El Grinch del Cercado | Abanico ministerial; Embestida de gabinete | Fase II al 50 % | 2/2 | Identidad mecánica propia o declaración explícita de variante; ataques 3–4; segunda pasiva; rol, atributo y canal |
| Gallinazo · Techo de Lima | Picada desde el cielo; Aleteo; Lluvia de plumas; Luna oscura | Fase II al 50 % | 2/2 | Segunda pasiva; rol, atributo y canal explícitos |
| Alberto Fujimori · El Expediente Final | Sello celeste; Archivo reservado; Sentencia legendaria | Fase II al 50 % | 2/2 | Ataque 4; segunda pasiva; rol, atributo y canal explícitos |

## Jefes de Extinción

| Boss | Ataques implementados | Pasivas | Fases | Falta definir |
|---|---|---|---|---|
| Tirano del Cráter | Embestida obligatoria; Rugido de choque; Pisotón sísmico; Lluvia de meteoritos | Agotamiento tras tres ataques; tormenta obligatoria | 2/2 | Rol textual definitivo; comprobar que atributo y canal mostrados coincidan con el daño real |
| Triceratops Fósil | Embestida fósil; Rugido ancestral; Pisotón de cámara; Carga contra pilares | Dos placas fósiles; cristal vulnerable durante aturdimiento | 2/2 | Rol textual definitivo; comprobar que atributo y canal mostrados coincidan con el daño real |

Los dos jefes de Extinción cubren el presupuesto completo de kit. El trabajo pendiente allí es validación de identidad, lectura visual y balance con partidas completas, no añadir más acciones.

## Minijefes

| Minijefe | Ataques implementados | Pasiva/fase | Falta definir |
|---|---|---|---|
| Makanaky · La Realeza | Grito real; Flash de la realeza | Fase II al 50 % | Ataque 3; rol, atributo y canal explícitos |
| El Fiscalizador | Embestida fiscal; Cerco de conos | Fase II al 50 % | Ataque 3; rol, atributo y canal explícitos |
| La Paloma Brava | Aleteo de plumas; Picotazo doble | Fase II al 50 % | Ataque 3; rol, atributo y canal explícitos |
| El Huaco Renegado | Golpe del huaco; Fragmentos de cerámica | Fase II al 50 % | Ataque 3; rol, atributo y canal explícitos |

## Orden recomendado

1. Definir identidad mecánica —rol, atributo y canal— desde el daño que ya ejecuta cada boss.
2. Separar las variantes estacionales de sus patrones heredados antes de diseñar ataques nuevos.
3. Completar primero los huecos de jefes de portal de dos ataques; cada ataque nuevo debe incluir aviso, geometría, cobertura y recuperación reales.
4. Diseñar el tercer ataque de los cuatro minijefes sin aumentar su frecuencia total: el nuevo patrón reemplaza turnos, no los añade.
5. Definir segundas pasivas solo cuando cambien una decisión del jugador y tengan lectura visual propia.
6. Validar daño, duración, móvil, movimiento reducido y cooperativo antes de marcar cualquier espacio como implementado.
