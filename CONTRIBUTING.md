# Cómo colaborar en PERUSURVIVOR

Este repositorio publica automáticamente `main` en producción. Por eso nadie debe subir cambios directamente a `main`: cada persona trabaja en una rama, abre un Pull Request y espera las pruebas.

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

7. Al fusionarse en `main`, GitHub construye y publica la versión automáticamente. No hay que copiar archivos manualmente al VPS.

## Qué hace el dueño del repositorio

- Revisa el diff y prueba la función importante.
- Confirma que las comprobaciones de GitHub terminaron correctamente.
- Fusiona el Pull Request; no descarga y vuelve a subir los archivos del colaborador.
- Verifica `https://perusurvivor.michitech.tech/__release.json` y el juego publicado.
- Si el cambio es grande, usa `Squash and merge` para conservar un historial legible.

## Reglas de ramas

- `main`: producción; siempre debe poder compilar y pasar pruebas.
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
