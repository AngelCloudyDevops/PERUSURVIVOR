# Cuentas y base de datos en Hostinger

## Alcance

Cuenta opcional con usuario (3–24 letras ASCII, números y `_`) y contraseña de 12–128 caracteres. Invitados siguen jugando sin conexión al servicio. No se pide correo ni se inventa una recuperación por email: registro y recuperación entregan un código privado de 192 bits, mostrado una vez. Recuperar exige ese código, cambia la contraseña, rota el código e invalida sesiones. Si se pierden contraseña y código, no existe recuperación automática.

El cliente se comunica con `/api/` en el mismo dominio HTTPS. No contiene claves del VPS ni secretos de servicio. Las sesiones duran siete días y usan una cookie `HttpOnly; Secure; SameSite=Strict`. Contraseñas: scrypt asíncrono con sal aleatoria por cuenta; el servidor conserva únicamente el hash del token y del código de recuperación. No se registran cuerpos de peticiones. POST y PUT exigen Origin permitido y JSON. Hay límite de 128 KiB, 30 intentos por IP de conexión / 15 minutos y cuatro derivaciones simultáneas. Detrás de nginx este límite agrupa usuarios: es conservador; no se confía en X-Forwarded-For aportado por clientes. Antes de una apertura masiva se debe añadir un límite por IP en el proxy y moderación de registros.

## Esquema v1 (SQLite)

| Tabla | Campos | Acceso |
| --- | --- | --- |
| users | UUID, username único en minúsculas, password_hash, salt, recovery_hash, created_at | Solo servidor; la API devuelve UUID y nombre |
| sessions | token_hash, user_id FK, expires_at | Solo servidor; cierre de sesión revoca todas las sesiones de la cuenta |
| saves | user_id PK/FK, revision, payload JSON, updated_at | Solo el dueño autenticado |

`payload` contiene `{version:4, progress, best}`. `progress` es la estructura normalizada de `P.Meta`: monedas, colección, estrellas y copias, historial gacha, estadísticas y mejoras por personaje, inventario, mochila y recibos acotados. No incluye enemigos, proyectiles ni una partida en curso. No se promete reanudar una partida interrumpida. Audio y opciones del dispositivo siguen siendo locales.

La base se crea automáticamente con `PRAGMA user_version=1`, claves foráneas y WAL. Siguientes cambios requerirán migraciones versionadas y backup previo; nunca borrar tablas para actualizar. El JSON versionado evita duplicar ahora todas las reglas locales en docenas de tablas. Si se necesita analítica/ranking, añadir tablas `runs` y `leaderboard` con resultados **verificados por el servidor**, no extraer autoridad del JSON del cliente.

**Límite de confianza:** el guardado individual es una copia privada del progreso calculado por el navegador. Puede ser modificado por su propietario; no es un sistema antitrampas ni debe conceder premios, compras reales o posiciones competitivas. Las monedas y tiradas actuales son gratuitas. Para una economía competitiva, mover recompensas, compras y RNG al servidor con transacciones y recibos firmados antes de habilitarla.

## Sincronización y conflictos

- Invitado mantiene `causas-progress-v1`. Cada cuenta usa `causas-progress-account-UUID`, sin mezclar cuentas.
- Iniciar sesión descarga el guardado de la cuenta; una cuenta nueva ofrece importar al invitado explícitamente, una sola vez. El original invitado no se borra.
- Las transacciones locales de `P.Meta` encolan copias al servidor sin peticiones dentro del bucle de renderizado. Un PUT solo actualiza si coincide la revisión actual (transacción SQLite). Un 409 conserva la copia local y exige elegir una copia.
- Fallos de red dejan una marca local pendiente persistente. Un siguiente login no reemplaza esa copia automáticamente. Reintentar usa su revisión original; no fuerza el reemplazo remoto. Descargar y reemplazar es una acción explícita.
- Cerrar sesión vuelve al invitado. Una copia local de la cuenta queda en ese dispositivo: evita usar equipos compartidos si deseas conservarla en privado. No se guarda contraseña ni token en localStorage. Cada petición de guardado incluye el UUID esperado, contrastado con la sesión por el servidor: cambiar de cuenta en otra pestaña devuelve 409 y no mezcla progresos.

## Desarrollo local

Requiere Node 22.13+ o 24 (el contenedor usa 24). `node:sqlite` es interno, sin proveedor SaaS ni paquete nativo externo.

PowerShell:
```powershell
$env:ACCOUNTS_DB = "$PWD/data/accounts.sqlite"
$env:ACCOUNTS_ORIGINS = 'http://127.0.0.1:4173'
$env:ACCOUNTS_INSECURE = 'true' # exclusivamente HTTP local
npm start
```

En producción NO activar `ACCOUNTS_INSECURE`. Sin `ACCOUNTS_DB` el juego y cooperativo conservan su funcionamiento previo, con login no disponible.

## VPS y persistencia

El instalador `ops/hostinger/install-coop.py` añade solamente `/api/` al nginx del juego y un bind mount de `/opt/perusurvivor/data` a `/data` del contenedor existente. `ACCOUNTS_DB=/data/accounts.sqlite`. No publica un puerto de BD, no cambia DNS ni toca Caddy o servicios ajenos. Conserva el contenedor sin privilegios y el sistema de archivos de la release de solo lectura. Cambiar el contenedor cooperativo puede interrumpir sus salas activas; ejecutar la instalación inicial en una ventana sin partidas. Futuras releases conservan la base fuera de `releases/`.

Antes de instalar, revisar `docker ps`, compose y nginx existentes. Después de que CI publique la release, un administrador copia temporalmente y ejecuta `ops/hostinger/install-coop.py` desde el repositorio revisado (el instalador administrativo no se distribuye en la web); el usuario de despliegue restringido no tiene ni necesita privilegios para modificar infraestructura. Probar `/api/account` sin cookie (`{"user":null}`), registro, login y guardado y confirmar que `/data/accounts.sqlite` no es accesible por HTTP.

## Copias de seguridad y restauración

`python3 /opt/perusurvivor/live/current/backend/backup-accounts.py` crea una copia consistente mediante SQLite backup API, comprueba integridad y conserva 14 copias privadas en `/opt/perusurvivor/backups/accounts`. El instalador configura una tarea diaria a las 04:17 (hora del sistema del VPS) y crea una primera copia; no poner copias en Git, artifacts públicos, `dist/` o la web. Una copia local no protege de perder el VPS: configurar un destino externo privado antes de confiarle datos importantes.

Restauración: detener solo `perusurvivor-coop`, conservar la BD actual y sus WAL/SHM, verificar integridad del backup, reemplazar el conjunto de la BD con la copia, devolver UID/GID 1000 y permisos privados, arrancar el servicio y verificar login/guardado. No restaurar el disco completo del VPS ni tocar otros servicios para recuperar esta BD. Probar restauración sobre un directorio temporal antes de aplicarla.

## Repositorio público

Solo se versionan código, esquema y documentación. `.gitignore` excluye `.env*` (salvo ejemplo), SQLite/WAL/SHM, datos, claves privadas y logs. No añadir volcados, cuentas reales, tokens, IPs de jugadores, códigos de recuperación ni credenciales a README, screenshots o pruebas. `private:true` de package.json evita publicar el paquete npm; no vuelve privado GitHub. Las claves SSH públicas y el host key público pueden aparecer en configuración; las privadas permanecen en secretos de CI. Si alguna credencial fue publicada previamente, quitarla del último commit no basta: revocarla y auditar el historial.

## Perfil y rol administrador (SQLite v2)

`user_roles(user_id PK/FK, role CHECK admin)` es independiente del guardado JSON. Registrar un campo `role` no concede permisos. La promoción se realiza en el VPS con `node ops/hostinger/set-account-role.cjs /ruta/accounts.sqlite USUARIO grant`; `revoke` retira el rol. Requiere cuenta existente y acceso privado al fichero. Revoca sesiones para exigir nuevo login. Nunca crear una contraseña compartida, asignar al primer registro, ni poner una lista de nombres administradores en el frontend. Hacer backup antes de promover. No exponer este script en la web.

La proyección admin afecta solo a su cuenta; cerrar sesión vuelve al invitado intacto. No se reinician estadísticas ni se borran desbloqueos legítimos de invitados. Una revocación retira el rol y las herramientas, pero no elimina progreso que la cuenta ya haya guardado. Los datos individuales siguen siendo copias del cliente, sin autoridad competitiva.
