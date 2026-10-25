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
El código está preparado. No activar la variable hasta instalar y probar el receptor, la cuenta y la clave en el VPS. Esa instalación requiere acceso administrativo temporal; la clave administrativa se retira después.

El despliegue automático no reinicia Caddy, Docker ni ninguna aplicación. Solo modifica releases/ y live/ del juego. Las versiones anteriores se conservan; no se eliminan automáticamente.

## Pruebas
python3 -m unittest discover -s tests/deployment -p "test_*.py"
La comprobación de rollback usa flock y se ejecuta en Linux. No hay paquetes Python externos en el VPS ni en CI.
