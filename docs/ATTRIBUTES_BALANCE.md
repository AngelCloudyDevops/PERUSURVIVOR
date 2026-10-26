# Equilibrio de atributos y canales de daño

Fuerza → Técnica → Ingenio → Fuerza. Ventaja +15%, desventaja −10%, mismo atributo neutral. Daño = presupuesto existente de habilidad × `2A/(A+D)` × ventaja. Ataque principal 100/secundario 85; defensas según papel. La rareza no modifica los índices.

## Validación reproducible

57 partidas con atributos y 57 controles emparejados sin el multiplicador de atributos/defensas: 19 personajes × tres mapas, semilla 819. Motor normal a 30 Hz, bot de movimiento y selección entre mejoras ofrecidas, ultis disponibles y límite de 360 s. La fase de control desactiva solamente `P.Attributes.multiplier`; no restaura un motor antiguo ni cambia HP, XP o IA. Las estrellas/mejoras permanentes no intervienen. El bot no visita portales opcionales; estos jefes se comprueban por pruebas de integración, no por este muestreo.

Base de motor: `2105f248af8020ead56964f3b299172d97a693eb`; scripts y nuevas reglas incluidos en este cambio. Los datos anteriores de otras auditorías permanecen intactos. Un timeout es estar vivo al límite de observación, no una derrota. Una semilla por escenario detecta regresiones grandes; no demuestra igualdad entre personajes ni sustituye partidas humanas. No mide FPS renderizados.

| Medida | Control | Atributos |
|---|---:|---:|
| Victoria / muerte / timeout vivo | 55 / 0 / 2 | 49 / 6 / 2 |
| Vivos al minuto 5 | 57/57 | 57/57 |
| Tiempo mediano hasta matar minijefe (s, incluye entrada) | 10.1 | 10.0 |

## Fichas y resultados por personaje

ATQ y DEF son índices; el daño por impacto anterior sigue siendo el presupuesto de cada habilidad. No convertir un índice 100 en 100 puntos de daño bruto.

| Personaje | Atributo | Principal | ATQ F/E | DEF F/E | Control V/M/T | Atributos V/M/T |
|---|---|---|---:|---:|---:|---:|
| Cristorata | Técnica | Físico | 100/85 | 95/105 | 3 / 0 / 0 | 1 / 1 / 1 |
| Cuy Supremo | Fuerza | Especial | 85/100 | 110/100 | 3 / 0 / 0 | 3 / 0 / 0 |
| Paloma del Centro | Técnica | Físico | 100/85 | 90/100 | 3 / 0 / 0 | 3 / 0 / 0 |
| Alan García | Ingenio | Especial | 85/100 | 100/110 | 3 / 0 / 0 | 3 / 0 / 0 |
| Alberto Fujimori | Ingenio | Especial | 85/100 | 105/105 | 3 / 0 / 0 | 2 / 0 / 1 |
| Keiko Fujimori | Técnica | Físico | 100/85 | 100/100 | 3 / 0 / 0 | 2 / 1 / 0 |
| Ollanta Humala | Fuerza | Especial | 85/100 | 110/95 | 3 / 0 / 0 | 3 / 0 / 0 |
| Kingteka | Fuerza | Físico | 100/85 | 105/95 | 3 / 0 / 0 | 3 / 0 / 0 |
| Shakadoto | Fuerza | Físico | 100/85 | 110/90 | 3 / 0 / 0 | 2 / 1 / 0 |
| Najasor | Técnica | Físico | 100/85 | 90/100 | 3 / 0 / 0 | 3 / 0 / 0 |
| CiriloTV | Ingenio | Físico | 100/85 | 100/100 | 3 / 0 / 0 | 2 / 1 / 0 |
| Fuzo | Ingenio | Especial | 85/100 | 95/105 | 3 / 0 / 0 | 3 / 0 / 0 |
| Charles | Ingenio | Especial | 85/100 | 105/95 | 2 / 0 / 1 | 2 / 1 / 0 |
| Axel Benba | Técnica | Especial | 85/100 | 95/100 | 3 / 0 / 0 | 3 / 0 / 0 |
| Cerdito VTuber | Fuerza | Físico | 100/85 | 105/95 | 3 / 0 / 0 | 3 / 0 / 0 |
| Sustento | Técnica | Físico | 100/85 | 90/105 | 3 / 0 / 0 | 3 / 0 / 0 |
| Cevichero | Técnica | Físico | 100/85 | 100/95 | 3 / 0 / 0 | 2 / 1 / 0 |
| La G5 | Fuerza | Físico | 100/85 | 105/90 | 2 / 0 / 1 | 3 / 0 / 0 |
| Makanaky · La Realeza | Fuerza | Físico | 100/85 | 105/95 | 3 / 0 / 0 | 3 / 0 / 0 |

## Comprobación controlada

228 cruces: 19 personajes contra los seis diseños de minion, normal y pesado. Cada cruce registra salida principal y entrada por ambos canales con presupuesto 100, antes de equipo/armadura. El cambio debe mantener todos los cruces viables, sin inmunidades.

Daño saliente principal: 85.71–121.05 por 100 de presupuesto. Los canales se prueban por separado y los índices no se multiplican de nuevo en minijefes.

Se conserva el ajuste anterior de G5, Fuzo y Cerdito. Las variaciones pequeñas de emparejamiento se introducen con los atributos y las defensas, sin aumentar poder por rareza ni aplicar un aumento general de HP. Revisar las derrotas y tiempos en más semillas antes de nerfear personajes por una única partida.

## Tipos y excepciones

- Contacto y golpes de oficio: físicos. Proyectiles normales enemigos: especiales.
- Discurso, ondas, tarjetas de apoyo y nubes: especiales. Escopetas, micrófonos y golpes: físicos según ficha.
- Cuy/Paloma: estampida física; principal según ficha. Extras persistentes de evolución: especiales.
- Tribunal: ejecuciones y sentencia porcentual son daño fijo con los topes previos; la ventaja no puede convertir la sentencia a jefe en golpe letal.
- Dominio: ejecuciones a enemigos normales son fijas; golpes contra jefes usan canal físico.
- Proyectiles/campos guardan una copia de estadísticas del dueño. El servidor comparte la fórmula y no acepta fichas del input del cliente.

## Reproducir

```sh
node scripts/attributes-audit.cjs
node scripts/attributes-audit.cjs --baseline
node scripts/summarize-attributes.cjs
npm run check
npm test
```

Datos: `attributes-runs.json` y `attributes-baseline.json`. Pruebas específicas: `tests/attributes.test.cjs`, además de regresión individual/cooperativa y habilidades.
