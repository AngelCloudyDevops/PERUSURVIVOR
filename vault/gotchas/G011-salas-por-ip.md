---
tipo: gotcha
id: G011
archivos: [backend/cooperative.cjs, tests/live/cooperative.cjs]
verificado: 2026-10-31
---
# G011 · Límite de 2 salas por IP rompe la prueba en vivo de 3 mapas

- **Síntoma:** `node tests/live/cooperative.cjs` contra producción falla en uno de los
  mapas con «Ya tienes demasiadas salas abiertas. Cierra una para crear otra».
- **Causa:**
  - `maxRoomsPerIp` = `MAX_ROOMS_PER_IP` o **2** (`backend/cooperative.cjs:5`); se
    comprueba al crear sala (`backend/cooperative.cjs:56`).
  - Sin argumentos y sin `COOP_FULL_RUN=1`, la prueba abre `campo`, `plaza` y `machu`
    **en paralelo** desde la misma IP (`tests/live/cooperative.cjs:109`): 3 salas > 2.
  - Con `COOP_FULL_RUN=1` (`tests/live/cooperative.cjs:8`) solo abre `campo`.
- **Cómo evitarla:** usa `COOP_FULL_RUN=1`, o pasa como mucho 2 mapas por argumento
  (`node tests/live/cooperative.cjs campo plaza`), o sube `MAX_ROOMS_PER_IP` en el servidor.
- **Cómo detectarla:** el informe `cooperative-live-report.json` marca `ok:false` con
  ese error en un caso.
- Más: [[arquitectura/cooperativo-autoritativo]].
