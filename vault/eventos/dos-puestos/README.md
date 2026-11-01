---
tipo: evento
id: duo-event
archivos: [backend/duo-event.cjs, backend/activities.cjs, tests/cooperative.test.cjs]
verificado: 2026-10-31
---
# Dos puestos, una causa (solo cooperativo)

Evento exclusivo de la sala de 2 jugadores: `DuoEvent` (`backend/duo-event.cjs:2`). No existe en solitario.

## Reglas
- Dos puestos fijos cerca de `(-170,390)` y `(170,390)`, desplazados a terreno libre; si no hay sitio o quedan a <200 entre sí, el evento queda `unavailable` (`duo-event.cjs:3`).
- Se desbloquea a `mapTime 45` s (`phase 'locked'→'ready'`, `tick :7`).
- Inicia cualquiera cerca de un puesto (≤110) con la acción `duo-event` (`start :6`; `backend/activities.cjs:14`). No arranca con escolta activa, actividad pendiente, arena, dominio ni jefe final.
- Activo: 45 s. Cada jugador debe ocupar un puesto distinto (≤65) y se acumulan 15 s «juntos»; el progreso solo sube cuando ambos puestos están ocupados por jugadores distintos (`tick :7`).
- Éxito: +35 monedas de equipo y +20 % de vida a los vivos (`tick :7`).
- Fracaso: se acabó el tiempo; reintento tras 20 s (`tick :7`).
- Snapshot: `duoEvent` (`snapshot :8`, `backend/activities.cjs:130`). Indicadores A/B guían a los puestos fuera de pantalla (cliente).

## Tests
`tests/cooperative.test.cjs:163` (mapas, posiciones, premio único), `:168` (pausa, arena, salida de zona, fracaso y reintento), `:177` (indicadores A/B).

Relacionados: [[eventos/escolta-combi/README]], [[sistemas/cooperativo/README]].
