# Desarrollo y control de versiones

1. Actualizar la rama y revisar git status antes de trabajar.
2. Crear una rama codex/descripcion para una tarea nueva.
3. Editar src/ y public/assets/; no editar dist/.
4. Ajustar las pruebas y el documento de diseño cuando cambien reglas.
5. Ejecutar npm run check y npm test.
6. Revisar git diff y subir el cambio para su revisión.

## Comandos
npm ci --ignore-scripts instala a partir del lockfile. Actualmente no hay paquetes de ejecución ni desarrollo.
npm start reconstruye dist/ y abre el servidor en el puerto 4173.
npm run build debe repetirse tras editar mientras el servidor ya está abierto.

## Automatización
.github/workflows/ci.yml se ejecuta en push, pull_request y a petición manual. La matriz cubre Linux y Windows, con Node 22 y 24. Cada ejecución instala, comprueba sintaxis, genera el juego y ejecuta regresiones y pruebas HTTP. El token del workflow solo tiene permiso de lectura del repositorio.

Una ejecución fallida debe repararse antes de integrar cambios. Las restricciones de red local de algunos entornos pueden impedir la prueba HTTP; en GitHub debe ejecutarse completa, sin omitirla.

## Pruebas manuales
Comprobar en navegador selección de personaje y mapa, movimiento, ataques, sprites, pausa y mejoras. Cuando se cambie un portal, comprobar también entrada, derrota, victoria y retorno.

tests/manual/portals.html conserva el antiguo ayudante de QA para acelerar encuentros. Debe servirse desde la raíz del proyecto después de compilar. Sus controles alteran el estado y nunca se copian al sitio distribuido.

## Colaboración
El proyecto puede estar abierto en varios chats. Coordinar la tarea antes de reorganizar módulos compartidos y conservar cambios ajenos. AGENTS.md describe las rutas canónicas para las herramientas.
