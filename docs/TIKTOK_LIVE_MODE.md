# Modo TikTok LIVE

La primera versión es un laboratorio local y privado para administradores. No se conecta a TikTok, no lee un chat real y no publica datos.
La partida de prueba tampoco escribe récords ni resultados en el progreso de la cuenta.

## Flujo de prueba

1. Un administrador abre **TikTok LIVE** desde el vestíbulo.
2. Inicia una partida de prueba.
3. El panel simula likes, comentarios, regalos y compartidos.
4. Los minions creados por el público muestran el nombre saneado del espectador.

## Eventos actuales

- 25 likes: un minion normal.
- Rosa: un minion normal.
- Regalo mediano: un minion veterano.
- Regalo grande: un minion élite.
- Comentario `!horda`: tres minions procesados gradualmente.
- Compartir: cura 10 % de la vida máxima del jugador.

La cola admite hasta 30 eventos y procesa como máximo uno cada 0,35 segundos. Esto evita que una ráfaga de actividad bloquee la partida. Solitario y cooperativo no se modifican.

## Siguiente etapa

La conexión real debe vivir detrás de un servidor que valide firmas, traduzca eventos de TikTok al formato interno y aplique límites por espectador. El cliente nunca debe recibir credenciales de TikTok.
