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

def install():
    source = (BASE / 'live/current/backend').resolve(strict=True)
    if not source.is_relative_to((BASE / 'releases').resolve()):
        raise RuntimeError('Release fuera del directorio del juego')
    target = BASE / 'coop'
    target.mkdir(exist_ok=True)
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
      COOP_ORIGINS: https://perusurvivor.michitech.tech,https://srv2060131.hstgr.cloud
    volumes:
      - /opt/perusurvivor:/releases:ro
      - /opt/perusurvivor/coop/launcher.cjs:/launcher.cjs:ro
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
    proxy_read_timeout 60s;
  }
  location = /coop/health { proxy_pass http://perusurvivor-coop:4180; }
'''
    if marker not in original:
        match = re.search(r'(?m)^[ \t]*location / \{', original)
        if not match:
            raise RuntimeError('Configuración nginx inesperada')
        shutil.copyfile(conf, BASE / 'nginx.before-coop.conf')
        conf.write_text(original[:match.start()] + routes + original[match.start():])
        try:
            print(run('docker', 'exec', 'perusurvivor-web', 'nginx', '-t'))
            print(run('docker', 'exec', 'perusurvivor-web', 'nginx', '-s', 'reload'))
        except Exception:
            conf.write_text(original)
            raise
    print('COOP_READY ' + health)

if __name__ == '__main__':
    install()
