---
tipo: evento
id: escort
archivos: [backend/escort.cjs, backend/activities.cjs, tests/cooperative.test.cjs]
verificado: 2026-10-31
---
# Escolta de la combi (solo cooperativo)

`Escort` (`backend/escort.cjs:2`). Una combi recorre una ruta del mapa y los dos deben acompañarla.

## Reglas
- Ruta: dos segmentos de la curva del chunk `x=0` con `y` entre 550 y 1130 (`escort.cjs:3`).
- Se desbloquea a `mapTime 90` s (`tick :6`). Inicia quien esté a ≤150 de la combi con la acción `escort` (`start :4`; `backend/activities.cjs:13`). No arranca con `duo-event` activo.
- Activo: 100 s y la combi tiene 150 de vida (`start :4`).
- La combi avanza 26/s solo si los dos jugadores están a ≤200 y no hay enemigos a <80 de ella (`tick :6`).
- Cada enemigo cerca (máx. 3) le resta 7 de vida por segundo.
- Dos paradas (a 1/3 y 2/3 del recorrido): hay que mantener 6 s de espera (`stops`, `hold`, `:6`).
- Éxito: +50 monedas y +25 % de vida a los vivos (`:6`). Fracaso (vida 0 o tiempo): reintento en 20 s y la combi vuelve al inicio.
- Snapshot: `escort` (`snapshot :7`, `activities.cjs:130`).

## Tests
`tests/cooperative.test.cjs:184` (tres mapas, dos jugadores, paradas, premio único, reintento).

Relacionados: [[eventos/dos-puestos/README]], [[sistemas/cooperativo/README]].
