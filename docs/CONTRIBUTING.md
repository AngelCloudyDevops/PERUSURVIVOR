# Desarrollo y control de versiones

La guía canónica para colaboradores está en [CONTRIBUTING.md](../CONTRIBUTING.md). Allí se explica cómo actualizar `main`, crear una rama, ejecutar las pruebas, abrir un Pull Request y activar el despliegue automático.

## Validación local

```bash
npm ci --ignore-scripts
npm run check
npm test
```

No se edita `dist/`: el build y GitHub Actions lo generan. Los cambios entran por Pull Request y solo una fusión aprobada en `main` publica producción.

Para la estructura de compilación, conservación y rollback de releases, consultar [Arquitectura de releases](RELEASE_ARCHITECTURE.md).
