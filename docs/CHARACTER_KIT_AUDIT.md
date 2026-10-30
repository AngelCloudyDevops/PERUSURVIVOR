# Auditoría de kits de personajes

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
| Cristorata | Clip de ida y vuelta | Reservado | Reservado | 1/3 |
| Cuy Supremo | ¡Habla, causa! | Reservado | Reservado | 1/3 |
| Paloma del Centro | Ráfaga de la plaza | Reservado | Reservado | 1/3 |
| Alan García | Discurso interminable | Reservado | Reservado | 1/3 |
| Alberto Fujimori | Banda presidencial | Reservado | Reservado | 1/3 |
| Keiko Fujimori | Abanico naranja | Reservado | Reservado | 1/3 |
| Ollanta Humala | Voz de mando | Reservado | Reservado | 1/3 |
| Kingteka · Amor a los animales | Escopeta causa | Gallinazo | Golpe de cuerpo | **3/3** |
| Shakadoto | Plátanos de vuelta | Reservado | Reservado | 1/3 |
| Najasor | ¡CPEZ! | Reservado | Reservado | 1/3 |
| CiriloTV | Vómito tóxico | Reservado | Reservado | 1/3 |
| Fuzo | Tarjetazo BCP | Reservado | Reservado | 1/3 |
| Charles | Bebé de juguete lanzador | Reservado | Reservado | 1/3 |
| Axel Benba | Clip relámpago | Reservado | Reservado | 1/3 |
| Sustento | Rifle de cucarachas | Reservado | Reservado | 1/3 |
| Cevichero | Enjambre azul | Reservado | Reservado | 1/3 |
| La G5 | Patada G5 · 145° | Reservado | Reservado | 1/3 |
| Makanaky · La Realeza | Puño de la Realeza | Mete cabezazos como yo | GAA | **3/3** |
| Sideral · Espantaminions | Mirada Sideral | Colazo del Lagarto | Huevo sospechoso | **3/3** |
| Chamelín · Trovo | Retaguardia de Trovo | Reservado | Reservado | 1/3 |

Resumen: 20 causas, 26 ataques personales funcionales, sin conceptos en estado planeado y tres contratos 9/9 completos: Kingteka, Makanaky y Sideral. Detalle del nuevo kit: [SIDERAL_KIT.md](SIDERAL_KIT.md).

## Q, R y pasivas

### Ultis Q implementadas con carta full art

- Kingteka: Gallinazos.
- Alberto Fujimori: Tribunal.
- Cristorata: invocación y montura de dragón.
- Cuy Supremo: estampida.
- Paloma del Centro: bandada.
- Makanaky: Los Tres de la Realeza.
- Sideral: Despertar del Lagarto (ilustración exclusiva del Lagarto).

### Expansiones R implementadas con carta full art

- Kingteka: Santuario del Reino Animal.
- Makanaky: dominio de la Realeza.
- Sideral: Habitación del Lagarto.
- CiriloTV: Audiencia.
- Chamelín Trovo: Baño de Trovo.

### Pasivas únicas

- Kingteka: Instinto de expedición.
- Makanaky: Racha de la Realeza.
- Sideral: Sangre fría.
- Los otros 17 espacios están reservados y no otorgan efectos.

Kingteka, Makanaky y Sideral son kits cerrados de extremo a extremo: tres ataques funcionales, tres evoluciones, Q, R y pasiva. Makanaky alterna puño, cabezazo y GAA; Respeto de Q y la carga del dominio son independientes.

## Cobertura de ilustraciones

- Los 12 poderes Q/R implementados ya tienen una ruta de carta full art registrada; Los Tres de la Realeza reutiliza temporalmente el full art de personaje de Makanaky.
- Las tres armas de Kingteka tienen full art propio para las cartas de subida de nivel.
- Los ataques personales del resto todavía usan composición procedural con sprite e icono; no poseen full art dedicado.
- Ocho causas tienen ilustración grande de personaje en Causapedia: Cristorata, Cuy, Paloma, Kingteka, Chamelín, Makanaky, Sideral y Cirilo.

## Orden de trabajo recomendado

1. Crear las dos full arts pendientes de Makanaky y verificar tarjetas en escritorio y móvil.
2. Afinar el balance numérico de sus tres técnicas, Q y R con partidas completas.
3. Elegir el siguiente personaje entre quienes ya tienen Q o R, definir juntos sus ataques 2 y 3 y repetir el mismo contrato.
4. Diseñar pasivas solo después de cerrar los tres ataques, para evitar que tapen carencias del arsenal.
5. Probar cada kit a nivel base y máximo contra minions, minijefes y jefe antes de marcarlo como completo.


Sideral está 9/9: tres técnicas, tres evoluciones, Sangre fría, Q y dominio existente. Su Q ya tiene ilustración exclusiva del Lagarto; ya tiene medición automática y ajustes de huevo/Q en [SIDERAL_BALANCE.md](SIDERAL_BALANCE.md), con validación humana pendiente.
