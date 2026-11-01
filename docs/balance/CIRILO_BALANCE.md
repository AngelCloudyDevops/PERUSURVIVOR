# Balance medido de CiriloTV · 29 de octubre de 2026

Se corrigen la puntería de Taxi/Eco/Q contra blancos móviles y la pérdida de la explosión de Eco cuando su primer impacto mata al blanco. Q recibe un ajuste de daño y crecimiento por evolución. No cambian stats base, Vómito/Glucosa, resistencia del taxi, pasiva, Audiencia ni transformaciones.

## Método y alcance

Son **60 ejecuciones automáticas locales del motor real**, 30 antes y 30 después, más 40 duelos controlados. Se usa `Game.update` en solitario y `Simulation` autoritativa con dos Cirilo en cooperativo. No son partidas humanas, pruebas de ping/FPS ni de carga del VPS; no se abrieron salas públicas ni se modificaron otros servicios.

En partidas se conservan reloj, aparición, colisiones, daño, niveles, cartas efectivamente ofrecidas, curaciones y reanimación normales. No se regalan vida, cargas, objetos, niveles ni bajas. Controlador a 0,2 s y motor a 30 Hz; R tiene prioridad sobre Q cuando ambas están listas. No se solicitan portales opcionales. Se mide la partida rápida, no Supervivencia de 30 minutos.

- Serie principal: tres mapas (Campo, Plaza y Machu), semillas 101/202/303, ambos modos: 18 intentos por fase, límite 360 s.
- Estilos: Campo/101, preferencias Vómito, Taxi, Eco y adaptativa, ambos modos: ocho por fase. Las preferencias usan la técnica cuando está desbloqueada; no fuerzan ofertas. Incluyen repeticiones de la configuración adaptativa de la serie principal.
- Cierre: Campo/101, preferencias Vómito y Eco, ambos modos, límite 600 s. Al aparecer el jefe final usa el mecanismo normal de objetivo fijado. Cuatro por fase; algunas derrotas previas al jefe repiten el intento de estilos.

En total 59 ejecuciones acabaron en victoria o derrota y una quedó en `timeout`; esta no se cuenta como victoria. Las repeticiones y estilos impiden interpretar el conjunto como una tasa independiente de victorias.

## Partidas completas y resultados mixtos

Serie principal adaptativa: nueve intentos por modo y fase.

| Modo | Mediana de duración antes → después | Mediana de bajas antes → después | Victorias antes → después |
|---|---:|---:|---:|
| Solitario | 121,90 → 131,43 s | 127 → 137 | 0 → 0 |
| Cooperativo | 155,57 → 151,43 s | 174 → 176 | 0 → 0 |

El controlador adaptativo entra al taxi cuando el rival está a menos de 140 u; vuelve a hacerlo frecuentemente. Es un estilo demasiado expuesto y no termina la partida en esta muestra. **No hay una mejora general demostrada del cooperativo adaptativo**. No se compensa este resultado aumentando globalmente defensa, vida o daño.

Estilos en Campo/101, sin fijar jefe, límite 360 s:

| Preferencia | Solitario antes → después | Cooperativo antes → después |
|---|---|---|
| Vómito | Derrota 290,17 → derrota 320,10 s | Victoria 314,50 → victoria 312,80 s |
| Taxi | Derrota 110,43 → derrota 153,60 s | Derrota 119,63 → derrota 146,10 s |
| Eco | Derrota 202,17 → límite 360 s, 104,59 PV | Derrota 282,90 → derrota 317,53 s |
| Adaptativa | Derrota 193,00 → derrota 118,80 s | Derrota 165,63 → derrota 133,13 s |

Comprobaciones de cierre con objetivo fijado y límite suficiente:

| Preferencia / modo | Antes | Después |
|---|---|---|
| Vómito / solitario | Derrota 290,17 s | Derrota 317,73 s |
| Vómito / cooperativo | Victoria 309,03 s; 43,09 / 110,07 PV | Victoria 310,13 s; 72,54 / 142,18 PV |
| Eco / solitario | Derrota 202,17 s | **Victoria 393,13 s; 125,58 PV** |
| Eco / cooperativo | Derrota 282,90 s | **Victoria 315,30 s; 9,83 / 10,26 PV** |

Estos casos muestran que el kit puede completar la partida en ambos modos con progresión normal, pero no prueban equilibrio definitivo. El cooperativo con Eco termina con muy poco margen. Ofertas, movimiento y orden de bajas cambian el recorrido posterior incluso usando la misma semilla.

## Ajustes y controles

### Anticipación de Taxi, Eco y Q

Antes apuntaban al lugar actual del enemigo. Se toman muestras de posición una sola vez por instante del motor en un `WeakMap` local: velocidad estimada máxima 260 u/s, muestra válida hasta 0,2 s y saltos mayores de 120 u descartados. La predicción máxima es 0,4 s para proyectiles y 0,5 s para taxi, incluyendo su preparación. Si el tramo previsto cruza cobertura, se conserva el objetivo actual. Se reinicia al cambiar de escena o retroceder el reloj.

Se decide la dirección una sola vez al lanzar cada ataque; **no hay proyectiles teledirigidos**. El taxi sigue su ruta fija de ida y vuelve por el recorrido registrado; no persigue al blanco. Conserva preparación, velocidades, daño, colisiones, alcance, impacto único por tramo, reversa solo evolucionada y resistencia de 40 %.

Duelo controlado: blanco durable a 200 u, atributo Fuerza y DEF especial/física 100; Cirilo obtiene nivel 14 y rangos mediante cartas reales. Blanco móvil en círculo a 0,8 rad/s, sin ataques enemigos ni terreno. Los valores incluyen atributos y defensa, no son coeficientes brutos universales. Las primeras descargas pueden fallar antes de disponer de una muestra de movimiento.

| Ataque / rango | DPS quieto antes → después | DPS móvil antes → después |
|---|---:|---:|
| Taxi / 1 | 14,90 → 14,90 | 0 → 12,42 |
| Taxi / 5 | 23,25 → 23,25 | 0 → 23,25 |
| Taxi evolucionado / 5 | 39,91 → 39,91 | 0 → 23,25 |
| Eco / 1 | 22,19 → 22,19 | 0 → 20,21 |
| Eco / 5 | 40,80 → 40,80 | 0 → 37,71 |

La reversa del taxi no garantiza otro acierto contra blancos que abandonaron su trayectoria. Eco evolucionado conserva el mismo DPS individual: su ventaja es transmitir hasta dos marcas secundarias, no incrementar el daño contra un blanco aislado.

Vómito original se conserva: 73,87 / 137,49 DPS quieto en rangos 1/5; el estrés lateral produce 0 DPS móvil antes y después. Es una limitación conocida de esa trayectoria, no una mejora que se atribuya a este parche. No se toca su funcionamiento ni el aliento usado por Audiencia.

### Eco tras un impacto mortal

El impacto inicial ahora deja la marca también si mata al blanco. La explosión ocurre 0,75 s después en su última posición y puede dañar a vecinos. Conserva daño inicial, explosión, radio, cobertura, seis marcas máximas y evolución de dos marcas al 50 %, sin propagación recursiva. La prueba reproduce una baja inicial y verifica daño posterior al vecino; el caso no queda cubierto por el duelo durable.

### Q · ¡FULL MALDAD!

Coeficiente por proyectil **0,75 → 1,05**. La escala al activar conserva `1 + 0,14 × (mayor rango − 1)` y añade **×1,15 si tiene al menos una evolución personal**. No suma rangos ni evoluciones; cambios posteriores no recalculan una Q activa. Se verifican salida desde la boca y cobertura también en el tramo inicial.

Con el blanco quieto del control, daño total de Q **114,13 → 159,78** en rango 1 y **178,04 → 249,26** en rango 5 sin evolución. Dividiendo por su ventana de 1,95 s: **58,53 → 81,94 DPS** y **91,30 → 127,83 DPS**. El control deja correr 3 s para resolver proyectiles en vuelo; su campo `dps` usa esos 3 s y es diferente de `qWindowDps`.

Contra el blanco móvil pasa de cero a 79,89 / 124,63 de daño total (rangos 1/5). No todos los proyectiles de un abanico tienen por qué acertar al mismo rival. Se conservan tres abanicos, nueve proyectiles, 1,95 s, movilidad, carga por baja y depósitos Q/R separados. No añade curación, invulnerabilidad, transformación ni recarga con sus propias bajas.

### Pasiva, stats, Audiencia y transformaciones

Sin cambios: 135 PV, velocidad 165, poder 24 y rareza UR; +10 % de daño recibido y etapas originales. La resurrección sigue siendo única, al 40 % de vida, con transformación y multiplicadores originales. La prueba de contacto letal cooperativo y las 41 pruebas existentes de CiriloUR siguen verificándolas.

Se registraron cero resurrecciones antes y dos después en estos recorridos. Los niveles finales máximos fueron 14: **no prueban una llegada natural a nivel 20**. Las dos resurrecciones ocurrieron en los intentos individuales de Vómito, donde Audiencia puede llevar temporalmente a la etapa demoníaca y la implementación original permite resucitar. Se conserva ese comportamiento; no se deduce que el umbral natural haya cambiado. Esta muestra no justifica ampliar vidas o reducir el riesgo pasivo.

Las huellas SHA-256 normalizadas de `cirilo-ur.js` y `cirilo-arena.js` son idénticas antes/después. No se modifican sus métodos, timers, transformaciones ni daño del dominio.

## Evidencia reproducible

Base: `ecb0ef74a6560a56987d470f549924d13a44c2f6`. Los JSON guardan SHA base y huellas normalizadas del código medido. El candidato tiene cambios locales sobre esa base, identificados por la huella de `cirilo-kit.js`; `sourceSha` por sí solo no identifica el candidato.

- [Principal antes](datos/cirilo-balance-before-domain.json) / [después](datos/cirilo-balance-after-domain.json).
- [Estilos antes](datos/cirilo-balance-before-pilot-domain.json) / [después](datos/cirilo-balance-after-pilot-domain.json).
- [Cierre con Vómito antes](datos/cirilo-balance-before-boss-domain.json) / [después](datos/cirilo-balance-after-boss-domain.json).
- [Cierre con Eco antes](datos/cirilo-balance-before-echo-boss-domain.json) / [después](datos/cirilo-balance-after-echo-boss-domain.json).
- [Duelos antes](datos/cirilo-duels-before.json) / [después](datos/cirilo-duels-after.json).

```sh
node scripts/cirilo-balance-audit.cjs --after --domain
node scripts/cirilo-balance-audit.cjs --after --pilot --domain
node scripts/cirilo-balance-audit.cjs --after --finish-boss --domain
node scripts/cirilo-balance-audit.cjs --after --finish-echo --domain
node scripts/cirilo-combat-measure.cjs --after
```

Para repetir el antes, omitir `--after` y usar `--source-root RUTA` a un checkout separado de la base (misma lista de módulos). Auditores, muestras controladas y archivos de evidencia quedan fuera de `dist/`; no se distribuyen controles para manipular partidas.

Siguiente validación: jugadores humanos, uso ocasional y seguro del taxi, más compañeros/objetos y Supervivencia. Se conservan las derrotas y el límite en la evidencia; no se declara cerrado el balance general.
