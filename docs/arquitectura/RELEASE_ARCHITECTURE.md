# Arquitectura de releases y colaboración

## Flujo de producción

```text
feature/* -> Pull Request -> staging -> prueba manual -> Pull Request -> main -> producción
```

Los colaboradores no publican manualmente. Suben una rama y abren un Pull Request hacia `staging`. El dueño revisa y prueba `https://staging.perusurvivor.michitech.tech`; solo después promueve `staging` a `main`. `main` sigue siendo la única fuente de producción.

Staging usa `/opt/perusurvivor-staging`, contenedores, base de cuentas, salas cooperativas, bloqueo, releases y rollback propios. Comparte únicamente el proxy HTTPS y la red Docker del VPS. Sus contenedores tienen límites de CPU/memoria y sus respuestas incluyen `noindex`.

## Garantías actuales

- CI evita duplicados: las ramas de trabajo se validan por Pull Request; solo `staging` y `main` ejecutan también CI al recibir un push.
- La batería completa se ejecuta una vez en Linux/Node 24 y la compatibilidad ligera en Windows/Node 22.
- El mismo `dist/` que supera las pruebas se conserva como artefacto y llega al job de despliegue de la rama correspondiente.
- El deploy confirma que el SHA sigue siendo la punta de `main` o `staging`, según la rama publicada.
- SSH usa una cuenta restringida, host fijado y comando forzado.
- El receptor valida rutas, tipos, cantidad y tamaño de archivos.
- `live/current` cambia atómicamente y la comprobación HTTPS restaura la release anterior si falla. Producción exige portada `200` con el juego; staging acepta además su `401 Basic` intencional, siempre que `__release.json` público identifique exactamente el SHA activado.
- Se conservan la release actual, la anterior y las cinco releases recientes adicionales.

## Presupuesto

- Contenido extraído máximo aceptado por el receptor: 192 MiB.
- Archivo comprimido máximo aceptado por el receptor: 96 MiB.
- CI impone un presupuesto operativo menor: 92 MiB comprimidos, 80 MiB extraídos y 1000 archivos.
- El margen entre CI y receptor evita que una diferencia de compresión haga fallar una publicación.

Estos límites son una protección, no un objetivo. El paquete debe reducirse progresivamente. `scripts/release-budget.cjs` muestra los directorios que más pesan.

## Separación de arte

El build distribuye WebP/WebM y excluye PNG maestros, prompts, metadatos de autoría y recursos reemplazados. La siguiente migración estructural separará las fuentes pesadas del árbol de ejecución:

```text
public/assets/       recursos runtime
assets-source/       maestros y prompts administrados por LFS o repositorio de arte
```

La migración se realizará por lotes porque las herramientas de empaquetado actuales todavía leen fuentes junto a sus WebP.

## Backend y web

La release contiene `backend/` porque el launcher cooperativo lee el backend desde la misma versión. Nginx debe negar acceso HTTP a `/backend/`; el código se mantiene disponible para el contenedor mediante el volumen de releases.

Mientras una release anterior conserve salas activas, el proceso cooperativo espera a quedar vacío. Antes de introducir cambios incompatibles en mensajes WebSocket se debe versionar el protocolo y permitir que sesiones nuevas entren al backend nuevo mientras las antiguas terminan en el anterior.

## Caché

- HTML, `version.json` y `__release.json`: sin caché persistente.
- JavaScript y CSS usan huella en la URL.
- Los recursos visuales conservan nombres versionados. No se marcarán como `immutable` hasta que el build añada huellas de contenido a todas sus rutas.

## Recuperación

La activación fallida vuelve al enlace anterior. La limpieza nunca elimina la release activa ni la anterior. Para una reversión manual se selecciona una release conservada y se cambia `live/current` bajo el mismo bloqueo de despliegue.
