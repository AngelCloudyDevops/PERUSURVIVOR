# Acabado de los caminos

El suelo conserva las texturas aprobadas y la red transitable. Campo de Marte añade grano discreto y pequeños bordes de pasto; Plaza de Armas, juntas de pavimento escalonadas; Machu Picchu, marcas de desgaste y grietas breves. Evitar grandes manchas planas, contornos duros que parezcan muros, hierba en medio del corredor y ruido que compita con proyectiles o botín.

PathDetails compone los caminos en una superficie temporal de 256 × 256 con acabado a dos unidades de mundo por píxel. Reutiliza exactamente los segmentos y áreas especiales de Chunks; no modifica ground, roadDistance, curve, nodos, obstáculos ni colisiones. Las marcas de superficie quedan recortadas al camino y los bordes de pasto se validan fuera del corredor, con un máximo de 96 grupos por sector.

Todo se integra en el canvas final de 512 × 512 del sector y se reutiliza al dibujar cada fotograma. Los bordes de piedra de Machu mantienen su composición final en alta resolución. No se descargan imágenes adicionales, no hay partículas, temporizadores ni entidades nuevas. Las posiciones dependen del mapa y coordenadas globales, de forma que reconstruir un sector produce el mismo acabado.
