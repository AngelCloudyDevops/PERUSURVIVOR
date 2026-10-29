# Auditoría de kits de personajes

Estado comprobado contra el código del juego. Esta tabla distingue lo que funciona en combate de lo que solo está planeado o reservado.

## Regla del roster

- Cada causa dispone de exactamente tres slots de ataque personal.
- `Implementado` significa que el ataque tiene perfil de combate y puede ejecutarse.
- `Planeado` conserva un concepto aprobado, pero no habilita cartas, controles ni daño.
- `Reservado` no tiene diseño aprobado y debe mostrarse como próximamente.
- Q (ulti), R (expansión) y la pasiva única no sustituyen ninguno de los tres ataques.
- Una evolución mejora un ataque existente; tampoco cuenta como un ataque nuevo.

El contrato ejecutable vive en `P.CharacterProfiles.weaponKits` y `weaponSlots`. Las fichas de la Causapedia leen ese contrato para no presentar una evolución o una definitiva como si fueran el segundo o tercer ataque.

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
| Makanaky · La Realeza | Puño de la realeza | **Planeado:** Tú no tienes mano | **Planeado:** Gaaaa | 1 implementado + 2 planeados |
| Sideral · Espantaminions | Mirada Sideral | Reservado | Reservado | 1/3 |
| Chamelín · Trovo | Retaguardia de Trovo | Reservado | Reservado | 1/3 |

Resumen: 20 causas, 22 ataques personales funcionales, dos conceptos planeados y solo un arsenal completo. Makanaky es el siguiente kit listo para implementación porque sus tres conceptos ya fueron acordados.

## Q, R y pasivas

### Ultis Q implementadas con carta full art

- Kingteka: Gallinazos.
- Alberto Fujimori: Tribunal.
- Cristorata: invocación y montura de dragón.
- Cuy Supremo: estampida.
- Paloma del Centro: bandada.

### Expansiones R implementadas con carta full art

- Kingteka: Santuario del Reino Animal.
- Makanaky: dominio de la Realeza.
- Sideral: Habitación del Lagarto.
- CiriloTV: Audiencia.
- Chamelín Trovo: Baño de Trovo.

### Pasivas únicas

- Kingteka: Instinto de manada.
- Makanaky: Racha de la Realeza.
- Los otros 18 espacios están reservados y no otorgan efectos.

Kingteka es el primer kit cerrado de extremo a extremo: tres ataques funcionales, Q, R, pasiva y arte propio para las cinco cartas de combate. Instinto de manada recupera 2,5 % de vida máxima al cambiar de arma, prepara un único ataque con +12 % de daño durante 4 s y tiene 7 s de recuperación.

## Cobertura de ilustraciones

- Los 10 poderes Q/R implementados ya tienen una ruta de carta full art registrada.
- Las tres armas de Kingteka tienen full art propio para las cartas de subida de nivel.
- Los ataques personales del resto todavía usan composición procedural con sprite e icono; no poseen full art dedicado.
- Ocho causas tienen ilustración grande de personaje en Causapedia: Cristorata, Cuy, Paloma, Kingteka, Chamelín, Makanaky, Sideral y Cirilo.

## Orden de trabajo recomendado

1. Implementar y equilibrar el cabezazo y `Gaaaa` de Makanaky, con cambio 1–3 y rangos independientes.
2. Crear sus dos full arts de ataque y verificar tarjetas en escritorio y móvil.
3. Elegir el siguiente personaje entre quienes ya tienen Q o R, definir juntos sus ataques 2 y 3 y repetir el mismo contrato.
4. Diseñar pasivas solo después de cerrar los tres ataques, para evitar que tapen carencias del arsenal.
5. Probar cada kit a nivel base y máximo contra minions, minijefes y jefe antes de marcarlo como completo.

