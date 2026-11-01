# Guía para colaborar en PERUSURVIVOR

Esta guía se puede compartir con cualquier colaborador. No requiere ni contiene accesos al servidor, claves, tokens o datos privados.

## Qué necesitas

- Git.
- Node.js 22 o 24.
- Una cuenta de GitHub con acceso al repositorio.
- Un editor como VS Code.

El dueño del proyecto se encarga de aprobar y publicar. Tú trabajas en una rama y entregas un Pull Request.

## Preparación inicial

Haz esto una sola vez:

```bash
git clone https://github.com/AngelCloudyDevops/PERUSURVIVOR.git
cd PERUSURVIVOR
npm ci --ignore-scripts
```

## Empezar una tarea

Actualiza `staging` y crea una rama nueva. Sustituye `nombre-corto` por una descripción breve:

```bash
git switch staging
git pull --ff-only origin staging
git switch -c feature/nombre-corto
```

Usa:

- `feature/*` para funciones o contenido.
- `fix/*` para correcciones.
- `docs/*` para documentación.

Una rama corresponde a una sola tarea. No reutilices ramas antiguas.

## Dónde trabajar

- `src/`: lógica y presentación del juego.
- `public/assets/`: recursos que carga el navegador.
- `backend/`: cuentas y cooperativo; requiere revisión adicional.
- `tests/`: pruebas automáticas.
- `docs/`: reglas y documentación.

No edites `dist/`: se genera automáticamente. Tampoco subas `node_modules/`, archivos temporales, bases de datos, claves, tokens, contraseñas o `.env`.

No modifiques `.github/workflows/` ni `ops/hostinger/` salvo que la tarea lo pida expresamente y el dueño vaya a revisarlo.

## Validar antes de entregar

Ejecuta:

```bash
npm run check
npm test
npm run release:budget
```

También abre el juego localmente cuando el cambio sea visual:

```bash
npm start
```

Comprueba escritorio y una pantalla móvil. Si tocaste sprites, revisa caminar, atacar, recibir daño y morir en todas las direcciones afectadas.

## Guardar y subir

```bash
git status
git add -A
git commit -m "feat: descripción clara del cambio"
git push -u origin feature/nombre-corto
```

Antes del commit, revisa `git status` para confirmar que solo subes archivos de la tarea.

En GitHub abre un Pull Request con:

- Rama base: `staging`.
- Rama de origen: tu rama de trabajo.
- Resumen de qué cambió.
- Pasos para probarlo.
- Capturas o video si el cambio es visual.
- Riesgos o partes que todavía no comprobaste.

No abras el Pull Request directamente hacia `main`.

## Después del Pull Request

1. Espera las pruebas automáticas.
2. Corrige los errores en la misma rama y vuelve a hacer `git push`.
3. Responde las observaciones de la revisión.
4. El dueño fusionará el cambio hacia `staging`.
5. La versión de prueba aparecerá en <https://staging.perusurvivor.michitech.tech>.
6. El dueño decidirá cuándo promover `staging` a `main` y producción.

Tú no necesitas entrar al VPS, al hosting ni copiar archivos manualmente.

## Si staging avanzó mientras trabajabas

Guarda primero tus cambios y luego actualiza tu rama:

```bash
git fetch origin
git merge origin/staging
```

Resuelve únicamente los conflictos que entiendas. Si el conflicto mezcla sistemas de otra tarea, detente y consulta al dueño antes de elegir una versión.

## Lista rápida de entrega

- [ ] Una sola tarea en la rama.
- [ ] No hay secretos ni archivos privados.
- [ ] No se editó `dist/`.
- [ ] `npm run check` termina bien.
- [ ] `npm test` termina bien.
- [ ] Se comprobó móvil si hay cambios visuales.
- [ ] El Pull Request apunta a `staging`.
- [ ] La descripción explica cómo probarlo.

