# Auditoría de kits de personajes

> Histórico: refleja el estado del commit `77bf549` (2026-10-30), con 20 causas. Hoy hay 21 personajes jugables (`src/data/catalog.js:3-11` menos ElZeein, que `shift()` convierte en jefe en `src/data/catalog.js:32`; `src/data/catalog.js:33`; `src/data/powers.js:74-109`; comprobado por `tests/gameplay.test.cjs:12`); Marciano de SJL (`src/data/powers.js:109`) no figura aquí. Ver código.

Estado comprobado contra el código del juego. Esta tabla distingue lo que funciona en combate de lo que solo está planeado o reservado.

## Regla del roster

- Cada causa dispone de exactamente tres slots de ataque personal.
- `Implementado` significa que el ataque tiene perfil de combate y puede ejecutarse.
- `Planeado` conserva un concepto aprobado, pero no habilita cartas, controles ni daño.
- `Reservado` no tiene diseño aprobado y debe mostrarse como próximamente.
- Q (ulti), R (expansión) y la pasiva única no sustituyen ninguno de los tres ataques.
- Una evolución mejora un ataque existente; tampoco cuenta como un ataque nuevo.

El arsenal ejecutable vive en `P.CharacterProfiles.weaponKits` y `weaponSlots`; `P.CharacterContract` lo combina con tres evoluciones, pasivas, ultis y dominios para producir el estado único que leen Wiki, ficha extensa y Balance. Ninguna interfaz presenta una evolución o una definitiva como si fuera el segundo o tercer ataque.

## Resultado actual

| Causa | Ataque 1 funcional | Ataque 2 | Ataque 3 | Arsenal |
|---|---|---|---|---|
| Cristorata | Clip de ida y vuelta | Derrape del directo | Garra del dragón | **3/3** |
| Cuy Supremo | ¡Habla, causa! | Reservado | Reservado | 1/3 |
| Paloma del Centro | Ráfaga de la plaza | Reservado | Reservado | 1/3 |
| Alan García | Discurso interminable | Reservado | Reservado | 1/3 |
| Alberto Fujimori | Banda presidencial | Reservado | Reservado | 1/3 |
| Keiko Fujimori | Abanico naranja | Reservado | Reservado | 1/3 |
| Ollanta Humala | Voz de mando | Reservado | Reservado | 1/3 |
| Kingteka · Amor a los animales | Escopeta causa | Gallinazo | Golpe de cuerpo | **3/3** |
| Shakadoto | Plátanos de vuelta | Reservado | Reservado | 1/3 |
| Najasor | ¡CPEZ! | Reservado | Reservado | 1/3 |
| CiriloTV | Vómito tóxico | Taxi de Cirilo | Eco maldito | **3/3** |
| Fuzo | Tarjetazo BCP | Reservado | Reservado | 1/3 |
| Charles | Bebé de juguete lanzador | Reservado | Reservado | 1/3 |
| Axel Benba | Clip relámpago | Reservado | Reservado | 1/3 |
| Sustento | Rifle de cucarachas | Reservado | Reservado | 1/3 |
| Cevichero | Enjambre azul | Reservado | Reservado | 1/3 |
| La G5 | Patada G5 · 145° | Reservado | Reservado | 1/3 |
| Makanaky · La Realeza | Puño de la Realeza | Mete cabezazos como yo | GAA | **3/3** |
| Sideral · Espantaminions | Mirada Sideral | Colazo del Lagarto | Huevo sospechoso | **3/3** |
| Chamelín · Trovo | Retaguardia de Trovo | Escupitajo pegajoso | Pichi de Trovo | **3/3** |

Resumen: 20 causas, 32 ataques personales funcionales, sin conceptos en estado planeado y seis contratos 9/9 completos: Kingteka, Makanaky, Sideral, CiriloTV, Chamelín y Cristorata. Detalle del nuevo kit: [SIDERAL_KIT.md](../diseno/SIDERAL_KIT.md).

## Q, R y pasivas

### Ultis Q implementadas con carta full art

- Kingteka: Gallinazos.
- Alberto Fujimori: Tribunal.
- Cristorata: invocación y montura de dragón.
- Cuy Supremo: estampida.
- Paloma del Centro: bandada.
- Makanaky: Los Tres de la Realeza.
- Sideral: Despertar del Lagarto (ilustración exclusiva del Lagarto).
- CiriloTV: ¡FULL MALDAD! (ilustración exclusiva).
- Chamelín: ¡SE TAPÓ TODO! (ilustración exclusiva de ondas de presión).

### Expansiones R implementadas con carta full art

- Kingteka: Santuario del Reino Animal.
- Makanaky: dominio de la Realeza.
- Sideral: Habitación del Lagarto.
- CiriloTV: Audiencia.
- Chamelín Trovo: Baño de Trovo.
- Cristorata: El Coliseo del Dragón (arte de personaje existente; ilustración R exclusiva pendiente).

### Pasivas únicas

- Kingteka: Instinto de expedición.
- Makanaky: Racha de la Realeza.
- Sideral: Sangre fría.
- CiriloTV: Persistencia maldita (reglas de riesgo y resurrección existentes formalizadas).
- Chamelín: Presión acumulada.
- Cristorata: De ida y de vuelta.
- Los otros 14 espacios están reservados y no otorgan efectos.

Kingteka, Makanaky, Sideral, CiriloTV, Chamelín y Cristorata son kits cerrados de extremo a extremo: tres ataques funcionales, tres evoluciones, Q, R y pasiva. Makanaky alterna puño, cabezazo y GAA; Respeto de Q y la carga del dominio son independientes.

## Cobertura de ilustraciones

- Los 15 poderes Q/R implementados ya tienen una ruta de carta full art registrada; Los Tres de la Realeza ya posee ilustración exclusiva y El Coliseo del Dragón todavía reutiliza temporalmente la de Cristorata.
- Las tres armas de Kingteka tienen full art propio para las cartas de subida de nivel.
- Los ataques personales del resto todavía usan composición procedural con sprite e icono; no poseen full art dedicado.
- Ocho causas tienen ilustración grande de personaje en Causapedia: Cristorata, Cuy, Paloma, Kingteka, Chamelín, Makanaky, Sideral y Cirilo.

## Orden de trabajo recomendado

1. Verificar la tarjeta exclusiva de Los Tres de la Realeza en escritorio y móvil y crear la ilustración pendiente de El Coliseo del Dragón.
2. Afinar el balance numérico de las tres técnicas, Q y R de Makanaky con partidas completas.
3. Elegir el siguiente personaje entre quienes ya tienen Q o R, definir juntos sus ataques 2 y 3 y repetir el mismo contrato.
4. Diseñar pasivas solo después de cerrar los tres ataques, para evitar que tapen carencias del arsenal.
5. Probar cada kit a nivel base y máximo contra minions, minijefes y jefe antes de marcarlo como completo.


Sideral está 9/9: tres técnicas, tres evoluciones, Sangre fría, Q y dominio existente. Su Q ya tiene ilustración exclusiva del Lagarto; ya tiene medición automática y ajustes de huevo/Q en [SIDERAL_BALANCE.md](SIDERAL_BALANCE.md), con validación humana pendiente.

CiriloTV completa 9/9 con taxi, eco, evoluciones, pasiva registrada y Q. Se conservan Audiencia y transformaciones. [CIRILO_KIT.md](../diseno/CIRILO_KIT.md) describe límites, carga independiente y trabajo visual/balance pendiente.
