# Modo TikTok LIVE

El modo es privado para administradores. Conserva el laboratorio local y añade una conexión beta a un LIVE público mediante el `@usuario` del creador. Nunca solicita ni almacena contraseña, cookie o sesión de TikTok.
La partida interactiva tampoco escribe récords ni resultados en el progreso de la cuenta.

La conexión corre en el servidor. El navegador recibe únicamente eventos normalizados por Server-Sent Events: likes, `!horda`, regalos y compartidos. Una cuenta administradora mantiene una conexión y el servidor limita las conexiones simultáneas.

La librería `tiktok-live-connector` está fijada exactamente a `2.5.0`. Es una integración no oficial y puede dejar de funcionar si TikTok modifica su servicio. Por eso la interfaz la identifica como beta y el simulador local sigue disponible como respaldo.

## Flujo de prueba

1. Un administrador abre **Herramientas → TikTok LIVE** desde el vestíbulo.
2. Para eventos reales, escribe solo el `@usuario` que ya está transmitiendo públicamente y pulsa **Conectar LIVE**.
3. Pulsa **Iniciar modo interactivo**. El panel también permite simular likes, comentarios, regalos y compartidos.
4. Los minions creados por el público muestran el nombre saneado del espectador.

## Eventos actuales

- 25 likes: un minion normal.
- Rosa: un minion normal.
- Regalo mediano: un minion veterano.
- Regalo grande: un minion élite.
- Comentario `!horda`: tres minions procesados gradualmente.
- Compartir: cura 10 % de la vida máxima del jugador.

La cola admite hasta 30 eventos y procesa como máximo uno cada 0,35 segundos. Esto evita que una ráfaga de actividad bloquee la partida. Solitario y cooperativo no se modifican.

## Límites de la beta

No usa una contraseña ni inicia sesión en TikTok. Depende de la interfaz pública no oficial disponible para transmisiones visibles. Si TikTok cambia su servicio, la conexión puede fallar sin afectar el juego normal ni el simulador.
