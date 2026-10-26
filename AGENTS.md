# Trabajo en PERUSURVIVOR
- Edita src/ para código y public/assets/ para imágenes y sonido.
- dist/ es generado: no editarlo ni usarlo como fuente; npm run build lo actualiza.
- scripts/modules.cjs define el orden de los scripts clásicos. Conserva ese orden y el objeto compartido P salvo refactor explícito.
- Ejecuta npm run check y npm test antes de subir cambios.
- Documenta reglas nuevas en docs/GAME_DESIGN.md y cambios de arquitectura en docs/ARCHITECTURE.md.
- Conserva modificaciones de otros chats; revisa git status antes de editar archivos compartidos.
- No distribuyas utilidades de QA que manipulen el estado del juego.
- Cada chat trabaja en su propia rama y worktree; integra preservando los cambios de main.
- Ejecuta las pruebas públicas prolongadas mediante Public cooperative E2E: comparte el bloqueo perusurvivor-production con el despliegue. No publiques por fuera del flujo durante estas pruebas.
