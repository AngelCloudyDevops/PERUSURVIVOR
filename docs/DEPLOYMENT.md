# Despliegue automático en Hostinger

Destino: https://perusurvivor.michitech.tech, VPS srv2060131.hstgr.cloud.
El sitio es estático; Caddy y el contenedor perusurvivor-web siguen sirviendo los mismos archivos.

## Flujo preparado
1. Cada push ejecuta CI en Linux/Windows y Node 22/24.
2. La publicación solo se habilita para push a main, después de todas las pruebas.
3. Se comprueba que el commit siga siendo el último de main.
4. GitHub compila dist/ y envía únicamente el paquete estático por SSH.
5. El receptor acepta solo deploy seguido de un SHA completo. Rechaza enlaces, rutas externas y archivos especiales.
6. La release se extrae en releases/<sha> y live/current cambia de forma atómica.
7. Se comprueba por HTTPS el SHA publicado y el HTML del juego. Ante un fallo se restaura el enlace anterior.

## Acceso y configuración
La cuenta perusurvivor-deploy no tiene sudo, acceso a Docker ni permiso sobre los otros servicios.
Su clave pública utiliza restrict y un comando forzado al receptor, instalado y propiedad de root.
La clave privada se guarda solo en el secreto PERUSURVIVOR_DEPLOY_KEY de GitHub; no se versiona.
ops/hostinger/known_hosts fija la identidad SSH del VPS.
La variable de repositorio PERUSURVIVOR_DEPLOY_ENABLED debe ser true para activar la publicación.

## Estado
Instalación restringida completada el 2026-10-25. La variable de activación se habilita después de la prueba real de envío y verificación HTTPS. El siguiente push a main ejecuta el flujo completo. La clave administrativa de instalación se retira al terminar la verificación; la clave permanente de GitHub solo permite publicar el juego.

El despliegue automático no reinicia Caddy, Docker ni ninguna aplicación. Solo modifica releases/ y live/ del juego. Las versiones anteriores se conservan; no se eliminan automáticamente.

## Pruebas
python3 -m unittest discover -s tests/deployment -p "test_*.py"
La comprobación de rollback usa flock y se ejecuta en Linux. No hay paquetes Python externos en el VPS ni en CI.

## Servicio cooperativo
Instalación administrativa única, después de publicar una release con backend: ejecutar `python3 /opt/perusurvivor/live/current/backend/install-vps.py`. El instalador crea exclusivamente /opt/perusurvivor/coop, construye Node con npm ci del lock publicado, inicia perusurvivor-coop en la red existente del juego y añade /coop y /coop/health al nginx perusurvivor-web. Guarda nginx.before-coop.conf y valida nginx antes de recargarlo. No reinicia Caddy ni otros proyectos.
El contenedor corre como uid 1000, filesystem de solo lectura, sin capacidades, sin Docker socket ni puertos publicados, 512 MiB y 0.75 CPU. MAX_ROOMS=6 inicialmente. /coop/health verifica el proceso. El launcher observa live/current cada 2 segundos y reinicia únicamente el servidor cooperativo al cambiar la release. Las salas en curso terminan en un despliegue: avisar antes de actualizar si hay jugadores. Para retirar el cooperativo, restaurar nginx.before-coop.conf, validar y recargar solo perusurvivor-web, luego detener el proyecto perusurvivor-coop; el individual sigue estático.
