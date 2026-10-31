# Cómo colaborar en PERUSURVIVOR

Este repositorio publica automáticamente `staging` en pruebas y `main` en producción. Nadie debe subir cambios directamente a esas ramas: cada persona trabaja en una rama, abre un Pull Request y espera las pruebas.

## Flujo corto para colaboradores

1. Clona el repositorio una sola vez:

   ```bash
   git clone https://github.com/AngelCloudyDevops/PERUSURVIVOR.git
   cd PERUSURVIVOR
   npm ci --ignore-scripts
   ```

2. Antes de empezar, actualiza `staging` y crea una rama descriptiva:

   ```bash
   git switch staging
   git pull --ff-only origin staging
   git switch -c feature/nombre-corto
   ```

3. Cambia únicamente lo relacionado con la tarea. No edites `dist/`: se genera con el build.

4. Comprueba el trabajo:

   ```bash
   npm run check
   npm test
   ```

5. Guarda y sube la rama:

   ```bash
   git add -A
   git commit -m "feat: descripción clara"
   git push -u origin feature/nombre-corto
   ```

6. En GitHub abre un Pull Request hacia `staging`. Otra persona revisa el cambio y lo fusiona cuando CI está verde.

7. GitHub publica `staging` automáticamente en `https://staging.perusurvivor.michitech.tech`. Después de probar allí, abre un Pull Request de `staging` hacia `main` para publicar producción. No hay que copiar archivos manualmente al VPS.

## Qué hace el dueño del repositorio

- Revisa el diff y prueba la función importante.
- Confirma que las comprobaciones de GitHub terminaron correctamente.
- Fusiona primero hacia `staging`, verifica el entorno de pruebas y luego promueve `staging` a `main`.
- Verifica primero `https://staging.perusurvivor.michitech.tech/__release.json` y, después de promover, `https://perusurvivor.michitech.tech/__release.json`.
- Si el cambio es grande, usa `Squash and merge` para conservar un historial legible.

## Reglas de ramas

- `main`: producción; solo recibe cambios ya comprobados en staging.
- `staging`: integración y prueba manual en línea; también debe pasar CI.
- `feature/*`: contenido o funciones nuevas.
- `fix/*`: correcciones.
- `docs/*`: documentación sin cambios jugables.
- Una rama corresponde a una tarea. Se elimina después del merge.
- No reutilices una rama antigua ni trabajes desde un worktree atrasado.
- Si `staging` avanzó mientras trabajabas, ejecuta `git fetch origin` y actualiza tu rama antes del merge.

## Archivos y recursos

- Código del juego: `src/`.
- Backend cooperativo y cuentas: `backend/`.
- Recursos que usa el navegador: `public/assets/`.
- Documentación y reglas: `docs/`.
- Operación del VPS: `ops/hostinger/`.
- `dist/`, `tmp/` y `output/` son salidas locales y no se versionan.

Los PNG maestros y prompts actuales siguen versionados por compatibilidad. Los recursos nuevos deben incluir WebP optimizado para ejecución. La migración de fuentes pesadas a almacenamiento de arte/LFS se hará por lotes, sin mezclarla con cambios jugables.

## Cambios que requieren cuidado adicional

- Cambios en `.github/workflows/`, `ops/hostinger/`, cuentas, cooperativo o base de datos requieren revisión del dueño.
- No se guardan claves, tokens, `.env`, bases de datos ni copias de producción.
- Un cambio visual debe conservar móvil, movimiento reducido y anclas de sprites.
- Un cambio de protocolo cooperativo debe mantener compatibilidad con la release anterior o declarar una migración.
