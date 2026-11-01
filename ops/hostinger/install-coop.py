#!/usr/bin/env python3
"""Instala solo el servidor cooperativo y la ruta nginx del juego existente."""
from pathlib import Path
import re
import shutil
import subprocess
import time

BASE = Path('/opt/perusurvivor')

def run(*args):
    return subprocess.check_output(args, text=True, stderr=subprocess.STDOUT)

def forward_ip(conf):
    # El backend limita por IP real: nginx debe enviarla en /coop y /api/ (también en configuraciones ya instaladas).
    if 'X-Real-IP' in conf:
        return conf
    return re.sub(r'(?m)^([ \t]*)proxy_set_header Host \$host;\n', lambda m: m.group(0) + m.group(1) + 'proxy_set_header X-Real-IP $remote_addr;\n' + m.group(1) + 'proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;\n', conf)

def install():
    source = (BASE / 'live/current/backend').resolve(strict=True)
    if not source.is_relative_to((BASE / 'releases').resolve()):
        raise RuntimeError('Release fuera del directorio del juego')
    target = BASE / 'coop'
    target.mkdir(exist_ok=True)
    data = BASE / 'data'
    data.mkdir(mode=0o700, exist_ok=True)
    shutil.chown(data, user=1000, group=1000)
    for name in ['Dockerfile', 'package.json', 'package-lock.json', 'launcher.cjs']:
        shutil.copyfile(source / name, target / name)
    compose = '''services:
  coop:
    build: .
    container_name: perusurvivor-coop
    restart: unless-stopped
    init: true
    read_only: true
    user: "1000:1000"
    mem_limit: 512m
    cpus: 0.75
    pids_limit: 64
    cap_drop: [ALL]
    security_opt: [no-new-privileges:true]
    tmpfs: [/tmp]
    environment:
      PORT: "4180"
      MAX_ROOMS: "6"
      ACCOUNTS_DB: /data/accounts.sqlite
      COOP_ORIGINS: https://perusurvivor.michitech.tech,https://srv2060131.hstgr.cloud
    volumes:
      - /opt/perusurvivor:/releases:ro
      - /opt/perusurvivor/coop/launcher.cjs:/launcher.cjs:ro
      - /opt/perusurvivor/data:/data:rw
    networks: [gateway]
networks:
  gateway:
    external: true
    name: perusurvivor_gateway
'''
    (target / 'compose.yaml').write_text(compose)
    print(run('docker', 'compose', '-p', 'perusurvivor-coop', '-f', str(target / 'compose.yaml'), 'up', '-d', '--build', '--wait'))
    for attempt in range(20):
        try:
            health = run('docker', 'exec', 'perusurvivor-web', 'wget', '-qO-', 'http://perusurvivor-coop:4180/coop/health')
            if '"ok":true' in health:
                break
        except subprocess.CalledProcessError:
            pass
        time.sleep(1)
    else:
        raise RuntimeError('El servidor cooperativo no está listo; nginx no fue modificado')
    conf = BASE / 'nginx.conf'
    original = conf.read_text()
    marker = '  # PERUSURVIVOR COOPERATIVO\n'
    routes = marker + '''  location = /coop {
    proxy_pass http://perusurvivor-coop:4180;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "upgrade";
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_read_timeout 60s;
  }
  location = /coop/health { proxy_pass http://perusurvivor-coop:4180; }
'''
    updated = original
    if marker not in updated:
        match = re.search(r'(?m)^[ \t]*location / \{', updated)
        if not match:
            raise RuntimeError('Configuración nginx inesperada')
        updated = updated[:match.start()] + routes + updated[match.start():]
    if '# PERUSURVIVOR CUENTAS' not in updated:
        match = re.search(r'(?m)^[ \t]*location / \{', updated)
        if not match:
            raise RuntimeError('Configuración nginx inesperada')
        account_routes = '''  # PERUSURVIVOR CUENTAS
  location /api/ {
    client_max_body_size 128k;
    proxy_pass http://perusurvivor-coop:4180;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_read_timeout 15s;
    add_header Cache-Control "no-store" always;
  }
'''
        updated = updated[:match.start()] + account_routes + updated[match.start():]
    if '# PERUSURVIVOR ARCHIVOS PRIVADOS' not in updated:
        match = re.search(r'(?m)^[ \t]*location / \{', updated)
        if not match:
            raise RuntimeError('Configuración nginx inesperada')
        private_routes = '''  # PERUSURVIVOR ARCHIVOS PRIVADOS
  location ^~ /backend/ { return 404; }
'''
        updated = updated[:match.start()] + private_routes + updated[match.start():]
    updated = forward_ip(updated)
    if updated != original:
        shutil.copyfile(conf, BASE / 'nginx.before-accounts.conf')
        conf.write_text(updated)
        try:
            print(run('docker', 'exec', 'perusurvivor-web', 'nginx', '-t'))
            print(run('docker', 'exec', 'perusurvivor-web', 'nginx', '-s', 'reload'))
        except Exception:
            conf.write_text(original)
            raise
    print('COOP_READY ' + health)
    backup_cron = Path('/etc/cron.d/perusurvivor-accounts-backup')
    # Salida con fecha y código de salida en un log: un fallo del backup debe quedar visible (exit distinto de 0).
    log = '/var/log/perusurvivor-backup.log'
    backup_cron.write_text('17 4 * * * root (echo "$(date -Is) backup inicio"; python3 /opt/perusurvivor/live/current/backend/backup-accounts.py; code=$?; echo "$(date -Is) backup exit=$code"; exit $code) >>' + log + ' 2>&1\n')
    backup_cron.chmod(0o644)
    print(run('python3', str(source / 'backup-accounts.py')))

if __name__ == '__main__':
    install()
