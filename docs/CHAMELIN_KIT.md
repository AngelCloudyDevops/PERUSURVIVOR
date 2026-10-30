# Chamelín · charcos, Pegote y presión

Kit funcional 9/9: tres ataques, tres evoluciones, Presión acumulada, ¡SE TAPÓ TODO! Q y Baño de Trovo R. Se mantienen 125 PV, velocidad 185, poder 28 y rareza UR. No se editan `chamelin.js`, `chamelin-arena.js` ni las láminas/animaciones del dominio. No se declara cerrado el balance de partidas completas.

## Arsenal y evolución

Teclas 1/2/3 o botones táctiles. Pegote se ofrece por carta desde nivel 2 y Pichi desde nivel 4. Cada técnica tiene rango 1–5 propio: +14 % de daño, +5 % de alcance y ×0,96 al intervalo por rango adicional. Rangos 2–5 requieren niveles 6/8/10/12; evolución, rango 5 y nivel 14. El catálogo no recibe mejoras de una partida. Cambio con intervalo mínimo 0,3 s; no se cambia durante Q o Baño de Trovo.

| Técnica | Intervalo / alcance base | Función | Evolución |
|---|---|---|---|
| Retaguardia de Trovo | 0,8 s / 420 u | Impacto especial ligero, coeficiente 0,15. Charcos originales: 4 s, radio 48 u, coeficiente 0,30 por segundo, lento 20 % (10 % jefes). | **Desastre de Trovo:** conserva los tres proyectiles y reglas de no acumulación de los charcos originales. |
| Escupitajo pegajoso | 1,25 s / 440 u | Proyectil blanco caricaturesco, coeficiente 1,1, velocidad 520 u/s; 10 % de Pegote. | **Pegote salpicón:** al impactar, salpica a 75 u con 60 % del daño directo. La misma tirada individual también rige para los vecinos. |
| Pichi de Trovo | 1,6 s / 380 u | Proyectil amarillo, coeficiente 0,30, velocidad 460 u/s. Deja un charco de radio 52 u y 3 s, coeficiente 0,18/s. | **Barrido amarillo:** tres chorros separados 0,18 rad, charcos de radio 64 u y 5 s. Conserva 15 %; no triplica las tiradas. |

Los rangos de Retaguardia también aumentan el poder de sus charcos fuera del dominio. Los charcos nuevos de Pichi tienen reloj de daño común por propietario cada 0,5 s: en una zona superpuesta solo se aplica el charco más fuerte de ese propietario. Límite de 24 charcos nuevos por jugador. No se sustituye ni modifica el gestor de charcos original de Retaguardia.

## Probabilidades y estados

**Pegote:** una tirada `< 0,10` por enemigo y lanzamiento; al activarse, −30 % de velocidad durante 3 s, modificado por resistencia de estado. No altera permanentemente `speed` ni defensas. Nuevos Pegotes pueden renovar la duración, pero no suman la intensidad. El líquido blanco es un efecto caricaturesco de adhesión, sin embarazo ni mecánicas sexuales.

**Resbalón:** una tirada `< 0,15` por enemigo y lanzamiento, al recibir el chorro o entrar en uno de sus charcos. Los tres chorros evolucionados comparten el registro de tiradas. Fallar también consume la oportunidad de ese lanzamiento: permanecer en el charco no vuelve a tirar cada cuadro. Lanzamientos posteriores son oportunidades nuevas.

Un minion normal/pesado que resbala cae durante 0,6 s (ajustado por resistencia de estado), deja de caminar/atacar y cancela su carga. Tiene 4 s de protección desde el inicio del efecto contra otro resbalón, compartida entre jugadores. No pierde defensas ni recibe daño de caída adicional. Los jefes y minijefes no caen: reciben −15 % de velocidad durante 1 s con la misma probabilidad/protección. Los proyectiles enemigos ya lanzados siguen existiendo.

Los estados se deciden en el servidor en cooperativo. No se distribuye una tirada desde el cliente. Pegote puede combinarse multiplicativamente con los lentos existentes; la resistencia de estado reduce duración, no cambia el 10 %/15 %.

## Pasiva · Presión acumulada

Daño real de charcos originales de Retaguardia o nuevos de Pichi genera una carga; máximo una por segundo y tres acumuladas. Daño directo, salpicaduras, Q, curaciones y acciones dentro de dominios no generan presión. Los estados y cargas son independientes por jugador.

Con tres cargas, el siguiente lanzamiento personal válido consume las tres y aumenta su área ×1,30:

- Retaguardia: radio del charco 48 → 62,4 u.
- Pegote básico: habilita una salpicadura de radio 45 u; evolucionado: radio 75 → 97,5 u.
- Pichi: radio de charcos 52 → 67,6 u, o 64 → 83,2 u evolucionado.

No tener objetivo no consume las cargas. La pasiva no incrementa daño, probabilidad de estado, vida, Q ni R. Morir limpia cargas y zonas personales nuevas.

## Q · ¡SE TAPÓ TODO!

Usa `ultimate.chamelinCharge`, separado de `ultimate.charge` de Baño de Trovo. Bajas propias normales/pesadas/minijefes/jefes aportan 5/8/20/30 puntos, máximo 100. No recarga con bajas de Q ni durante su ejecución o dominios; se conserva la carga original de R.

Duración 2 s, preparación 0,2 s y tres ondas circulares a 0,2 / 0,8 / 1,4 s. Puede caminar; suspende el ataque personal. Radio base 190 u multiplicado por alcance, máximo 270 u. Cada onda causa `0,8 × poder × escala` de daño especial y empuje corto de 12 u a minions, sin empujar jefes. Cobertura bloquea el daño. Un enemigo dentro de un charco original o propio de Pichi recibe ×1,25, una sola vez por onda; no se consumen los charcos ni se multiplican bonificaciones por superposición.

La escala se fija al activar: `1 + 0,14 × (mayor rango personal − 1)`, y ×1,15 si existe alguna evolución personal; no se suman rangos/evoluciones. No cura, ejecuta, transforma ni vuelve invulnerable. No activa probabilidades de Pegote o resbalón. No se puede iniciar dentro de un dominio. La carta Q usa el arte exclusivo `assets/cards/chamelin-se-tapo-todo-ultimate-fullart-v1.webp`: Chamelín con chullo y chaqueta andina, tres ondas turquesas y tuberías reventadas en un patio peruano nocturno. Comparte el pixel art detallado y la composición 2:3 de las otras cartas; mantiene el marco de fuego y la carta independiente de Baño de Trovo. Se conservan fuente PNG y prompt; el juego carga el WebP optimizado y no distribuye el prompt.

## Conservación de Baño de Trovo

Baño de Trovo conserva activación R, depósito/carga, presentaciones, arena, chorro, mordida final, daño y retornos. Dentro del dominio se usa su perfil original de Retaguardia. Al entrar se convierte temporalmente la cadencia del arma equipada a la cadencia original de Retaguardia, conservando el factor de cadencia del jugador, y se recupera el arma/cadencia al salir. El arsenal no reemplaza sus métodos internos ni dibuja ataques nuevos encima de sus secuencias. Activar R cancela una Q en curso y limpia las zonas nuevas de Pichi.

## Animaciones, red y verificación

`chamelin-kit.js` resuelve arsenal, probabilidades, presión, zonas y Q; `chamelin-kit-art.js` dibuja proyectiles, charcos, ondas y estados. Utiliza cuadros completos del atlas existente: caminata con pies/brazos conectados, inclinación leve al lanzar, pose de presión al estar quieto y figura completa al resbalar. No recorta extremidades ni escribe nombres sobre minions. Respeta movimiento reducido y delega en los renderizadores originales durante Baño de Trovo, daño y derrota.

Estados `chamelinArsenal`, `chamelinPassive`, `chamelinPools`, temporizadores Q y estados temporales del enemigo viajan en snapshots habituales. Los chorros comparten un registro de objetivos por lanzamiento; el servidor decide daño, estados y cargas. No se añade autoridad de daño ni posiciones del cliente.

Pruebas: contrato 9/9 y catálogo/base intactos, probabilidades en sus umbrales exactos y una sola tirada, evoluciones, daño real/salpicadura/charcos/cobertura, pasiva limitada y consumo, tres ondas Q/cargas separadas, conservación del dominio, estado cooperativo y limpieza al morir. Se conservan además las pruebas existentes de `chamelin.test.cjs`.

Pendiente: medición de partidas completas y balance con jugadores, compañeros/objetos diversos, y revisión adicional en móvil. Las pruebas de reglas no sustituyen esa validación.
