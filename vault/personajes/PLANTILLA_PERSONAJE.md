---
tipo: plantilla
alcance: personajes-jugables
archivos: [src/data/catalog.js, src/data/powers.js, src/data/character-contract.js, src/systems/character-skins.js, src/systems/progression.js, src/rendering/sprites.js]
verificado: 2026-11-05
---
# Plantilla maestra para crear o completar un personaje

Esta es la receta obligatoria para trabajar un personaje jugable. Se usa junto con
[`docs/diseno/VISUAL_CONTRACT.md`](../../docs/diseno/VISUAL_CONTRACT.md), el contrato
general de personajes del [`README.md`](../../README.md#contrato-general-de-personajes-estadísticas-pasiva-y-habilidades)
y la ficha particular de `vault/personajes/<id>/`.

El código y las pruebas mandan sobre la documentación. Antes de proponer algo, se debe
auditar lo que ya existe. **No se inventa una habilidad, arte, skin o estado para llenar
un hueco.** Lo que no esté implementado se marca `Por definir`.

## 1. Auditoría antes de editar

- [ ] Leer `vault/personajes/<id>/README.md`, `ataques.md`, `poderes.md`, `assets.md`,
  `tests.md` y `gotchas.md` cuando exista.
- [ ] Revisar la ficha real en `P.CharacterContract.describe`, Causapedia, Wiki,
  laboratorio y Balance.
- [ ] Buscar el `id` en `src/`, `backend/`, `tests/`, `scripts/` y `public/assets/`.
- [ ] Identificar sobrescrituras y envoltorios posteriores; no asumir que la primera
  asignación encontrada es la que llega a producción.
- [ ] Separar con claridad: Base, versión del personaje, skin cosmética, evolución,
  transformación temporal y técnica. No son sinónimos.
- [ ] Anotar qué ya funciona, qué está incompleto y qué todavía es solo una propuesta.

## 2. Identidad y datos estables

- [ ] ID estable y único. Un personaje nuevo se agrega al final del roster; no se
  reordenan índices existentes.
- [ ] Nombre base, nombre de versión, rareza, especie, rol, descripción y debilidad.
- [ ] Stats base y avanzados definidos en las fuentes compartidas, no duplicados en UI.
- [ ] Desbloqueo inicial, Gacha, cuenta, migraciones y backend coherentes.
- [ ] `P.CharacterContract` refleja el estado real: `Implementado`, `Planeado` o
  `Por definir`.
- [ ] Wiki, Causapedia, Balance y laboratorio leen las mismas fuentes.

## 3. Contrato mecánico 9/9

Cada pieza debe declarar propósito, canal de daño, geometría, alcance, cadencia,
objetivos, señales, contra-juego, interacción cooperativa y limpieza de estado.

| Pieza | Requisito mínimo |
|---|---|
| Ataque 1 | Función distinta, anticipación, ejecución, impacto y recuperación. |
| Ataque 2 | No debe ser un cambio de color del primero; crea otra decisión. |
| Ataque 3 | Completa el combo o cubre una debilidad sin duplicar los anteriores. |
| Evoluciones 1–3 | Modifican su ataque de origen y comunican el cambio mecánico. |
| Pasiva | Regla, acumulación, estado listo, consumo, rotura y HUD legibles. |
| Q / ulti | Carga propia, entrada, estado activo, salida y limpieza. |
| R / dominio | Carga separada, escenario, peligros, salida y regla global de dominios. |

- [ ] Definir primero las combinaciones entre piezas y después sus números.
- [ ] Comprobar que Q y R usan cargas distintas cuando corresponda.
- [ ] Dentro de un dominio, ataques y Q siguen disponibles salvo prohibición de diseño
  escrita y probada.
- [ ] Transformaciones temporales conservan el kit aprobado o documentan exactamente
  qué reemplazan; nunca degradan sin querer al autoataque genérico.
- [ ] Subir de nivel, elegir cartas y fusionar se aplaza durante secuencias que lo
  requieran y se reanuda al terminar, sin perder XP.
- [ ] Todo estado temporal se limpia al morir, reiniciar, cambiar personaje, salir al
  vestíbulo y terminar una partida.

## 4. Contrato visual

- [ ] Full art principal y referencia estable de cuerpo, rostro, ropa y accesorios.
- [ ] Reposo y caminata con escala, ancla de pies y dirección consistentes.
- [ ] Cada ataque tiene preparación, ejecución e impacto; una forma distinta usa atlas
  distinto.
- [ ] Pasiva visible en HUD y actor: vacía, acumulándose, lista, consumida y rota.
- [ ] Q y R tienen carta, entrada, estado activo y salida.
- [ ] Proyectiles, huevos, marcas, invocaciones, auras y transformaciones cambian junto
  con la skin cuando forman parte de su identidad.
- [ ] Daño crítico, control, daño recibido y derrota se leen sin texto invasivo.
- [ ] Advertencias visuales coinciden con la colisión y nunca quedan debajo del actor.
- [ ] Movimiento reducido conserva la información sin destellos ni sacudidas fuertes.
- [ ] Partículas, humo y luces tienen límites para no degradar FPS.

### Recursos

- [ ] PNG maestro archivado, WebP optimizado de ejecución y prompt reproducible.
- [ ] Fondo transparente real, márgenes seguros, ninguna extremidad cortada y figuras
  completas por celda.
- [ ] El arte no contiene marcos, nombres ni logos que debe componer la interfaz.
- [ ] Las rutas están integradas al build y verificadas por tests; no basta con que el
  archivo exista en el repositorio.

## 5. Versiones y skins: regla de partida

Una versión define la identidad jugable; una skin cambia apariencia sin cambiar stats.
La selección de apariencia se resuelve una sola vez al preparar la partida.

Flujo obligatorio:

1. El selector equipa Base o una skin compatible y poseída.
2. El vestíbulo muestra exactamente esa selección.
3. Antes de precargar se captura el ID explícito en `pendingRunSkin`, incluida `base`.
4. `P.Game.start` aplica la selección al actor definitivo mediante `applyToRun`.
5. El actor conserva `runSkinId` durante toda la partida.
6. El render solo repara recursos perdidos usando `runSkinId`; **nunca vuelve a elegir
   desde el guardado por fotograma**.
7. Proyectiles, invocaciones y efectos copian `skinId`/`visualId` de su propietario al
   nacer; no consultan después una preferencia global.
8. Al terminar, la partida guarda progreso sin borrar ni sustituir la apariencia
   equipada para la siguiente entrada.

Casos que deben tener prueba automática:

- [ ] Skin elegida → el guardado cambia durante la precarga → primer render conserva
  la skin.
- [ ] Base elegida → el guardado tardío contiene una skin → primer render conserva Base.
- [ ] Primer y siguientes proyectiles/invocaciones usan la misma apariencia.
- [ ] Pausa, nivel, transformación, dominio, muerte y final de partida no cambian skin.
- [ ] Lobby, retrato, actor, pasiva, cartas y efectos corresponden a la misma skin.
- [ ] Cooperativo serializa la apariencia del actor y no la decide en el cliente remoto.

## 6. Cooperativo y autoridad

- [ ] El cliente envía intención; servidor o anfitrión valida daño, posición, carga,
  recarga y premios.
- [ ] Estados nuevos tienen propietario (`ownerSlot`) y sobreviven snapshots/reconexión.
- [ ] Dos jugadores pueden usar versiones o skins diferentes sin compartir estado.
- [ ] Pausas, cinemáticas y dominios conservan un reloj coherente.
- [ ] El render no decide daño, control, colisiones ni resultados.

## 7. Interfaz y accesibilidad

- [ ] Ficha, selector, vestíbulo, HUD, cartas y menú de nivel usan nombres consistentes.
- [ ] Letras legibles en escritorio y móvil; información esencial no depende de pasar el
  cursor.
- [ ] El icono comunica la función; el full art comunica identidad y rareza.
- [ ] Teclado, ratón y toque pueden activar lo mismo.
- [ ] Pausa y opciones no duplican botones ni ocultan acciones principales.
- [ ] Sonido obedece volúmenes globales y sus variantes no crean nodos nuevos por frame.

## 8. Pruebas obligatorias

- [ ] Contrato y catálogo: IDs, rareza, versión, 9/9 y fuentes compartidas.
- [ ] Mecánica: daño, cadencia, alcance, control, recarga, combo y límites.
- [ ] Estado: reinicio, muerte, salida, segunda partida y cambio de personaje.
- [ ] Apariencia: Base y cada skin, vestíbulo, primer render, proyectiles y final de run.
- [ ] Visual: rutas, firma WebP, dimensiones, atlas, anclas y recursos optimizados.
- [ ] Cooperativo: autoridad, snapshot, propietarios y reconexión.
- [ ] Accesibilidad: movimiento reducido, móvil y señales sincronizadas con hitboxes.
- [ ] Rendimiento: cupos de partículas/actores, caché y ausencia de trabajo pesado por
  fotograma.
- [ ] Regresión focal del personaje.
- [ ] `npm run check`.
- [ ] `npm test` completo sin fallos.

## 9. Documentación y cierre

- [ ] Actualizar la carpeta del personaje: `README`, `ataques`, `poderes`, `assets`,
  `tests` y `gotchas`.
- [ ] Actualizar contratos, auditorías y README general solo con hechos implementados.
- [ ] Registrar decisiones generales en `docs/diseno/GAME_DESIGN.md` y cambios de
  arquitectura en `docs/arquitectura/ARCHITECTURE.md`.
- [ ] No marcar `completo` por tener texto o arte sin conexión al juego real.
- [ ] Abrir PR desde una rama nueva, esperar CI, fusionar y verificar `__release.json`.
- [ ] Probar en producción con caché renovada: selector → vestíbulo → partida → primera
  técnica → siguientes técnicas → nivel/Q/R → final → segunda partida.

## Orden recomendado de implementación

1. Auditar y congelar el contrato aprobado.
2. Datos, stats y catálogo.
3. Tres ataques y su combo.
4. Tres evoluciones.
5. Pasiva.
6. Q.
7. R.
8. Cooperativo y limpieza de estados.
9. Arte base conectado.
10. Skins conectadas a todos los estados derivados.
11. UI, audio, accesibilidad y rendimiento.
12. Pruebas, documentación, PR y verificación de producción.

No se pasa al siguiente bloque ocultando un fallo del anterior con un parche visual.
Cuando una mecánica o apariencia no coincide, se reproduce primero el recorrido real
completo y se prueba la causa raíz.
