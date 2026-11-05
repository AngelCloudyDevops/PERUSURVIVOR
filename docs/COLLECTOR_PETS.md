# Mascotas recolectoras

Las mascotas son equipo permanente que se elige antes de una partida individual. Ocupan un espacio propio y no reducen los dos espacios iniciales de suministros. El tercer espacio de suministros se desbloquea al completar diez victorias individuales. Nunca colisionan, reciben daño, atacan, abren cofres ni escogen recompensas.

| Rareza | Mascota | Capacidad | Alcance | Velocidad | Recoge |
| --- | --- | ---: | ---: | ---: | --- |
| Común | Gallinita recolectora | 4 | 450 | 270 | Experiencia |
| Rara | Gallinita mochilera | 8 | 700 | 360 | Experiencia y monedas |
| Legendaria | Gallinita cohete | 12 | 1000 | 540 | Experiencia, monedas, llaves, imanes, curación y panetones |

La común está incluida para todas las cuentas. La rara cuesta 180 monedas permanentes y exige la común; la legendaria cuesta 400 y exige la rara. Una compra desbloquea la mascota para siempre.

La selección guardada en la mochila decide la variante de la siguiente partida y se fija al preparar la expedición, antes de cargar el mapa o mostrar una elección inicial. Si queda un identificador anterior en el jugador o el perfil vuelve a sincronizarse durante esa transición, la partida conserva la variante preparada; mientras carga el atlas, el dibujo provisional conserva la mochila o los cohetes de esa variante para no parecer la gallinita común.

La pantalla **Mochila** es la única interfaz de equipamiento y separa Suministros de Mascotas en dos pestañas. Los espacios del vestíbulo son un resumen de la próxima partida: los símbolos `+` abren Suministros y el retrato de la gallina abre Mascotas. No existe un selector modal paralelo.

## Ciclo de recolección

1. Busca botín permitido dentro de su alcance respecto del jugador.
2. Viaja físicamente y guarda objetos hasta llenar su capacidad o quedarse sin objetivos.
3. Regresa al jugador y entrega el lote completo.
4. Descansa 0,8 / 0,6 / 0,4 segundos según su rareza.

La experiencia se suma únicamente al regresar. La legendaria prioriza llaves, curación necesaria, imanes, monedas y finalmente experiencia. No toma panetones con 70 % o más de vida ni curación con la vida completa.

El atlas `public/assets/pets/collector-chickens-v1.webp` contiene 18 cuadros, seis por rareza. El PNG maestro y el prompt reproducible permanecen en el repositorio, pero el build distribuye únicamente el WebP optimizado.
