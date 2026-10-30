# Auditoría de kits de bosses

Esta auditoría aplica a las amenazas mayores el mismo principio usado en las causas: mostrar solamente mecánicas reales y dejar cada hueco como **Por definir**. No concede ataques, pasivas o fases; tampoco modifica balance. La fuente ejecutable es `P.EnemyContract` y la Wiki deriva sus espacios de los catálogos jugables.

## Contrato común

| Categoría | Ataques | Habilidades de rol | Pasivas | Fases | Ulti | Expansión |
|---|---:|---:|---:|---:|---:|---:|
| Minijefe | 3 | 0 | 1 | 2 | 1 | No aplica |
| Jefe | 4 | 0 | 2 | 2 | 1 | 1 |

Además del kit, cada ficha debe declarar rol, atributo, canal de daño, debilidad y el contrato estadístico universal completo. Esos campos se mantienen como **Por definir** o **Desconocido** mientras no exista una fuente mecánica real. La ulti y la expansión son piezas separadas: una fase, pasiva o ataque no puede rellenar ambos espacios con otro nombre.

## Jefes de portal

| Boss | Ataques implementados | Pasivas | Ulti / Expansión | Fases | Falta definir |
|---|---|---|---|---|---|
| El Chosicano · Última Parada | Embestida de ruta; Bocinazo; Lluvia de boletos; Control de paradero | La familia es primero; Frenazo expuesto | Hora punta / Última Parada · La familia es primero | 2/2 | Kit 100 % cubierto. Validar ritmo, lectura de cobertura y balance en partidas completas |
| El Gabinete Infinito | Abanico ministerial; Pleno descontrolado; Proyecto de ley; Interpelación | Gabinete inestable; Reglas del pleno | Cuestión de confianza / Estado de emergencia | 4/4 | Mecánicas completas; falta dirección de arte, animación, audio y balance con partidas completas |
| El Guardián de la Niebla | Anillo de niebla; Golpe pétreo | Fase II al 50 % | Por definir / Por definir | 2/2 | Ataques 3–4; segunda pasiva; rol, atributo y canal |
| La Procesión de Medianoche | Anillo de niebla; Golpe pétreo | Fase II al 50 % | Por definir / Por definir | 2/2 | Identidad propia; ataques 3–4; segunda pasiva; rol, atributo y canal |
| El Grinch del Cercado | Abanico ministerial; Embestida de gabinete | Fase II al 50 % | Por definir / Por definir | 2/2 | Identidad propia; ataques 3–4; segunda pasiva; rol, atributo y canal |
| Gallinazo · Techo de Lima | Picada desde el cielo; Aleteo; Lluvia de plumas; Luna oscura | Fase II al 50 % | Por definir / Por definir | 2/2 | Segunda pasiva; rol, atributo y canal explícitos |
| Alberto Fujimori · El Expediente Final | Sello celeste; Archivo reservado; Sentencia legendaria | Fase II al 50 % | Por definir / Por definir | 2/2 | Ataque 4; segunda pasiva; rol, atributo y canal explícitos |

## Jefes de Extinción

| Boss | Ataques implementados | Pasivas | Ulti / Expansión | Fases | Falta definir |
|---|---|---|---|---|---|
| Tirano del Cráter | Embestida obligatoria; Rugido de choque; Pisotón sísmico; Lluvia de meteoritos | Agotamiento tras tres ataques; tormenta obligatoria | Por definir / Por definir | 2/2 | Rol textual definitivo; separar remate y expansión reales |
| Triceratops Fósil | Embestida fósil; Rugido ancestral; Pisotón de cámara; Carga contra pilares | Dos placas fósiles; cristal vulnerable durante aturdimiento | Por definir / Por definir | 2/2 | Rol textual definitivo; separar remate y expansión reales |

Los dos jefes de Extinción cubren ataques, pasivas y fases, pero la plantilla ampliada deja visibles sus espacios separados de ulti y expansión. No se reutilizará automáticamente meteoritos, tormenta, placas o mazmorra para llenarlos: primero debe decidirse si son realmente una pieza distinta y comprobarse en combate.

## Minijefes

| Minijefe | Ataques implementados | Pasiva/fase | Ulti | Falta definir |
|---|---|---|---|---|
| Makanaky · La Realeza | Grito real; Flash de la realeza | Fase II al 50 % | Por definir | Ataque 3; rol, atributo y canal explícitos |
| El Fiscalizador | Embestida fiscal; Cerco de conos | Fase II al 50 % | Por definir | Ataque 3; rol, atributo y canal explícitos |
| La Paloma Brava | Aleteo de plumas; Picotazo doble | Fase II al 50 % | Por definir | Ataque 3; rol, atributo y canal explícitos |
| El Huaco Renegado | Golpe del huaco; Fragmentos de cerámica | Fase II al 50 % | Por definir | Ataque 3; rol, atributo y canal explícitos |

## Orden recomendado

1. Definir identidad mecánica —rol, atributo y canal— desde el daño que ya ejecuta cada boss.
2. Separar las variantes estacionales de sus patrones heredados antes de diseñar ataques nuevos.
3. Completar primero los huecos de jefes de portal de dos ataques; cada ataque nuevo debe incluir aviso, geometría, cobertura y recuperación reales.
4. Diseñar el tercer ataque de los cuatro minijefes sin aumentar su frecuencia total: el nuevo patrón reemplaza turnos, no los añade.
5. Definir segundas pasivas solo cuando cambien una decisión del jugador y tengan lectura visual propia.
6. Validar daño, duración, móvil, movimiento reducido y cooperativo antes de marcar cualquier espacio como implementado.
