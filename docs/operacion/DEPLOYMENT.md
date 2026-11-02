# Despliegue automático en Hostinger

Destinos: producción en https://perusurvivor.michitech.tech y pruebas en https://staging.perusurvivor.michitech.tech, ambos en el VPS srv2060131.hstgr.cloud.
Cada entorno tiene archivos, contenedores, base de cuentas, salas y rollback separados.

## Flujo preparado
1. Cada Pull Request a `main` o `staging` ejecuta una única validación en Linux y Node 24; los pushes a ramas de trabajo no duplican esa ejecución.
2. Un push a `main` o `staging` repite la validación, comprueba el presupuesto de release y genera el artefacto que se publicará.
3. La publicación solo se habilita para push a `staging` o `main`, después de todas las pruebas.
4. El dist/ probado se guarda como artefacto temporal; deploy descarga exactamente ese artefacto y comprueba que el commit siga siendo el último de su rama.
5. GitHub envía únicamente el paquete de release por SSH.
6. El receptor acepta únicamente `deploy <SHA>` para producción o `deploy-staging <SHA>` para pruebas. Rechaza cualquier otro comando, enlaces, rutas externas y archivos especiales.
7. La release se extrae en releases/<sha> y live/current cambia de forma atómica.
8. Se comprueba por HTTPS el SHA publicado y el HTML del juego. Ante un fallo se restaura el enlace anterior.
9. Después de una activación correcta se conservan la release actual, la anterior y las cinco releases recientes adicionales; el resto se elimina de forma acotada.

La matriz completa Ubuntu/Windows y Node 22/24 se ejecuta cada noche o manualmente mediante `Compatibilidad completa`. Así se conserva la cobertura multiplataforma sin bloquear cada actualización.

## Acceso y configuración
La cuenta perusurvivor-deploy no tiene sudo, acceso a Docker ni permiso sobre los otros servicios.
Su clave pública utiliza restrict y un comando forzado al receptor, instalado y propiedad de root.
La clave privada se guarda solo en el secreto PERUSURVIVOR_DEPLOY_KEY de GitHub; no se versiona.
ops/hostinger/known_hosts fija la identidad SSH del VPS.
La variable de repositorio PERUSURVIVOR_DEPLOY_ENABLED debe ser true para activar la publicación.

## Estado
Instalación restringida completada el 2026-10-25. La variable de activación se habilita después de la prueba real de envío y verificación HTTPS. El siguiente push a main ejecuta el flujo completo. La clave administrativa de instalación se retira al terminar la verificación; la clave permanente de GitHub solo permite publicar el juego.

El despliegue automático no reinicia Caddy, Docker ni ninguna aplicación. Solo modifica `releases/` y `live/` del entorno correspondiente. Cada launcher cooperativo detecta exclusivamente su enlace y espera que sus propias salas terminen antes de sustituir el proceso.

## Flujo de integración

- Cambio habitual de un colaborador: rama desde `main`, Pull Request directo a `main`, validación, fusión y publicación automática.
- Ajuste pequeño del propietario: push directo a `main`, validación y publicación automática.
- Cambio de alto riesgo: rama hacia `staging`, prueba en línea y promoción posterior de `staging` a `main`.

Se consideran de alto riesgo los cambios en cooperativo, guardados, cuentas, backend, permisos o arquitectura de publicación. Staging deja de ser un paso obligatorio para contenido, interfaz, balance, personajes y correcciones normales.

Staging usa límites menores (`96 MiB` web; `256 MiB`, `0.50 CPU` y tres salas para cooperativo), una base SQLite independiente y cabeceras `noindex`.

El job de CI limita el contenido a 80 MiB y 1000 archivos. El archivo enviado no puede superar 92 MiB; el receptor reserva margen hasta 96 MiB comprimidos y 192 MiB extraídos. Los valores y la estrategia futura de recursos por hash se documentan en [RELEASE_ARCHITECTURE.md](../arquitectura/RELEASE_ARCHITECTURE.md).

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

## Copias de seguridad de cuentas
`install-coop.py` programa a diario (04:17) `backup-accounts.py` y añade a `/var/log/perusurvivor-backup.log` la hora de inicio y `backup exit=<código>`; revisar que no aparezca un código distinto de 0 (`grep -v 'exit=0' /var/log/perusurvivor-backup.log`). Las copias son locales (14 retenidas en `/opt/perusurvivor/backups/accounts`).

TODO (decisión del propietario): no existe copia externa. Si el VPS se pierde, se pierden también las copias. Falta elegir destino privado (almacenamiento de objetos, otro servidor) y credenciales antes de automatizarla.

## IP real del cliente y proxies de confianza
nginx envía `X-Real-IP` y `X-Forwarded-For` en `/coop` y `/api/`. El backend (`backend/client-ip.cjs`) solo confía en `X-Real-IP` cuando el par TCP está en `TRUSTED_PROXIES` (IP o CIDR separados por coma; por defecto loopback y los rangos privados `10/8`, `172.16/12`, `192.168/16`, `fc00::/7`, que cubren la red `perusurvivor_gateway`). Los limitadores de login y de conexiones WebSocket usan esa IP. Las instalaciones existentes reciben las cabeceras al ejecutar `update-release.py` (idempotente; valida y recarga nginx).

Variables opcionales del contenedor cooperativo: `TRUSTED_PROXIES`, `BODY_TIMEOUT_MS` (10000), `MAX_ROOMS_PER_IP` (2), `LOBBY_IDLE_MS` (300000).
