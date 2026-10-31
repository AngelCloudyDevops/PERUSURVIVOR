# Manual del propietario de PERUSURVIVOR

Este manual explica cómo recibir cambios de colaboradores, probarlos y publicarlos sin compartir accesos sensibles. Las reglas técnicas del juego están en el [Manual maestro de creación](manual/PERUSURVIVOR_Manual_Maestro_de_Creacion_v1.pdf).

## Ramas permanentes

- `main`: versión pública de producción. Solo recibe cambios ya probados.
- `staging`: versión de integración y pruebas en línea.
- `feature/*`, `fix/*` y `docs/*`: ramas temporales, una por tarea. Se eliminan después de fusionarlas.

```text
rama de trabajo -> Pull Request a staging -> prueba -> Pull Request a main -> producción
```

Nadie debe subir directamente a `main` o `staging`. Un colaborador tampoco necesita acceso al servidor, DNS, hosting ni secretos de GitHub.

## Incorporar a un colaborador

1. Dale acceso al repositorio con el permiso mínimo necesario para crear ramas y Pull Requests.
2. Envíale únicamente [GUIA_PARA_COLABORADORES.md](GUIA_PARA_COLABORADORES.md).
3. Define una tarea pequeña con resultado verificable y archivos aproximados que puede tocar.
4. Pídele una rama nueva para esa tarea y un Pull Request hacia `staging`.
5. No compartas claves SSH, tokens, contraseñas, archivos `.env`, bases de datos ni paneles del hosting.

## Revisar un Pull Request

Antes de fusionar, confirma:

- El destino del Pull Request es `staging`, no `main`.
- La rama contiene una sola tarea y no incluye archivos ajenos.
- No aparecen secretos, bases de datos, archivos temporales ni `dist/`.
- Las pruebas de GitHub están en verde.
- Los cambios de sprites conservan anclas, direcciones, movimiento y vista móvil.
- Los cambios cooperativos mantienen compatibilidad o incluyen una migración explícita.
- Los cambios grandes de arte respetan el presupuesto de la release.

Usa `Squash and merge` cuando una rama tenga varios commits de corrección. Así la historia conserva un commit claro por tarea.

## Probar en staging

Después de fusionar hacia `staging`:

1. Espera que GitHub Actions termine correctamente.
2. Abre <https://staging.perusurvivor.michitech.tech> y recarga sin caché.
3. Comprueba menú, móvil, partida solitaria y, si corresponde, cooperativo.
4. Reproduce exactamente la función modificada y una función vecina para detectar regresiones.
5. Revisa <https://staging.perusurvivor.michitech.tech/__release.json> y confirma que muestra el commit esperado.
6. Si algo falla, corrígelo en una nueva rama o en la misma rama abierta; no promociones el cambio.

Staging tiene cuentas, salas cooperativas y recursos aislados. Sus datos de prueba no deben considerarse datos de producción.

## Publicar en producción

Cuando staging esté validado:

1. Abre un Pull Request de `staging` hacia `main`.
2. Revisa el resumen acumulado y espera CI verde.
3. Fusiona el Pull Request.
4. GitHub publica automáticamente el artefacto que superó las pruebas.
5. Confirma <https://perusurvivor.michitech.tech/__release.json> y realiza una prueba breve de inicio de partida.

No copies archivos manualmente al servidor y no reconstruyas una release directamente en producción.

## Si una publicación falla

- No vuelvas a ejecutar cambios al azar ni modifiques otros servicios.
- Guarda el enlace de la ejecución de GitHub Actions y el SHA afectado.
- Comprueba primero si falló CI, la carga o la verificación HTTPS.
- El receptor restaura automáticamente la release anterior si la activación no pasa la comprobación.
- Si la versión ya está publicada pero tiene un defecto funcional, crea un `fix/*`, pruébalo en staging y promuévelo normalmente.
- Solo una incidencia urgente justifica una reversión manual; debe quedar documentada después.

## Mantenimiento para escalar

- Elimina ramas temporales fusionadas con regularidad, después de verificar que no contienen trabajo pendiente.
- Exige Pull Request y CI aprobado en las reglas de protección de `main` y `staging`.
- Mantén una tarea por rama y evita Pull Requests gigantes.
- Separa maestros gráficos pesados mediante Git LFS o un repositorio de arte; el juego debe conservar WebP/WebM optimizados.
- Versiona los cambios incompatibles del protocolo cooperativo y las migraciones de datos.
- Revisa mensualmente el tamaño de la release con `npm run release:budget`.
- Conserva documentación y pruebas junto con cada función nueva.

## Documentos relacionados

- [Guía para colaboradores](GUIA_PARA_COLABORADORES.md)
- [Cómo contribuir](../CONTRIBUTING.md)
- [Arquitectura de releases](RELEASE_ARCHITECTURE.md)
- [Despliegue automático](DEPLOYMENT.md)
- [Diseño del juego](GAME_DESIGN.md)
- [Arquitectura del proyecto](ARCHITECTURE.md)

