# Cómo colaborar en PERUSURVIVOR

Este repositorio publica automáticamente `staging` en pruebas y `main` en producción. Los colaboradores trabajan en una rama y abren un Pull Request directo a `main`; `staging` se reserva para cambios de alto riesgo. El propietario puede enviar ajustes pequeños directamente a `main`.

## Flujo corto para colaboradores

1. Clona el repositorio una sola vez:

   ```bash
   git clone https://github.com/AngelCloudyDevops/PERUSURVIVOR.git
   cd PERUSURVIVOR
   npm ci --ignore-scripts
   ```

2. Antes de empezar, actualiza `main` y crea una rama descriptiva:

   ```bash
   git switch main
   git pull --ff-only origin main
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

6. En GitHub abre un Pull Request hacia `main`. Otra persona revisa el cambio y lo fusiona cuando CI está verde.

7. GitHub publica `main` automáticamente en `https://perusurvivor.michitech.tech`. No hay que copiar archivos manualmente al VPS.

Para cooperativo, guardados, cuentas, backend, permisos o arquitectura, dirige primero el Pull Request a `staging`, prueba `https://staging.perusurvivor.michitech.tech` y luego promueve `staging` a `main`.

## Qué hace el dueño del repositorio

- Revisa el diff y prueba la función importante.
- Confirma que las comprobaciones de GitHub terminaron correctamente.
- Para cambios habituales, fusiona el Pull Request directo a `main` y verifica `https://perusurvivor.michitech.tech/__release.json`.
- Para cambios de alto riesgo, verifica primero `https://staging.perusurvivor.michitech.tech/__release.json` y después promueve a producción.
- Puede enviar ajustes pequeños directamente a `main`; CI y el despliegue automático siguen siendo obligatorios.
- Si el cambio es grande, usa `Squash and merge` para conservar un historial legible.

## Reglas de ramas

- `main`: producción y destino habitual de los Pull Requests.
- `staging`: integración y prueba manual en línea para cambios de alto riesgo.
- `feature/*`: contenido o funciones nuevas.
- `fix/*`: correcciones.
- `docs/*`: documentación sin cambios jugables.
- Una rama corresponde a una tarea. Se elimina después del merge.
- No reutilices una rama antigua ni trabajes desde un worktree atrasado.
- Si `main` avanzó mientras trabajabas, ejecuta `git fetch origin` y actualiza tu rama antes del merge.

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
