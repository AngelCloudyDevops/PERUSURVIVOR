# Despliegue automático en Hostinger

Destino: https://perusurvivor.michitech.tech, VPS srv2060131.hstgr.cloud.
El sitio es estático; Caddy y el contenedor perusurvivor-web siguen sirviendo los mismos archivos.

## Flujo preparado
1. Cada push ejecuta sintaxis, build y smoke tests en Linux/Windows y Node 22/24.
2. Ubuntu y Node 24 ejecutan una vez la batería completa, el presupuesto de release y las pruebas del receptor.
3. La publicación solo se habilita para push a main, después de todas las pruebas.
4. El dist/ probado se guarda como artefacto temporal; deploy descarga exactamente ese artefacto y comprueba que el commit siga siendo el último de main.
5. GitHub envía únicamente el paquete de release por SSH.
6. El receptor acepta solo deploy seguido de un SHA completo. Rechaza enlaces, rutas externas y archivos especiales.
7. La release se extrae en releases/<sha> y live/current cambia de forma atómica.
8. Se comprueba por HTTPS el SHA publicado y el HTML del juego. Ante un fallo se restaura el enlace anterior.
9. Después de una activación correcta se conservan la release actual, la anterior y las cinco releases recientes adicionales; el resto se elimina de forma acotada.

## Acceso y configuración
La cuenta perusurvivor-deploy no tiene sudo, acceso a Docker ni permiso sobre los otros servicios.
Su clave pública utiliza restrict y un comando forzado al receptor, instalado y propiedad de root.
La clave privada se guarda solo en el secreto PERUSURVIVOR_DEPLOY_KEY de GitHub; no se versiona.
ops/hostinger/known_hosts fija la identidad SSH del VPS.
La variable de repositorio PERUSURVIVOR_DEPLOY_ENABLED debe ser true para activar la publicación.

## Estado
Instalación restringida completada el 2026-10-25. La variable de activación se habilita después de la prueba real de envío y verificación HTTPS. El siguiente push a main ejecuta el flujo completo. La clave administrativa de instalación se retira al terminar la verificación; la clave permanente de GitHub solo permite publicar el juego.

El despliegue automático no reinicia Caddy, Docker ni ninguna aplicación. Solo modifica releases/ y live/ del juego. El launcher cooperativo detecta el enlace nuevo y espera que las salas existentes terminen antes de sustituir su proceso.

El job de CI limita el contenido a 80 MiB y 1000 archivos. El archivo enviado no puede superar 92 MiB; el receptor reserva margen hasta 96 MiB comprimidos y 192 MiB extraídos. Los valores y la estrategia futura de recursos por hash se documentan en [RELEASE_ARCHITECTURE.md](RELEASE_ARCHITECTURE.md).

## Pruebas
python3 -m unittest discover -s tests/deployment -p "test_*.py"
La comprobación de rollback usa flock y se ejecuta en Linux. No hay paquetes Python externos en el VPS ni en CI.

## Servicio cooperativo
La prueba manual de GitHub Actions `Public cooperative E2E` y el despliegue comparten el grupo de concurrencia `perusurvivor-production`, con cola y sin cancelar trabajos en curso. Los chats pueden seguir integrando cambios: las publicaciones esperan a que termine la prueba. Cambiar el propio flujo o su prueba también la ejecuta automáticamente en main. La prueba usa la geometría de la versión publicada y entradas normales por WebSocket en tres salas privadas de dos jugadores; espera los tres minutos reales de los portales, derrota los jefes, comprueba el retorno y los premios individuales, y completa el emoliente del Campo. El informe queda como artefacto siete días. Esto protege las pruebas de despliegues del flujo; no conserva salas durante un despliegue posterior.

Instalación administrativa única, después de publicar una release con backend: ejecutar `python3 /opt/perusurvivor/live/current/backend/install-vps.py`. El instalador crea exclusivamente /opt/perusurvivor/coop, construye Node con npm ci del lock publicado, inicia perusurvivor-coop en la red existente del juego y añade /coop y /coop/health al nginx perusurvivor-web. Guarda nginx.before-coop.conf y valida nginx antes de recargarlo. No reinicia Caddy ni otros proyectos.
El contenedor corre como uid 1000, filesystem de solo lectura, sin capacidades, sin Docker socket ni puertos publicados, 512 MiB y 0.75 CPU. MAX_ROOMS=6 inicialmente. /coop/health verifica el proceso. El launcher observa live/current cada 2 segundos y reinicia únicamente el servidor cooperativo al cambiar la release. Las salas en curso terminan en un despliegue: avisar antes de actualizar si hay jugadores. Para retirar el cooperativo, restaurar nginx.before-coop.conf, validar y recargar solo perusurvivor-web, luego detener el proyecto perusurvivor-coop; el individual sigue estático.

El instalador también bloquea el acceso HTTP a `/backend/`. Los archivos siguen disponibles dentro del volumen de releases para el contenedor, pero Nginx no los entrega al navegador.

Después de fusionar la release que introduce límites, retención y protección del backend, ejecutar una sola vez como root:

```bash
python3 /opt/perusurvivor/live/current/backend/ops/update-release.py
```

El actualizador verifica que la fuente pertenezca a la release activa, reemplaza atómicamente únicamente el receptor de PERUSURVIVOR, guarda una copia de la configuración Nginx y recarga solo `perusurvivor-web` después de `nginx -t`.
