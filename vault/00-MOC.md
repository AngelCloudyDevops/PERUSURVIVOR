---
tipo: indice
verificado: 2026-10-31
---
# Mapa de contenidos (MOC)

Base de conocimiento de PERUSURVIVOR («Causas del Caos») para agentes de IA.
Léela **antes de cambiar código**. Ante una contradicción, **manda el código**:
corrige la nota en el mismo cambio. Las convenciones de escritura están en
[[CONVENCIONES]].

## Cómo navegar
1. Empieza aquí. Ubica la zona que toca tu tarea en la tabla de abajo.
2. Abre la carpeta del personaje, evento o sistema afectado y su `README`.
3. Revisa [[gotchas/README|todas las trampas]]: son cortas y evitan los errores más caros.
4. Si tocas una función de `P` con envoltorios, lee [[arquitectura/envoltorios]].
5. Verifica en el código cada número que vayas a usar: las notas citan `archivo:línea`,
   pero las líneas se mueven. Busca con `grep -n` el identificador citado.

## Zonas
| Si la tarea toca… | Lee |
|---|---|
| Cómo arranca el cliente, `window.P`, namespaces | [[arquitectura/objeto-p]] |
| Añadir o mover un script | [[arquitectura/orden-modulos]] |
| `Entities.hurt`, `Game.update`, `Combat.cast` y otros envoltorios | [[arquitectura/envoltorios]] |
| Menú, partida, pantalla de mejoras, fin (`P.state.mode`) | [[arquitectura/escenas]] |
| `build.cjs`, `dist/`, assets publicados, presupuesto de release | [[arquitectura/build]] |
| Cooperativo, servidor, protocolo, snapshots | [[arquitectura/cooperativo-autoritativo]], [[sistemas/cooperativo/README]] |
| Cuentas, guardado, migraciones | [[arquitectura/cuentas-guardado]], [[sistemas/cuentas/README]] |
| FPS, benchmark, presupuestos | [[arquitectura/rendimiento]] |
| Un personaje jugable | [[personajes/README]] |
| Un evento de mapa, portal, jefe o minijefe | [[eventos/README]] |
| Un sistema de juego (combate, oleadas, cartas, IA, audio…) | [[sistemas/README]] |
| Una pasiva, Q, R o carta especial | [[poderes/README]] |
| Algo «raro» que se rompe sin motivo aparente | [[gotchas/README]] |

## Índices
- [[arquitectura/README|Arquitectura]]
- [[personajes/README|Personajes (21)]]
- [[eventos/README|Eventos y encuentros]]
- [[sistemas/README|Sistemas]]
- [[poderes/README|Poderes]]
- [[gotchas/README|Gotchas]]

## Cuándo actualizar cada nota
| Cambio en el código | Actualiza |
|---|---|
| Número de balance (vida, daño, recarga, alcance) | `personajes/<id>/ataques.md` o `poderes.md`; nota del evento o sistema |
| Personaje nuevo | Carpeta nueva en `personajes/`, [[personajes/README]], [[poderes/README]], [[gotchas/G004-listas-ids-personajes]] |
| Script nuevo o movido | [[arquitectura/orden-modulos]]; [[arquitectura/envoltorios]] si envuelve algo |
| Envoltorio nuevo sobre una función de `P` | [[arquitectura/envoltorios]] |
| Clave nueva en `P.state` | Nota del sistema dueño (dónde se reinicia) |
| Asset nuevo o renombrado | `personajes/<id>/assets.md`, [[arquitectura/build]] |
| Test nuevo | `tests.md` del personaje o nota del sistema; registrarlo en `package.json` |
| Protocolo, snapshot o servidor | [[arquitectura/cooperativo-autoritativo]] |
| Esquema de guardado | [[arquitectura/cuentas-guardado]] |
| Trampa descubierta | Nueva `gotchas/Gnnn-slug.md` y [[gotchas/README]] |

Regla de cierre: un cambio de código que deja una nota falsa está incompleto.

## Para humanos
La documentación narrativa (diseño, balance, arte, operación) está en `docs/`
(índice en `docs/README.md`). El vault no la sustituye: resume lo que un agente
necesita para no romper nada.
